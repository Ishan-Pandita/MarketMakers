"""
Financial News Simplifier Service
Uses Google Gemini 2.5 Flash to simplify complex financial news for beginners.
Excellent at structured JSON extraction from text.
"""


def simplify_news(text: str, model) -> dict:
    """Simplify financial news text and provide key insights."""

    prompt = f"""You are a financial educator who simplifies complex financial news for beginners.

Given this financial news or text:
"{text}"

Provide your response in this exact JSON format (no markdown, just raw JSON):
{{
  "summary": "2-3 sentence simple summary of what happened",
  "simpleExplanation": "Explain what this means in everyday language that a beginner would understand. Use analogies if helpful. 3-5 sentences.",
  "keyInsights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "impact": "How this might affect regular investors or the economy. 1-2 sentences.",
  "terms": [
    {{"term": "financial term used", "definition": "simple definition"}},
    {{"term": "another term", "definition": "simple definition"}}
  ]
}}"""

    try:
        response = model.generate_content(prompt)
        text_result = response.text.strip()
        if text_result.startswith("```"):
            text_result = text_result.split("\n", 1)[1]
            text_result = text_result.rsplit("```", 1)[0]

        import json
        return json.loads(text_result)
    except Exception:
        return {
            "summary": "Unable to process this content right now.",
            "simpleExplanation": "The AI service encountered an issue. Please try again with a shorter or clearer financial text.",
            "keyInsights": ["Try pasting a specific financial news headline or article excerpt."],
            "impact": "Unable to assess impact at this time.",
            "terms": []
        }
