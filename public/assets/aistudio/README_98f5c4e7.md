# 🌟 AuraSense — Adaptive AI Shopping Assistant

**YouCam API Hackathon Submission** | Skin AI & eCommerce VTO Track

AuraSense is an intelligent, hands-free voice and vision AI shopping assistant that combines:
- 🔬 **YouCam Skin AI** diagnostics for real-time skin analysis
- 🎨 **YouCam Virtual Try-On (VTO)** for interactive makeup visualization
- 🤖 **Agentic AI reasoning** to match products to user context and skin needs
- 🎙️ **Voice interaction** for accessible, hands-free shopping experiences

---

## 🏗️ Architecture

```
┌─────────────┐
│ Voice Input │ ──> User context (event, concerns, weather)
└─────────────┘
       ↓
┌─────────────┐
│ Image Input │ ──> Facial photo upload/capture
└─────────────┘
       ↓
┌──────────────────┐
│ YouCam Skin AI   │ ──> Analyze wrinkles, hydration, redness, spots, etc.
└──────────────────┘
       ↓
┌──────────────────┐
│ LLM Agent        │ ──> Match skin scores + context → product recommendations
└──────────────────┘
       ↓
┌──────────────────┐
│ YouCam VTO API   │ ──> Apply makeup/shade overlay to user photo
└──────────────────┘
       ↓
┌──────────────────┐
│ TTS Audio Output │ ──> Spoken explanation of diagnosis & recommendations
└──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- YouCam API credentials ([Get them here](https://developer.perfectcorp.com/))
- OpenAI or Google Gemini API key for LLM reasoning

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd "c:\Users\LENOVO\Desktop\AUROSENSE -YOUCAM PROJECT"
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   copy .env.example .env
   # Edit .env and add your API keys
   ```

5. **Test the setup (mock mode):**
   ```bash
   python test_modules.py
   ```

6. **Run the application:**
   ```bash
   streamlit run app.py
   ```

---

## 📁 Project Structure

```
aurasense/
├── app.py                      # Main Streamlit UI dashboard
├── config.py                   # Environment variables & API configuration
├── requirements.txt            # Python dependencies
├── test_modules.py            # Module test suite
├── .env.example               # Environment template
├── modules/
│   ├── __init__.py
│   ├── skin_api.py            # ✅ YouCam Skin AI REST handler
│   ├── vto_api.py             # 🚧 YouCam VTO REST handler (next)
│   ├── voice_engine.py        # 🚧 STT/TTS audio processing (next)
│   └── shopping_agent.py      # 🚧 Agentic matching logic (next)
└── README.md
```

**Legend:** ✅ Completed | 🚧 In Progress

---

## 🔑 Environment Variables

Required variables in `.env`:

```bash
# YouCam APIs
YOUCAM_SKIN_API_KEY=your_skin_api_key
YOUCAM_VTO_API_KEY=your_vto_api_key

# LLM (at least one required)
OPENAI_API_KEY=your_openai_key
# OR
GOOGLE_API_KEY=your_google_key

# Mock mode (set to false when real keys are configured)
ENABLE_MOCK_MODE=true
```

---

## 🧪 Testing

### Mock Mode Testing
Perfect for development without API keys:

```bash
python test_modules.py
```

Expected output:
```
🧪 AuraSense Module Test Suite
[1/3] Testing Configuration...
  ✅ Config loaded successfully
  📍 Mock mode enabled: True
[2/3] Testing Skin Analysis API...
  ✅ Skin analysis completed
  📊 Metrics received: 10 fields
  💬 Generated Summary: Primary concerns: dehydration, redness/sensitivity...
[3/3] Testing Module Imports...
  ✅ Modules package imported
✨ All tests passed!
```

### Live API Testing
Once you have real API keys:
1. Set `ENABLE_MOCK_MODE=false` in `.env`
2. Run `python -c "from modules.skin_api import analyze_skin; ..."`

---

## 🎯 Features

### Phase 1: Core Integration (Current)
- [x] Project structure and configuration
- [x] YouCam Skin AI integration with mock fallback
- [x] Metric parsing and health summaries
- [ ] YouCam VTO API integration
- [ ] Voice input/output engine
- [ ] Agentic reasoning layer

### Phase 2: Streamlit UI
- [ ] Image upload/capture interface
- [ ] Real-time skin metric visualization
- [ ] Side-by-side VTO preview
- [ ] Audio playback controls
- [ ] Accessible dark-mode theme

### Phase 3: Intelligence
- [ ] Context-aware product matching
- [ ] Multi-modal recommendation logic
- [ ] Session history tracking
- [ ] Personalized routine generation

---

## 🛠️ Development

### Adding New Features

1. **Create module** in `modules/`
2. **Add config** variables to `config.py`
3. **Update tests** in `test_modules.py`
4. **Integrate** into `app.py`

### Code Style
- Functions documented with docstrings
- Type hints for all function signatures
- Error handling with custom exceptions
- Mock mode support for all external APIs

---

## 📝 API Integration Notes

### YouCam Skin AI
- **Endpoint:** `https://yce-api-01.perfectcorp.com/api/v2/skin/analyze`
- **Auth:** Bearer token in Authorization header
- **Input:** Base64-encoded image
- **Output:** Nested JSON with metric scores (0-100 scale)

### YouCam VTO
- **Endpoint:** TBD (awaiting official documentation)
- **Function:** Apply makeup overlay to facial image
- **Input:** Image + product/shade ID
- **Output:** Processed image bytes

---

## 🤝 Contributing

This is a hackathon project for YouCam API Skin AI & eCommerce VTO Track.

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **YouCam/Perfect Corp** for API access and hackathon organization
- **Streamlit** for rapid UI prototyping
- **LangChain** for agentic AI framework

---

**Built with ❤️ for the YouCam Hackathon**
