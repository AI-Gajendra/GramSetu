# GramSetu Implementation Plan - Prototype Phase
## Backend-First with Tight Security

**Version:** 1.0  
**Phase:** Prototype (MVP)  
**Focus:** Backend First, Tight Security  
**Last Updated:** February 2026

---

## 1. Executive Summary

This implementation plan outlines the development of the GramSetu prototype, focusing on a backend-first approach with tight security measures. The prototype will demonstrate the core voice-first AI agent capabilities for rural farmers in India, enabling them to:

- Query government schemes via voice
- Complete KCC (Kisan Credit Card) applications through voice input
- Access market prices and weather information

**Prototype Scope (Backend-Focused):**
- Hindi/Hinglish language support (Telugu/Tamil in Phase 2)
- Simulated OTP authentication (no real SMS gateway)
- Mock mandi prices and weather data (no external API dependencies)
- Basic KCC form generation with PDF output
- Mobile-responsive web interface (minimal viable)

**Security Focus:**
- JWT-based session management
- Input validation and sanitization
- PII masking (Aadhar numbers)
- No raw audio storage
- Rate limiting on all endpoints
- HTTPS-only communication

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PROTOTYPE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐         ┌──────────────────────┐                     │
│  │  Frontend   │◄───────►│   API Gateway         │                     │
│  │  (React     │  HTTPS  │   - REST API          │                     │
│  │   PWA)      │         │   - Authorizer        │                     │
│  └─────────────┘         │   - Rate Limiting     │                     │
│                          └──────────┬───────────┘                     │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    AWS LAMBDA FUNCTIONS                         │   │
│  ├─────────────┬─────────────┬─────────────┬───────────────────────┤   │
│  │ auth-lambda │ agent-lambda│ pdf-lambda  │ utility-lambda       │   │
│  │ - OTP       │ - Transcribe│ - Generate  │ - Health check       │   │
│  │ - JWT       │ - Bedrock   │ - Upload S3 │ - Metrics            │   │
│  │ - Profile   │ - Polly     │             │                      │   │
│  └─────────────┴─────────────┴─────────────┴───────────────────────┘   │
│                                     │                                  │
│                                     ▼                                  │
│  ┌──────────────┬──────────────┬──────────────┬───────────────────┐    │
│  │ DynamoDB     │ S3 Buckets   │ Bedrock      │ CloudWatch       │    │
│  │ - User Data  │ - PDFs       │ Agent        │ - Logs           │    │
│  │ - Sessions   │ - Templates │ - Knowledge  │ - Metrics        │    │
│  └──────────────┴──────────────┴──────────────┴───────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Compute** | AWS Lambda (Python 3.11) | Serverless function execution |
| **API Gateway** | REST API with JWT Authorizer | Secure API access |
| **Database** | DynamoDB | User profiles, sessions, applications |
| **Object Storage** | S3 (2 buckets) | PDFs, audio files (temp) |
| **AI/ML** | Amazon Bedrock (Claude 3.5 Sonnet) | Intent recognition, response generation |
| **Speech-to-Text** | Amazon Transcribe | Voice transcription |
| **Text-to-Speech** | Amazon Polly | Voice output |
| **Knowledge Base** | Bedrock Knowledge Base | Government scheme documents |
| **Monitoring** | CloudWatch | Logging, alerts, metrics |
| **Frontend** | React (Vite) + Tailwind | Mobile PWA |

---

## 3. Security Implementation

### 3.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │ Transport   │    │ Application │    │ Data        │       │
│  │ Security    │    │ Security    │    │ Security    │       │
│  ├─────────────┤    ├─────────────┤    ├─────────────┤       │
│  │ • HTTPS     │    │ • JWT Auth  │    │ • DynamoDB  │       │
│  │ • TLS 1.3   │    │ • API Key   │    │   Encryption│       │
│  │ • Cert Mgr  │    │ • Rate Limit│    │ • S3 Bucket │       │
│  │             │    │ • Input     │    │   Policies  │       │
│  │             │    │   Validation│    │ • PII       │       │
│  │             │    │             │    │   Masking   │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Authentication & Authorization

#### 3.2.1 Authentication Flow (Simulated OTP)

```
┌──────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   User                Frontend              Lambda              │
│    │                      │                    │                  │
│    │  1. Enter Phone     │                    │                  │
│    │─────────────────────►                    │                  │
│    │                      │                    │                  │
│    │                      │ 2. POST /auth/login │                 │
│    │                      │  {phone: "9999999999"}               │
│    │                      ────────────────────►                 │
│    │                      │                    │                  │
│    │                      │ 3. Generate OTP    │                 │
│    │                      │    (1234 for demo) │                 │
│    │                      │    Store in DDB    │                 │
│    │                      │    Log to CW       │                 │
│    │                      │◄───────────────────                  │
│    │                      │                    │                  │
│    │  4. Enter OTP       │                    │                  │
│    │─────────────────────►                    │                  │
│    │                      │                    │                  │
│    │                      │ 5. POST /auth/verify│                 │
│    │                      │  {phone, otp}      │                 │
│    │                      ────────────────────►                 │
│    │                      │                    │                  │
│    │                      │ 6. Validate OTP   │                 │
│    │                      │    Generate JWT   │                 │
│    │                      │    Return token   │                 │
│    │                      ◄───────────────────                   │
│    │                      │                    │                  │
│    │  7. Receive JWT     │                    │                  │
│    │◄─────────────────────                    │                  │
│    │                      │                    │                  │
└──────────────────────────────────────────────────────────────────┘
```

