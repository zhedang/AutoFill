# AutoFill Browser Extension

A browser extension that allows users to automatically fill forms on any website by dragging and dropping files containing their information.

## Project Overview

AutoFill is a browser extension designed to streamline form filling across the web. Users can drag and drop files (PDFs, images, documents) onto any webpage with forms, and the extension will intelligently detect and fill the appropriate fields.

## Features

- 🎯 **Universal Compatibility** - Works on any website with forms
- 📁 **Multi-format Support** - PDF, JPG, PNG, DOC, DOCX, TXT and more
- 🤖 **Intelligent Detection** - Automatically identifies form fields and matches content
- 🔒 **Privacy First** - All processing happens locally, no data sent to external servers
- ⚡ **Instant Results** - Real-time form filling as you drag files

## Demo Page

The current React app serves as a demonstration of how the extension would work. It shows:

- File upload interface
- Form field detection
- Automatic filling capabilities
- User experience flow

## Technical Stack

- **Extension**: Chrome Extension Manifest V3
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **File Processing**: Tesseract.js (OCR), PDF.js, etc.

## Development Roadmap

### Phase 1: Core Extension
- [ ] Chrome extension manifest setup
- [ ] Content script for form detection
- [ ] File drop zone overlay
- [ ] Basic file reading capabilities

### Phase 2: File Processing
- [ ] PDF text extraction
- [ ] Image OCR processing
- [ ] Document parsing (DOC, DOCX)
- [ ] Text file processing

### Phase 3: Smart Form Filling
- [ ] Form field detection algorithms
- [ ] Content matching logic
- [ ] Field type recognition
- [ ] Validation and error handling

### Phase 4: User Experience
- [ ] Drag and drop interface
- [ ] Progress indicators
- [ ] Success/error feedback
- [ ] Settings and preferences

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Extension Development

```bash
# Build extension
npm run build:extension

# Load in Chrome
# 1. Open chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the dist/extension folder
```

## Architecture

```
src/
├── extension/          # Extension-specific code
│   ├── manifest.json   # Extension manifest
│   ├── content.js      # Content script
│   ├── background.js   # Background script
│   └── popup/         # Extension popup UI
├── demo/              # Demo page (current React app)
│   ├── App.jsx        # Main demo component
│   └── components/    # Demo components
└── shared/            # Shared utilities
    ├── fileProcessors/ # File processing modules
    ├── formDetectors/  # Form detection logic
    └── utils/         # Common utilities
```

## Security & Privacy

- **Local Processing**: All file processing happens in the browser
- **No Data Transmission**: No user data is sent to external servers
- **Permission Minimal**: Only requests necessary permissions
- **Open Source**: Transparent code for security review

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
