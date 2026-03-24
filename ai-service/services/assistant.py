"""
Unified AI assistant for MarketMakers.

This assistant handles:
- general financial chat
- portfolio-aware guidance
- learning guidance
- financial news/article simplification
- lightweight streaming over the same structured contract
"""

import json
import re
from typing import Iterator, Optional


ALLOWED_MODE_HINTS = {"auto", "chat", "news", "portfolio", "learning"}
DEFAULT_WARNING = "Educational only, not professional financial advice."
MODE_LABELS = {
    "general_chat": "Financial assistant",
    "news_simplify": "News simplified",
    "portfolio_guidance": "Portfolio context used",
    "learning_guidance": "Learning guidance",
}


def assistant_response(
    message: str,
    history: list,
    portfolio_context: Optional[dict],
    mode_hint: str = "auto",
    groq_client=None,
    gemini_model=None,
) -> dict:
    """Generate a structured assistant response."""

    normalized_hint = mode_hint if mode_hint in ALLOWED_MODE_HINTS else "auto"
    intent = _detect_intent(message, normalized_hint)
    system_content = _build_system_content(intent, portfolio_context)
    prompt = _build_prompt(message, history, intent, system_content)

    if gemini_model:
        try:
            response = gemini_model.generate_content(prompt)
            parsed = _parse_response(response.text)
            return _normalize_response(parsed, intent, "gemini-2.5-flash")
        except Exception as exc:
            print(f"Gemini assistant fallback triggered: {exc}")

    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_content},
                    {
                        "role": "user",
                        "content": (
                            f"{_format_history(history)}\n\n"
                            f"User message:\n{message}\n\n"
                            f"{_json_instructions(intent)}"
                        ),
                    },
                ],
                temperature=0.4,
                max_tokens=1024,
            )
            parsed = _parse_response(response.choices[0].message.content.strip())
            return _normalize_response(parsed, intent, "llama-3.3-70b-versatile")
        except Exception as exc:
            print(f"Groq assistant fallback triggered: {exc}")

    return _fallback_response(intent)


def assistant_stream_payload(
    message: str,
    history: list,
    portfolio_context: Optional[dict],
    mode_hint: str = "auto",
    groq_client=None,
    gemini_model=None,
) -> Iterator[dict]:
    """
    Yield stream-friendly events using the same structured assistant contract.

    This is intentionally built on top of `assistant_response` so the streamed and
    non-streamed API shapes stay aligned.
    """

    payload = assistant_response(
        message=message,
        history=history,
        portfolio_context=portfolio_context,
        mode_hint=mode_hint,
        groq_client=groq_client,
        gemini_model=gemini_model,
    )

    intent = payload.get("intent", "general_chat")
    yield {
        "type": "intent",
        "intent": intent,
        "modeLabel": MODE_LABELS.get(intent, MODE_LABELS["general_chat"]),
    }
    yield {
        "type": "meta",
        "payload": {
            "sections": payload.get("sections", {}),
            "citations": payload.get("citations", []),
            "warnings": payload.get("warnings", [DEFAULT_WARNING]),
            "provider": payload.get("provider"),
        },
    }

    for chunk in _chunk_text(payload.get("answer", "")):
        yield {"type": "token", "content": chunk}

    yield {"type": "done", "payload": payload}


def _detect_intent(message: str, mode_hint: str) -> str:
    if mode_hint == "news":
        return "news_simplify"
    if mode_hint == "portfolio":
        return "portfolio_guidance"
    if mode_hint == "learning":
        return "learning_guidance"
    if mode_hint == "chat":
        return "general_chat"

    lowered = message.lower()
    if (
        len(message) > 350
        or "\n\n" in message
        or any(
            word in lowered
            for word in (
                "headline",
                "article",
                "news",
                "fed",
                "earnings",
                "inflation",
                "simplify this",
                "explain this article",
                "what does this mean",
            )
        )
    ):
        return "news_simplify"
    if any(
        word in lowered
        for word in (
            "portfolio",
            "holding",
            "holdings",
            "allocation",
            "diversify",
            "asset mix",
            "what should i do with",
        )
    ):
        return "portfolio_guidance"
    if any(
        word in lowered
        for word in (
            "learn",
            "course",
            "lesson",
            "beginner",
            "teach me",
            "how do i start",
        )
    ):
        return "learning_guidance"
    return "general_chat"


