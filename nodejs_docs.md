


To build a complete "Voice-in, Voice-out" AI assistant in Node.js, we cannot use the standard Amazon Transcribe (which requires uploading a file to S3 and waiting). Instead, we must use **Amazon Transcribe Streaming**, which processes microphone audio in real-time. 

Here is the complete, single-file solution that records from your microphone, streams it to Transcribe, sends the text to Amazon Bedrock (using Llama 2), generates speech with Polly, and plays it back.

### 1. System Prerequisites
Because Node.js needs to interface with your physical microphone and speakers, you need to install lightweight audio software on your computer:
*   **Mac**: Built-in (no installation needed for playback). Install `sox` for the mic: `brew install sox`
*   **Windows**: Install [SoX](https://sourceforge.net/projects/sox/) and add it to your System PATH.
*   **Linux**: `sudo apt-get install sox libsox-fmt-all mpg123`

### 2. Project Setup
Initialize your project and install the required AWS and Audio packages:
```bash
npm init -y
npm install @aws-sdk/client-transcribe-streaming @aws-sdk/client-bedrock-runtime @aws-sdk/client-polly node-record-lpcm16 play-sound
```

Open your `package.json` and add `"type": "module"` so we can use modern `import` syntax:
```json
{
  "name": "voice-assistant",
  "type": "module",
  "dependencies": { ... }
}
```

### 3. The Code (`index.js`)

Save the following code in a file named `index.js`. 

*(Note: Ensure your AWS CLI is configured with `aws configure` and you have granted access to the **Meta Llama 2 70B** model in the Bedrock Console).*

```javascript
import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from "@aws-sdk/client-transcribe-streaming";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import record from "node-record-lpcm16";
import player from "play-sound";
import fs from "fs";
import { pipeline } from "stream/promises";

// === AWS CONFIGURATION ===
const REGION = "us-east-1"; // Ensure Bedrock model is active in this region
const transcribeClient = new TranscribeStreamingClient({ region: REGION });
const bedrockClient = new BedrockRuntimeClient({ region: REGION });
const pollyClient = new PollyClient({ region: REGION });

const audioPlayer = player({});

/**
 * STEP 1: Listen to the Microphone and Transcribe in Real-Time
 */
async function listenAndTranscribe() {
    console.log("\n🎙️  Listening... (Speak a sentence and pause)");

    // Start recording from the microphone (16kHz, 1 channel is required by Transcribe)
    const mic = record.record({ sampleRate: 16000, channels: 1 });
    const micStream = mic.stream();

    // Convert the Node.js mic stream into an Async Iterable for the AWS SDK
    const audioStream = async function* () {
        for await (const chunk of micStream) {
            yield { AudioEvent: { AudioChunk: chunk } };
        }
    }();

    const command = new StartStreamTranscriptionCommand({
        LanguageCode: "en-US",
        MediaSampleRateHertz: 16000,
        MediaEncoding: "pcm",
        AudioStream: audioStream,
    });

    try {
        const response = await transcribeClient.send(command);
        let finalTranscript = "";

        // Read the streaming response from AWS
        for await (const event of response.TranscriptResultStream) {
            if (event.TranscriptEvent) {
                const results = event.TranscriptEvent.Transcript.Results;
                
                // When AWS determines the sentence is complete (IsPartial === false)
                if (results.length > 0 && !results[0].IsPartial) {
                    finalTranscript = results[0].Alternatives[0].Transcript;
                    mic.stop(); // Stop the microphone
                    console.log(`\n🗣️  You said: "${finalTranscript}"`);
                    return finalTranscript;
                }
            }
        }
    } catch (err) {
        mic.stop();
        console.error("Transcription Error:", err);
    }
}

/**
 * STEP 2: Send the text to Amazon Bedrock (LLM)
 */
async function askBedrock(text) {
    console.log("🤔 AI is thinking...");

    // Format prompt specifically for Llama 2. Ask it to keep responses short.
    const payload = {
        prompt: `[INST] You are a helpful voice assistant. Keep your response conversational and strictly under 2 sentences. User says: ${text} [/INST]`,
        max_gen_len: 200,
        temperature: 0.5,
        top_p: 0.9
    };

    const command = new InvokeModelCommand({
        modelId: "meta.llama2-70b-chat-v1", // You can change to Claude/Titan if preferred
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
    });

    const response = await bedrockClient.send(command);
    const jsonResponse = JSON.parse(new TextDecoder().decode(response.body));
    const answer = jsonResponse.generation.trim();
    
    console.log(`\n🤖 AI answers: "${answer}"`);
    return answer;
}

/**
 * STEP 3: Convert text to Speech and Play it
 */
async function speak(text) {
    console.log("🔊 Generating audio...");

    const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: "Matthew", // Male voice. Try 'Joanna' for a female voice.
        Engine: "neural"    // Neural engine sounds much more lifelike
    });

    const response = await pollyClient.send(command);
    const filePath = "./response.mp3";
    
    // Save the audio stream to a file
    const fileStream = fs.createWriteStream(filePath);
    await pipeline(response.AudioStream, fileStream);

    // Play the audio file through the system speakers
    return new Promise((resolve, reject) => {
        audioPlayer.play(filePath, (err) => {
            if (err) {
                console.error("Error playing audio", err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * MAIN EXECUTION FLOW
 */
async function runVoiceAssistant() {
    try {
        // 1. Listen
        const userText = await listenAndTranscribe();
        
        if (userText) {
            // 2. Reason
            const aiResponse = await askBedrock(userText);
            
            // 3. Answer
            await speak(aiResponse);
            console.log("\n✅ Cycle Complete. Run the script again to talk!");
        }
    } catch (error) {
        console.error("Application Error:", error);
    }
}

// Start the app
runVoiceAssistant();
```

### How to Run:
1. Ensure your microphone is plugged in and accessible.
2. Run the script in your terminal:
   ```bash
   node index.js
   ```
3. When the console says **"🎙️ Listening..."**, speak a clear sentence into your microphone, then pause for a second. AWS will detect the silence, cut off the stream, fetch the LLM response, and play the audio answer back to you!