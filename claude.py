import boto3
import json
import os

# The SDK automatically detects the BEDROCK_API_KEY environment variable
# Make sure to set your region correctly
client = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1" 
)

model_id = "anthropic.claude-3-5-haiku-20241022-v1:0" # Example model ID
body = json.dumps({
    "messages": [{"role": "user", "content": [{"text": "Hello, how are you today?"}]}],
    "max_tokens": 100,
    "temperature": 0.8,
})

response = client.invoke_model(
    modelId=model_id,
    contentType="application/json",
    accept="application/json",
    body=body
)

response_body = json.loads(response.get('body').read())
print(response_body['output']['message']['content'][0]['text'])
