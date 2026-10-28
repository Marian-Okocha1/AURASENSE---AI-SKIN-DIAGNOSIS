"""
AuraSense - Streamlit Enterprise AI Beauty & Fashion Personal Shopper
Reference Streamlit application supporting live YouCam API payload integration,
st.session_state.skin_profile, and st.session_state.body_profile state management.
"""

import streamlit as st
import json
from modules.skin_api import parse_skin_analysis_response, FITZPATRICK_METADATA
from modules.body_api import parse_body_analysis_response
from modules.shopping_agent import generate_shopping_recommendations

# Page Configuration with Fashion Aesthetic
st.set_page_config(
    page_title="AuraSense | Biometric Skin & Body Personal Shopper",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling (Cashmere Trench, Cognac, Zero Pink)
st.markdown("""
<style>
    .stApp {
        background-color: #EAE4DC;
        color: #1C1917;
    }
    .metric-card {
        background-color: #FAF7F2;
        border: 1px solid #D6CEBE;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .badge-cognac {
        background-color: #C2611C;
        color: #FFFFFF;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
        display: inline-block;
    }
    .badge-attribute {
        background-color: #E5DFD4;
        color: #2D241E;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-right: 6px;
        margin-bottom: 6px;
        display: inline-block;
    }
</style>
""", unsafe_allow_html=True)

# 1. Initialize Session State
if "skin_profile" not in st.session_state:
    sample_skin_api_payload = {
        "fitzpatrick_scale": "III",
        "hydration": 44,
        "redness": 58,
        "wrinkles": 32,
        "dark_circles": 46,
        "pores": 38,
        "pigmentation": 25,
        "oiliness": 52,
        "skin_age": 31,
        "chronological_age": 28,
        "skin_type": "Sensitive & Dehydrated"
    }
    st.session_state.skin_profile = parse_skin_analysis_response(sample_skin_api_payload)

if "body_profile" not in st.session_state:
    sample_body_api_payload = {
        "attributes": {
            "taller": False,
            "belly": False,
            "slim": True,
            "hip": True,
            "waist": True,
            "arm": False,
            "leg": True,
            "shoulder_left": False,
            "shoulder_right": False
        }
    }
    st.session_state.body_profile = parse_body_analysis_response(sample_body_api_payload)

if "shopping_recommendations" not in st.session_state:
    st.session_state.shopping_recommendations = generate_shopping_recommendations(
        st.session_state.skin_profile,
        st.session_state.body_profile,
        occasion="High-fashion cocktail / Executive presentation"
    )

# Header
st.title("AuraSense AI Shopper")
st.caption("Biometric YouCam Skin Phototype & Body Architecture Analyzer")

# Top Metrics Row
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.markdown(f'<span class="badge-cognac">Phototype Type {st.session_state.skin_profile["fitzpatrick_scale"]}</span>', unsafe_allow_html=True)
    st.subheader(st.session_state.skin_profile["fitzpatrick_name"])
    st.write(f"**UV Sensitivity:** {st.session_state.skin_profile['uv_sensitivity']}")
    st.write(f"**Recommended SPF:** SPF {st.session_state.skin_profile['recommended_spf']}+")
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.markdown(f'<span class="badge-cognac">{st.session_state.body_profile["body_shape"]} Silhouette</span>', unsafe_allow_html=True)
    st.subheader(f"Shape: {st.session_state.body_profile['body_shape']}")
    st.write(st.session_state.body_profile["styling_advice"]["silhouette"])
    st.markdown('</div>', unsafe_allow_html=True)

with col3:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.subheader("Detected Body Attributes")
    attrs = st.session_state.body_profile["attributes"]
    attr_html = ""
    for k, v in attrs.items():
        if v:
            attr_html += f'<span class="badge-attribute">✓ {k.replace("_", " ").title()}</span>'
    st.markdown(attr_html if attr_html else "<span>Balanced baseline</span>", unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)

with col4:
    st.markdown('<div class="metric-card">', unsafe_allow_html=True)
    st.subheader("Skin Biometrics")
    st.write(f"**Hydration:** {st.session_state.skin_profile['hydration']}/100")
    st.write(f"**Redness:** {st.session_state.skin_profile['redness']}/100")
    st.write(f"**Wrinkles:** {st.session_state.skin_profile['wrinkles']}/100")
    st.markdown('</div>', unsafe_allow_html=True)

# Tabs
tab1, tab2, tab3 = st.tabs(["Biometric Diagnostics", "Agentic Fashion & Skincare", "Simulate Live API Payload"])

with tab1:
    st.subheader("Clinical Phototype & Sun Protection Directive")
    st.info(st.session_state.skin_profile["sun_protection_advice"])
    
    st.subheader("Flattering Garment Silhouettes")
    for cut in st.session_state.body_profile["styling_advice"]["flattering_cuts"]:
        st.write(f"• **{cut}**")

with tab2:
    recs = st.session_state.shopping_recommendations
    st.subheader("LLM Personal Shopper Tailored Guidance")
    st.markdown(f"**Fitzpatrick Phototype Strategy:** {recs.get('fitzpatrickAdvice', '')}")
    st.markdown(f"**Body Architecture Directives:** {recs.get('bodyFitAdvice', '')}")

    st.subheader("Curated Outfits for Body & Skin Tone")
    for outfit in recs.get("flatteringOutfits", []):
        with st.expander(outfit["title"], expanded=True):
            st.write(f"**Cut & Silhouette:** {outfit['silhouette']}")
            st.write(f"**Why It Flatters You:** {outfit['whyFlattering']}")
            st.write(f"**Paired Makeup:** {outfit['pairedMakeup']}")

with tab3:
    st.subheader("Test Live YouCam API Payloads")
    st.write("Update payload parameters below to trigger state re-parsing and agentic recommendations.")
    
    col_a, col_b = st.columns(2)
    with col_a:
        fitz_choice = st.selectbox("Select Fitzpatrick Scale:", ["I", "II", "III", "IV", "V", "VI"], index=2)
        hyd_val = st.slider("Hydration Score", 10, 100, st.session_state.skin_profile["hydration"])
        red_val = st.slider("Redness Score", 10, 100, st.session_state.skin_profile["redness"])
    
    with col_b:
        taller_flag = st.checkbox("taller", value=st.session_state.body_profile["attributes"]["taller"])
        belly_flag = st.checkbox("belly", value=st.session_state.body_profile["attributes"]["belly"])
        slim_flag = st.checkbox("slim", value=st.session_state.body_profile["attributes"]["slim"])
        hip_flag = st.checkbox("hip", value=st.session_state.body_profile["attributes"]["hip"])
        waist_flag = st.checkbox("waist", value=st.session_state.body_profile["attributes"]["waist"])
        sh_l = st.checkbox("shoulder_left", value=st.session_state.body_profile["attributes"]["shoulder_left"])
        sh_r = st.checkbox("shoulder_right", value=st.session_state.body_profile["attributes"]["shoulder_right"])

    if st.button("Apply API Response & Re-run Agent"):
        new_skin_payload = {
            "fitzpatrick_scale": fitz_choice,
            "hydration": hyd_val,
            "redness": red_val,
            "wrinkles": 30,
            "dark_circles": 40
        }
        new_body_payload = {
            "attributes": {
                "taller": taller_flag,
                "belly": belly_flag,
                "slim": slim_flag,
                "hip": hip_flag,
                "waist": waist_flag,
                "arm": False,
                "leg": True,
                "shoulder_left": sh_l,
                "shoulder_right": sh_r
            }
        }
        st.session_state.skin_profile = parse_skin_analysis_response(new_skin_payload)
        st.session_state.body_profile = parse_body_analysis_response(new_body_payload)
        st.session_state.shopping_recommendations = generate_shopping_recommendations(
            st.session_state.skin_profile,
            st.session_state.body_profile
        )
        st.success("Session state updated with parsed YouCam biometric parameters.")
        st.rerun()
