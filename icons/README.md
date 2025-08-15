# App Icons

## Required Icon Files

To use custom icons for your System Monitor app, place the following files in this directory:

### Windows Icons:
- **icon.ico** - Main Windows icon (recommended sizes: 16x16, 32x32, 48x48, 256x256)

### Optional Platform Icons:
- **icon.png** - General PNG icon (512x512 recommended)
- **icon.icns** - macOS icon (if building for Mac)

## How to Create Icons:

### Option 1: Online Converters
1. Create a 512x512 PNG image of your app icon
2. Use online converters like:
   - https://www.icoconverter.com/
   - https://convertio.co/png-ico/
   - https://favicon.io/favicon-converter/

### Option 2: Design Tools
- Use tools like GIMP, Photoshop, or free online tools
- Export in multiple sizes for best quality

### Option 3: Simple System Monitor Icon
For a quick system monitor themed icon, you could use:
- Computer/monitor symbol
- Chart/graph icon
- CPU/processor icon
- Combined with modern colors (blue, green, etc.)

## Current Status:
❌ No icon files found - using default Electron icon
✅ Package.json configured for custom icons

## Next Steps:
1. Add your `icon.ico` file to this folder
2. Run `npm run build` to build with your custom icon
3. The new .exe will use your custom icon!
