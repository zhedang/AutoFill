// Background Service Worker for AutoFill Extension
// This script runs in the background and manages the extension's core functionality

console.log('AutoFill Extension Background Script Loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    autoDetect: true,
    supportedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt', 'md']
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.type) {
    case 'PROCESS_FILE':
      handleFileProcessing(request.data, sendResponse);
      return true; // Keep message channel open for async response
      
    case 'GET_SETTINGS':
      chrome.storage.sync.get(null, (settings) => {
        sendResponse({ success: true, settings });
      });
      return true;
      
    case 'UPDATE_SETTINGS':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Handle file processing
async function handleFileProcessing(fileData, sendResponse) {
  try {
    console.log('Processing file:', fileData);
    
    // Extract text from different file types
    let extractedText = '';
    
    if (fileData.type.startsWith('image/')) {
      // Handle image files with OCR
      extractedText = await processImageFile(fileData);
    } else if (fileData.type === 'application/pdf') {
      // Handle PDF files
      extractedText = await processPDFFile(fileData);
    } else if (fileData.type.includes('document') || fileData.type.includes('word')) {
      // Handle Word documents
      extractedText = await processWordFile(fileData);
    } else if (fileData.type === 'text/plain' || fileData.name.endsWith('.md') || fileData.type === 'text/markdown') {
      // Handle text files
      const response = await fetch(fileData.content);
      extractedText = await response.text();
    } else {
      // Default to text for unknown types
      try {
        const response = await fetch(fileData.content);
        extractedText = await response.text();
      } catch (e) {
        console.warn(`Could not process file ${fileData.name} as text.`);
      }
    }
    
    // Analyze extracted text to find form-relevant information
    console.log('=== DEBUG: About to analyze text ===');
    console.log('Extracted text length:', extractedText.length);
    console.log('Extracted text preview:', extractedText.substring(0, 200));
    
    const formData = analyzeTextForFormFields(extractedText);
    
    console.log('=== DEBUG: Sending response ===');
    console.log('Final form data:', formData);
    
    sendResponse({
      success: true,
      extractedText,
      formData
    });
    
  } catch (error) {
    console.error('File processing error:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}

// Process image files (OCR)
async function processImageFile(fileData) {
  // This would use Tesseract.js or similar OCR library
  // For now, return placeholder
  return `Image file: ${fileData.name} - OCR processing would extract text here`;
}

// Process PDF files
async function processPDFFile(fileData) {
  // This would use PDF.js to extract text
  // For now, return placeholder
  return `PDF file: ${fileData.name} - PDF text extraction would happen here`;
}

// Process Word documents
async function processWordFile(fileData) {
  // This would use mammoth.js or similar library
  // For now, return placeholder
  return `Word document: ${fileData.name} - Document parsing would happen here`;
}

// Analyze extracted text to find form-relevant information
function analyzeTextForFormFields(text) {
  console.log('=== DEBUG: analyzeTextForFormFields ===');
  console.log('Input text:', text);
  
  // This is a simplified analysis - in production, you'd use more sophisticated NLP
  const formData = {};
  
  // Extract common patterns
  const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g,
    date: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,
    name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
    address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi
  };
  
  Object.entries(patterns).forEach(([key, pattern]) => {
    const matches = text.match(pattern);
    console.log(`Pattern "${key}":`, matches);
    if (matches) {
      formData[key] = matches[0];
    }
  });
  
  console.log('Extracted form data:', formData);
  return formData;
}
