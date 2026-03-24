import json
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

try:
    from playwright.sync_api import sync_playwright
except ImportError:  # pragma: no cover - optional browser verification
    sync_playwright = None


API_BASE = "http://127.0.0.1:5001/api/v1"
FRONTEND_URL = "http://localhost:5173"


def request_json(method, path, token=None, body=None, retries=0, retry_delay=2):
    url = f"{API_BASE}{path}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    payload = None
    if body is not None:
        payload = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"

    request = urllib.request.Request(url, data=payload, headers=headers, method=method)

    attempt = 0
    while True:
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                text = response.read().decode("utf-8")
                return json.loads(text) if text else {}
        except urllib.error.HTTPError as error:
            text = error.read().decode("utf-8", errors="replace")
            if attempt < retries and "buffering timed out" in text:
                attempt += 1
                time.sleep(retry_delay)
                continue
            raise RuntimeError(f"{method} {path} failed with {error.code}: {text}") from error


def build_watchlist_payload(result):
    return {
        "symbol": result["symbol"],
        "quoteSymbol": result.get("quoteSymbol", ""),
        "exchange": result.get("exchange", ""),
        "currency": result.get("currency", ""),
        "name": result["name"],
        "assetType": result.get("assetType", "stock"),
        "notes": "live market verification",
    }


def main():
    unique = uuid.uuid4().hex[:8]
    email = f"livefix_{unique}@example.com"
    password = "Password123!"

    request_json(
        "POST",
        "/auth/register",
        retries=8,
        body={
            "name": "Live Market Fix",
            "email": email,
            "password": password,
            "role": "learner",
        },
    )
    login = request_json(
        "POST",
        "/auth/login",
        retries=8,
        body={
            "email": email,
            "password": password,
        },
    )
    token = login["token"]

    search_aapl = request_json(
        "GET",
        f"/ai/asset-search?{urllib.parse.urlencode({'query': 'AAPL'})}",
        token=token,
    )
    search_reliance = request_json(
        "GET",
        f"/ai/asset-search?{urllib.parse.urlencode({'query': 'RELIANCE'})}",
        token=token,
    )

    aapl_result = next(
        (
            {
                **item,
                "assetType": "stock",
            }
            for item in search_aapl.get("results", [])
            if item.get("symbol")
        ),
        None,
    )
    reliance_result = next(
        (
            {
                **item,
                "assetType": "stock",
            }
            for item in search_reliance.get("results", [])
            if item.get("symbol")
        ),
        None,
    )

    if not aapl_result:
        raise RuntimeError(
            f"AAPL search did not return any live market results: {json.dumps(search_aapl)}"
        )

    request_json(
        "POST",
        "/watchlist",
        token=token,
        body=build_watchlist_payload(aapl_result),
    )

    watchlist = request_json("GET", "/watchlist/live-values", token=token)
    aapl_watch = next(
        (item for item in watchlist.get("items", []) if item.get("symbol") == aapl_result["symbol"]),
        None,
    )
    if not aapl_watch or not aapl_watch.get("hasLivePrice"):
        raise RuntimeError("AAPL watchlist item did not receive a live price from the API")

    live_price = float(aapl_watch["livePrice"])
    buy_price = round(max(live_price * 0.8, 1), 2)

    request_json(
        "POST",
        "/portfolio/assets",
        token=token,
        body={
            "name": aapl_result["name"],
            "ticker": aapl_result["symbol"],
            "quoteSymbol": aapl_result.get("quoteSymbol", ""),
            "exchange": aapl_result.get("exchange", ""),
            "currency": aapl_result.get("currency", ""),
            "amount": 1000,
            "assetType": "stock",
            "purchasePrice": buy_price,
        },
    )

    portfolio_live = request_json("GET", "/portfolio/live-values", token=token)
    portfolio_asset = next(
        (
            item
            for item in portfolio_live.get("assets", [])
            if item.get("symbol") == aapl_result["symbol"]
        ),
        None,
    )
    if not portfolio_asset:
        raise RuntimeError("Portfolio live values did not include the AAPL asset")
    if not portfolio_asset.get("hasLivePrice"):
        raise RuntimeError("Portfolio asset did not receive a live API quote")
    if portfolio_asset.get("gainLossAmt") is None:
        raise RuntimeError("Portfolio asset did not calculate P&L from buy price and live price")

    reliability = {
        "aapl_search_symbol": aapl_result.get("symbol"),
        "aapl_quote_symbol": aapl_result.get("quoteSymbol"),
        "aapl_watchlist_live_price": aapl_watch.get("livePrice"),
        "portfolio_gain_loss": portfolio_asset.get("gainLossAmt"),
        "portfolio_gain_loss_pct": portfolio_asset.get("gainLossPct"),
        "portfolio_price_source": portfolio_asset.get("priceSource"),
        "portfolio_coverage": portfolio_live.get("priceCoverage"),
    }

    if reliance_result:
        try:
            request_json(
                "POST",
                "/watchlist",
                token=token,
                body=build_watchlist_payload(reliance_result),
            )
            watchlist_after_india = request_json("GET", "/watchlist/live-values", token=token)
            india_watch = next(
                (
                    item
                    for item in watchlist_after_india.get("items", [])
                    if item.get("symbol") == reliance_result["symbol"]
                ),
                None,
            )
            reliability["reliance_search_symbol"] = reliance_result.get("symbol")
            reliability["reliance_quote_symbol"] = reliance_result.get("quoteSymbol")
            reliability["reliance_exchange"] = reliance_result.get("exchange")
            reliability["reliance_watchlist_live_price"] = (
                india_watch.get("livePrice") if india_watch else None
            )
            reliability["reliance_has_live_price"] = (
                india_watch.get("hasLivePrice") if india_watch else False
            )
        except Exception as error:  # pragma: no cover - reporting path
            reliability["reliance_error"] = str(error)

    if sync_playwright is not None:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context()
            context.add_init_script(
                f"window.localStorage.setItem('token', {json.dumps(token)});"
            )
            page = context.new_page()
            page.goto(f"{FRONTEND_URL}/portfolio")
            page.wait_for_load_state("networkidle")
            page.get_by_role("button", name="Assets").click()
            page.wait_for_timeout(600)

            page.get_by_role("button", name="Add asset").click()
            search_input = page.locator('input[placeholder*="AAPL"]').first
            search_input.fill("RELIANCE")
            page.wait_for_timeout(1500)

            page_text = page.locator("body").inner_text()
            reliability["ui_shows_live_search_copy"] = (
                "Live search via market API" in page_text
            )
            reliability["ui_shows_live_api_price_copy"] = "Live API price" in page_text
            reliability["ui_search_shows_exchange_badge"] = (
                "NSE" in page_text or "BSE" in page_text
            )
            browser.close()
    else:
        reliability["ui_browser_check"] = "skipped: playwright module not available in default python"

    print(json.dumps(reliability, indent=2))


if __name__ == "__main__":
    main()
