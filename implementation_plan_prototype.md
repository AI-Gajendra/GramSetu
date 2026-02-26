# 🏗️ Phase 1: Backend Architecture (AWS Serverless)

We will use a **Serverless Monolith** approach (fewer Lambdas, easier to manage state) for the prototype to save time.

### 1. Core Services Setup
*   **Brain:** Amazon Bedrock Agent (Claude 3.5 Sonnet).
*   **Memory:** Amazon DynamoDB (Single Table Design).
*   **Knowledge:** Bedrock Knowledge Base (S3 + OpenSearch Serverless).
*   **Ears & Mouth:** Amazon Transcribe & Polly.
*   **API:** Amazon API Gateway (REST).

### 2. Database Schema (DynamoDB)
Create one table: `GramSetu_Data` with Partition Key `PK` and Sort Key `SK`.

| Entity | PK | SK | Attributes |
| :--- | :--- | :--- | :--- |
| **User Profile** | `USER#<Phone>` | `PROFILE` | `language`, `name`, `location`, `created_at` |
| **Auth OTP** | `AUTH#<Phone>` | `OTP` | `code`, `ttl` (Time to live) |
| **Chat History** | `USER#<Phone>` | `MSG#<Timestamp>` | `role` (user/ai), `text`, `audio_url` |
| **Application** | `USER#<Phone>` | `APP#<FormID>` | `status`, `s3_pdf_url`, `form_data (JSON)` |

### 3. API Endpoints (API Gateway)
Keep it simple. 4 Routes only.

1.  `POST /auth/login` → Triggers OTP (Mock).
2.  `POST /auth/verify` → Returns Session Token (JWT).
3.  `POST /agent/query` → **The Heavy Lifter.** Accepts Audio Blob or Text. Returns Audio Blob + Text + UI Cards.
4.  `GET /forms/{id}` → Downloads the generated PDF.

---

# 💻 Phase 2: Backend Logic (The "Smart" Parts)

### Step 1: The Bedrock Agent (The Orchestrator)
Don't write complex if/else logic in Python. Let Bedrock do it.
*   **System Prompt:** "You are GramSetu. You speak Hindi and English. Your goal is to help farmers. If they want to apply for a loan, collect these 5 fields: Name, Aadhar, Land Size, Crop, Loan Amount."
*   **Action Group 1 (RAG):** Enabled Knowledge Base for "Scheme Queries".
*   **Action Group 2 (Tools):**
    *   `get_weather(location)`
    *   `get_mandi_prices(crop)`
    *   `generate_kcc_form(name, aadhar, ...)`

### Step 2: The Main Lambda (`gramsetu-backend`)
This function handles the `POST /agent/query` request.
*   **Input:** User Audio File (base64) + `user_id`.
*   **Logic Flow:**
    1.  **Transcribe:** Send Audio to Amazon Transcribe → Get Text.
    2.  **Agent Invoke:** Send Text to Bedrock Agent.
    3.  **Agent Logic:** Bedrock decides to use RAG, check Weather, or call `generate_kcc_form`.
    4.  **Response:** Bedrock returns text response.
    5.  **Polly:** Convert Text Response to Audio (Hindi/English voice).
    6.  **Save:** Store interaction in DynamoDB.
*   **Output:** JSON `{ "text": "...", "audio_base64": "...", "ui_card": "..." }`

### Step 3: PDF Generation Lambda (`gramsetu-pdf-gen`)
*   **Trigger:** Called by Bedrock Agent when all form slots are filled.
*   **Library:** `reportlab` (Python).
*   **Logic:** Takes JSON data, overlays it on a KCC Form Template, saves to S3, returns Signed URL.

---

# 📱 Phase 3: Frontend Plan (Mobile PWA)

**Tech Stack:** React (Vite) + Tailwind CSS + Axios.
**Design Style:** WhatsApp clone (Green theme, Chat bubbles).

### Component Structure
```text
src/
├── components/
│   ├── AudioRecorder.jsx  // The Big Mic Button
│   ├── ChatBubble.jsx     // Renders User (Right) vs AI (Left)
│   ├── LoginModal.jsx     // Phone Number Input
│   └── PDFCard.jsx        // "Download Form" UI
├── pages/
│   └── Home.jsx           // Main Logic
├── services/
│   └── api.js             // Axios calls to API Gateway
└── utils/
    └── audio.js           // Helpers to play base64 audio
```

### Critical Frontend Features
1.  **Mic Interaction:**
    *   User holds Mic button → Browser records `audio/webm`.
    *   On release → Convert to `Blob` → Send to API.
2.  **Audio Autoplay:**
    *   When API returns `audio_base64`, immediately decode and play using `Howler.js` or native `Audio` object.
3.  **Guest vs. Auth Mode:**
    *   If `localStorage` has no token, show "Login for Schemes" button when they try to apply.

---

# 🛡️ Security Implementation (Hackathon Level)

1.  **Auth (Mock but Secure):**
    *   Don't buy an SMS gateway.
    *   **Logic:** When user enters `9999999999`, Lambda generates OTP `1234`.
    *   *Log the OTP to CloudWatch* so you can see it and enter it during the demo.
2.  **Data Privacy:**
    *   **Masking:** In `gramsetu-pdf-gen`, logic: `aadhar_display = "XXXXXXXX" + aadhar[-4:]`.
    *   **HTTPS:** API Gateway provides this by default.
3.  **Rate Limiting:**
    *   Enable "Throttling" in API Gateway (e.g., 100 requests/sec) to prevent credit burn.