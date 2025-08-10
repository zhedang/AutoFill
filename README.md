# AutoFill Extension with Local LLM Backend

This project uses a browser extension to intelligently auto-fill web forms by extracting information from user-provided files. The core intelligence is powered by a local Python backend that leverages a local Large Language Model (LLM) via Ollama for accurate, context-aware data extraction.

## Architecture

The system is composed of two main parts:

1.  **Frontend**: A Chrome browser extension written in JavaScript. It is responsible for detecting forms on a webpage, creating a user interface (a file drop zone), and communicating with the backend.

2.  **Backend**: A local Python server using Flask. It receives files from the browser extension, extracts their text content, and uses a local LLM via Ollama to intelligently parse the text and extract relevant data. This approach ensures both high accuracy and user privacy, as no data ever leaves the user's machine.

## Features

- **Intelligent Extraction**: Uses a local LLM to understand the context of documents, leading to highly accurate form filling.
- **Privacy-First**: All file processing and data extraction happens 100% locally. No data is sent to external cloud services.
- **Broad File Support**: Supports `.pdf`, `.docx`, `.txt`, and `.md` files out of the box.
- **Simple Interface**: Easy-to-use drag-and-drop functionality on any web page with a form.

---

## Setup and Installation

To get the project running, you need to set up three components: the Ollama LLM, the Python backend, and the Chrome Extension.

### 1. Ollama LLM Setup

- You must have [Ollama](https://ollama.com/) installed and running on your machine.
- Ensure you have a model available. This project is configured to use `gemma`, but you can change the model name in `server.py`.

  ```bash
  # Pull the gemma model if you haven't already
  ollama pull gemma
  ```

### 2. Python Backend Setup

- In your terminal, navigate to the project's root directory (`/Users/zhedang/Desktop/Projects/AutoFill`).
- Install the required Python libraries:

  ```bash
  pip install Flask flask-cors python-docx PyPDF2 ollama
  ```

- Run the Flask server:

  ```bash
  python server.py
  ```

- The server will start on `http://127.0.0.1:5000`. Keep this terminal window open while using the extension.

### 3. Chrome Extension Setup

- Open Google Chrome and navigate to `chrome://extensions`.
- Enable **Developer mode** using the toggle in the top-right corner.
- Click the **Load unpacked** button.
- Select the `extension` folder from this project directory (`/Users/zhedang/Desktop/Projects/AutoFill/extension`).
- The "AutoFill Extension" should now appear in your list of extensions.

---

## How to Use

1.  Ensure your Python server is running.
2.  Navigate to any webpage that contains a form you want to fill.
3.  The AutoFill drop zone should appear on the page.
4.  Drag and drop a supported file (`.pdf`, `.docx`, `.txt`) onto the drop zone.
5.  The extension will send the file to the local server, which will use the LLM to extract the data and send it back.
6.  The form fields will be filled automatically with the extracted information.

## Current Status

This project is currently in the development and debugging phase. The end-to-end architecture is functional, but the accuracy of the data extraction is highly dependent on the capability of the local LLM being used.

---

## Development Log

**August 9, 2025**

- **Activity**: Successfully re-architected the project from a pure JavaScript extension to a hybrid model with a Python/Flask backend. Integrated a local LLM (`gemma`) via Ollama to handle the core data extraction logic, replacing the previous regex-based approach.
- **Findings**: The new architecture works end-to-end. The local `gemma` model can successfully process simple, clean documents and return structured data. However, its performance is limited on more complex documents, sometimes failing to find information and returning `null` values.
- **Next Steps**: The immediate next step is to experiment with more powerful, cloud-based LLMs (such as the GPT series, Claude, or Google's Gemini models) to drastically improve the accuracy and robustness of the information extraction.
