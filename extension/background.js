// Background service worker for AI Prompt Engineering Platform Chrome Extension

class BackgroundService {
  constructor() {
    this.platformUrl = 'http://localhost:5175';
    this.init();
  }

  init() {
    this.setupContextMenus();
    this.setupMessageHandlers();
    this.setupStorageHandlers();
    this.setupTabHandlers();
  }

  setupContextMenus() {
    // Create context menu items
    chrome.runtime.onInstalled.addListener(() => {
      // Main menu item
      chrome.contextMenus.create({
        id: 'ai-prompt-main',
        title: 'AI Prompt Engineering',
        contexts: ['page', 'selection', 'link', 'image']
      });

      // Sub-menu items
      chrome.contextMenus.create({
        id: 'extract-content',
        parentId: 'ai-prompt-main',
        title: 'Extract Page Content',
        contexts: ['page']
      });

      chrome.contextMenus.create({
        id: 'analyze-selection',
        parentId: 'ai-prompt-main',
        title: 'Analyze Selected Text',
        contexts: ['selection']
      });

      chrome.contextMenus.create({
        id: 'analyze-link',
        parentId: 'ai-prompt-main',
        title: 'Analyze Link',
        contexts: ['link']
      });

      chrome.contextMenus.create({
        id: 'analyze-image',
        parentId: 'ai-prompt-main',
        title: 'Analyze Image',
        contexts: ['image']
      });

      chrome.contextMenus.create({
        id: 'separator1',
        parentId: 'ai-prompt-main',
        type: 'separator',
        contexts: ['page', 'selection', 'link', 'image']
      });

      chrome.contextMenus.create({
        id: 'quick-prompt',
        parentId: 'ai-prompt-main',
        title: 'Quick Prompt',
        contexts: ['page', 'selection']
      });

      chrome.contextMenus.create({
        id: 'open-platform',
        parentId: 'ai-prompt-main',
        title: 'Open Platform',
        contexts: ['page', 'selection', 'link', 'image']
      });
    });

    // Handle context menu clicks
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  async handleContextMenuClick(info, tab) {
    try {
      switch (info.menuItemId) {
        case 'extract-content':
          await this.extractPageContent(tab);
          break;
        case 'analyze-selection':
          await this.analyzeSelection(info, tab);
          break;
        case 'analyze-link':
          await this.analyzeLink(info, tab);
          break;
        case 'analyze-image':
          await this.analyzeImage(info, tab);
          break;
        case 'quick-prompt':
          await this.openQuickPrompt(info, tab);
          break;
        case 'open-platform':
          await this.openPlatform();
          break;
      }
    } catch (error) {
      console.error('Error handling context menu click:', error);
    }
  }

  async extractPageContent(tab) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: this.extractContentScript
      });
      
      const content = results[0]?.result;
      if (content) {
        await this.sendToPlatform({
          action: 'extract-content',
          data: {
            url: tab.url,
            title: tab.title,
            content: content,
            timestamp: new Date().toISOString(),
            source: 'context-menu'
          }
        });
        
        this.showNotification('Content extracted successfully!');
      }
    } catch (error) {
      console.error('Error extracting content:', error);
      this.showNotification('Error extracting content');
    }
  }

  extractContentScript() {
    // Extract meaningful content from the page
    const content = {
      text: document.body.innerText.slice(0, 10000), // Limit to 10000 chars
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
        language: document.documentElement.lang || 'en'
      }
    };
    
    return content;
  }

  async analyzeSelection(info, tab) {
    if (info.selectionText) {
      await this.sendToPlatform({
        action: 'analyze-selection',
        data: {
          url: tab.url,
          title: tab.title,
          selection: info.selectionText,
          timestamp: new Date().toISOString(),
          source: 'context-menu'
        }
      });
      
      this.showNotification('Selection sent for analysis!');
    }
  }

  async analyzeLink(info, tab) {
    if (info.linkUrl) {
      await this.sendToPlatform({
        action: 'analyze-link',
        data: {
          sourceUrl: tab.url,
          sourceTitle: tab.title,
          linkUrl: info.linkUrl,
          linkText: info.selectionText || 'No text',
          timestamp: new Date().toISOString(),
          source: 'context-menu'
        }
      });
      
      this.showNotification('Link sent for analysis!');
    }
  }

  async analyzeImage(info, tab) {
    if (info.srcUrl) {
      await this.sendToPlatform({
        action: 'analyze-image',
        data: {
          sourceUrl: tab.url,
          sourceTitle: tab.title,
          imageUrl: info.srcUrl,
          timestamp: new Date().toISOString(),
          source: 'context-menu'
        }
      });
      
      this.showNotification('Image sent for analysis!');
    }
  }

  async openQuickPrompt(info, tab) {
    const context = {
      url: tab.url,
      title: tab.title,
      selection: info.selectionText || '',
      timestamp: new Date().toISOString()
    };
    
    await this.sendToPlatform({
      action: 'quick-prompt',
      data: context
    });
    
    await this.openPlatform('/prompt-ide?quick=true');
  }

  async openPlatform(path = '') {
    const url = `${this.platformUrl}${path}`;
    await chrome.tabs.create({ url });
  }

  async sendToPlatform(message) {
    // Store the message for the platform to pick up
    const messageId = `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await chrome.storage.local.set({
      [messageId]: {
        ...message,
        id: messageId,
        processed: false
      }
    });
    
    // Clean up old messages (keep only last 50)
    this.cleanupOldMessages();
  }

  async cleanupOldMessages() {
    try {
      const result = await chrome.storage.local.get();
      const messageKeys = Object.keys(result).filter(key => key.startsWith('message_'));
      
      if (messageKeys.length > 50) {
        // Sort by timestamp and remove oldest
        const sortedKeys = messageKeys.sort();
        const keysToRemove = sortedKeys.slice(0, messageKeys.length - 50);
        
        for (const key of keysToRemove) {
          await chrome.storage.local.remove(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old messages:', error);
    }
  }

  setupMessageHandlers() {
    // Handle messages from content scripts and popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }

  async handleMessage(message, sender, sendResponse) {
    try {
      switch (message.action) {
        case 'get-tab-info':
          const tab = await this.getCurrentTab();
          sendResponse({ tab });
          break;
        case 'extract-content':
          await this.extractPageContent(sender.tab);
          sendResponse({ success: true });
          break;
        case 'store-prompt':
          await this.storeRecentPrompt(message.data);
          sendResponse({ success: true });
          break;
        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    }
  }

  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async storeRecentPrompt(promptData) {
    try {
      const result = await chrome.storage.local.get(['recentPrompts']);
      const recentPrompts = result.recentPrompts || [];
      
      // Add new prompt to the beginning
      recentPrompts.unshift({
        ...promptData,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 10 prompts
      const limitedPrompts = recentPrompts.slice(0, 10);
      
      await chrome.storage.local.set({ recentPrompts: limitedPrompts });
    } catch (error) {
      console.error('Error storing recent prompt:', error);
    }
  }

  setupStorageHandlers() {
    // Listen for storage changes to sync data
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync') {
        // Handle settings changes
        this.handleSettingsChange(changes);
      }
    });
  }

  handleSettingsChange(changes) {
    // Update extension behavior based on settings
    if (changes.autoExtract) {
      console.log('Auto-extract setting changed:', changes.autoExtract.newValue);
    }
    
    if (changes.contextSuggestions) {
      console.log('Context suggestions setting changed:', changes.contextSuggestions.newValue);
    }
  }

  setupTabHandlers() {
    // Listen for tab updates to provide context-aware suggestions
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tab);
      }
    });
  }

  async handleTabUpdate(tab) {
    try {
      // Check if context suggestions are enabled
      const result = await chrome.storage.sync.get(['contextSuggestions']);
      if (result.contextSuggestions !== false) {
        // Analyze page and provide suggestions (implement as needed)
        this.analyzePageForSuggestions(tab);
      }
    } catch (error) {
      console.error('Error handling tab update:', error);
    }
  }

  async analyzePageForSuggestions(tab) {
    // Implement intelligent suggestions based on page content
    // This could include detecting code repositories, documentation sites, etc.
    const url = new URL(tab.url);
    
    if (url.hostname.includes('github.com')) {
      // GitHub repository detected
      await this.suggestGitHubPrompts(tab);
    } else if (url.hostname.includes('stackoverflow.com')) {
      // Stack Overflow detected
      await this.suggestStackOverflowPrompts(tab);
    } else if (url.pathname.includes('/docs/') || url.hostname.includes('docs.')) {
      // Documentation site detected
      await this.suggestDocumentationPrompts(tab);
    }
  }

  async suggestGitHubPrompts(tab) {
    // Store GitHub-specific prompt suggestions
    await chrome.storage.local.set({
      [`suggestion_${tab.id}`]: {
        type: 'github',
        prompts: [
          'Code Review Assistant',
          'README Generator',
          'Issue Analyzer',
          'Commit Message Helper'
        ],
        timestamp: new Date().toISOString()
      }
    });
  }

  async suggestStackOverflowPrompts(tab) {
    await chrome.storage.local.set({
      [`suggestion_${tab.id}`]: {
        type: 'stackoverflow',
        prompts: [
          'Problem Solver',
          'Code Debugger',
          'Solution Analyzer',
          'Answer Formatter'
        ],
        timestamp: new Date().toISOString()
      }
    });
  }

  async suggestDocumentationPrompts(tab) {
    await chrome.storage.local.set({
      [`suggestion_${tab.id}`]: {
        type: 'documentation',
        prompts: [
          'Documentation Summarizer',
          'API Explorer',
          'Tutorial Creator',
          'Example Generator'
        ],
        timestamp: new Date().toISOString()
      }
    });
  }

  showNotification(message) {
    // Create a notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'AI Prompt Engineering',
      message: message
    });
  }
}

// Initialize background service
const backgroundService = new BackgroundService();