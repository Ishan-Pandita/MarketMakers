"""
MarketMakers AI Microservice

Unified FastAPI service for:
- portfolio analysis
- portfolio health scoring
- chat + news/article simplification
- lightweight streaming chat
- investment simulation explanations
- live price lookups and asset search
"""

import json
import logging
import os
import time
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from services.assistant import assistant_response, assistant_stream_payload
from services.health_score import calculate_health_score
from services.portfolio_analyzer import analyze_portfolio
from services.price_fetcher import fetch_asset_details, fetch_live_prices
from services.simulator import simulate_explanation

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
INTERNAL_TOKEN = os.getenv("INTERNAL_TOKEN")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

gemini_model = genai.GenerativeModel("gemini-2.5-flash") if GEMINI_API_KEY else None

groq_client = None
if GROQ_API_KEY:
    try:
        from groq import Groq

        groq_client = Groq(api_key=GROQ_API_KEY)
    except ImportError:
        print("Groq SDK not installed. Assistant will use Gemini only.")

app = FastAPI(
    title="MarketMakers AI Service",
    description="Unified AI assistant and financial analysis service",
    version="4.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
ai_logger = logging.getLogger("ai-service")

PUBLIC_PATHS = {
    "/",
    "/health",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/docs/oauth2-redirect",
}


@app.middleware("http")
async def verify_internal_token(request: Request, call_next):
    if request.url.path in PUBLIC_PATHS:
        return await call_next(request)

    token = request.headers.get("X-Internal-Token")
    if not INTERNAL_TOKEN or token != INTERNAL_TOKEN:
        return JSONResponse(status_code=403, content={"detail": "Forbidden"})

    return await call_next(request)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000)
    ai_logger.info(
        "%s %s -> %s (%sms)",
        request.method,
        request.url.path,
        response.status_code,
        duration,
    )
    return response


class Asset(BaseModel):
    name: str
    ticker: Optional[str] = None
    amount: float
    type: str = "stock"


class AnalyzeRequest(BaseModel):
    assets: list[Asset]
    totalValue: float


class HealthScoreRequest(BaseModel):
    assets: list[Asset]
    totalValue: float


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    history: list[ChatMessage] = []
    portfolioContext: Optional[dict] = None
    modeHint: Optional[str] = Field(
        default="auto",
        pattern="^(auto|chat|news|portfolio|learning)$",
    )


class SimulateRequest(BaseModel):
    initialAmount: float = 0
    monthlyInvestment: float
    returnRate: float
    years: int
    futureValue: float
    totalInvested: float


class LivePricesRequest(BaseModel):
    symbols: list[str] = []
    assets: list[dict] = []


@app.get("/")
async def root():
    return {
        "service": "MarketMakers AI",
        "status": "running",
        "providers": {
            "primary": "gemini-2.5-flash" if GEMINI_API_KEY else "not configured",
            "fallback": "llama-3.3-70b-versatile" if groq_client else "not configured",
        },
    }


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "gemini_configured": bool(GEMINI_API_KEY),
        "groq_configured": bool(groq_client),
        "internal_auth_configured": bool(INTERNAL_TOKEN),
    }


@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.assets:
        raise HTTPException(status_code=400, detail="No assets provided")

    assets_data = [asset.model_dump() for asset in req.assets]
    return analyze_portfolio(assets_data, req.totalValue, gemini_model)


@app.post("/health-score")
async def health_score(req: HealthScoreRequest):
    assets_data = [asset.model_dump() for asset in req.assets]
    return calculate_health_score(assets_data, req.totalValue, None)


@app.post("/chat")
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    history_data = [message.model_dump() for message in req.history]
    return assistant_response(
        req.message,
        history_data,
        req.portfolioContext,
        mode_hint=req.modeHint or "auto",
        groq_client=groq_client,
        gemini_model=gemini_model,
    )


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    history_data = [message.model_dump() for message in req.history]

    async def event_stream():
        for event in assistant_stream_payload(
            req.message,
            history_data,
            req.portfolioContext,
            mode_hint=req.modeHint or "auto",
            groq_client=groq_client,
            gemini_model=gemini_model,
        ):
            yield f"data: {json.dumps(event)}\n\n"
            await _small_pause()

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/simulate")
async def simulate(req: SimulateRequest):
    return simulate_explanation(
        req.monthlyInvestment,
        req.returnRate,
        req.years,
        req.futureValue,
        req.totalInvested,
        req.initialAmount,
        gemini_model,
    )


@app.post("/live-prices")
async def live_prices(req: LivePricesRequest):
    lookups = req.assets or req.symbols
    if not lookups:
        raise HTTPException(status_code=400, detail="No symbols provided")
    prices = await fetch_live_prices(lookups)
    return {"prices": prices}


@app.get("/asset-search")
async def asset_search(query: str):
    if not query.strip():
        raise HTTPException(status_code=400, detail="Query is required")
    return {"results": await fetch_asset_details(query.strip())}


async def _small_pause():
    """Introduce a tiny delay so streamed chunks render progressively."""
    await __import__("asyncio").sleep(0.02)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
