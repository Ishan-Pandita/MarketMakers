"""
Portfolio Health Score Service
Calculates a 0-100 health score based on diversification, concentration, and asset allocation.
"""


def calculate_health_score(assets: list, total_value: float, model) -> dict:
    """Calculate portfolio health score with detailed breakdown."""

    if not assets or total_value <= 0:
        return {
            "score": 0,
            "riskLevel": "N/A",
            "diversification": "N/A",
            "breakdown": {},
            "message": "Add assets to your portfolio to get a health score."
        }

    # 1. Diversification Score (0-30 pts)
    asset_types = set(a.get("type", "stock") for a in assets)
    type_count = len(asset_types)
    diversification_score = min(30, type_count * 10)

    # 2. Concentration Risk (0-30 pts)
    max_allocation = max(a["amount"] for a in assets) / total_value * 100
    if max_allocation < 20:
        concentration_score = 30
    elif max_allocation < 40:
        concentration_score = 20
    elif max_allocation < 60:
        concentration_score = 10
    else:
        concentration_score = 0

    # 3. Asset Count (0-20 pts)
    asset_count = len(assets)
    if asset_count >= 10:
        count_score = 20
    elif asset_count >= 5:
        count_score = 15
    elif asset_count >= 3:
        count_score = 10
    else:
        count_score = 5

    # 4. Type Balance (0-20 pts)
    type_distribution = {}
    for asset in assets:
        t = asset.get("type", "stock")
        type_distribution[t] = type_distribution.get(t, 0) + asset["amount"]

    type_percentages = {t: v / total_value * 100 for t, v in type_distribution.items()}
    balance_variance = sum(abs(p - 100 / max(1, len(type_percentages))) for p in type_percentages.values())
    balance_score = max(0, min(20, 20 - int(balance_variance / 10)))

    # Total score
    total_score = diversification_score + concentration_score + count_score + balance_score

    # Risk level
    if total_score >= 75:
        risk_level = "Low"
    elif total_score >= 50:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Diversification label
    if diversification_score >= 20:
        diversification_label = "Good"
    elif diversification_score >= 10:
        diversification_label = "Moderate"
    else:
        diversification_label = "Low"

    return {
        "score": total_score,
        "riskLevel": risk_level,
        "diversification": diversification_label,
        "breakdown": {
            "diversification": {"score": diversification_score, "max": 30, "detail": f"{type_count} asset types"},
            "concentration": {"score": concentration_score, "max": 30, "detail": f"Max allocation: {max_allocation:.1f}%"},
            "assetCount": {"score": count_score, "max": 20, "detail": f"{asset_count} assets"},
            "balance": {"score": balance_score, "max": 20, "detail": "Type distribution balance"}
        },
        "topHolding": max(assets, key=lambda a: a["amount"])["name"],
        "assetTypes": list(asset_types),
        "message": f"Your portfolio health score is {total_score}/100. Risk Level: {risk_level}."
    }
