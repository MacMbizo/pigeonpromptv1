// Content script for AI Prompt Engineering Platform Chrome Extension

class ContentScriptManager {
  constructor() {
    this.platformUrl = 'http://localhost:5175';
    this.isInjected = false;
    this.selectionHandler = null;
    this.init();
  }

  init() {
    this.injectStyles();
    this.setupSelectionHandler();
    this.setupMessageListener();
    this.setupKeyboardShortcuts();
    this.checkForPlatformMessages();
    this.markAsInjected();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ai-prompt-highlight {
        background-color: rgba(59, 130, 246, 0.2) !important;
        border: 2px solid #3b82f6 !important;
        border-radius: 4px !important;
        position: relative !important;
      }
      
      .ai-prompt-tooltip {
        position: absolute;
        top: -40px;
        left: 0;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10000;
        white-space: nowrap;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .ai-prompt-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 20px;
        border: 5px solid transparent;
        border-top-color: #1f2937;
      }
      
      .ai-prompt-floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .ai-prompt-floating-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      }
      
      .ai-prompt-quick-menu {
        position: fixed;
        bottom: 90px;
        right: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        z-index: 9998;
        min-width: 200px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        pointer-events: none;
      }
      
      .ai-prompt-quick-menu.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }
      
      .ai-prompt-menu-item {
        padding: 12px 16px;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background 0.2s;
        font-size: 14px;
        color: #374151;
      }
      
      .ai-prompt-menu-item:hover {
        background: #f9fafb;
      }
      
      .ai-prompt-menu-item:last-child {
        border-bottom: none;
        border-radius: 0 0 12px 12px;
      }
      
      .ai-prompt-menu-item:first-child {
        border-radius: 12px 12px 0 0;
      }
      
      .ai-prompt-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10001;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      }
      
      .ai-prompt-notification.show {
        transform: translateX(0);
      }
      
      .ai-prompt-notification.error {
        background: #ef4444;
      }
      
      .ai-prompt-notification.warning {
        background: #f59e0b;
      }
    `;
    document.head.appendChild(style);
  }

  setupSelectionHandler() {
    let selectionTimeout;
    
    document.addEventListener('mouseup', () => {
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
        this.handleTextSelection();
      }, 300);
    });
    
    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        clearTimeout(selectionTimeout);
        selectionTimeout = setTimeout(() => {
          this.handleTextSelection();
        }, 300);
      }
    });
  }

  handleTextSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Remove existing tooltips
    document.querySelectorAll('.ai-prompt-tooltip').forEach(tooltip => {
      tooltip.remove();
    });
    
    if (selectedText && selectedText.length > 10) {
      this.showSelectionTooltip(selection, selectedText);
    }
  }

  showSelectionTooltip(selection, text) {
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'ai-prompt-tooltip';
    tooltip.textContent = `Analyze with AI (${text.length} chars)`;
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
    
    tooltip.addEventListener('click', () => {
      this.analyzeSelection(text);
      tooltip.remove();
    });
    
    document.body.appendChild(tooltip);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.remove();
      }
    }, 5000);
  }

  setupMessageListener() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true;
    });
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'extract-content':
        const content = this.extractPageContent();
        sendResponse({ content });
        break;
      case 'get-selection':
        const selection = window.getSelection().toString();
        sendResponse({ selection });
        break;
      case 'highlight-element':
        this.highlightElement(message.selector);
        sendResponse({ success: true });
        break;
      case 'show-notification':
        this.showNotification(message.text, message.type);
        sendResponse({ success: true });
        break;
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  extractPageContent() {
    return {
      url: window.location.href,
      title: document.title,
      text: document.body.innerText.slice(0, 10000),
      headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: h.tagName.toLowerCase(),
        text: h.textContent.trim()
      })),
      links: Array.from(document.querySelectorAll('a[href]')).slice(0, 20).map(a => ({
        text: a.textContent.trim(),
        href: a.href
      })),
      images: Array.from(document.querySelectorAll('img[src]')).slice(0, 10).map(img => ({
        alt: img.alt,
        src: img.src,
        title: img.title
      })),
      codeBlocks: Array.from(document.querySelectorAll('pre, code')).map(code => 
        code.textContent.trim()
      ).filter(code => code.length > 10).slice(0, 10),
      metadata: {
        description: document.querySelector('meta[name="description"]')?.content || '',
        keywords: document.querySelector('meta[name="keywords"]')?.content || '',
        author: document.querySelector('meta[name="author"]')?.content || '',
        language: document.documentElement.lang || 'en',
        charset: document.characterSet,
        viewport: document.querySelector('meta[name="viewport"]')?.content || ''
      },
      timestamp: new Date().toISOString()
    };
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+A: Analyze selection
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const selection = window.getSelection().toString().trim();
        if (selection) {
          this.analyzeSelection(selection);
        } else {
          this.showNotification('No text selected', 'warning');
        }
      }
      
      // Ctrl+Shift+E: Extract page content
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        this.extractAndSendContent();
      }
      
      // Ctrl+Shift+P: Open platform
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.openPlatform();
      }
    });
  }

  setupFloatingButton() {
    // Only add floating button if not on the platform itself
    if (window.location.href.includes(this.platformUrl)) {
      return;
    }
    
    const button = document.createElement('button');
    button.className = 'ai-prompt-floating-button';
    button.innerHTML = '🤖';
    button.title = 'AI Prompt Engineering';
    
    const menu = document.createElement('div');
    menu.className = 'ai-prompt-quick-menu';
    menu.innerHTML = `
      <div class="ai-prompt-menu-item" data-action="extract">📄 Extract Content</div>
      <div class="ai-prompt-menu-item" data-action="analyze">🔍 Analyze Selection</div>
      <div class="ai-prompt-menu-item" data-action="open">🚀 Open Platform</div>
    `;
    
    button.addEventListener('click', () => {
      menu.classList.toggle('show');
    });
    
    menu.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (action) {
        this.handleFloatingMenuAction(action);
        menu.classList.remove('show');
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!button.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
    
    document.body.appendChild(button);
    document.body.appendChild(menu);
  }

  handleFloatingMenuAction(action) {
    switch (action) {
      case 'extract':
        this.extractAndSendContent();
        break;
      case 'analyze':
        const selection = window.getSelection().toString().trim();
        if (selection) {
          this.analyzeSelection(selection);
        } else {
          this.showNotification('Please select some text first', 'warning');
        }
        break;
      case 'open':
        this.openPlatform();
        break;
    }
  }

  async analyzeSelection(text) {
    try {
      await this.sendToPlatform({
        action: 'analyze-selection',
        data: {
          url: window.location.href,
          title: document.title,
          selection: text,
          timestamp: new Date().toISOString(),
          source: 'content-script'
        }
      });
      
      this.showNotification('Selection sent for analysis!');
    } catch (error) {
      console.error('Error analyzing selection:', error);
      this.showNotification('Error analyzing selection', 'error');
    }
  }

  async extractAndSendContent() {
    try {
      const content = this.extractPageContent();
      
      await this.sendToPlatform({
        action: 'extract-content',
        data: {
          ...content,
          source: 'content-script'
        }
      });
      
      this.showNotification('Content extracted successfully!');
    } catch (error) {
      console.error('Error extracting content:', error);
      this.showNotification('Error extracting content', 'error');
    }
  }

  async sendToPlatform(message) {
    // Send message to background script
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  openPlatform() {
    chrome.runtime.sendMessage({
      action: 'open-platform'
    });
  }

  highlightElement(selector) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('ai-prompt-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          element.classList.remove('ai-prompt-highlight');
        }, 3000);
      }
    } catch (error) {
      console.error('Error highlighting element:', error);
    }
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `ai-prompt-notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  async checkForPlatformMessages() {
    // Check for messages from the platform
    try {
      const result = await chrome.storage.local.get();
      const messageKeys = Object.keys(result).filter(key => 
        key.startsWith('message_') && !result[key].processed
      );
      
      for (const key of messageKeys) {
        const message = result[key];
        if (message && !message.processed) {
          this.processPlatformMessage(message);
          
          // Mark as processed
          await chrome.storage.local.set({
            [key]: { ...message, processed: true }
          });
        }
      }
    } catch (error) {
      console.error('Error checking platform messages:', error);
    }
    
    // Check again in 5 seconds
    setTimeout(() => {
      this.checkForPlatformMessages();
    }, 5000);
  }

  processPlatformMessage(message) {
    switch (message.action) {
      case 'highlight-code':
        this.highlightCodeBlocks();
        break;
      case 'extract-links':
        this.extractAndHighlightLinks();
        break;
      case 'show-suggestions':
        this.showContextualSuggestions(message.data);
        break;
    }
  }

  highlightCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre, code');
    codeBlocks.forEach(block => {
      if (block.textContent.trim().length > 10) {
        block.classList.add('ai-prompt-highlight');
      }
    });
    
    this.showNotification(`Highlighted ${codeBlocks.length} code blocks`);
  }

  extractAndHighlightLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      link.classList.add('ai-prompt-highlight');
    });
    
    this.showNotification(`Highlighted ${links.length} links`);
  }

  showContextualSuggestions(suggestions) {
    if (suggestions && suggestions.length > 0) {
      const suggestionText = suggestions.join(', ');
      this.showNotification(`Suggestions: ${suggestionText}`);
    }
  }

  markAsInjected() {
    this.isInjected = true;
    document.documentElement.setAttribute('data-ai-prompt-injected', 'true');
  }

  // Detect page type for context-aware suggestions
  detectPageType() {
    const url = window.location.href;
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.com')) {
      return 'github';
    } else if (hostname.includes('stackoverflow.com')) {
      return 'stackoverflow';
    } else if (url.includes('/docs/') || hostname.includes('docs.')) {
      return 'documentation';
    } else if (document.querySelectorAll('pre, code').length > 5) {
      return 'code-heavy';
    } else if (document.querySelectorAll('article, .post, .content').length > 0) {
      return 'article';
    }
    
    return 'general';
  }
}

// Initialize content script when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ContentScriptManager();
  });
} else {
  new ContentScriptManager();
}

// Prevent multiple injections
if (!document.documentElement.hasAttribute('data-ai-prompt-injected')) {
  // Add floating button after a short delay
  setTimeout(() => {
    const manager = new ContentScriptManager();
    manager.setupFloatingButton();
  }, 1000);
}