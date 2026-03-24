import os
import time
from typing import Dict, List

import httpx


_price_cache: Dict[str, dict] = {}

EXCHANGE_ALIASES = {
    "NATIONAL STOCK EXCHANGE OF INDIA": "NSE",
    "NSE": "NSE",
    "XNSE": "NSE",
    "BOMBAY STOCK EXCHANGE": "BSE",
    "BSE": "BSE",
    "XBOM": "BSE",
    "NASDAQ": "NASDAQ",
    "XNAS": "NASDAQ",
    "NYSE": "NYSE",
    "XNYS": "NYSE",
    "NYSE ARCA": "ARCA",
    "ARCX": "ARCA",
}


def _normalize_text(value) -> str:
    return str(value or "").strip()


def _normalize_upper(value) -> str:
    return _normalize_text(value).upper()


def _get_twelve_data_key() -> str:
    return os.getenv("TWELVE_DATA_API_KEY", "").strip()


def _normalize_exchange(value) -> str | None:
    exchange = _normalize_upper(value)
    if not exchange:
        return None
    return EXCHANGE_ALIASES.get(exchange, exchange)


def _is_crypto(asset_type: str, symbol: str) -> bool:
    lowered = _normalize_text(asset_type).lower()
    return "crypto" in lowered or "digital" in lowered or "/" in symbol


def _build_quote_symbol(symbol: str, exchange: str | None, asset_type: str) -> str:
    normalized_symbol = _normalize_upper(symbol)
    normalized_exchange = _normalize_exchange(exchange)

    if not normalized_symbol:
        return ""

    if ":" in normalized_symbol or "/" in normalized_symbol:
        return normalized_symbol

    if _is_crypto(asset_type, normalized_symbol):
        return f"{normalized_symbol}/USD"

    if normalized_exchange in {"NSE", "BSE"}:
        return f"{normalized_symbol}:{normalized_exchange}"

    return normalized_symbol


def _normalize_lookup(item) -> dict:
    if isinstance(item, str):
        return {
            "symbol": _normalize_upper(item),
            "quoteSymbol": _normalize_upper(item),
            "exchange": None,
            "assetType": "",
        }

    symbol = _normalize_upper(item.get("symbol"))
    exchange = _normalize_exchange(item.get("exchange"))
    asset_type = _normalize_text(item.get("assetType"))
    quote_symbol = _normalize_upper(item.get("quoteSymbol")) or _build_quote_symbol(
        symbol,
        exchange,
        asset_type,
    )

    return {
        "symbol": symbol,
        "quoteSymbol": quote_symbol,
        "exchange": exchange,
        "assetType": asset_type,
    }


def _build_candidates(lookup: dict) -> list[dict]:
    symbol = lookup["symbol"]
    quote_symbol = lookup["quoteSymbol"]
    exchange = lookup["exchange"]
    asset_type = lookup["assetType"]
    seen = set()
    candidates = []

    def add_candidate(candidate_symbol: str, candidate_exchange: str | None = None):
        normalized_symbol = _normalize_upper(candidate_symbol)
        normalized_exchange = _normalize_exchange(candidate_exchange)
        if not normalized_symbol:
            return

        cache_key = f"{normalized_symbol}|{normalized_exchange or ''}"
        if cache_key in seen:
            return

        seen.add(cache_key)
        candidates.append(
            {
                "symbol": normalized_symbol,
                "exchange": normalized_exchange,
                "cacheKey": cache_key,
            }
        )

    if quote_symbol:
        add_candidate(quote_symbol)

    if exchange and symbol:
        add_candidate(symbol, exchange)
        add_candidate(f"{symbol}:{exchange}")

    if symbol:
        add_candidate(symbol)

    if _is_crypto(asset_type, quote_symbol or symbol):
        if symbol and "/" not in symbol:
            add_candidate(f"{symbol}/USD")
            add_candidate(f"{symbol}/USDT")

    if symbol and not exchange and ":" not in symbol and "/" not in symbol:
        add_candidate(f"{symbol}:NSE")
        add_candidate(f"{symbol}:BSE")

    return candidates


async def _fetch_candidate_price(client: httpx.AsyncClient, candidate: dict) -> float | None:
    twelve_data_key = _get_twelve_data_key()
    cache_key = candidate["cacheKey"]
    now = time.time()
    cached = _price_cache.get(cache_key)
    if cached and now - cached["ts"] <= 60:
        return cached["price"]

    params = {
        "symbol": candidate["symbol"],
        "apikey": twelve_data_key,
    }
    if candidate["exchange"]:
        params["exchange"] = candidate["exchange"]

    try:
        response = await client.get("https://api.twelvedata.com/price", params=params)
        payload = response.json()
        price = float(payload["price"]) if "price" in payload else None
    except Exception as exc:
        print(f"Price fetch failed for {candidate['symbol']}: {exc}")
        price = None

    _price_cache[cache_key] = {
        "price": price,
        "ts": now,
    }
    return price


async def fetch_live_prices(items: List[str | dict]) -> Dict[str, float | None]:
    twelve_data_key = _get_twelve_data_key()
    if not items:
        return {}

    normalized_items = [_normalize_lookup(item) for item in items if item]
    if not twelve_data_key:
        return {
            key: None
            for lookup in normalized_items
            for key in {lookup["symbol"], lookup["quoteSymbol"]}
            if key
        }

    import asyncio

    async def _resolve_one(client: httpx.AsyncClient, lookup: dict) -> tuple[dict, float | None]:
        for candidate in _build_candidates(lookup):
            price = await _fetch_candidate_price(client, candidate)
            if price is not None:
                return (lookup, price)
        return (lookup, None)

    results: Dict[str, float | None] = {}
    async with httpx.AsyncClient(timeout=10) as client:
        resolved = await asyncio.gather(
            *[_resolve_one(client, lookup) for lookup in normalized_items]
        )
        for lookup, price in resolved:
            for key in {lookup["symbol"], lookup["quoteSymbol"]}:
                if key:
                    results[key] = price

    return results


async def fetch_asset_details(query: str) -> list[dict]:
    twelve_data_key = _get_twelve_data_key()
    if not query or not twelve_data_key:
        return []

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            response = await client.get(
                "https://api.twelvedata.com/symbol_search",
                params={
                    "symbol": query,
                    "apikey": twelve_data_key,
                    "outputsize": 8,
                },
            )
            payload = response.json()
        except Exception as exc:
            print(f"Asset search failed for {query}: {exc}")
            return []

    results = payload.get("data", [])[:8]
    normalized_results = []
    for item in results:
        symbol = _normalize_upper(item.get("symbol"))
        exchange = _normalize_exchange(item.get("exchange") or item.get("mic_code"))
        asset_type = item.get("instrument_type") or item.get("type") or ""
        normalized_results.append(
            {
                "symbol": symbol,
                "quoteSymbol": _build_quote_symbol(symbol, exchange, asset_type),
                "name": item.get("instrument_name") or symbol,
                "exchange": exchange,
                "type": asset_type,
                "country": item.get("country"),
                "currency": item.get("currency"),
                "provider": "twelvedata",
            }
        )

    return normalized_results
