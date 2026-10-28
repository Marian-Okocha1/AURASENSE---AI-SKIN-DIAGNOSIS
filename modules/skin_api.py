"""
AuraSense - YouCam Skin AI & Fitzpatrick Scale Analyzer Module
Parses live skin analysis responses, extracts Fitzpatrick phototype,
and configures sun-protection advice and UI contrast metrics.
"""

from typing import Dict, Any, Optional

FITZPATRICK_METADATA = {
    "I": {
        "name": "Type I · Ivory / Pale Porcelain",
        "description": "Always burns, never tans. Extremely fair skin with minimal melanin.",
        "sun_protection_advice": "Extreme UV vulnerability. Daily mineral broad-spectrum SPF 50+ (Zinc Oxide / Titanium Dioxide) required. High erythema risk; reapply every 90 minutes outdoors.",
        "recommended_spf": 50,
        "melanin_level": "Very Low",
        "uv_sensitivity": "Extreme",
        "color_harmony": ["Champagne", "Soft Rose", "Warm Taupe", "Slate"]
    },
    "II": {
        "name": "Type II · Fair Beige",
        "description": "Burns easily, tans minimally. Fair complexion with low melanin reserves.",
        "sun_protection_advice": "High UV sensitivity. Daily broad-spectrum SPF 50+ combined with ceramide barrier hydration to counteract solar redness.",
        "recommended_spf": 50,
        "melanin_level": "Low",
        "uv_sensitivity": "High",
        "color_harmony": ["Camel", "Soft Terracotta", "Warm Bronze", "Espresso"]
    },
    "III": {
        "name": "Type III · Medium / Warm Olive",
        "description": "Sometimes mild burn, gradually tans to golden olive. Moderate melanin.",
        "sun_protection_advice": "Moderate burn risk; tans gradually. Daily broad-spectrum SPF 50 recommended with topical antioxidant Vitamin C to prevent solar lentigines and hyperpigmentation.",
        "recommended_spf": 50,
        "melanin_level": "Medium",
        "uv_sensitivity": "Moderate",
        "color_harmony": ["Saddle Cognac", "Warm Terracotta", "Burnished Gold", "Rich Espresso"]
    },
    "IV": {
        "name": "Type IV · Olive / Moderate Brown",
        "description": "Rarely burns, tans easily to deep olive/brown. High melanin concentration.",
        "sun_protection_advice": "Low burn risk; high post-inflammatory pigment response. Daily broad-spectrum SPF 30+ recommended; pair with azelaic acid to prevent melasma.",
        "recommended_spf": 30,
        "melanin_level": "High",
        "uv_sensitivity": "Low",
        "color_harmony": ["Amber Gold", "Burnt Orange", "Deep Emerald", "Espresso"]
    },
    "V": {
        "name": "Type V · Rich Bronze / Deep Brown",
        "description": "Very rarely burns, tans very easily. Robust natural photoprotection.",
        "sun_protection_advice": "Very low burn risk. Daily sheer SPF 30 recommended (clear formulation to avoid white residue) for anti-photoaging and moisture barrier maintenance.",
        "recommended_spf": 30,
        "melanin_level": "Very High",
        "uv_sensitivity": "Minimal",
        "color_harmony": ["Rich Bronze", "Warm Terracotta", "Marigold", "Noir"]
    },
    "VI": {
        "name": "Type VI · Deeply Pigmented Noir",
        "description": "Never burns, deeply pigmented. Maximum natural melanin shielding.",
        "sun_protection_advice": "Minimal burn risk. Use clear gel SPF 30 to maintain cellular DNA resilience and prevent photoaging without ashiness. Deep emollient squalane indicated.",
        "recommended_spf": 30,
        "melanin_level": "Deep",
        "uv_sensitivity": "Minimal",
        "color_harmony": ["Jewel Ruby", "Bright Ochre", "Burnished Bronze", "Onyx"]
    }
}


def parse_skin_analysis_response(api_response: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses live YouCam Skin AI JSON payload, extracting the Fitzpatrick scale
    and configuring sun-protection advice, diagnostic scorecards, and UI contrast settings.

    Args:
        api_response: Raw dict received from YouCam Skin AI API endpoint.

    Returns:
        Structured skin profile dictionary ready for session state and agentic reasoning.
    """
    if not isinstance(api_response, dict):
        api_response = {}

    # Extract fitzpatrick_scale (standardized to Roman numerals I-VI)
    raw_scale = str(api_response.get("fitzpatrick_scale", api_response.get("fitzpatrickScale", "III"))).strip().upper()
    raw_scale = raw_scale.replace("TYPE", "").strip()

    valid_scales = ["I", "II", "III", "IV", "V", "VI"]
    fitzpatrick_scale = raw_scale if raw_scale in valid_scales else "III"
    metadata = FITZPATRICK_METADATA.get(fitzpatrick_scale, FITZPATRICK_METADATA["III"])

    # Extract biometric indicators
    hydration = int(api_response.get("hydration", 44))
    redness = int(api_response.get("redness", 58))
    wrinkles = int(api_response.get("wrinkles", 32))
    dark_circles = int(api_response.get("dark_circles", api_response.get("darkCircles", 46)))
    pores = int(api_response.get("pores", 38))
    pigmentation = int(api_response.get("pigmentation", 25))
    oiliness = int(api_response.get("oiliness", 52))
    skin_age = int(api_response.get("skin_age", api_response.get("skinAge", 31)))
    chronological_age = int(api_response.get("chronological_age", api_response.get("chronologicalAge", 28)))

    # Primary concerns derivation
    concerns = api_response.get("primary_concerns", api_response.get("primaryConcerns", []))
    if not concerns:
        concerns = []
        if hydration < 50:
            concerns.append("Dehydration & Epidermal Moisture Loss")
        if redness > 50:
            concerns.append("Vascular Erythema / Cheek Sensitivity")
        if wrinkles > 40:
            concerns.append("Fine Lines & Expression Wrinkles")
        if dark_circles > 40:
            concerns.append("Periorbital Dark Circles")
        if not concerns:
            concerns = ["Antioxidant Barrier Maintenance", "Daily Photoprotection"]

    overall_health = int(api_response.get("overall_health_score", api_response.get("overallHealthScore", 74)))

    skin_profile = {
        "fitzpatrick_scale": fitzpatrick_scale,
        "fitzpatrick_name": metadata["name"],
        "description": metadata["description"],
        "sun_protection_advice": metadata["sun_protection_advice"],
        "recommended_spf": metadata["recommended_spf"],
        "melanin_level": metadata["melanin_level"],
        "uv_sensitivity": metadata["uv_sensitivity"],
        "color_harmony": metadata["color_harmony"],
        "hydration": hydration,
        "redness": redness,
        "wrinkles": wrinkles,
        "dark_circles": dark_circles,
        "pores": pores,
        "pigmentation": pigmentation,
        "oiliness": oiliness,
        "skin_age": skin_age,
        "chronological_age": chronological_age,
        "skin_type": api_response.get("skin_type", "Sensitive"),
        "overall_health_score": overall_health,
        "primary_concerns": concerns,
    }

    return skin_profile