#### 3.2.2 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "phone": "919999999999",
    "iat": 1700000000,
    "exp": 1700086400,
    "scope": "guest|authenticated"
  },
  "signature": "HMAC-SHA256签名"
}
```

**Token Configuration:**
- **Algorithm:** HS256
- **Expiration:** 24 hours (prototype)
- **Secret Storage:** AWS Secrets Manager
- **Refresh:** Not implemented in prototype (re-login required)

#### 3.2.3 API Authorization Levels

| Endpoint | Guest | Authenticated | Notes |
|----------|-------|---------------|-------|
| `GET /health` | ✓ | ✓ | No auth required |
| `POST /auth/login` | ✓ | ✓ | Rate limited |
| `POST /auth/verify` | ✓ | ✓ | Rate limited |
| `POST /agent/query` | ✓ | ✓ | Guest limited to 5 queries |
| `GET /user/profile` | ✗ | ✓ | Requires JWT |
| `PUT /user/profile` | ✗ | ✓ | Requires JWT |
| `POST /form/generate` | ✗ | ✓ | Requires JWT |
| `GET /form/{id}` | ✗ | ✓ | Requires JWT + ownership |

### 3.3 Input Validation & Sanitization

#### 3.3.1 Validation Rules

| Field | Validation | Sanitization |
|-------|------------|---------------|
| **Phone** | `^91[0-9]{10}$` | Digits only |
| **OTP** | `^[0-9]{4}$` | Digits only |
| **Aadhar** | `^[0-9]{12}$` | Digits only, Luhn check |
| **Name** | `^[A-Za-z\s]{2,50}$` | Trim, uppercase |
| **Land Size** | `0.1-100` | Float, 1 decimal |
| **Loan Amount** | `1000-300000` | Integer, INR |
| **Language** | `hi-IN\|en-IN` | Enum check |
| **Audio** | `≤1MB, webm/mp3` | Max size, format check |

#### 3.3.2 SQL/NoSQL Injection Prevention

- **DynamoDB:** Use parameterized queries (boto3 defaults)
- **Bedrock:** Sanitize prompt inputs, no direct user input in system prompts
- **Lambda:** Validate all string inputs against regex patterns

### 3.4 Data Protection

#### 3.4.1 PII Handling

```
┌─────────────────────────────────────────────────────────────────┐
│                    PII HANDLING RULES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Aadhar Number:                                                 │
│  ─────────────                                                  │
│  Storage:   Encrypt at rest (AES-256)                         │
│  Display:   XXXXXX1234 (last 4 visible)                        │
│  Logging:   NEVER log full Aadhar                              │
│  Response:  Mask in API responses                              │
│                                                                 │
│  Phone Number:                                                  │
│  ────────────                                                  │
│  Storage:   Hash + salt (SHA-256)                             │
│  Display:   XXXXXX9999 (last 4 visible)                       │
│  Logging:   NEVER log full phone                               │
│                                                                 │
│  Audio Data:                                                   │
│  ──────────                                                    │
│  Storage:   NEVER persist after transcription                 │
│  Processing: In-memory only                                    │
│  Logging:   NEVER log audio content                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.4.2 Encryption Configuration

| Resource | At Rest | In Transit |
|----------|---------|------------|
| DynamoDB | ✓ AWS-managed KMS | TLS 1.3 |
| S3 Buckets | ✓ SSE-KMS | TLS 1.3 |
| Lambda Env | ✓ Secrets Manager | N/A |
| CloudWatch | ✓ AWS-managed | TLS 1.3 |

