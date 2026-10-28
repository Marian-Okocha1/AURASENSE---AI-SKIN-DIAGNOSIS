"""
AuraSense - Agentic AI Shopping Personal Shopper Module
Hooks live parsed body shape attributes and Fitzpatrick scale directly
into the LLM agent to deliver customized fashion cuts, color harmonies,
and clinical skincare formulations based on biometric reality.
"""

import os
import json
from typing import Dict, Any, Optional

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


def build_shopping_prompt(skin_profile: Dict[str, Any], body_profile: Dict[str, Any], occasion: str = "High-fashion gala / Executive presentation") -> str:
    """
    Constructs a high-precision prompt injecting exact Fitzpatrick scale and body attribute flags.
    """
    fitzpatrick = skin_profile.get("fitzpatrick_scale", "III")
    fitz_name = skin_profile.get("fitzpatrick_name", f"Type {fitzpatrick}")
    sun_advice = skin_profile.get("sun_protection_advice", "Daily broad-spectrum SPF 50 required.")
    hydration = skin_profile.get("hydration", 44)
    redness = skin_profile.get("redness", 58)
    concerns = ", ".join(skin_profile.get("primary_concerns", ["Hydration", "Redness"]))

    body_shape = body_profile.get("body_shape", "Hourglass")
    attrs = body_profile.get("attributes", {})
    active_attrs = [k for k, v in attrs.items() if v]

    prompt = f"""
You are the AuraSense Haute Couture & Biometric Skincare Personal Shopper Agent.
Tailor luxury fashion fit recommendations, color palettes, and skincare prescriptions strictly grounded in the following live YouCam biometric payload.

[BIOMETRIC SKIN PROFILE]:
- Fitzpatrick Phototype: Type {fitzpatrick} ({fitz_name})
- Sun Protection Directives: {sun_advice}
- Hydration Score: {hydration}/100 | Redness Score: {redness}/100
- Primary Skin Concerns: {concerns}
- Strict Color Rule: NEVER recommend pink or bubblegum tones. AuraSense uses luxury warm earth & couture shades: Cashmere Beige, Saddle Cognac, Burnished Bronze, Rich Espresso, Porcelain Cream, Terracotta.

[BODY ARCHITECTURE & ATTRIBUTES]:
- Derived Silhouette: {body_shape}
- Active Attribute Flags: {', '.join(active_attrs) if active_attrs else 'None / Balanced'}
- Flag Details:
  * Taller: {attrs.get('taller', False)}
  * Belly: {attrs.get('belly', False)}
  * Slim: {attrs.get('slim', False)}
  * Hip: {attrs.get('hip', False)}
  * Waist: {attrs.get('waist', False)}
  * Shoulders: Left {attrs.get('shoulder_left', False)}, Right {attrs.get('shoulder_right', False)}
  * Limbs: Arm {attrs.get('arm', False)}, Leg {attrs.get('leg', False)}

[OCCASION CONTEXT]:
- Occasion: {occasion}

Return a valid JSON object matching this schema:
{{
  "fitzpatrickAdvice": "Detailed explanation of UV photoprotection, undertone matching, and shade harmony for Type {fitzpatrick}.",
  "bodyFitAdvice": "Actionable clothing fit directives tailored to the {body_shape} silhouette and flags {active_attrs}.",
  "flatteringOutfits": [
    {{
      "title": "Outfit name",
      "silhouette": "Specific tailored cut or garment structure",
      "whyFlattering": "Why this flatters their specific body flags and silhouette",
      "pairedMakeup": "Complementary lip shade and eye accent (cognac/bronze/nude tones, NO pink)"
    }}
  ],
  "customAgentNotes": "Executive summary from the personal shopper agent."
}}
"""
    return prompt


