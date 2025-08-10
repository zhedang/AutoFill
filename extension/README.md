# AutoFill Browser Extension

A Chrome/Safari extension that automatically fills forms by dragging and dropping files containing user information.

## 🚀 Features

- **Universal Form Detection**: Works on any website with forms
- **Multi-format Support**: PDF, JPG, PNG, DOC, DOCX, TXT
- **Intelligent Field Matching**: Automatically detects and fills appropriate form fields
- **Privacy First**: All processing happens locally, no data sent to external servers
- **Easy to Use**: Simple drag-and-drop interface

## 📁 Extension Structure

```
extension/
├── manifest.json          # Extension configuration
├── background/
│   └── background.js      # Service worker (background script)
├── content/
│   └── content.js         # Content script injected into web pages
├── popup/
│   ├── popup.html         # Extension popup interface
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup functionality
├── utils/
│   └── fileProcessor.js   # File processing utilities
└── assets/                # Icons and other assets
```

## 🔧 Installation

### Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

### Safari
1. Open Safari Preferences > Extensions
2. Enable "Developer mode"
3. Click "Show Extension Builder"
4. Import the extension folder

## 🎯 How It Works

1. **Install Extension**: Add the extension to your browser
2. **Navigate to Forms**: Go to any webpage with forms
3. **Drag & Drop Files**: Drop PDFs, images, or documents onto the page
4. **Auto-fill**: Extension detects form fields and fills them automatically

## 🛠️ Development

### Prerequisites
- Chrome/Safari browser
- Basic knowledge of JavaScript and browser extensions

### Local Development
1. Clone the repository
2. Make changes to extension files
3. Reload extension in browser
4. Test on any webpage with forms

### Building
```bash
# No build step required - extension runs directly
# Just ensure all files are in the extension/ directory
```

## 🔌 API Reference

### Background Script
- `PROCESS_FILE`: Process uploaded files
- `GET_SETTINGS`: Retrieve extension settings
- `UPDATE_SETTINGS`: Update extension settings

### Content Script
- Form field detection
- Drag-and-drop interface
- Automatic form filling
- Field type analysis

### File Processing
- PDF text extraction (placeholder)
- Image OCR (placeholder)
- Word document parsing (placeholder)
- Text file reading

## 🎨 Customization

### Styling
- Modify `popup/popup.css` for popup appearance
- Update `content/content.js` for drop zone styling
- Customize colors and layout in CSS files

### Functionality
- Add new file type support in `utils/fileProcessor.js`
- Enhance form detection in `content/content.js`
- Modify field matching logic as needed

## 🚧 Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic extension structure
- [x] Form detection
- [x] File upload interface
- [x] Popup management

### Phase 2: File Processing
- [ ] PDF.js integration for PDF text extraction
- [ ] Tesseract.js for image OCR
- [ ] Mammoth.js for Word documents
- [ ] Enhanced text parsing

### Phase 3: Smart Form Filling
- [ ] Machine learning for field matching
- [ ] Context-aware filling
- [ ] Validation and error handling
- [ ] User feedback system

### Phase 4: Advanced Features
- [ ] Batch file processing
- [ ] Custom field mapping
- [ ] Export/import settings
- [ ] Analytics dashboard

## 🐛 Troubleshooting

### Common Issues
1. **Extension not loading**: Check manifest.json syntax
2. **Forms not detected**: Ensure content script is running
3. **Files not processing**: Check file type support
4. **Popup not working**: Verify popup files are correct

### Debug Mode
1. Open browser developer tools
2. Check console for error messages
3. Inspect extension background page
4. Verify content script injection

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create a GitHub issue
- Check the troubleshooting section
- Review the code comments

---

**Note**: This is a development version. Some features (PDF processing, OCR) are placeholders and need real library integration for production use.
