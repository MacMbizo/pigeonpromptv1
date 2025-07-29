// Popup functionality for AI Prompt Engineering Platform Chrome Extension

class PopupManager {
  constructor() {
    this.platformUrl = 'http://localhost:5175';
    this.init();
  }

  async init() {
    await this.loadPageInfo();
    this.setupEventListeners();
    await this.loadRecentPrompts();
    this.loadSettings();
  }

  async loadPageInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        document.getElementById('current-url').textContent = this.truncateText(tab.url, 30);
        document.getElementById('page-title').textContent = this.truncateText(tab.title, 25);
        
        // Get selection info
        const selection = await this.getPageSelection(tab.id);
        const selectionInfo = selection ? 
          `${selection.length} chars selected` : 'None';
        document.getElementById('selection-info').textContent = selectionInfo;
      }
    } catch (error) {
      console.error('Error loading page info:', error);
    }
  }

  async getPageSelection(tabId) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        function: () => window.getSelection().toString()
      });
      return results[0]?.result || '';
    } catch (error) {
      console.error('Error getting selection:', error);
      return '';
    }
  }

  setupEventListeners() {
    // Quick Actions
    document.getElementById('extract-content').addEventListener('click', () => {
      this.extractPageContent();
    });

    document.getElementById('analyze-selection').addEventListener('click', () => {
      this.analyzeSelection();
    });

    document.getElementById('open-platform').addEventListener('click', () => {
      this.openPlatform();
    });

    // Settings
    document.getElementById('auto-extract').addEventListener('change', (e) => {
      this.saveSetting('autoExtract', e.target.checked);
    });

    document.getElementById('context-suggestions').addEventListener('change', (e) => {
      this.saveSetting('contextSuggestions', e.target.checked);
    });

    // Footer buttons
    document.getElementById('settings-btn').addEventListener('click', () => {
      this.openSettings();
    });

    document.getElementById('help-btn').addEventListener('click', () => {
      this.openHelp();
    });

    // Use prompt buttons
    document.querySelectorAll('.use-prompt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const promptTitle = e.target.parentElement.querySelector('.prompt-title').textContent;
        this.usePrompt(promptTitle);
      });
    });
  }

  async extractPageContent() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: this.extractContentScript
        });
        
        const content = results[0]?.result;
        if (content) {
          await this.sendToPlat form({
            action: 'extract-content',
            data: {
              url: tab.url,
              title: tab.title,
              content: content,
              timestamp: new Date().toISOString()
            }
          });
          
          this.showNotification('Content extracted successfully!');
        }
      }
    } catch (error) {
      console.error('Error extracting content:', error);
      this.showNotification('Error extracting content', 'error');
    }
  }

  extractContentScript() {
    // Extract meaningful content from the page
    const content = {
      text: document.body.innerText.slice(0, 5000), // Limit to 5000 chars
      headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()),
      links: Array.from(document.querySelectorAll('a[href]')).slice(0, 10).map(a => ({
        text: a.textContent.trim(),
        href: a.href
      })),
      images: Array.from(document.querySelectorAll('img[src]')).slice(0, 5).map(img => ({
        alt: img.alt,
        src: img.src
      })),
      codeBlocks: Array.from(document.querySelectorAll('pre, code')).map(code => 
        code.textContent.trim()
      ).filter(code => code.length > 10).slice(0, 5)
    };
    
    return content;
  }

  async analyzeSelection() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        const selection = await this.getPageSelection(tab.id);
        
        if (selection && selection.trim()) {
          await this.sendToPlatform({
            action: 'analyze-selection',
            data: {
              url: tab.url,
              title: tab.title,
              selection: selection,
              timestamp: new Date().toISOString()
            }
          });
          
          this.showNotification('Selection sent for analysis!');
        } else {
          this.showNotification('No text selected', 'warning');
        }
      }
    } catch (error) {
      console.error('Error analyzing selection:', error);
      this.showNotification('Error analyzing selection', 'error');
    }
  }

  async openPlatform() {
    try {
      await chrome.tabs.create({ url: this.platformUrl });
      window.close();
    } catch (error) {
      console.error('Error opening platform:', error);
    }
  }

  async sendToPlatform(message) {
    // Store the message for the platform to pick up
    await chrome.storage.local.set({
      [`message_${Date.now()}`]: message
    });
    
    // Open platform if not already open
    const tabs = await chrome.tabs.query({ url: `${this.platformUrl}/*` });
    if (tabs.length === 0) {
      await chrome.tabs.create({ url: this.platformUrl });
    } else {
      await chrome.tabs.update(tabs[0].id, { active: true });
    }
  }

  async loadRecentPrompts() {
    try {
      const result = await chrome.storage.local.get(['recentPrompts']);
      const prompts = result.recentPrompts || [
        { title: 'Code Review Assistant', id: 'code-review' },
        { title: 'Content Summarizer', id: 'summarizer' },
        { title: 'Bug Analyzer', id: 'bug-analyzer' }
      ];
      
      // Update the prompts list (already rendered in HTML for demo)
      // In a real implementation, you'd dynamically generate this
    } catch (error) {
      console.error('Error loading recent prompts:', error);
    }
  }

  async usePrompt(promptTitle) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await this.sendToPlatform({
        action: 'use-prompt',
        data: {
          promptTitle,
          context: {
            url: tab.url,
            title: tab.title,
            timestamp: new Date().toISOString()
          }
        }
      });
      
      this.showNotification(`Using prompt: ${promptTitle}`);
    } catch (error) {
      console.error('Error using prompt:', error);
      this.showNotification('Error using prompt', 'error');
    }
  }

  loadSettings() {
    chrome.storage.sync.get(['autoExtract', 'contextSuggestions'], (result) => {
      document.getElementById('auto-extract').checked = result.autoExtract !== false;
      document.getElementById('context-suggestions').checked = result.contextSuggestions !== false;
    });
  }

  saveSetting(key, value) {
    chrome.storage.sync.set({ [key]: value });
  }

  openSettings() {
    chrome.tabs.create({ url: `${this.platformUrl}/settings` });
    window.close();
  }

  openHelp() {
    chrome.tabs.create({ url: `${this.platformUrl}/help` });
    window.close();
  }

  showNotification(message, type = 'success') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#10b981'};
      color: white;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);