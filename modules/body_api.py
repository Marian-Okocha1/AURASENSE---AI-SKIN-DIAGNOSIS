"""
AuraSense - YouCam Body Shape & Attribute Analyzer Module
Parses live YouCam Body Shape API JSON payloads containing boolean attribute flags
(taller, belly, slim, hip, waist, arm, leg, shoulder_left, shoulder_right)
and maps them into a structured user body-profile dictionary for styling
and e-commerce virtual try-on recommendations.
"""

from typing import Dict, Any, List


def parse_body_analysis_response(api_response: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses live YouCam Body AI API responses, extracts boolean flags,
    determines the primary architectural body shape silhouette,
    and generates tailored styling rules, flattering cuts, and try-on suggestions.

    Args:
        api_response: Raw dictionary from YouCam Body Shape & Reshape API.

    Returns:
        Structured body profile dictionary for session state and LLM agent consumption.
    """
    if not isinstance(api_response, dict):
        api_response = {}

    # Extract boolean flags directly with safe defaults
    raw_attrs = api_response.get("attributes", api_response)
    
    taller = bool(raw_attrs.get("taller", False))
    belly = bool(raw_attrs.get("belly", False))
    slim = bool(raw_attrs.get("slim", True))
    hip = bool(raw_attrs.get("hip", True))
    waist = bool(raw_attrs.get("waist", True))
    arm = bool(raw_attrs.get("arm", False))
    leg = bool(raw_attrs.get("leg", True))
    shoulder_left = bool(raw_attrs.get("shoulder_left", False))
    shoulder_right = bool(raw_attrs.get("shoulder_right", False))

    attributes: Dict[str, bool] = {
        "taller": taller,
        "belly": belly,
        "slim": slim,
        "hip": hip,
        "waist": waist,
        "arm": arm,
        "leg": leg,
        "shoulder_left": shoulder_left,
        "shoulder_right": shoulder_right,
    }

    # Derive body shape silhouette based on attribute flag combinations
    shoulders_prominent = shoulder_left or shoulder_right

    if waist and hip and not belly:
        body_shape = "Hourglass"
        silhouette_desc = "Balanced bust and hip proportions with defined waist taper."
        flattering_cuts = ["Tailored trench coat with waist cinch belt", "High-rise cigarette trousers", "Wrap midi dresses", "Fitted cashmere blazer"]
        accentuate_features = ["Cinched waistline", "Balanced hip curve", "Neckline and collarbone framing"]
        clothing_fit_advice = "Emphasize your natural waistline with structured tailoring, belted jackets, and contoured seams. Avoid oversized boxy cuts that mask waist curvature."
        vto_suggestions = ["Double-breasted belted trench in camel/cognac", "Monochrome ribbed knit dress", "Structured wool blend blazer"]
    elif hip and not waist:
        body_shape = "Pear"
        silhouette_desc = "Fuller hips with narrower torso and delicate shoulder line."
        flattering_cuts = ["A-line structured midi skirts", "Boatneck and structured shoulder tops", "Straight-leg fluid wool trousers", "Fit-and-flare coats"]
        accentuate_features = ["Delicate collarbones", "Defined upper torso", "Graceful lower silhouette"]
        clothing_fit_advice = "Draw visual interest upward with structured lapels, statement collars, and boatneck silhouettes. Pair with relaxed straight-leg trousers in rich dark neutrals."
        vto_suggestions = ["Structured shoulder drape blouse in ivory", "High-waisted wide-leg trouser in espresso", "A-line cashmere camel coat"]
    elif shoulders_prominent and not hip:
        body_shape = "Inverted Triangle"
        silhouette_desc = "Broad sculpted shoulders tapering down to a slender hip line."
        flattering_cuts = ["Deep V-neck wrap blouses", "Wide-leg palazzo trousers", "Pleated fluid midi skirts", "Raglan sleeve tailoring"]
        accentuate_features = ["Sculpted athletic shoulder architecture", "Slender hip and leg line"]
        clothing_fit_advice = "Balance broad shoulders with voluminous bottoms like wide-leg palazzo pants or pleated A-line skirts. Soften upper silhouette with fluid deep V or shawl lapels."
        vto_suggestions = ["Fluid wide-leg pleated trousers in burnished bronze", "V-neck draped silk blouse", "Unstructured drop-shoulder duster coat"]
    elif belly and not waist:
        body_shape = "Apple"
        silhouette_desc = "Concentrated midsection volume with slender limbs and great legs."
        flattering_cuts = ["Empire-waist fluid silhouettes", "Open-front elongated duster jackets", "V-neck shift dresses", "Slim-cut ankle trousers"]
        accentuate_features = ["Sculpted slender legs", "Open neckline and collarbones"]
        clothing_fit_advice = "Direct the gaze vertically with monochromatic inner layers paired with long open-front dusters or unbuttoned trench coats. Highlight legs with ankle-grazing trousers."
        vto_suggestions = ["Longline open cashmere duster in oatmeal", "Fluid modal wrap dress", "Tailored ankle-length cigarette pants"]
    elif taller and slim:
        body_shape = "Elongated Tall"
        silhouette_desc = "Tall, elongated vertical line with slender limbs and athletic posture."
        flattering_cuts = ["Full-length wide-leg trousers", "Floor-grazing maxi coats", "Bold color-blocking", "Oversized tailored trenches"]
        accentuate_features = ["Long vertical leg line", "Statuesque stature", "Elongated neck and arms"]
        clothing_fit_advice = "You effortlessly carry volume, dramatic lengths, and structured oversized outerwear. Experiment with bold horizontal waist detailing or floor-length trench silhouettes."
        vto_suggestions = ["Floor-length double-breasted trench in Cashmere Trench beige", "Wide-cuff palazzo pants", "Mock-neck fine knit sweater"]
    elif slim and not hip and not waist:
        body_shape = "Petite Slim"
        silhouette_desc = "Petite, slender vertical frame with streamlined contours."
        flattering_cuts = ["Cropped tailored jackets", "Monochromatic column silhouettes", "High-rise straight trousers", "Vertical pleating"]
        accentuate_features = ["Streamlined proportions", "Delicate wrist and ankle lines"]
        clothing_fit_advice = "Opt for tailored proportions that preserve vertical continuity. Cropped jackets and high-rise trousers create leg elongation without overwhelming your frame."
        vto_suggestions = ["Cropped wool equestrian blazer", "High-rise tailored trousers", "Mini structured top-handle bag"]
    else:
        body_shape = "Rectangle"
        silhouette_desc = "Uniform balance across shoulders, waist, and hips with athletic line."
        flattering_cuts = ["Belted safari jackets", "Pleated trousers with drape", "Asymmetrical hem dresses", "Color-blocked outerwear"]
        accentuate_features = ["Athletic balance", "Even proportions", "Clean geometric silhouettes"]
        clothing_fit_advice = "Create dimension and curves using waist-cinching belts, diagonal drapes, and textured layers. Tailored outerwear with pockets adds flattering visual depth."
        vto_suggestions = ["Belted safari utility jacket in cognac", "Pleated front wool trousers", "Asymmetric wrap knit"]

    # Generate proportions summary text
    active_flags = [k for k, v in attributes.items() if v]
    summary = f"Detected Silhouette: {body_shape}. Active attributes: {', '.join(active_flags) if active_flags else 'balanced baseline'}."

    body_profile: Dict[str, Any] = {
        "body_shape": body_shape,
        "attributes": attributes,
        "proportions_summary": summary,
        "styling_advice": {
            "silhouette": silhouette_desc,
            "flattering_cuts": flattering_cuts,
            "accentuate_features": accentuate_features,
            "clothing_fit_advice": clothing_fit_advice,
            "color_palette_matches": [
                "Warm Cashmere (#EAE4DC)",
                "Saddle Cognac (#C2611C)",
                "Burnished Bronze (#B45309)",
                "Dark Espresso (#1C1917)",
                "Porcelain Cream (#FAF7F2)"
            ],
            "vto_tryon_suggestions": vto_suggestions,
        }
    }

    return body_profile