#### 3.4.3 S3 Bucket Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyNonHTTPS",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::gramsetu-pdfs/*",
        "arn:aws:s3:::gramsetu-pdfs"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    },
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gramsetu-pdfs/public/*"
    },
    {
      "Sid": "LambdaOnlyPut",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT:role/gramsetu-lambda-role"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::gramsetu-pdfs/*"
    }
  ]
}
```

### 3.5 Rate Limiting & Throttling

```
┌─────────────────────────────────────────────────────────────────┐
│                    RATE LIMITING CONFIG                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Endpoint              Limit              Burst    Window       │
│  ─────────────────────────────────────────────────────────      │
│  /auth/login           5 req/min           10      per IP        │
│  /auth/verify          10 req/min          20      per IP       │
│  /agent/query          20 req/min          30      per user      │
│  /form/generate        5 req/min           10      per user      │
│                                                                 │
│  Response Headers:                                            │
│  - X-RateLimit-Limit: 20                                       │
│  - X-RateLimit-Remaining: 15                                   │
│  - X-RateLimit-Reset: 1700000000                               │
│                                                                 │
│  When Limit Exceeded:                                          │
│  - HTTP 429 Too Many Requests                                   │
│  - Retry-After: 60 seconds                                     │
│  - Body: {"error": "rate_limit_exceeded", "retry_after": 60}   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.6 Logging & Monitoring

#### 3.6.1 CloudWatch Log Groups

| Log Group | Retention | PII Redaction |
|-----------|-----------|---------------|
| `/aws/lambda/gramsetu-auth` | 7 days | Phone, Aadhar masked |
| `/aws/lambda/gramsetu-agent` | 7 days | Audio refs only |
| `/aws/lambda/gramsetu-pdf` | 7 days | Aadhar masked |
| `/aws/apigateway/gramsetu-api` | 7 days | Request/response logged |

#### 3.6.2 Security Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY METRICS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Monitor:                                                       │
│  ────────                                                      │
│  • Failed authentication attempts (>5/min = alert)             │
│  • Rate limit violations (>10/min = alert)                     │
│  • Invalid input submissions (>20/min = alert)                 │
│  • API error rate (>5% = alert)                                 │
│  • Unusual query patterns (bedrock agent)                       │
│                                                                 │
│  Alerts:                                                        │
│  ──────                                                         │
│  • SNS Topic: gramsetu-security-alerts                          │
│  • Email: hackathon-team@demo.local                             │
│  • Severity: INFO, WARNING, CRITICAL                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema (DynamoDB)

### 4.1 Single Table Design

**Table Name:** `GramSetu_Prototype`

**Primary Key:**
- Partition Key (PK): String
- Sort Key (SK): String

### 4.2 Entity Definitions

```
┌─────────────────────────────────────────────────────────────────┐
│                    DYNAMODB SCHEMA                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USER PROFILE                                                  │
│  ────────────                                                  │
│  PK:        USER#<phone_number>                                │
│  SK:        PROFILE                                            │
│  Fields:                                                         │
│    • user_id          : UUID (primary key)                     │
│    • phone_hash       : SHA-256(phone)                         │
│    • preferred_lang   : "hi-IN" | "en-IN"                      │
│    • name             : String                                  │
│    • location         : String (district)                      │
│    • created_at       : Unix timestamp                          │
│    • last_active     : Unix timestamp                          │
│    • interaction_count: Number                                  │
│    • saved_apps      : List[form_id]                            │
│                                                                 │
│  OTP STORE                                                     │
│  ─────────                                                     │
│  PK:        AUTH#<phone_number>                                │
│  SK:        OTP                                                │
│  Fields:                                                         │
│    • otp_code         : String (hashed)                        │
│    • attempts         : Number (0-3)                            │
│    • created_at       : Unix timestamp                          │
│    • expires_at       : Unix timestamp (+5 min)                 │
│                                                                 │
│  CONVERSATION HISTORY                                          │
│  ────────────────────                                           │
│  PK:        USER#<phone_number>  OR  SESSION#<session_id>      │
│  SK:        MSG#<timestamp>#<sequence>                          │
│  Fields:                                                         │
│    • role            : "user" | "assistant"                    │
│    • content         : String (transcribed text)               │
│    • language        : String                                   │
│    • audio_url       : String (S3 ref, optional)               │
│    • intent          : String (detected intent)                 │
│    • metadata        : Map (JSON)                               │
│  TTL:        24 hours                                           │
│                                                                 │
│  APPLICATION                                                   │
│  ───────────                                                    │
│  PK:        USER#<phone_number>                                │
│  SK:        APP#<form_id>                                      │
│  Fields:                                                         │
│    • form_id         : UUID                                     │
│    • type            : "KCC" | "PM-KISAN" | etc.               │
│    • status          : "draft" | "generated" | "submitted"     │
│    • form_data       : Map (encrypted JSON)                     │
│    • pdf_url         : String (S3 signed URL)                  │
│    • created_at      : Unix timestamp                          │
│    • updated_at      : Unix timestamp                          │
│                                                                 │
│  SESSION                                                       │
│  ───────                                                       │
│  PK:        SESSION#<session_id>                              │
│  SK:        METADATA                                           │
│  Fields:                                                         │
│    • user_id         : String (if authenticated)               │
│    • phone_hash      : String (if authenticated)               │
│    • language        : String                                   │
│    • created_at      : Unix timestamp                          │
│    • expires_at      : Unix timestamp (+30 min)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 GSI (Global Secondary Indexes)

| GSI Name | Partition Key | Sort Key | Purpose |
|----------|---------------|----------|---------|
| `GSI1-UserId` | `user_id` | `created_at` | Lookup by user_id |
| `GSI2-FormId` | `form_id` | `user_id` | Lookup by form_id |
| `GSI3-Phone` | `phone_hash` | `created_at` | Lookup by phone |

---

## 5. API Endpoints

### 5.1 Endpoint Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BASE URL: https://api.gramsetu.demo.local/v1                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    AUTHENTICATION                         │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ POST   /auth/login        - Send OTP (simulated)         │ │
│  │ POST   /auth/verify      - Verify OTP, get JWT           │ │
│  │ POST   /auth/logout      - Invalidate JWT                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    USER                                   │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ GET    /user/profile     - Get user profile (auth)      │ │
│  │ PUT    /user/profile     - Update profile (auth)        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│──────────────────────────  ┌────────────────────────────────┐ │
│  │                    AGENT                                  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ POST   /agent/query       - Voice/text query             │ │
│  │ GET    /agent/history     - Get conversation history    │ │
│  └──────────────────────────────────────────────────────────┘ │
  ┌──────────────────────────────────────────────────────────│                                                                 │
│┐ │
│  │                    FORMS                                  │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ POST   /form/generate     - Generate PDF (auth)          │ │
│  │ GET    /form/{id}         - Download PDF (auth)          │ │
│  │ GET    /form/list         - List user forms (auth)       │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    HEALTH                                 │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ GET    /health            - Health check (no auth)      │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Request/Response Formats

#### 5.2.1 POST /auth/login

**Request:**
```json
{
  "phone": "919999999999"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your phone",
  "expires_in": 300
}
```

**Error Response (429):**
```json
{
  "success": false,
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retry_after": 60
}
```

#### 5.2.2 POST /auth/verify

**Request:**
```json
{
  "phone": "919999999999",
  "otp": "1234"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "uuid",
    "phone": "919999999999",
    "preferred_lang": "hi-IN"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "invalid_otp",
  "message": "Incorrect OTP. Please try again.",
  "attempts_remaining": 2
}
```

#### 5.2.3 POST /agent/query

**Request:**
```json
{
  "session_id": "uuid",
  "input": {
    "type": "audio",  // or "text"
    "content": "base64_encoded_audio"  // or "text string"
  },
  "language": "hi-IN",
  "context": {
    "previous_intent": "scheme_query"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "response": {
    "text": "PM-KISAN योजना के तहत...",
    "audio_base64": "UklGRiQAAABXQVZF...",
    "intent": "scheme_info",
    "entities": {
      "scheme": "PM-KISAN"
    },
    "sources": ["pm-kisan-guidelines.pdf"]
  },
  "session": {
    "session_id": "uuid",
    "turn": 3
  }
}
```

#### 5.2.4 POST /form/generate

**Request:**
```json
{
  "form_type": "KCC",
  "data": {
    "applicant_name": "राम कुमार शर्मा",
    "father_name": "श्याम लाल शर्मा",
    "aadhar_number": "123456789012",
    "address": "ग्राम: रामपुर, पोस्ट: बलरामपुर",
    "district": "अमरावती",
    "state": "महाराष्ट्र",
    "land_size_acres": 5.5,
    "crop_type": "कपास",
    "loan_amount": 50000,
    "bank_name": "भारतीय स्टेट बैंक"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "form": {
    "form_id": "KCC-2026-0001",
    "type": "KCC",
    "status": "generated",
    "download_url": "https://gramsetu-pdfs.s3.../KCC-2026-0001.pdf",
    "expires_at": 1700000000
  }
}
```

---

## 6. Lambda Functions

### 6.1 Function Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAMBDA FUNCTIONS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ gramsetu-auth-lambda                                     │ │
│  │ ─────────────────────                                     │ │
│  │ Runtime: Python 3.11                                      │ │
│  │ Memory: 512 MB                                           │ │
│  │ Timeout: 10 seconds                                      │ │
│  │                                                           │ │
│  │ Functions:                                                │ │
│  │ • send_otp(phone) → Generate + store OTP                 │ │
│  │ • verify_otp(phone, otp) → Validate + return JWT        │ │
│  │ • logout(token) → Blacklist JWT                          │ │
│  │ • create_profile(user_data) → Create user                │ │
│  │ • get_profile(user_id) → Get user data                  │ │
│  │ • update_profile(user_id, data) → Update user            │ │
│  │                                                           │ │
│  │ Dependencies:                                             │ │
│  │ • boto3 (DynamoDB, Secrets Manager)                      │ │
│  │ • PyJWT (token generation)                               │ │
│  │ • hashlib (phone hashing)                                │ │
│  │ • secrets (OTP generation)                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ gramsetu-agent-lambda                                     │ │
│  │ ─────────────────────                                     │ │
│  │ Runtime: Python 3.11                                      │ │
│  │ Memory: 1024 MB (Bedrock needs more)                     │ │
│  │ Timeout: 30 seconds                                       │ │
│  │                                                           │ │
│  │ Functions:                                                │ │
│  │ • transcribe_audio(audio_base64, lang) → text             │ │
│  │ • invoke_bedrock_agent(text, context) → response         │ │
│  │ • synthesize_speech(text, lang) → audio_base64           │ │
│  │ • get_conversation_history(session_id) → messages       │ │
│  │ • save_conversation(session_id, message) → None         │ │
│  │                                                           │ │
│  │ External Calls:                                           │ │
│  │ • Amazon Transcribe (speech-to-text)                     │ │
│  │ • Amazon Bedrock (Claude 3.5 Sonnet)                     │ │
│  │ • Amazon Polly (text-to-speech)                          │ │
│  │ • Bedrock Knowledge Base (RAG)                          │ │
│  │                                                           │ │
│  │ Dependencies:                                             │ │
│  │ • boto3 (AWS services)                                   │ │
│  │ • amazon-transcribe               (pip)                  │ │
│  │ • amazon-polly                    (pip)                  │ │
│  │ • botocore.exceptions             (builtin)              │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ gramsetu-pdf-lambda                                       │ │
│  │ ─────────────────────                                     │ │
│  │ Runtime: Python 3.11                                      │ │
│  │ Memory: 512 MB                                           │ │
│  │ Timeout: 15 seconds                                       │ │
│  │                                                           │ │
│  │ Functions:                                                │ │
│  │ • validate_application_data(data) → validation_result    │ │
│  │ • extract_entities_from_text(text) → entities            │ │
│  │ • generate_kcc_pdf(form_data) → pdf_url                  │ │
│  │ • mask_aadhar(aadhar) → masked_string                     │ │
│  │ • upload_to_s3(pdf_data) → s3_url                        │ │
│  │                                                           │ │
│  │ Dependencies:                                             │ │
│  │ • reportlab (PDF generation)                             │ │
│  │ • boto3 (S3)                                             │ │
│  │ • cryptography (encryption)                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ gramsetu-utility-lambda                                   │ │
│  │ ─────────────────────                                      │ │
│  │ Runtime: Python 3.11                                      │ │
│  │ Memory: 256 MB                                           │ │
│  │ Timeout: 5 seconds                                         │ │
│  │                                                           │ │
│  │ Functions:                                                │ │
│  │ • health_check() → status                                 │ │
│  │ • get_metrics() → cloudwatch_data                         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Lambda Environment Variables

```yaml
# gramsetu-auth-lambda
AUTH_SECRET_NAME: "gramsetu/auth/jwt-secret"
DYNAMODB_TABLE: "GramSetu_Prototype"
OTP_EXPIRY_SECONDS: 300
MAX_OTP_ATTEMPTS: 3

# gramsetu-agent-lambda
BEDROCK_MODEL_ID: "anthropic.claude-3-5-sonnet-20241022-v2:0"
BEDROCK_AGENT_ID: "agent-id-from-console"
KNOWLEDGE_BASE_ID: "kb-id-from-console"
TRANSCRIBE_LANGUAGE: "hi-IN"
POLLY_VOICE_ID_HINDI: "Aditi"
POLLY_VOICE_ID_ENGLISH: "Joanna"
DYNAMODB_TABLE: "GramSetu_Prototype"

# gramsetu-pdf-lambda
S3_BUCKET_PDFS: "gramsetu-pdfs"
S3_BUCKET_TEMPLATES: "gramsetu-templates"
KMS_KEY_ID: "alias/gramsetu-keys"
DYNAMODB_TABLE: "GramSetu_Prototype"
```

### 6.3 Lambda IAM Roles

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT:table/GramSetu_Prototype"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::gramsetu-pdfs/*",
        "arn:aws:s3:::gramsetu-templates/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeAgent",
        "bedrock:RetrieveAndGenerate"
      ],
      "Resource": [
        "arn:aws:bedrock:REGION:ACCOUNT:agent/AGENT_ID",
        "arn:aws:bedrock:REGION:ACCOUNT:knowledge-base/KB_ID"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "transcribe:StartTranscriptionJob",
        "transcribe:GetTranscriptionJob"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:gramsetu/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:REGION:ACCOUNT:log-group:/aws/lambda/gramsetu-*"
    }
  ]
}
```

---

## 7. Bedrock Agent Configuration

### 7.1 Agent Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                    BEDROCK AGENT CONFIG                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Agent Name:        GramSetu_Prototype_Agent                    │
│  Model:            Claude 3.5 Sonnet                           │
│  Model ID:         anthropic.claude-3-5-sonnet-20241022-v2:0 │
│                                                                 │
│  Instruction:                                                    │
│  ───────────                                                    │
│  "You are GramSetu, a helpful AI assistant for rural farmers  │
│   in India. Your goal is to help farmers access government    │
│   schemes, market information, and complete application forms  │
│   through natural voice conversation.                           │
│                                                                 │
│   Guidelines:                                                   │
│   - Speak in simple, clear language appropriate for farmers    │
│   - Use Hindi (हिंदी) as default, support English              │
│   - When users ask about schemes, search the knowledge base   │
│   - Always cite the source document for scheme details         │
│   - For form filling, collect information one field at a time  │
│   - Confirm extracted information before proceeding            │
│   - Be patient and supportive                                  │
│   - Provide actionable advice based on available data          │
│                                                                 │
│   Knowledge Base:                                               │
│   ─────────────                                                │
│   - Government scheme PDFs (PM-KISAN, KCC, Soil Health Card)   │
│   - Embedding model: Titan Embeddings G1 - Text               │
│   - Vector store: OpenSearch Serverless                        │
│                                                                 │
│   Action Groups:                                                │
│   ────────────                                                 │
│   1. WeatherTool    - get_weather_forecast                     │
│   2. PriceTool      - get_mandi_prices                         │
│   3. FormTool       - generate_kcc_application                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Bedrock Tools (Action Groups)

#### 7.2.1 Weather Tool

```python
def get_weather_forecast(location: str, days: int = 3) -> dict:
    """
    Get weather forecast for a location in India.
    
    Parameters:
        location: District name (e.g., "Amravati", "Jaipur")
        days: Number of days (1-7, default: 3)
    
    Returns:
        {
            "location": str,
            "current": {
                "temp": float,  # Celsius
                "condition": str,  # "Sunny", "Cloudy", "Rainy"
                "humidity": int,  # percentage
                "wind_speed": float  # km/h
            },
            "forecast": [
                {
                    "date": str,  # "2026-02-26"
                    "temp_max": float,
                    "temp_min": float,
                    "rain_probability": int,  # percentage
                    "condition": str
                }
            ]
        }
    """
    # Mock implementation for prototype
    pass
```

#### 7.2.2 Price Tool

```python
def get_mandi_prices(crop: str, state: Optional[str] = None) -> dict:
    """
    Get current mandi prices for crops.
    
    Parameters:
        crop: Crop name (wheat, rice, cotton, sugarcane, pulses, etc.)
        state: Optional state filter (Maharashtra, UP, Punjab, etc.)
    
    Returns:
        {
            "crop": str,
            "prices": [
                {
                    "mandi": str,  # Market name
                    "state": str,
                    "price_per_quintal": float,  # INR
                    "date": str  # "2026-02-26"
                }
            ],
            "trend": "rising" | "falling" | "stable",
            "best_mandi": str,
            "advice": str  # Natural language advice
        }
    """
    # Mock implementation for prototype
    pass
```

#### 7.2.3 Form Generation Tool

```python
def generate_kcc_application(
    name: str,
    aadhar: str,
    land_size: float,
    crop_type: str,
    loan_amount: float,
    father_name: str = "",
    address: str = "",
    district: str = "",
    state: str = "",
    bank_name: str = ""
) -> dict:
    """
    Generate KCC application PDF.
    
    Parameters:
        name: Applicant full name
        aadhar: 12-digit Aadhar number
        land_size: Land size in acres
        crop_type: Type of crop cultivated
        loan_amount: Requested loan amount in INR
        father_name: Father's name
        address: Full address
        district: District name
        state: State name
        bank_name: Bank name
    
    Returns:
        {
            "form_id": str,  # "KCC-2026-0001"
            "status": "generated",
            "message": str
        }
        # PDF URL will be generated by Lambda
    """
    # Calls gramsetu-pdf-lambda via Bedrock
    pass
```

### 7.3 Knowledge Base Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE BASE CONFIG                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Knowledge Base Name:  GramSetu_Knowledge_Base                 │
│  Embedding Model:        Titan Embeddings G1 - Text            │
│  Vector Store:           OpenSearch Serverless                 │
│  Chunking Strategy:      Fixed size (300 tokens, 20% overlap)  │
│                                                                 │
│  S3 Data Source:         s3://gramsetu-knowledge-base/         │
│                                                                 │
│  Documents:                                                      │
│  ──────────                                                      │
│  • pm-kisan-guidelines-hindi.pdf                               │
│  • pm-kisan-guidelines-english.pdf                              │
│  • kcc-application-process.pdf                                │
│  • soil-health-card-scheme.pdf                                 │
│  • smam-subsidy-guidelines.pdf                                 │
│  • fasal-bima-yojana.pdf                                       │
│                                                                 │
│  Metadata Filters:                                              │
│  ───────────────                                               │
│  • scheme_name: String                                        │
│  • language: String (hi-IN, en-IN)                            │
│  • last_updated: Date                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Frontend Integration (Prototype Scope)

### 8.1 Frontend Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND REQUIREMENTS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tech Stack:                                                    │
│  ──────────                                                    │
│  • React 18 + Vite                                             │
│  • Tailwind CSS (mobile-first)                                 │
│  • Axios (HTTP client)                                         │
│  • Howler.js (audio playback)                                 │
│  • React Router (navigation)                                   │
│                                                                 │
│  Pages:                                                         │
│  ──────                                                         │
│  1. HomePage (/) - Main chat interface                         │
│  2. LoginModal - OTP authentication                            │
│  3. ProfilePage (/profile) - User settings                     │
│  4. FormsPage (/forms) - List applications                     │
│                                                                 │
│  Key Components:                                               │
│  ───────────────                                               │
│  • AudioRecorder - Microphone recording                        │
│  • ChatBubble - Message display                                │
│  • AudioPlayer - Response playback                             │
│  • LoginForm - Phone + OTP input                               │
│  • PDFViewer - Form download                                   │
│                                                                 │
│  State Management:                                             │
│  ─────────────────                                             │
│  • React Context for auth state                               │
│  • Local storage for session                                  │
│  • Session storage for conversation                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 API Service Layer

```javascript
// services/api.js
import axios from 'axios';

const API_BASE = 'https://api.gramsetu.demo.local/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gramsetu_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gramsetu_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (phone) => api.post('/auth/login', { phone }),
  verify: (phone, otp) => api.post('/auth/verify', { phone, otp }),
  logout: () => api.post('/auth/logout')
};

export const agentAPI = {
  query: (sessionId, input, language) => 
    api.post('/agent/query', { session_id: sessionId, input, language }),
  history: (sessionId) => api.get(`/agent/history?session_id=${sessionId}`)
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data)
};

export const formAPI = {
  generate: (formType, data) => api.post('/form/generate', { form_type: formType, data }),
  get: (formId) => api.get(`/form/${formId}`),
  list: () => api.get('/form/list')
};

export default api;
```

---

## 9. Implementation Timeline

### 9.1 Sprint Breakdown (4 Sprints)

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION TIMELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SPRINT 1: Foundation (Week 1)                                │
│  ──────────────────────────────                                 │
│  Day 1-2:  AWS account setup, IAM roles                        │
│  Day 3-4:  DynamoDB table creation, S3 buckets                 │
│  Day 5:    API Gateway setup, JWT authorizer                   │
│  Day 7:    Lambda skeleton deployment                           │
│                                                                 │
│  Deliverable: API endpoints responding                         │
│                                                                 │
│  SPRINT 2: Authentication (Week 2)                             │
│  ───────────────────────────────                               │
│  Day 8-9:  Auth Lambda - OTP generation/verification            │
│  Day 10:   JWT token generation and validation                 │
│  Day 11:   User profile CRUD operations                        │
│  Day 12:   Rate limiting configuration                          │
│  Day 14:   Integration testing - auth flow                     │
│                                                                 │
│  Deliverable: Working auth system                              │
│                                                                 │
│  SPRINT 3: Agent & AI (Week 3)                                 │
│  ─────────────────────────────                                  │
│  Day 15-16: Bedrock Agent setup and configuration              │
│  Day 17:   Knowledge Base setup, document upload              │
│  Day 18-19: Transcribe integration (voice → text)             │
│  Day 20:   Polly integration (text → voice)                    │
│  Day 21:   Agent Lambda - orchestration logic                  │
│  Day 22-23: Integration - full query flow                      │
│  Day 24:   Testing and debugging                               │
│                                                                 │
│  Deliverable: Voice query working                             │
│                                                                 │
│  SPRINT 4: Forms & Polish (Week 4)                            │
│  ───────────────────────────────                                │
│  Day 25-26: PDF Lambda - form generation                       │
│  Day 27:   KCC form template creation                          │
│  Day 28:   Entity extraction and validation                    │
│  Day 29:   PII masking implementation                          │
│  Day 30:   Frontend integration                                │
│  Day 31-32: End-to-end testing                                 │
│  Day 33-34: Security audit and fixes                          │
│  Day 35:   Demo preparation                                    │
│                                                                 │
│  Deliverable: Working prototype for demo                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Testing Strategy

### 10.1 Testing Types

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING STRATEGY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  UNIT TESTS (pytest)                                           │
│  ───────────────                                               │
│  • test_auth_lambda.py    - OTP generation, JWT, profile       │
│  • test_agent_lambda.py   - Transcribe, Polly, Bedrock calls    │
│  • test_pdf_lambda.py     - Validation, PDF generation         │
│  • test_utils.py          - PII masking, input validation      │
│                                                                 │
│  Mocks:                                                         │
│  • moto (DynamoDB mock)                                        │
│  • pytest-mock (Lambda boto3 calls)                            │
│  • responses (HTTP calls)                                      │
│                                                                 │
│  INTEGRATION TESTS                                             │
│  ─────────────────                                             │
│  • test_auth_flow.py         - Full authentication flow        │
│  • test_query_flow.py        - Voice query → response          │
│  • test_form_flow.py         - Form generation flow            │
│  • test_error_handling.py    - Error scenarios                 │
│                                                                 │
│  SECURYTI TESTS                                                │
│  ──────────────                                                │
│  • test_auth_security.py     - JWT validation, OTP brute force │
│  • test_input_validation.py  - SQL injection, XSS              │
│  • test_pii_handling.py      - Aadhar masking, phone hashing  │
│  • test_rate_limiting.py     - DoS simulation                  │
│                                                                 │
│  COVERAGE TARGET: 80%                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Test Commands

```bash
# Run all tests
pytest tests/ -v

# Run unit tests only
pytest tests/unit/ -v

# Run integration tests
pytest tests/integration/ -v

# Run with coverage
pytest --cov=src --cov-report=html --cov-fail-under=80

# Run security tests
pytest tests/security/ -v

# Run specific test file
pytest tests/unit/test_auth_lambda.py -v
```

---

## 11. Deployment

### 11.1 Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GitHub Actions Workflow (.github/workflows/deploy.yml)        │
│                                                                 │
│  Stage 1: Build                                                 │
│  ─────────────                                                 │
│  • Install dependencies (pip install -r requirements.txt)    │
│  • Run linting (flake8, black)                                 │
│  • Run type checking (mypy)                                    │
│  • Run unit tests                                              │
│                                                                 │
│  Stage 2: Security Scan                                        │
│  ────────────────────                                           │
│  • Run safety (dependency vulnerabilities)                      │
│  • Run bandit (security issues)                                │
│                                                                 │
│  Stage 3: Deploy to AWS                                        │
│  ──────────────────────────                                     │
│  • Configure AWS credentials                                   │
│  • Package Lambda functions (zip)                              │
│  • Deploy to S3                                                │
│  • Update Lambda functions                                     │
│  • Deploy API Gateway                                          │
│  • Run integration tests                                       │
│                                                                 │
│  Stage 4: Notify                                               │
│  ──────────────                                                │
│  • Post to Slack/Discord on success/failure                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Manual Deployment (Prototype)

```bash
# 1. Package Lambda functions
cd lambda/auth && zip -r ../deploy/auth.zip . -x "*.pyc" "__pycache__/*"
cd lambda/agent && zip -r ../deploy/agent.zip . -x "*.pyc" "__pycache__/*"
cd lambda/pdf && zip -r ../deploy/pdf.zip . -x "*.pyc" "__pycache__/*"

# 2. Deploy Lambda functions
aws lambda update-function-code \
  --function-name gramsetu-auth-lambda \
  --zip-file fileb://deploy/auth.zip

aws lambda update-function-code \
  --function-name gramsetu-agent-lambda \
  --zip-file fileb://deploy/agent.zip

aws lambda update-function-code \
  --function-name gramsetu-pdf-lambda \
  --zip-file fileb://deploy/pdf.zip

# 3. Deploy API Gateway
aws apigatewayv2 update-api \
  --api-id API_ID \
  --body file://api-config.json

# 4. Verify deployment
curl https://api.gramsetu.demo.local/v1/health
```

---

## 12. Security Checklist

### 12.1 Pre-Deployment Security Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY CHECKLIST                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AUTHENTICATION                                                 │
│  ─────────────                                                 │
│  □ JWT secret stored in Secrets Manager                        │
│  □ JWT expiration set to 24 hours                              │
│  □ OTP TTL set to 5 minutes                                    │
│  □ Max 3 OTP attempts before lockout                          │
│  □ Phone number format validation                              │
│                                                                 │
│  AUTHORIZATION                                                  │
│  ────────────                                                  │
│  □ API Gateway authorizer configured                           │
│  □ JWT validation on protected endpoints                       │
│  □ Resource ownership check (forms)                           │
│                                                                 │
│  INPUT VALIDATION                                               │
│  ─────────────────                                              │
│  □ All inputs validated with regex                            │
│  □ SQL/NoSQL injection prevention                             │
│  □ Bedrock prompt injection prevention                        │
│  □ File upload size limits (<1MB)                             │
│                                                                 │
│  DATA PROTECTION                                                │
│  ───────────────                                               │
│  □ DynamoDB encryption at rest enabled                         │
│  □ S3 bucket policies restrict access                         │
│  □ PII masking in logs                                        │
│  □ Aadhar numbers masked in responses                         │
│  □ Phone numbers hashed in storage                            │
│  □ No raw audio storage                                       │
│                                                                 │
│  RATE LIMITING                                                  │
│  ─────────────                                                  │
│  □ API Gateway throttling configured                          │
│  □ Per-user rate limits                                        │
│  □ Per-IP rate limits                                          │
│  □ 429 responses include Retry-After                         │
│                                                                 │
│  MONITORING                                                     │
│  ──────────                                                     │
│  □ CloudWatch logs enabled                                     │
│  □ Security metrics alarms configured                         │
│  □ Failed auth alerts configured                              │
│                                                                 │
│  NETWORK                                                        │
│  ────────                                                       │
│  □ HTTPS enforced                                              │
│  □ TLS 1.3 minimum                                            │
│  □ S3 bucket policies deny HTTP                              │
│                                                                 │
│  COMPLIANCE                                                     │
│  ──────────                                                     │
│  □ No PII in logs                                              │
│  □ Data retention policy defined                               │
│  □ User consent mechanism in place                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Risk Assessment

### 13.1 Identified Risks and Mitigations

```
┌─────────────────────────────────────────────────────────────────┐
│                    RISK ASSESSMENT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HIGH RISK                                                     │
│  ─────────                                                     │
│  • Bedrock API rate limits/quotas                            │
│    Mitigation: Implement caching, queue requests               │
│                                                                 │
│  • Transcription accuracy for regional accents                 │
│    Mitigation: Use custom vocabulary, allow text fallback      │
│                                                                 │
│  • PDF generation failures                                     │
│    Mitigation: Retry logic, fallback to data storage          │
│                                                                 │
│  MEDIUM RISK                                                   │
│  ───────────                                                   │
│  • JWT token security                                          │
│    Mitigation: Short expiration, secure secret storage        │
│                                                                 │
│  • Knowledge base query relevance                              │
│    Mitigation: Fine-tune chunking, test with real queries     │
│                                                                 │
│  • Audio playback on mobile devices                           │
│    Mitigation: Test on multiple devices, fallback to text     │
│                                                                 │
│  LOW RISK                                                      │
│  ─────────                                                     │
│  • DynamoDB throttling                                         │
│    Mitigation: Use provisioned capacity for prototype        │
│                                                                 │
│  • S3 upload failures                                          │
│    Mitigation: Retry with exponential backoff                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. Demo Scenarios

### 14.1 Scenario 1: Guest Query (No Auth)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEMO SCENARIO 1                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Goal: Show scheme information without login                   │
│                                                                 │
│  User: "PM-KISAN योजना के बारे में बताओ"                        │
│  System: [Transcribes to text]                                  │
│  System: [Queries Bedrock Knowledge Base]                      │
│  System: "PM-KISAN योजना के तहत..."                             │
│  System: [Speaks response via Polly]                          │
│                                                                 │
│  Constraints:                                                  │
│  • Max 5 queries for guests                                    │
│  • No form generation allowed                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.2 Scenario 2: Authenticated Form Fill

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEMO SCENARIO 2                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Goal: Complete KCC application                                │
│                                                                 │
│  Step 1: User clicks "Apply for KCC"                           │
│  System: "Please login to apply"                               │
│  Step 2: User enters phone + OTP (demo: 1234)                  │
│  System: Login successful                                      │
│  Step 3: User: "I want Kisan Credit Card"                      │
│  System: "Sure! Let's apply for KCC. What's your name?"        │
│  Step 4: User: "राम कुमार"                                      │
│  System: "Father's name?"                                      │
│  Step 5: User: "श्याम लाल"                                     │
│  ... (collects all fields)                                     │
│  Step 6: System: "Confirm: Name: राम कुमार, Land: 5 acres..." │
│  Step 7: User: "हाँ"                                            │
│  Step 8: System: [Generates PDF]                               │
│  System: "Your application is ready! Download from here..."   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 14.3 Scenario 3: Market Prices

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEMO SCENARIO 3                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Goal: Get current mandi prices                                │
│                                                                 │
│  User: "आज कपास के भाव क्या हैं?"                               │
│  System: [Queries mock price data]                              │
│  System: "आज कपास के भाव..."                                    │
│  System: "अमरावती मंडी में ₹6,200 प्रति क्विंटल"                │
│  System: "पिछले हफ्ते से ₹200 की बढ़ोतरी है"                    │
│                                                                 │
│  Note: Use mock data for prototype                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. Success Metrics

### 15.1 Technical Metrics

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUCCESS METRICS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PERFORMANCE                                                    │
│  ───────────                                                   │
│  • API response time: < 3s for simple queries                 │
│  • Transcription latency: < 2s                                │
│  • PDF generation: < 5s                                       │
│  • Uptime: > 99%                                               │
│                                                                 │
│  RELIABILITY                                                   │
│  ──────────                                                    │
│  • Error rate: < 1%                                            │
│  • Successful form completions: > 90%                         │
│  • Transcription success rate: > 85%                         │
│                                                                 │
│  SECURITY                                                      │
│  ─────────                                                      │
│  • Failed auth attempts blocked: 100%                        │
│  • PII in logs: 0 instances                                    │
│  • Rate limit violations handled: 100%                       │
│                                                                 │
│  USER EXPERIENCE                                                │
│  ─────────────                                                  │
│  • Guest → Auth conversion: Track                             │
│  • Average session duration: Track                            │
│  • Forms generated per user: Track                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Appendices

### 16.1 Environment Variables Reference

```bash
# AWS Configuration
AWS_REGION=ap-south-1
AWS_ACCOUNT_ID=123456789012

# DynamoDB
DYNAMODB_TABLE=GramSetu_Prototype

# S3
S3_BUCKET_PDFS=gramsetu-pdfs
S3_BUCKET_TEMPLATES=gramsetu-templates
S3_BUCKET_KB=gramsetu-knowledge-base

# Bedrock
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
BEDROCK_AGENT_ID=XXXXXXXXXX
KNOWLEDGE_BASE_ID=XXXXXXXXXX

# Security
JWT_SECRET_NAME=gramsetu/auth/jwt-secret
KMS_KEY_ID=alias/gramsetu-keys

# API Gateway
API_BASE_URL=https://api.gramsetu.demo.local/v1

# Feature Flags
ENABLE_MOCK_WEATHER=true
ENABLE_MOCK_PRICES=true
MAX_GUEST_QUERIES=5
```

### 16.2 File Structure

```
gramsetu-prototype/
├── backend/
│   ├── lambda/
│   │   ├── auth/
│   │   │   ├── app.py              # Lambda handler
│   │   │   ├── requirements.txt    # Dependencies
│   │   │   ├── auth_service.py     # Auth logic
│   │   │   ├── jwt_utils.py        # JWT handling
│   │   │   └── models.py           # Data models
│   │   ├── agent/
│   │   │   ├── app.py              # Lambda handler
│   │   │   ├── requirements.txt
│   │   │   ├── bedrock_client.py   # Bedrock calls
│   │   │   ├── transcribe_client.py
│   │   │   ├── polly_client.py
│   │   │   └── conversation_mgr.py
│   │   ├── pdf/
│   │   │   ├── app.py              # Lambda handler
│   │   │   ├── requirements.txt
│   │   │   ├── pdf_generator.py   # ReportLab logic
│   │   │   ├── validator.py        # Input validation
│   │   │   └── pii_handler.py      # Masking logic
│   │   └── tests/
│   │       ├── unit/
│   │       ├── integration/
│   │       └── security/
│   ├── infrastructure/
│   │   ├── terraform/              # or SAM template
│   │   └── scripts/
│   └── deploy/
│       └── (zipped Lambda packages)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── design.md
│   ├── requirements.md
│   ├── implementation_plan_prototype.md
│   └── api_documentation.md
├── .github/
│   └── workflows/
│       └── deploy.yml
└── README.md
```

### 16.3 Glossary

| Term | Definition |
|------|------------|
| **JWT** | JSON Web Token - secure URL-safe means of representing claims to be transferred between two parties |
| **KCC** | Kisan Credit Card - Government loan scheme for farmers |
| **PM-KISAN** | Pradhan Mantri Kisan Samman Nidhi - Farmer income support scheme |
| **Mandi** | Agricultural produce market |
| **RAG** | Retrieval-Augmented Generation - AI architecture combining LLM with knowledge base |
| **PII** | Personally Identifiable Information |
| **Aadhar** | Unique Identification Authority of India (UIDAI) - 12-digit unique ID |
| **TTL** | Time To Live - expiration timestamp for cached/temporary data |

---

## 17. Conclusion

This implementation plan provides a comprehensive roadmap for building the GramSetu prototype with a focus on backend-first development and tight security. The prototype will demonstrate the core voice-first AI agent capabilities while maintaining robust security practices appropriate for handling sensitive farmer data.

**Key Focus Areas:**
1. Secure authentication with simulated OTP
2. JWT-based session management
3. PII protection and masking
4. Rate limiting and input validation
5. Comprehensive logging and monitoring

The implementation follows an iterative approach, with clear milestones and testing strategies to ensure quality and security throughout the development process.

---

*Document Version: 1.0*  
*Last Updated: February 2026*  
*Authors: Hackathon Team*
