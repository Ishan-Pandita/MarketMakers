"""
Portfolio Analysis Service
Uses Google Gemini 2.5 Flash to analyze portfolio diversification, risk, and provide insights.
Best JSON output quality + deep financial knowledge.
"""
import google.generativeai as genai


def analyze_portfolio(assets: list, total_value: float, model) -> dict:
    """Analyze a portfolio and return diversification insights, risk level, and suggestions."""

    assets_summary = "\n".join(
        [f"- {a['name']} ({a.get('type', 'stock')}): ${a['amount']:,.2f}" for a in assets]
    )

    # Calculate basic stats
    type_distribution = {}
    for asset in assets:
        t = asset.get("type", "stock")
        type_distribution[t] = type_distribution.get(t, 0) + asset["amount"]

    prompt = f"""You are a financial portfolio analyst. Analyze this investment portfolio and provide actionable insights.

Portfolio (Total Value: ${total_value:,.2f}):
{assets_summary}

Asset Type Distribution:
{chr(10).join([f"- {k}: ${v:,.2f} ({v/total_value*100:.1f}%)" for k, v in type_distribution.items()])}

Provide your analysis in this exact JSON format (no markdown, just raw JSON):
{{
  "riskLevel": "Low|Medium|High",
  "diversificationScore": <number 1-100>,
  "insights": [
    "insight 1",
    "insight 2",
    "insight 3"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ],
  "summary": "2-3 sentence overall assessment"
}}"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean markdown code blocks if present
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]

        import json
        return json.loads(text)
    except Exception as e:
        # Fallback analysis
        num_types = len(type_distribution)
        risk = "High" if num_types <= 1 else "Medium" if num_types <= 2 else "Low"
        div_score = min(100, num_types * 25)

        return {
            "riskLevel": risk,
            "diversificationScore": div_score,
            "insights": [
                f"Your portfolio has {len(assets)} assets across {num_types} asset type(s).",
                f"Total portfolio value is ${total_value:,.2f}.",
                "Consider diversifying across more asset types for better risk management."
            ],
            "suggestions": [
                "Add ETFs or index funds for broader market exposure.",
                "Consider allocating 10-20% to bonds for stability.",
                "Regularly rebalance your portfolio quarterly."
            ],
            "summary": f"Your portfolio is {'well' if num_types >= 3 else 'poorly'}-diversified with {num_types} asset type(s). Risk level: {risk}."
        }
