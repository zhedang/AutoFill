// Content Script for AutoFill Extension
// This script runs on every webpage and provides the drag-and-drop functionality

console.log('AutoFill Extension Content Script Loaded');

class AutoFillExtension {
  constructor() {
    this.isEnabled = false;
    this.dropZone = null;
    this.formFields = [];
    this.init();
  }

  init() {
    // Check if extension is enabled
    this.checkExtensionStatus();
    
    // Initialize form detection
    this.detectFormFields();
    
    // Create drop zone
    this.createDropZone();
    
    // Listen for DOM changes to detect dynamic forms
    this.observeDOMChanges();
    
    // Listen for messages from background script
    this.setupMessageListener();
  }

  async checkExtensionStatus() {
    try {
      const response = await this.sendMessage({ type: 'GET_SETTINGS' });
      if (response.success) {
        this.isEnabled = response.settings.enabled;
        if (this.isEnabled) {
          this.activate();
        } else {
          // Even if disabled, show in demo mode
          console.log('Extension disabled, running in demo mode');
          this.isEnabled = false;
          this.activate(); // Still activate for demo
        }
      }
    } catch (error) {
      console.log('Extension not available, running in demo mode');
      this.isEnabled = false;
      this.activate(); // Activate for demo mode
    }
  }

  activate() {
    console.log('AutoFill Extension Activated');
    this.showDropZone();
    this.attachEventListeners();
  }

