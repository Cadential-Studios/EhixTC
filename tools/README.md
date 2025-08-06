# Tools Directory

This directory contains development tools and utilities for debugging, testing, and monitoring the game.

## Structure

- `generate-location-report.js` - Generates comprehensive reports about the location system
- `testing/` - Testing utilities and interactive test files
  - `test-location-manager.html` - Interactive browser-based location system testing

## Usage

Tools can be run using npm scripts:

```bash
npm run location:report    # Generate location system report
npm run location:test      # Open location testing interface
```

Or directly:

```bash
node tools/generate-location-report.js
```

## Testing Tools

The testing directory contains interactive tools for validating game systems:

- **Location Manager Test**: Browser-based interface for testing location loading, exploration modals, and system integration
- **Future Tools**: Additional testing utilities will be added here as needed
