"""
MarketMakers AI Microservice
FastAPI service providing AI-powered financial analysis using multiple AI providers.

AI Provider Strategy (all free tier):
  - Google Gemini 2.5 Flash  → Portfolio Analyzer, News Simplifier, Simulator
  - Groq Llama 3.3 70B      → Chatbot (fastest inference for real-time chat)
  - No AI                    → Health Score (pure algorithmic calculation)

Endpoints:
  POST /analyze         — Portfolio analysis (Gemini 2.5 Flash)
  POST /health-score    — Portfolio health score (algorithmic, no AI)
  POST /simplify-news   — Financial news simplification (Gemini 2.5 Flash)
  POST /chat            — AI financial chatbot (Groq Llama 3.3 70B)
  POST /simulate        — Investment scenario explanation (Gemini 2.5 Flash)
"""

import os
import time
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from dotenv import load_dotenv

import google.generativeai as genai

from services.portfolio_analyzer import analyze_portfolio
from services.health_score import calculate_health_score
from services.news_simplifier import simplify_news
from services.chatbot import chat_response
from services.simulator import simulate_explanation

load_dotenv()

# ─── AI Provider Configuration ────────────────────────────────────────

# 1. Google Gemini 2.5 Flash — for Portfolio Analyzer, News Simplifier, Simulator
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

gemini_model = genai.GenerativeModel("gemini-2.5-flash") if GEMINI_API_KEY else None

# 2. Groq Llama 3.3 70B — for Chatbot (ultra-fast inference)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = None
if GROQ_API_KEY:
    try:
        from groq import Groq
        groq_client = Groq(api_key=GROQ_API_KEY)
    except ImportError:
        print("⚠️  Groq SDK not installed. Chatbot will fall back to Gemini.")

# ─── FastAPI App ───────────────────────────────────────────────────────

app = FastAPI(
    title="MarketMakers AI Service",
    description="AI-powered financial analysis microservice using Gemini 2.5 Flash + Groq",
    version="2.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5001", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
logging.basicConfig(level=logging.INFO)
ai_logger = logging.getLogger("ai-service")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000)
    ai_logger.info(f"{request.method} {request.url.path} → {response.status_code} ({duration}ms)")
    return response

# ─── Request/Response Models ───────────────────────────────────────────

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


class SimplifyNewsRequest(BaseModel):
    text: str = Field(min_length=10)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    portfolioContext: Optional[dict] = None


class SimulateRequest(BaseModel):
    monthlyInvestment: float
    returnRate: float
    years: int
    futureValue: float
    totalInvested: float


# ─── Health Check ──────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "service": "MarketMakers AI",
        "status": "running",
        "providers": {
            "gemini": "gemini-2.5-flash" if GEMINI_API_KEY else "not configured",
            "groq": "llama-3.3-70b-versatile" if groq_client else (
                "falling back to Gemini" if GEMINI_API_KEY else "not configured"
            ),
        },
    }


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "gemini_configured": bool(GEMINI_API_KEY),
        "groq_configured": bool(groq_client),
    }


# ─── Portfolio Analysis (Gemini 2.5 Flash) ─────────────────────────────

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    if not req.assets:
        raise HTTPException(status_code=400, detail="No assets provided")

    assets_data = [a.model_dump() for a in req.assets]
    result = analyze_portfolio(assets_data, req.totalValue, gemini_model)
    return result


# ─── Health Score (No AI — Pure Algorithm) ─────────────────────────────

@app.post("/health-score")
async def health_score(req: HealthScoreRequest):
    assets_data = [a.model_dump() for a in req.assets]
    result = calculate_health_score(assets_data, req.totalValue, None)
    return result


# ─── News Simplifier (Gemini 2.5 Flash) ───────────────────────────────

@app.post("/simplify-news")
async def simplify(req: SimplifyNewsRequest):
    result = simplify_news(req.text, gemini_model)
    return result


# ─── Chatbot (Groq Llama 3.3 70B → Gemini fallback) ──────────────────

@app.post("/chat")
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    history_data = [m.model_dump() for m in req.history]

    # Use Groq for chatbot (fastest inference), fall back to Gemini
    result = chat_response(
        req.message, history_data, req.portfolioContext,
        groq_client=groq_client,
        gemini_model=gemini_model
    )
    return result


# ─── Simulator Explanation (Gemini 2.5 Flash) ─────────────────────────

@app.post("/simulate")
async def simulate(req: SimulateRequest):
    result = simulate_explanation(
        req.monthlyInvestment, req.returnRate, req.years,
        req.futureValue, req.totalInvested, gemini_model
    )
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