  detectFormFields() {
    // Find all form input fields
    const selectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="tel"]',
      'input[type="date"]',
      'input[type="number"]',
      'textarea',
      'select'
    ];
    
    this.formFields = Array.from(document.querySelectorAll(selectors.join(',')));
    console.log(`Found ${this.formFields.length} form fields`);
    
    // Analyze field types and labels
    this.analyzeFormFields();
  }

  analyzeFormFields() {
    this.formFields.forEach(field => {
      const fieldInfo = this.analyzeField(field);
      field.dataset.autofillType = fieldInfo.type;
      field.dataset.autofillLabel = fieldInfo.label;
    });
  }

  analyzeField(field) {
    let type = 'unknown';
    let label = '';
    
    // Try to find associated label
    if (field.id) {
      const labelElement = document.querySelector(`label[for="${field.id}"]`);
      if (labelElement) {
        label = labelElement.textContent.trim();
      }
    }
    
    // If no label found, look for nearby text
    if (!label) {
      const parent = field.parentElement;
      const textNodes = Array.from(parent.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .filter(text => text.length > 0);
      
      if (textNodes.length > 0) {
        label = textNodes[0];
      }
    }
    
    // Determine field type based on input type and label
    if (field.type === 'email' || label.toLowerCase().includes('email')) {
      type = 'email';
    } else if (field.type === 'tel' || label.toLowerCase().includes('phone')) {
      type = 'phone';
    } else if (field.type === 'date' || label.toLowerCase().includes('date')) {
      type = 'date';
    } else if (field.type === 'number' || label.toLowerCase().includes('amount') || label.toLowerCase().includes('price')) {
      type = 'number';
    } else if (label.toLowerCase().includes('name')) {
      type = 'name';
    } else if (label.toLowerCase().includes('address')) {
      type = 'address';
    }
    
    return { type, label };
  }

  createDropZone() {
    // Create floating drop zone
    this.dropZone = document.createElement('div');
    this.dropZone.id = 'autofill-dropzone';
    this.dropZone.innerHTML = `
      <div class="autofill-dropzone-content">
        <div class="autofill-icon">📄</div>
        <div class="autofill-text">Drop files here to auto-fill</div>
      </div>
    `;
    
    // Add styles
    this.dropZone.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 200px;
      height: 120px;
      background: rgba(59, 130, 246, 0.9);
      border: 2px dashed white;
      border-radius: 12px;
      display: none;
      z-index: 10000;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    `;
    
    // Add hover effects
    this.dropZone.addEventListener('mouseenter', () => {
      this.dropZone.style.transform = 'scale(1.05)';
      this.dropZone.style.background = 'rgba(59, 130, 246, 1)';
    });
    
    this.dropZone.addEventListener('mouseleave', () => {
      this.dropZone.style.transform = 'scale(1)';
      this.dropZone.style.background = 'rgba(59, 130, 246, 0.9)';
    });
    
    // Add to page
    document.body.appendChild(this.dropZone);
  }

  showDropZone() {
    if (this.dropZone) {
      this.dropZone.style.display = 'block';
    }
  }

  hideDropZone() {
    if (this.dropZone) {
      this.dropZone.style.display = 'none';
    }
  }

  attachEventListeners() {
    // Add drag and drop events to the drop zone
    this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
    this.dropZone.addEventListener('drop', this.handleDrop.bind(this));
    this.dropZone.addEventListener('click', this.handleClick.bind(this));
    
    // Add drag and drop events to the entire page
    document.addEventListener('dragover', this.handlePageDragOver.bind(this));
    document.addEventListener('drop', this.handlePageDrop.bind(this));
  }

  handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dropZone.style.borderColor = '#10b981';
    this.dropZone.style.background = 'rgba(16, 185, 129, 0.9)';
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    this.dropZone.style.borderColor = 'white';
    this.dropZone.style.background = 'rgba(59, 130, 246, 0.9)';
    
    const files = Array.from(e.dataTransfer.files);
    this.processFiles(files);
  }

  handleClick() {
    // Create file input and trigger click
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.md';
    
    input.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      this.processFiles(files);
    });
    
    input.click();
  }

  handlePageDragOver(e) {
    // Show drop zone when dragging over the page
    if (this.isEnabled && !this.dropZone.contains(e.target)) {
      this.showDropZone();
    }
  }

  handlePageDrop(e) {
    // Hide drop zone after drop
    this.hideDropZone();
  }

  async processFiles(files) {
    console.log('Processing files with Python server:', files);

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://127.0.0.1:5000/process', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          this.fillFormFields(result.formData);
        } else {
          console.error('File processing failed:', result.error);
          alert(`File processing failed: ${result.error}`);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing file: ${error.message}. Make sure the Python server is running.`);
      }
    }
  }

  fillFormFields(formData) {
    console.log('=== DEBUG: fillFormFields called ===');
    console.log('Form data received:', formData);
    console.log('Available form fields:', this.formFields);
    
    if (!formData || Object.keys(formData).length === 0) {
      console.log('No form data to fill!');
      return;
    }
    
    // Match extracted data to form fields
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`Looking for field matching key: "${key}" with value: "${value}"`);
      
      const matchingFields = this.formFields.filter(field => {
        const fieldType = field.dataset.autofillType;
        const fieldLabel = field.dataset.autofillLabel;
        const placeholder = field.placeholder || '';
        const name = field.name || '';
        const id = field.id || '';
        
        console.log(`Field:`, {
          type: fieldType,
          label: fieldLabel,
          placeholder: placeholder,
          name: name,
          id: id
        });
        
        // More flexible matching
        const matches = (
          fieldType === key ||
          (fieldLabel && fieldLabel.toLowerCase().includes(key.toLowerCase())) ||
          (placeholder && placeholder.toLowerCase().includes(key.toLowerCase())) ||
          (name && name.toLowerCase().includes(key.toLowerCase())) ||
          (id && id.toLowerCase().includes(key.toLowerCase()))
        );
        
        console.log(`Field matches "${key}":`, matches);
        return matches;
      });
      
      console.log(`Found ${matchingFields.length} matching fields for "${key}"`);
      
      // Fill matching fields
      matchingFields.forEach(field => {
        console.log(`Filling field:`, field);
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Visual feedback
        field.style.backgroundColor = '#d1fae5';
        setTimeout(() => {
          field.style.backgroundColor = '';
        }, 2000);
      });
    });
    
    // Show success message
    this.showSuccessMessage();
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.innerHTML = '✅ Form fields auto-filled successfully!';
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 10001;
      font-weight: 500;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  }

  async sendMessage(message) {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, resolve);
      });
    } else {
      throw new Error('Chrome extension API not available');
    }
  }

  setupMessageListener() {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log('Content script received message:', request);
        sendResponse({ success: true });
      });
    }
  }

  observeDOMChanges() {
    // Watch for new form fields being added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const newFields = node.querySelectorAll('input, textarea, select');
              if (newFields.length > 0) {
                this.detectFormFields();
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Helper method to read file as text
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Simple text analysis for demo mode
  analyzeTextDemo(text) {
    console.log('=== DEMO: Analyzing text ===');
    console.log('Text content:', text);
    
    const formData = {};
    
    // Simple patterns for demo
    const patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(\+\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}/g,
      date: /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/g,
      name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g
    };
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const matches = text.match(pattern);
      console.log(`Demo pattern "${key}":`, matches);
      if (matches) {
        formData[key] = matches[0];
      }
    });
    
    console.log('Demo form data:', formData);
    return formData;
  }
}

// Initialize the extension when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AutoFillExtension();
  });
} else {
  new AutoFillExtension();
}
