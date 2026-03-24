"""
Financial Scenario Simulator Service
Uses Google Gemini 2.5 Flash to provide AI-powered explanations for investment simulations.
"""


def simulate_explanation(
    monthly_investment: float,
    return_rate: float,
    years: int,
    future_value: float,
    total_invested: float,
    initial_amount: float,
    model,
) -> dict:
    """Generate AI explanation for a financial simulation."""

    prompt = f"""You are a financial educator. A user is simulating an investment:

- Starting Portfolio Value: Rs.{initial_amount:,.0f}
- Monthly Investment: Rs.{monthly_investment:,.0f}
- Expected Annual Return: {return_rate}%
- Investment Period: {years} years
- Projected Future Value: Rs.{future_value:,.0f}
- Total Amount Invested: Rs.{total_invested:,.0f}
- Potential Gains: Rs.{future_value - total_invested:,.0f}

Provide a clear, encouraging explanation in 3-4 sentences. Mention the power of compounding.
Then add a brief note about risks in 1 sentence. Keep it simple and motivating.
Return only the explanation text, no JSON formatting."""

    try:
        response = model.generate_content(prompt)
        return {"explanation": response.text.strip()}
    except Exception:
        gains = future_value - total_invested
        return {
            "explanation": (
                f"Starting with Rs.{initial_amount:,.0f} and investing Rs.{monthly_investment:,.0f} every month "
                f"at an expected {return_rate}% annual return over {years} years, your investment could grow to "
                f"Rs.{future_value:,.0f}. You would have invested Rs.{total_invested:,.0f} in total, with potential "
                f"gains of Rs.{gains:,.0f}. That is the power of compound growth building on both your starting "
                "capital and your regular contributions. Remember that actual returns can vary and market risk is real."
            )
        }
