# AI Prompt Engineering Platform - Chrome Extension

A powerful Chrome extension that integrates with the AI Prompt Engineering Platform to provide context-aware AI assistance directly in your browser.

## Features

### 🚀 Quick Actions
- **Extract Page Content**: Automatically extract and analyze web page content
- **Analyze Selection**: Send selected text for AI analysis
- **Context-Aware Suggestions**: Get intelligent prompts based on the current page
- **Floating Action Button**: Quick access to AI tools on any webpage

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+A`: Analyze selected text
- `Ctrl+Shift+E`: Extract page content
- `Ctrl+Shift+P`: Open AI Prompt Platform

### 🎯 Context Menu Integration
- Right-click on any page element to access AI tools
- Analyze links, images, and selected text
- Quick prompt suggestions based on page type

### 🔄 Smart Detection
- **GitHub Repositories**: Code review, README generation, issue analysis
- **Stack Overflow**: Problem solving, debugging assistance
- **Documentation Sites**: Summarization, API exploration
- **Code-Heavy Pages**: Syntax analysis, optimization suggestions

## Installation

### Development Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` folder
4. The extension will appear in your extensions list

### Production Installation
1. Download the extension package
2. Open Chrome and go to `chrome://extensions/`
3. Drag and drop the `.crx` file into the extensions page

## Usage

### Getting Started
1. Install the extension
2. Make sure the AI Prompt Platform is running at `http://localhost:5175`
3. Navigate to any webpage
4. Use the floating button, keyboard shortcuts, or context menu to interact

### Floating Action Button
- Appears on all non-platform pages
- Click to access quick menu:
  - 📄 Extract Content
  - 🔍 Analyze Selection
  - 🚀 Open Platform

### Context Menu
Right-click on any page element to see AI options:
- **Extract Page Content**: Full page analysis
- **Analyze Selected Text**: Text-specific insights
- **Analyze Link**: Link destination analysis
- **Analyze Image**: Image content analysis
- **Quick Prompt**: Context-aware prompt suggestions

### Selection Analysis
1. Select any text on a webpage (minimum 10 characters)
2. A tooltip will appear: "Analyze with AI"
3. Click the tooltip or use `Ctrl+Shift+A`
4. The selection will be sent to the platform for analysis

## Configuration

### Settings
Access settings through the extension popup:
- **Auto-extract Content**: Automatically extract content when visiting new pages
- **Context-aware Suggestions**: Enable intelligent prompt suggestions

### Platform URL
By default, the extension connects to `http://localhost:5175`. To change this:
1. Edit `popup.js` and `background.js`
2. Update the `platformUrl` variable
3. Reload the extension

## Technical Details

### Files Structure
```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for web pages
├── icons/                # Extension icons
│   ├── icon16.svg
│   ├── icon48.svg
│   └── icon128.svg
└── README.md            # This file
```

### Permissions
- `activeTab`: Access current tab content
- `storage`: Store user preferences and messages
- `contextMenus`: Add right-click menu items
- `scripting`: Inject content scripts
- `notifications`: Show system notifications

### Communication Flow
1. **Content Script** → **Background Script** → **Platform**
2. Messages are stored in Chrome storage for platform pickup
3. Real-time synchronization between extension and platform

## Development

### Building
1. Make sure all files are in the `extension/` directory
2. Test in development mode
3. Package using Chrome's extension packaging tools

### Debugging
1. Open Chrome DevTools
2. Go to Extensions tab
3. Click "Inspect views" for background page or popup
4. Use console for debugging

### Testing
1. Load extension in development mode
2. Navigate to test pages
3. Verify all features work correctly
4. Check console for errors

## Troubleshooting

### Common Issues

**Extension not working:**
- Check if platform is running at correct URL
- Verify extension permissions are granted
- Check browser console for errors

**Content not extracting:**
- Ensure page has loaded completely
- Check if page blocks content scripts
- Verify storage permissions

**Keyboard shortcuts not working:**
- Check for conflicts with other extensions
- Ensure page has focus
- Verify shortcuts in extension settings

### Error Messages
- "No text selected": Select text before using analysis features
- "Error extracting content": Page may block content access
- "Platform not available": Check if platform is running

## Privacy & Security

### Data Handling
- Only processes content you explicitly select or extract
- No automatic data collection
- All communication with platform is local
- No external servers involved

### Permissions Usage
- `activeTab`: Only accesses current active tab
- `storage`: Stores preferences and temporary messages locally
- `scripting`: Only injects content script when needed

## Support

For issues, feature requests, or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure platform compatibility
4. Contact support through the main platform

## Version History

### v1.0.0
- Initial release
- Basic content extraction
- Context menu integration
- Keyboard shortcuts
- Floating action button
- Smart page detection

---

**Note**: This extension requires the AI Prompt Engineering Platform to be running locally. Make sure the platform is accessible before using the extension features.