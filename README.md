# GramSetu (Village Bridge)

A voice-first, multilingual AI agent platform that bridges the information and literacy gap for rural farmers in India.

## Overview

GramSetu enables farmers to access government scheme information, market intelligence, and weather data through natural voice conversations in their native languages. The platform eliminates language and digital literacy barriers by allowing farmers to interact entirely through voice, including the ability to complete complex government application forms by simply speaking their details.

## Key Features

### 🎤 Voice-First Interaction
- Natural language conversations in Hindi, Hinglish, Telugu, and Tamil
- Powered by Amazon Transcribe for speech-to-text and Amazon Polly for text-to-speech
- Handles code-switching and colloquial speech patterns

### 📋 Voice-to-Form Filling (Hero Feature)
- Convert spoken farmer details into ready-to-submit PDF applications
- Automatic entity extraction and validation
- Starting with Kisan Credit Card (KCC) applications
- No typing required - complete forms entirely through voice

### 🌾 Government Scheme Discovery
- RAG-based knowledge base with government scheme PDFs
- Search and discover schemes by eligibility, benefits, and application process
- Powered by Amazon Bedrock Knowledge Bases with semantic search

### 📊 Market Intelligence
- Current mandi (market) prices for major crops
- Price trends and actionable selling advice
- Supports wheat, rice, cotton, sugarcane, and pulses

### 🌤️ Weather Advisory
- Location-based weather forecasts
- Integrated farming advice based on weather conditions
- Powered by OpenWeatherMap API

### 🔐 Progressive Authentication
- Guest mode for information queries (no login required)
- Phone OTP authentication for scheme applications
- Secure storage of user profiles and application history

## Architecture

### Technology Stack

**Frontend:**
- React with Next.js (Progressive Web App)
- WhatsApp-style conversation interface
- WebSocket streaming for real-time voice interaction

**Backend:**
- AWS Lambda (Python 3.11) - Serverless functions
- AWS API Gateway - REST + WebSocket APIs
- Amazon Bedrock Agent with Claude 3.5 Sonnet - AI orchestration

**AI/ML Services:**
- Amazon Transcribe - Speech-to-text (streaming)
- Amazon Polly - Text-to-speech (neural voices)
- Amazon Bedrock Knowledge Bases - RAG with vector search
- OpenSearch Serverless - Vector store
- Amazon Titan Embeddings - Text embeddings

**Data Storage:**
- DynamoDB - User profiles, conversation history, sessions
- S3 - Government PDFs, generated application forms

**External Services:**
- OpenWeatherMap API - Weather forecasts
- Mock data service - Mandi prices (MVP)

### System Components

```
┌─────────────────┐
│  Mobile Web UI  │ (React PWA)
└────────┬────────┘
         │ WebSocket/REST
┌────────▼────────┐
│  API Gateway    │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────────┐
    │         │          │              │
┌───▼───┐ ┌──▼──┐ ┌─────▼─────┐ ┌─────▼─────┐
│ Auth  │ │Voice│ │Orchestrator│ │   Form    │
│Handler│ │Proc │ │            │ │ Generator │
└───┬───┘ └──┬──┘ └─────┬─────┘ └─────┬─────┘
    │        │           │              │
    │    ┌───▼───────────▼──────────────▼───┐
    │    │  Amazon Bedrock Agent (Claude)   │
    │    │  + Knowledge Base (RAG)          │
    │    └──────────────────────────────────┘
    │
┌───▼────────────┐
│   DynamoDB     │ (User profiles, sessions)
└────────────────┘
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend)
- AWS Account with access to:
  - Lambda
  - API Gateway
  - Bedrock (Claude 3.5 Sonnet)
  - Transcribe
  - Polly
  - DynamoDB
  - S3
  - OpenSearch Serverless
- AWS SAM CLI
- OpenWeatherMap API key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/gramsetu.git
cd gramsetu
```

2. **Install Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Install frontend dependencies:**
```bash
cd src/frontend
npm install
cd ../..
```

4. **Configure AWS credentials:**
```bash
aws configure
```

5. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your AWS resource ARNs and API keys
```

### Development

**Run tests:**
```bash
# All tests
pytest

# Unit tests only
pytest tests/unit/

# Property-based tests
pytest tests/property/ -m property_test

# With coverage
pytest --cov=src --cov-report=html
```

**Local development:**
```bash
# Start local API Gateway
sam local start-api

