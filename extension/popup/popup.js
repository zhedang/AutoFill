// Popup JavaScript for AutoFill Extension

class PopupManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // Enable/disable toggle
    document.getElementById('enableToggle').addEventListener('change', (e) => {
      this.toggleExtension(e.target.checked);
    });

    // Quick action buttons
    document.getElementById('detectForms').addEventListener('click', () => {
      this.detectForms();
    });

    document.getElementById('clearFields').addEventListener('click', () => {
      this.clearFields();
    });

    // Settings checkboxes
    document.getElementById('autoDetect').addEventListener('change', (e) => {
      this.updateSetting('autoDetect', e.target.checked);
    });

    document.getElementById('showDropZone').addEventListener('change', (e) => {
      this.updateSetting('showDropZone', e.target.checked);
    });

    // Footer buttons
    document.getElementById('openSettings').addEventListener('click', () => {
      this.openSettings();
    });

    document.getElementById('help').addEventListener('click', () => {
      this.showHelp();
    });
  }

  async loadSettings() {
    try {
      const response = await this.sendMessage({ type: 'GET_SETTINGS' });
      if (response.success) {
        this.settings = response.settings;
      } else {
        // Default settings if extension not available
        this.settings = {
          enabled: false,
          autoDetect: true,
          showDropZone: false
        };
      }
    } catch (error) {
      console.log('Extension not available, using default settings');
      this.settings = {
        enabled: false,
        autoDetect: true,
        showDropZone: false
      };
    }
  }

  updateUI() {
    // Update toggle switch
    const enableToggle = document.getElementById('enableToggle');
    enableToggle.checked = this.settings.enabled;
    
    // Update status text
    const statusText = document.querySelector('.status-text');
    statusText.textContent = this.settings.enabled ? 'Enabled' : 'Disabled';
    
    // Update settings checkboxes
    document.getElementById('autoDetect').checked = this.settings.autoDetect;
    document.getElementById('showDropZone').checked = this.settings.showDropZone;
    
    // Update statistics (placeholder values for now)
    this.updateStatistics();
  }

  async toggleExtension(enabled) {
    try {
      this.settings.enabled = enabled;
      
      if (enabled) {
        // Activate extension on current tab
        await this.activateOnCurrentTab();
      } else {
        // Deactivate extension on current tab
        await this.deactivateOnCurrentTab();
      }
      
      // Save setting
      await this.updateSetting('enabled', enabled);
      
      // Update UI
      this.updateUI();
      
      // Show feedback
      this.showNotification(
        enabled ? 'Extension activated!' : 'Extension deactivated!',
        enabled ? 'success' : 'info'
      );
      
    } catch (error) {
      console.error('Error toggling extension:', error);
      this.showNotification('Error toggling extension', 'error');
      
      // Revert toggle
      document.getElementById('enableToggle').checked = !enabled;
    }
  }

  async activateOnCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            // This will be executed in the content script context
            if (window.autoFillExtension) {
              window.autoFillExtension.activate();
            }
          }
        });
      }
    } catch (error) {
      console.error('Error activating on current tab:', error);
    }
  }

  async deactivateOnCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            if (window.autoFillExtension) {
              window.autoFillExtension.deactivate();
            }
          }
        });
      }
    } catch (error) {
      console.error('Error deactivating on current tab:', error);
    }
  }

  async detectForms() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            if (window.autoFillExtension) {
              return window.autoFillExtension.detectFormFields();
            }
            return { count: 0 };
          }
        });
        
        if (result && result[0]) {
          const count = result[0].result.count || 0;
          this.updateStatistics({ formsCount: count });
          this.showNotification(`Found ${count} form fields!`, 'success');
        }
      }
    } catch (error) {
      console.error('Error detecting forms:', error);
      this.showNotification('Error detecting forms', 'error');
    }
  }

  async clearFields() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            if (window.autoFillExtension) {
              window.autoFillExtension.clearFormFields();
            }
          }
        });
        
        this.showNotification('Form fields cleared!', 'success');
      }
    } catch (error) {
      console.error('Error clearing fields:', error);
      this.showNotification('Error clearing fields', 'error');
    }
  }

  async updateSetting(key, value) {
    try {
      this.settings[key] = value;
      
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        await this.sendMessage({
          type: 'UPDATE_SETTINGS',
          settings: this.settings
        });
      }
      
      console.log(`Setting updated: ${key} = ${value}`);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  }

  updateStatistics(stats = {}) {
    // Update forms count
    if (stats.formsCount !== undefined) {
      document.getElementById('formsCount').textContent = stats.formsCount;
    }
    
    // Update fields filled count
    if (stats.fieldsFilled !== undefined) {
      document.getElementById('fieldsFilled').textContent = stats.fieldsFilled;
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    
    // Add to popup
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  openSettings() {
    // Open extension options page
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for older Chrome versions
      window.open(chrome.runtime.getURL('options.html'));
    }
  }

  showHelp() {
    // Show help information
    const helpText = `
AutoFill Extension Help:

1. Enable the extension using the toggle switch
2. Navigate to any webpage with forms
3. Drag and drop files (PDF, images, documents) onto the page
4. The extension will automatically detect and fill form fields

Supported file types:
- PDF documents
- Images (JPG, PNG)
- Word documents (DOC, DOCX)
- Text files (TXT)

For more help, visit our documentation.
    `;
    
    alert(helpText);
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
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
