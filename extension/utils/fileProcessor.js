// File Processing Utilities for AutoFill Extension

export class FileProcessor {
  constructor() {
    this.supportedTypes = {
      'application/pdf': this.processPDF,
      'image/jpeg': this.processImage,
      'image/jpg': this.processImage,
      'image/png': this.processImage,
      'application/msword': this.processWord,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': this.processWord,
      'text/plain': this.processText
    };
  }

  async processFile(file) {
    const processor = this.supportedTypes[file.type];
    
    if (!processor) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    
    try {
      const result = await processor.call(this, file);
      return {
        success: true,
        data: result,
        fileType: file.type,
        fileName: file.name
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        fileType: file.type,
        fileName: file.name
      };
    }
  }

  async processPDF(file) {
    // This would use PDF.js in a real implementation
    // For now, return placeholder
    return {
      type: 'pdf',
      text: `PDF content from ${file.name}`,
      pages: 1,
      extractedData: {
        text: `Sample text extracted from ${file.name}`,
        metadata: {
          title: file.name,
          author: 'Unknown',
          pages: 1
        }
      }
    };
  }

  async processImage(file) {
    // This would use Tesseract.js for OCR in a real implementation
    // For now, return placeholder
    return {
      type: 'image',
      text: `Image content from ${file.name}`,
      dimensions: { width: 800, height: 600 },
      extractedData: {
        text: `Sample text extracted from image ${file.name}`,
        confidence: 0.85
      }
    };
  }

  async processWord(file) {
    // This would use mammoth.js in a real implementation
    // For now, return placeholder
    return {
      type: 'word',
      text: `Word document content from ${file.name}`,
      extractedData: {
        text: `Sample text extracted from Word document ${file.name}`,
        paragraphs: 5,
        tables: 1
      }
    };
  }

  async processText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve({
          type: 'text',
          text: e.target.result,
          extractedData: {
            text: e.target.result,
            lines: e.target.result.split('\n').length,
            words: e.target.result.split(/\s+/).length
          }
        });
      };
      
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  extractFormData(processedData) {
    const formData = {};
    
    if (!processedData || !processedData.extractedData) {
      return formData;
    }
    
    const text = processedData.extractedData.text || '';
    
    // Extract common patterns
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g,
      date: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,
      name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
      address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
      zipCode: /\b\d{5}(?:-\d{4})?\b/g,
      ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
      creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g
    };
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        formData[key] = matches[0];
      }
    });
    
    return formData;
  }

  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit'
      };
    }
    
    if (!this.supportedTypes[file.type]) {
      return {
        valid: false,
        error: `Unsupported file type: ${file.type}`
      };
    }
    
    return { valid: true };
  }
}

export default FileProcessor;