# Invoke Lambda function locally
sam local invoke VoiceProcessorFunction --event events/voice_query.json

# Stream logs
sam logs -n VoiceProcessorFunction --stack-name gramsetu --tail
```

**Frontend development:**
```bash
cd src/frontend
npm run dev
```

### Deployment

**Deploy to AWS:**
```bash
# Build Lambda functions
sam build

# Deploy (first time)
sam deploy --guided

# Subsequent deploys
sam deploy
```

**Upload government scheme PDFs to Knowledge Base:**
```bash
aws s3 sync ./docs/government_schemes s3://gramsetu-knowledge-base/
```

**Update Bedrock Agent:**
```bash
aws bedrock-agent update-agent \
  --agent-id <your-agent-id> \
  --agent-resource-role-arn <your-role-arn>
```

## Project Structure

```
gramsetu/
├── src/
│   ├── frontend/          # React PWA
│   ├── lambdas/           # AWS Lambda functions
│   │   ├── auth_handler/
│   │   ├── voice_processor/
│   │   ├── orchestrator/
│   │   └── form_generator/
│   ├── bedrock/           # Bedrock Agent configuration
│   ├── models/            # Data models
│   └── utils/             # Shared utilities
├── tests/
│   ├── unit/              # Unit tests
│   ├── property/          # Property-based tests
│   ├── integration/       # Integration tests
│   └── fixtures/          # Test data
├── docs/
│   ├── government_schemes/ # PDF documents for KB
│   └── templates/         # PDF form templates
├── infrastructure/        # AWS SAM templates
└── .kiro/
    ├── specs/             # Feature specifications
    └── steering/          # Project conventions
```

## Testing Strategy

GramSetu uses a dual testing approach:

### Unit Tests
- Test specific scenarios and edge cases
- Mock AWS services for deterministic results
- Fast execution for rapid feedback

### Property-Based Tests (Hypothesis)
- Test universal correctness properties
- Minimum 100 iterations per property
- Verify behavior across randomized inputs

### Integration Tests
- End-to-end flow testing
- VCR.py for API response recording/replay
- Test complete user journeys

**Coverage target:** >80%

## Performance Targets

- **Transcription:** <2s from audio completion
- **AI Response:** <3s for simple queries
- **Knowledge Base Query:** <2s (95th percentile)
- **PDF Generation:** <5s
- **Audio File Size:** <100KB per response
- **Concurrent Users:** 100+ without degradation

## Security & Privacy

- ✅ All data encrypted at rest (DynamoDB encryption)
- ✅ HTTPS/TLS for all data in transit
- ✅ Aadhar number masking (show only last 4 digits)
- ✅ No raw audio storage after transcription
- ✅ 2-year data retention policy
- ✅ User data deletion on request (within 7 days)

## Supported Languages

- **Hindi (hi-IN)** - Primary language
- **Hinglish** - Code-switching between Hindi and English
- **Telugu (te-IN)** - Regional language
- **Tamil (ta-IN)** - Regional language
- **English (en-IN)** - Fallback language

## MVP Scope

The initial release focuses on:
- Hindi/Hinglish + one regional language (Telugu or Tamil)
- Kisan Credit Card (KCC) application as the primary form-filling use case
- Core government schemes: PM-KISAN, Soil Health Card, SMAM, Fasal Bima Yojana
- Basic market prices and weather advisory

## Roadmap

### Phase 1 (MVP) - Current
- ✅ Voice input/output in Hindi and Telugu/Tamil
- ✅ Government scheme discovery
- ✅ KCC application form filling
- ✅ Basic market prices and weather

### Phase 2
- [ ] Additional regional languages (Marathi, Punjabi, Bengali)
- [ ] More government schemes and application forms
- [ ] Real-time mandi price integration
- [ ] SMS/WhatsApp integration

### Phase 3
- [ ] Offline mode support
- [ ] Voice-based crop disease diagnosis
- [ ] Community features (farmer-to-farmer advice)
- [ ] Integration with government portals for direct submission

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`pytest`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with AWS AI services (Transcribe, Polly, Bedrock)
- Powered by Anthropic's Claude 3.5 Sonnet
- Weather data from OpenWeatherMap
- Inspired by the need to bridge the digital divide in rural India

## Contact

For questions or support, please open an issue or contact the team at [support@gramsetu.org](mailto:support@gramsetu.org)

---

**GramSetu** - Bridging the gap between farmers and opportunity, one voice at a time. 🌾
