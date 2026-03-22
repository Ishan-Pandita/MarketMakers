"""
Financial Scenario Simulator Service
Uses Google Gemini 2.5 Flash to provide AI-powered explanations for investment simulations.
Good at generating clear, motivational financial explanations.
"""


def simulate_explanation(monthly_investment: float, return_rate: float, years: int,
                         future_value: float, total_invested: float, model) -> dict:
    """Generate AI explanation for a financial simulation."""

    prompt = f"""You are a financial educator. A user is simulating an investment:

- Monthly Investment: ₹{monthly_investment:,.0f}
- Expected Annual Return: {return_rate}%
- Investment Period: {years} years
- Projected Future Value: ₹{future_value:,.0f}
- Total Amount Invested: ₹{total_invested:,.0f}
- Potential Gains: ₹{future_value - total_invested:,.0f}

Provide a clear, encouraging explanation in 3-4 sentences. Mention the power of compounding.
Then add a brief note about risks (1 sentence). Keep it simple and motivating.
Return only the explanation text, no JSON formatting."""

    try:
        response = model.generate_content(prompt)
        return {"explanation": response.text.strip()}
    except Exception:
        gains = future_value - total_invested
        return {
            "explanation": (
                f"By investing ₹{monthly_investment:,.0f} every month at an expected {return_rate}% annual return "
                f"over {years} years, your investment could grow to ₹{future_value:,.0f}. "
                f"You would have invested ₹{total_invested:,.0f} in total, with potential gains of "
                f"₹{gains:,.0f} — that's the power of compound interest working for you! "
                "Remember: actual returns may vary, and past performance doesn't guarantee future results."
            )
        }
