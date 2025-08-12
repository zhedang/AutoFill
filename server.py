import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import docx
import PyPDF2
import io
from openai import OpenAI
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('.env')

# Debug: Check if environment variable is loaded
api_key = os.getenv("DEEPSEEK_API_KEY")
print(f"API Key loaded: {'Yes' if api_key else 'No'}")
if api_key:
    print(f"API Key length: {len(api_key)}")
    print(f"API Key starts with: {api_key[:10]}...")

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173', 'http://127.0.0.1:5173', 'chrome-extension://*'])
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize OpenAI client for DeepSeek
client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def extract_text_from_pdf(file_stream):
    try:
        pdf_reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return str(e)

def extract_text_from_docx(file_stream):
    try:
        doc = docx.Document(file_stream)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        return str(e)

def extract_text_from_txt(file_stream):
    try:
        return file_stream.read().decode('utf-8')
    except Exception as e:
        return str(e)

def analyze_text_for_form_fields(text, form_fields):
    # Get count and build field list
    field_count = len(form_fields)
    fields_text = "\n".join([f"- {field}" for field in form_fields])
    
    prompt = f"""
    TASK: Extract information for {field_count} specific fields from the document.

    FIELDS TO EXTRACT:
    {fields_text}

    CRITICAL INSTRUCTIONS:
    - You MUST return a JSON object with EXACTLY {field_count} fields
    - Each field above must appear in your JSON response
    - If you find information for a field, extract it
    - If you cannot find information for a field, set it to null
    - Example format: {{"field1": "value1", "field2": null, "field3": "value3"}}
    - Do NOT skip any fields - all {field_count} fields must be present
    
    SPECIAL FORMATTING RULES:
    - For money/amount fields (like estimatedLoss, coverageAmount): return ONLY the numeric value, NO currency symbols ($, ¥, RMB, etc.)
    - For example: if document says "$89723" or "89723 RMB", return "89723"
    - For phone numbers: return only digits, no spaces or special characters
    - For dates: use YYYY-MM-DD format

    Document text:
    {text}
    """
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are an expert data extraction assistant. You MUST return a JSON object with ALL requested fields. Never skip fields - if information is not found, set the field to null."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content
        
        # Debug: Print what AI actually returned
        print(f"AI Response: {content}")
        
        # Clean the response to ensure it's valid JSON
        # The model might still add markdown ```json ... ``` despite instructions
        if content.startswith("```json"):
            content = content[7:-4].strip() # Remove markdown
        
        form_data = json.loads(content)
        print(f"Parsed JSON: {form_data}")
        return form_data
        
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"LLM response that failed parsing: {content}")
        return {"error": "Failed to parse LLM response as JSON."}
    except Exception as e:
        print(f"An error occurred with Ollama: {e}")
        return {"error": str(e)}

@app.route('/process', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_stream = io.BytesIO(file.read())
    
    extracted_text = ""
    if filename.endswith('.pdf'):
        extracted_text = extract_text_from_pdf(file_stream)
    elif filename.endswith('.docx'):
        extracted_text = extract_text_from_docx(file_stream)
    elif filename.endswith('.txt') or filename.endswith('.md'):
        extracted_text = extract_text_from_txt(file_stream)
    else:
        return jsonify({"error": "Unsupported file type"}), 400
        
    # TODO: Get form fields from the request (temporarily using hardcoded fields for testing)
    form_fields = ["policyNumber", "claimantName", "dateOfIncident", "estimatedLoss", "contactPhone", "contactEmail", "incidentDescription"]
    print(f"Using hardcoded form fields for testing: {form_fields}")
    print(f"Number of fields: {len(form_fields)}")
    
    form_data = analyze_text_for_form_fields(extracted_text, form_fields)
    
    # Debug: Print what we're sending back to the extension
    print(f"Sending to extension: {form_data}")
    print(f"Number of fields sent: {len(form_data)}")
    
    return jsonify({"success": True, "formData": form_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
