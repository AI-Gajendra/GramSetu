# Technology Stack

## Architecture

Serverless AWS-based architecture with voice-first AI pipeline.

## Core Technologies

### Frontend
- **Framework**: React with Next.js (or Streamlit/Gradio for rapid prototyping)
- **Type**: Progressive Web App (PWA)
- **UI Pattern**: WhatsApp-style conversation interface
- **Audio**: WebSocket streaming for real-time voice interaction

### Backend
- **Runtime**: AWS Lambda (Python 3.11)
- **API**: AWS API Gateway (REST + WebSocket)
- **Authentication**: AWS Cognito / DynamoDB-based OTP

### AI/ML Services
- **Speech-to-Text**: Amazon Transcribe (streaming API, HTTP/2)
- **Text-to-Speech**: Amazon Polly (neural voices)
- **AI Orchestration**: Amazon Bedrock Agent with Claude 3.5 Sonnet
- **Knowledge Base**: Amazon Bedrock Knowledge Bases with RAG
- **Vector Store**: OpenSearch Serverless
- **Embeddings**: Amazon Titan Embeddings G1 - Text

### Data Storage
- **User Profiles**: DynamoDB
- **Conversation History**: DynamoDB (24h TTL)
- **Document Storage**: S3 (government PDFs, generated forms)
- **Session Store**: DynamoDB (OTP with 5min TTL)

### External Services
- **Weather**: OpenWeatherMap API
- **Market Prices**: Mock/synthetic data for MVP

### PDF Generation
- **Library**: ReportLab (Python)

## Languages

### Supported Languages
- Hindi (hi-IN)
- Hinglish (code-switching between Hindi and English)
- Telugu (te-IN)
- Tamil (ta-IN)
- English (en-IN)

### Voice Configuration
- **Hindi**: Amazon Polly Aditi (neural, bilingual en-IN/hi-IN)
- **Telugu**: Standard voice
- **Tamil**: Standard voice
- **Audio Format**: MP3 at 24kbps (mobile-optimized)

## Testing

### Frameworks
- **Unit Tests**: pytest
- **Property-Based Tests**: Hypothesis (minimum 100 iterations per property)
- **Integration Tests**: pytest with VCR.py for API mocking
- **Load Testing**: Locust

### Test Organization
```
tests/
├── unit/           # Specific examples and edge cases
├── property/       # Universal correctness properties
├── integration/    # End-to-end flows
└── fixtures/       # Test data and mocks
```

## Common Commands

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run all tests
pytest

# Run unit tests only
pytest tests/unit/

# Run property tests only
pytest tests/property/ -m property_test

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test with verbose output
pytest tests/property/test_language_consistency.py -v -s
```

### AWS Deployment
```bash
# Deploy Lambda functions
sam build
sam deploy --guided

# Update Bedrock Agent
aws bedrock-agent update-agent --agent-id <id> --agent-resource-role-arn <arn>

# Sync Knowledge Base
aws s3 sync ./docs s3://gramsetu-knowledge-base/
```

### Local Development
```bash
# Start local API Gateway
sam local start-api

# Invoke Lambda locally
sam local invoke VoiceProcessorFunction --event events/voice_query.json

# Stream logs
sam logs -n VoiceProcessorFunction --stack-name gramsetu --tail
```

## Performance Targets

- Transcription: <2s from audio completion
- AI Response: <3s for simple queries
- Knowledge Base Query: <2s for 95% of queries
- PDF Generation: <5s
- Audio File Size: <100KB per response
- Concurrent Users: 100+ without degradation

## Security

- All data encrypted at rest (DynamoDB encryption)
- HTTPS/TLS for all data in transit
- Aadhar masking (show only last 4 digits)
- No raw audio storage after transcription
- 2-year data retention policy