def _build_system_content(intent: str, portfolio_context: Optional[dict]) -> str:
    base = (
        "You are the MarketMakers AI assistant. "
        "You explain financial topics clearly, help users learn, simplify financial articles, "
        "and provide portfolio-aware educational guidance. "
        f"Always include this warning in your response warnings array: '{DEFAULT_WARNING}'. "
        "Never claim to provide personalized financial advice. "
        "Always respond in the same language as the user."
    )

    if intent == "news_simplify":
        base += (
            " Focus on simple, beginner-friendly explanations. "
            "Extract what happened, why it matters, and the likely market impact. "
            "Identify a short list of assets or tickers that investors should watch when relevant."
        )
    elif intent == "portfolio_guidance":
        base += (
            " Focus on diversification, concentration risk, and educational next steps. "
            "Be specific but stay non-prescriptive."
        )
    elif intent == "learning_guidance":
        base += (
            " Focus on teaching clearly, sequencing beginner-friendly ideas, and suggesting what to learn next."
        )
    else:
        base += " Focus on concise, helpful answers with practical educational context."

    if portfolio_context and portfolio_context.get("totalValue", 0) > 0:
        assets = ", ".join(
            f"{asset['name']} (${asset['amount']:,.0f})"
            for asset in portfolio_context.get("assets", [])[:10]
        )
        base += (
            f" The user has a portfolio worth ${portfolio_context['totalValue']:,.2f}. "
            f"Known assets: {assets}."
        )

    return base


def _build_prompt(message: str, history: list, intent: str, system_content: str) -> str:
    return (
        f"System instructions:\n{system_content}\n\n"
        f"{_format_history(history)}\n\n"
        f"User message:\n{message}\n\n"
        f"{_json_instructions(intent)}"
    )


def _format_history(history: list) -> str:
    if not history:
        return "Conversation history:\nNo previous conversation."

    lines = ["Conversation history:"]
    for msg in history[-8:]:
        role = "User" if msg.get("role") == "user" else "Assistant"
        lines.append(f"{role}: {msg.get('content', '')}")
    return "\n".join(lines)


def _json_instructions(intent: str) -> str:
    if intent == "news_simplify":
        return (
            "Return only raw JSON with this exact structure:\n"
            "{\n"
            '  "intent": "news_simplify",\n'
            '  "answer": "A short plain-language answer for the user",\n'
            '  "sections": {\n'
            '    "summary": "2-3 sentence summary",\n'
            '    "simpleExplanation": "Beginner-friendly explanation in everyday language",\n'
            '    "keyPoints": ["point 1", "point 2", "point 3"],\n'
            '    "marketImpact": "Short note about likely impact",\n'
            '    "assetsToWatch": ["ticker 1", "ticker 2"],\n'
            '    "followUps": ["follow up 1", "follow up 2"]\n'
            "  },\n"
            f'  "warnings": ["{DEFAULT_WARNING}"]\n'
            "}"
        )

    target_intent = {
        "portfolio_guidance": "portfolio_guidance",
        "learning_guidance": "learning_guidance",
    }.get(intent, "general_chat")

    return (
        "Return only raw JSON with this exact structure:\n"
        "{\n"
        f'  "intent": "{target_intent}",\n'
        '  "answer": "Main answer for the user",\n'
        '  "sections": {\n'
        '    "followUps": ["follow up 1", "follow up 2"],\n'
        '    "portfolioNotes": ["optional note"],\n'
        '    "learningLinks": ["optional learning suggestion"]\n'
        "  },\n"
        f'  "warnings": ["{DEFAULT_WARNING}"]\n'
        "}"
    )


