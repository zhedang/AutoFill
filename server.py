import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import docx
import PyPDF2
import io
import ollama
import json

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

def analyze_text_for_form_fields(text):
    prompt = f"""
    You are an expert data extraction assistant. Your task is to extract specific fields from the provided text and return them in a clean JSON format.
    Do not include any explanations, introductory text, or markdown formatting like ```json. Only return the raw JSON object.

    The fields to extract are: name, email, phone, address, date.

    If a field is not found in the text, its value should be null.

    Here is the text:
    ---
    {text}
    ---
    """
    try:
        response = ollama.chat(
            model='gemma3n', # Note: User mentioned gemma3n, but 'gemma' is a common model family. User might need to adjust this.
            messages=[{'role': 'user', 'content': prompt}],
            options={'temperature': 0.0}
        )
        
        content = response['message']['content']
        
        # Clean the response to ensure it's valid JSON
        # The model might still add markdown ```json ... ``` despite instructions
        if content.startswith("```json"):
            content = content[7:-4].strip() # Remove markdown
        
        form_data = json.loads(content)
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
        
    form_data = analyze_text_for_form_fields(extracted_text)
    
    return jsonify({"success": True, "formData": form_data})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
