import asyncio
import json
import boto3
import pyaudio
import pygame
from amazon_transcribe.client import TranscribeStreamingClient
from amazon_transcribe.handlers import TranscriptResultStreamHandler
from amazon_transcribe.model import TranscriptEvent

# === AWS CONFIGURATION ===
REGION = "us-east-1" # Ensure Bedrock model is active in this region
bedrock_client = boto3.client('bedrock-runtime', region_name=REGION)
polly_client = boto3.client('polly', region_name=REGION)

# Global variables for the Async Transcribe Stream
final_transcript = ""
stop_recording = asyncio.Event()

# === STEP 1: Listen to Mic & Transcribe ===
class MyEventHandler(TranscriptResultStreamHandler):
    async def handle_transcript_event(self, transcript_event: TranscriptEvent):
        global final_transcript
        results = transcript_event.transcript.results
        for result in results:
            # When AWS determines the sentence is complete
            if not result.is_partial:
                for alt in result.alternatives:
                    final_transcript = alt.transcript
                    print(f"\n🗣️  You said: \"{final_transcript}\"")
                    stop_recording.set() # Signal to stop the microphone loop

async def listen_and_transcribe():
    global final_transcript
    final_transcript = ""
    stop_recording.clear()

    # Setup Microphone using PyAudio
    CHUNK = 1024
    RATE = 16000
    p = pyaudio.PyAudio()
    stream = p.open(format=pyaudio.paInt16, channels=1, rate=RATE, input=True, frames_per_buffer=CHUNK)

    print("\n🎙️  Listening... (Speak a sentence and pause)")

    # Setup AWS Transcribe Streaming
    client = TranscribeStreamingClient(region=REGION)
    transcribe_stream = await client.start_stream_transcription(
        language_code="en-US",
        media_sample_rate_hz=RATE,
        media_encoding="pcm"
    )

    # Async function to push mic data to AWS
    async def write_chunks():
        loop = asyncio.get_event_loop()
        while not stop_recording.is_set():
            # Run blocking mic read in an executor so it doesn't freeze the async loop
            data = await loop.run_in_executor(None, stream.read, CHUNK, False)
            await transcribe_stream.input_stream.send_audio_event(audio_chunk=data)
        await transcribe_stream.input_stream.end_stream()

    # Link the output stream to our custom handler
    handler = MyEventHandler(transcribe_stream.output_stream)
    
    # Run both the mic reader and the AWS listener concurrently
    await asyncio.gather(write_chunks(), handler.handle_events())
    
    # Cleanup Microphone
    stream.stop_stream()
    stream.close()
    p.terminate()

    return final_transcript

# === STEP 2: Send text to Amazon Bedrock (LLM) ===
def ask_bedrock(text):
    print("🤔 AI is thinking...")
    
    # Payload formatted for Meta Llama 2 (or Llama 3)
    payload = {
        "prompt": f"[INST] You are a helpful voice assistant. Keep your response conversational and strictly under 2 sentences. User says: {text}[/INST]",
        "max_gen_len": 200,
        "temperature": 0.5,
        "top_p": 0.9
    }
    
    response = bedrock_client.invoke_model(
        modelId="meta.llama3-70b-instruct-v1:0", # Update to llama3 if desired
        contentType="application/json",
        accept="application/json",
        body=json.dumps(payload)
    )
    
    response_body = json.loads(response['body'].read())
    answer = response_body['generation'].strip()
    print(f"\n🤖 AI answers: \"{answer}\"")
    return answer

# === STEP 3: Convert text to Speech and Play ===
def speak(text):
    print("🔊 Generating audio...")
    
    response = polly_client.synthesize_speech(
        Text=text,
        OutputFormat='mp3',
        VoiceId='Matthew', # Try 'Joanna' for a female voice
        Engine='neural'
    )
    
    if "AudioStream" in response:
        file_path = "response.mp3"
        # Save the audio stream to a file
        with open(file_path, "wb") as f:
            f.write(response["AudioStream"].read())
        
        # Play the audio file using pygame
        pygame.mixer.init()
        pygame.mixer.music.load(file_path)
        pygame.mixer.music.play()
        
        # Wait for the audio to finish playing
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
            
        pygame.mixer.quit()

# === MAIN EXECUTION FLOW ===
async def main():
    try:
        # 1. Listen
        user_text = await listen_and_transcribe()
        # user_text = "Hello, how are you?"
        if user_text:
            # 2. Reason
            ai_response = ask_bedrock(user_text)
            
            # 3. Answer
            speak(ai_response)
            print("\n✅ Cycle Complete. Run the script again to talk!")
            
    except Exception as e:
        print(f"Application Error: {e}")

if __name__ == "__main__":
    # Hide pygame welcome message
    import os
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
    
    # Run the Async App
    asyncio.run(main())