def _parse_response(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1]
        cleaned = cleaned.rsplit("```", 1)[0]

    match = re.search(r"\{.*\}", cleaned, re.S)
    if not match:
        raise ValueError("No JSON object found in assistant response")
    return json.loads(match.group(0))


def _normalize_response(parsed: dict, fallback_intent: str, provider: str) -> dict:
    intent = parsed.get("intent") or fallback_intent
    sections = parsed.get("sections") or {}
    warnings = parsed.get("warnings") or [DEFAULT_WARNING]
    answer = parsed.get("answer") or _fallback_answer_for_intent(intent)

    if intent == "news_simplify":
        normalized_sections = {
            "summary": str(sections.get("summary", "")).strip(),
            "simpleExplanation": str(sections.get("simpleExplanation", "")).strip(),
            "keyPoints": _normalize_list(sections.get("keyPoints"), limit=5),
            "marketImpact": str(sections.get("marketImpact", "")).strip(),
            "assetsToWatch": _normalize_list(sections.get("assetsToWatch"), limit=5),
            "followUps": _normalize_list(sections.get("followUps"), limit=4),
        }
    else:
        normalized_sections = {
            "followUps": _normalize_list(sections.get("followUps"), limit=4),
            "portfolioNotes": _normalize_list(sections.get("portfolioNotes"), limit=4),
            "learningLinks": _normalize_list(sections.get("learningLinks"), limit=4),
        }

    return {
        "intent": intent,
        "answer": answer.strip(),
        "sections": normalized_sections,
        "warnings": _normalize_list(warnings, limit=3) or [DEFAULT_WARNING],
        "citations": [],
        "provider": provider,
        "modeLabel": MODE_LABELS.get(intent, MODE_LABELS["general_chat"]),
    }


def _normalize_list(value, limit: int = 4) -> list[str]:
    if not isinstance(value, list):
        return []
    return [str(item).strip() for item in value if str(item).strip()][:limit]


def _chunk_text(text: str, chunk_size: int = 28) -> Iterator[str]:
    if not text:
        return iter(())
    for index in range(0, len(text), chunk_size):
        yield text[index : index + chunk_size]


def _fallback_answer_for_intent(intent: str) -> str:
    if intent == "news_simplify":
        return "Here is a simpler explanation of the article."
    if intent == "portfolio_guidance":
        return "Here is an educational review of your portfolio."
    if intent == "learning_guidance":
        return "Here is a beginner-friendly learning path."
    return "Here is a clear financial explanation."


def _fallback_response(intent: str) -> dict:
    if intent == "news_simplify":
        return {
            "intent": "news_simplify",
            "answer": "I could not fully analyze the article right now, but I can still help you break it down.",
            "sections": {
                "summary": "The article likely describes a market, company, or policy development that could affect investors.",
                "simpleExplanation": "Focus on who made the announcement, what changed, and why investors care. If you paste a shorter excerpt later, I can simplify it more precisely.",
                "keyPoints": [
                    "Look for the main decision or event.",
                    "Check which company, sector, or policy is involved.",
                    "Note whether the news changes growth, costs, or investor sentiment.",
                ],
                "marketImpact": "Market impact depends on whether the news changes rates, earnings expectations, regulation, or risk sentiment.",
                "assetsToWatch": [],
                "followUps": [
                    "Ask me to explain the key financial terms in the article.",
                    "Ask me how this news could affect long-term investors.",
                ],
            },
            "warnings": [DEFAULT_WARNING],
            "citations": [],
            "provider": "fallback",
            "modeLabel": MODE_LABELS["news_simplify"],
        }

    return {
        "intent": intent,
        "answer": (
            "I could not process that fully right now, but I can still help with a simpler explanation "
            "or a shorter follow-up question."
        ),
        "sections": {
            "followUps": [
                "Ask me to explain this in simpler words.",
                "Ask me for a step-by-step beginner explanation.",
            ],
            "portfolioNotes": [],
            "learningLinks": [],
        },
        "warnings": [DEFAULT_WARNING],
        "citations": [],
        "provider": "fallback",
        "modeLabel": MODE_LABELS.get(intent, MODE_LABELS["general_chat"]),
    }