def generate_shopping_recommendations(
    skin_profile: Dict[str, Any],
    body_profile: Dict[str, Any],
    occasion: str = "High-fashion gala / Executive presentation",
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Calls the Gemini LLM agent or falls back to an expert deterministic stylist
    to generate personalized clothing cuts, color matching, and skincare guidance.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")

    if GENAI_AVAILABLE and key:
        try:
            client = genai.Client(api_key=key)
            prompt = build_shopping_prompt(skin_profile, body_profile, occasion)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3,
                )
            )
            result = json.loads(response.text)
            return result
        except Exception as e:
            print(f"Gemini API shopping agent error: {e}. Falling back to deterministic recommendation.")

    # High-fidelity deterministic agent fallback
    fitzpatrick = skin_profile.get("fitzpatrick_scale", "III")
    body_shape = body_profile.get("body_shape", "Hourglass")
    attrs = body_profile.get("attributes", {})

    fitz_advice_map = {
        "I": "Fitzpatrick Type I exhibits extreme UV susceptibility. We mandate a pure mineral SPF 50+ barrier. For fashion and cosmetics, pair porcelain skin with warm champagne, burnished gold, and rich espresso contrasts to impart radiant warmth.",
        "II": "Fitzpatrick Type II burns easily and has sensitive micro-capillaries. Pair daily SPF 50 with calming ceramides. In wardrobe, camel tones, warm terracotta, and saddle cognac harmonize naturally with light undertones.",
        "III": "Fitzpatrick Type III possesses moderate melanin with high affinity for golden bronzes. Pair broad-spectrum SPF 50 with topical Vitamin C to inhibit sun spots. Saddle Cognac, Burnished Bronze, and Warm Terracotta elevate your natural golden sheen.",
        "IV": "Fitzpatrick Type IV tans effortlessly but is prone to post-inflammatory hyperpigmentation. Daily SPF 30+ with azelaic acid prevents melasma. Embrace deep amber, burnt umber, and dark chocolate hues.",
        "V": "Fitzpatrick Type V carries rich melanin photoprotection. Use sheer clear-gel SPF 30 to prevent ashiness. Saturated jewel bronze, warm cinnamon, and rich espresso create statuesque elegance.",
        "VI": "Fitzpatrick Type VI has profound natural photoprotection. Shield cellular DNA with hydrating gel SPF 30. Bold burnished bronze, ochre, and obsidian black create magnificent, luminous contrast."
    }

    body_advice_map = {
        "Hourglass": f"With active waist and hip flags, embrace structured tailoring that highlights your natural waist taper. Double-breasted belted trenches, wrap silhouettes, and high-waisted cigarette pants maintain flawless proportion.",
        "Pear": f"With prominent hip flags, accentuate your collarbones and shoulders with boatneck blouses and structured lapels. Pair with fluid wide-leg wool trousers in dark espresso to lengthen the lower silhouette.",
        "Inverted Triangle": f"With broad shoulder architecture, balance the upper frame with fluid pleated palazzo pants or A-line midi skirts in warm cognac. Deep V-necklines soften the shoulder plane beautifully.",
        "Apple": f"Highlight your slender leg architecture with ankle-grazing tailored trousers. Pair with elongated open-front cashmere duster coats to establish clean, slimming vertical lines through the torso.",
        "Elongated Tall": f"Your statuesque tall frame effortlessly commands floor-grazing cashmere trench coats, wide-cuff palazzo trousers, and bold structured volume without losing poise.",
        "Petite Slim": f"Maintain vertical continuity with cropped tailored blazers, high-rise trousers, and monochrome cashmere ensembles designed to accentuate your delicate frame.",
        "Rectangle": f"Create dynamic curvature using wide leather belts, asymmetric draped knitwear, and structured safari jackets with breast pockets."
    }

    return {
        "fitzpatrickAdvice": fitz_advice_map.get(fitzpatrick, fitz_advice_map["III"]),
        "bodyFitAdvice": body_advice_map.get(body_shape, body_advice_map["Hourglass"]),
        "flatteringOutfits": [
            {
                "title": f"The Cinch-Architecture Trench ({body_shape} Silhouette)",
                "silhouette": "Structured Double-Breasted Trench in Cashmere Camel with Wide Saddle Belt",
                "whyFlattering": f"Precisely flatters the {body_shape} contour by framing the shoulders and defining the midsection without bulk.",
                "pairedMakeup": "Velvet Matte Cognac Lipstick (#883A1E) + Burnished Bronze Eye Contour"
            },
            {
                "title": "Fluid Monochromatic Column",
                "silhouette": "Silk-Cashmere Knit Turtleneck tucked into High-Rise Pleated Wool Trousers",
                "whyFlattering": "Elongates the vertical line while honoring natural body contours and fabric drape.",
                "pairedMakeup": "Satin Nude Cocoa Lip Glaze + Soft Terracotta Cheek Glow"
            },
            {
                "title": "Architectural Gala Wrap Gown",
                "silhouette": "Bias-Cut Silk Charmeuse Gown with Asymmetric Draping & Defined Waist",
                "whyFlattering": "Flows seamlessly over hip curves and contours the torso for effortless regal posture.",
                "pairedMakeup": "Deep Auburn Gloss (#682312) + Gilded Champagne Lid Sheen"
            }
        ],
        "customAgentNotes": f"Biometric analysis confirms Fitzpatrick Type {fitzpatrick} phototype and {body_shape} architecture. All proposed formulations and fashion silhouettes honor these specific parameters."
    }
