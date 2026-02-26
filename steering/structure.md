# Project Structure

## Overview

GramSetu follows a serverless AWS Lambda architecture with clear separation between frontend, backend services, and AI/ML components.

## Directory Organization

```
gramsetu/
├── .kiro/
│   ├── specs/
│   │   └── gramsetu/          # Feature specifications
│   │       ├── requirements.md # User stories and acceptance criteria
│   │       ├── design.md       # Architecture and design decisions
│   │       └── tasks.md        # Implementation task list
│   └── steering/               # Project conventions and guidelines
│
├── src/
│   ├── frontend/               # Mobile web UI (React/Next.js PWA)
│   │   ├── components/         # UI components (MicrophoneButton, ConversationView, etc.)
│   │   ├── pages/              # Next.js pages
│   │   ├── hooks/              # React hooks for audio, WebSocket
│   │   └── utils/              # Frontend utilities
│   │
│   ├── lambdas/                # AWS Lambda functions
│   │   ├── auth_handler/       # Authentication (OTP generation/verification)
│   │   ├── voice_processor/    # Transcribe + Polly integration
│   │   ├── orchestrator/       # Bedrock Agent proxy
│   │   └── form_generator/     # PDF generation and entity extraction
│   │
│   ├── bedrock/                # Bedrock Agent configuration
│   │   ├── agent_instructions.txt  # System prompt
│   │   ├── action_groups/      # Tool definitions (weather, prices, forms)
│   │   └── knowledge_base/     # KB configuration
│   │
│   ├── models/                 # Data models and schemas
│   │   ├── user_profile.py
│   │   ├── conversation.py
│   │   ├── application.py
│   │   └── weather.py
│   │
│   └── utils/                  # Shared utilities
│       ├── dynamodb.py         # DynamoDB helpers
│       ├── s3.py               # S3 helpers
│       ├── validation.py       # Entity validation rules
│       └── error_handling.py   # Error templates and circuit breaker
│
├── tests/
│   ├── unit/                   # Unit tests for specific scenarios
│   │   ├── test_voice_processor.py
│   │   ├── test_entity_extraction.py
│   │   ├── test_form_generator.py
│   │   ├── test_authentication.py
│   │   └── test_orchestrator.py
│   │
│   ├── property/               # Property-based tests (Hypothesis)
│   │   ├── test_language_consistency.py
│   │   ├── test_entity_validation.py
│   │   ├── test_conversation_context.py
│   │   └── test_data_persistence.py
│   │
│   ├── integration/            # End-to-end flow tests
│   │   ├── test_guest_query_flow.py
│   │   ├── test_application_flow.py
│   │   └── test_error_recovery.py
│   │
│   ├── fixtures/               # Test data and mocks
│   │   ├── user_profiles.py
│   │   ├── applications.py
│   │   └── mock_data.py
│   │
│   └── conftest.py             # Pytest configuration
│
├── docs/
│   ├── government_schemes/     # PDF documents for Knowledge Base
│   │   ├── pm-kisan/
│   │   ├── soil-health-card/
│   │   ├── smam/
│   │   └── fasal-bima/
│   │
│   └── templates/              # PDF form templates
│       └── kcc_application.pdf
│
├── infrastructure/             # AWS infrastructure as code
│   ├── template.yaml           # SAM template
│   ├── dynamodb.yaml           # DynamoDB table definitions
│   └── api_gateway.yaml        # API Gateway configuration
│
├── requirements.txt            # Python dependencies
├── pytest.ini                  # Pytest configuration
├── .hypothesis/                # Hypothesis test database
└── README.md                   # Project documentation
```

## Component Responsibilities

### Frontend (`src/frontend/`)
- Mobile-responsive PWA with WhatsApp-style UI
- Microphone input capture and audio streaming
- WebSocket connection management
- Audio playback controls
- Authentication flow UI

### Lambda Functions (`src/lambdas/`)
- **auth_handler**: OTP generation, verification, user profile management
- **voice_processor**: Amazon Transcribe/Polly integration, audio format optimization
- **orchestrator**: Bedrock Agent invocation, conversation context management
- **form_generator**: Entity extraction, PDF generation, S3 upload

### Bedrock Configuration (`src/bedrock/`)
- Agent instructions (system prompt)
- Action group definitions (weather, prices, form generation tools)
- Knowledge Base setup and chunking strategy

### Data Models (`src/models/`)
- Shared data structures (UserProfile, ConversationMessage, KCCApplication)
- Validation logic
- DynamoDB serialization/deserialization

### Tests (`tests/`)
- **unit/**: Test specific examples, edge cases, error conditions
- **property/**: Test universal properties across randomized inputs (min 100 iterations)
- **integration/**: Test complete user flows end-to-end
- **fixtures/**: Reusable test data and mock objects

## File Naming Conventions

- Python files: `snake_case.py`
- Test files: `test_<module_name>.py`
- React components: `PascalCase.tsx`
- Configuration files: `kebab-case.yaml`
- Spec files: `lowercase.md`

## Import Conventions

```python
# Standard library imports first
import json
from datetime import datetime
from typing import List, Optional

# Third-party imports second
import boto3
from hypothesis import given, strategies as st

# Local imports last
from models.user_profile import UserProfile
from utils.validation import validate_aadhar
```

## Configuration Management

- Environment variables for AWS resource ARNs, API keys
- Secrets stored in AWS Secrets Manager
- Configuration files in `infrastructure/` directory
- No hardcoded credentials or sensitive data in code

## Documentation

- Inline docstrings for all public functions/classes
- Type hints for all function parameters and return values
- README.md for setup and deployment instructions
- Architecture diagrams in `docs/` directory
