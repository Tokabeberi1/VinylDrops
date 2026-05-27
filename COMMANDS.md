# GrooveHQ Terminal Commands Reference

This file contains all the terminal commands needed to develop, build, and deploy the GrooveHQ application.

## 🚀 Quick Start (First Time Setup)

```bash
# 1. Navigate to project directory
cd "Aranairad ar washalo"

# 2. Install all dependencies (required on first setup)
npm install

# 3. Start the development server
npm run dev
```

The application will be available at: **http://localhost:5173**

---

## 📖 Available npm Scripts

### Development

```bash
# Start development server with hot module replacement
npm run dev
```
- Runs on http://localhost:5173
- Hot reload enabled
- Source maps available
- Use Ctrl+C to stop

### Production Build

```bash
# Create optimized production build
npm run build
```
- Creates `dist/` folder
- Minified and optimized
- Source maps stripped
- Ready for deployment

### Preview Build

```bash
# Preview production build locally
npm run preview
```
- Serves the production build
- Use to test before deployment
- Run `npm run build` first

### Linting (if ESLint is configured)

```bash
# Run ESLint
npm run lint
```

---

## 🔧 Development Workflow

### Step-by-step typical development session:

```bash
# 1. Start development server
npm run dev

# 2. Open in browser
# Navigate to http://localhost:5173

# 3. Edit files in src/
# Changes auto-refresh in browser

# 4. Test admin features
# Login with: admin@test.com / 123456

# 5. When done, stop server
# Press Ctrl+C in terminal
```

---

## 🏗 Building for Production

### Complete build workflow:

```bash
# 1. Build the application
npm run build

# 2. Test production build locally
npm run preview

# 3. Verify dist/ folder created
ls dist/          # On Mac/Linux
dir dist          # On Windows

# 4. Upload dist/ folder to hosting
# See deployment instructions below
```

---

## 📦 Package Management

### Install all dependencies

```bash
npm install
```

### Add a new package

```bash
npm install package-name
```

### Update all packages

```bash
npm update
```

### Remove unused packages

```bash
npm prune
```

### Check for vulnerabilities

```bash
npm audit
```

### Fix security issues

```bash
npm audit fix
```

---

## 🚢 Deployment Commands

### Deploy to Vercel

```bash
# 1. Build locally
npm run build

# 2. Install Vercel CLI (first time only)
npm install -g vercel

# 3. Deploy to production
vercel --prod
```

### Deploy to Netlify

```bash
# 1. Build locally
npm run build

# 2. Install Netlify CLI (first time only)
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

### Deploy to traditional hosting (FTP/SFTP)

```bash
# 1. Build locally
npm run build

# 2. Upload dist/ folder contents to your server
# Using FTP/SFTP client
```

---

## 🔍 Debugging & Troubleshooting

### Clear node_modules and reinstall

```bash
# On Windows
rmdir node_modules /s /q
npm install

# On Mac/Linux
rm -rf node_modules
npm install
```

### Clear build cache

```bash
# Remove dist folder
npm run build

# Or manually
rm -rf dist          # Mac/Linux
rmdir /s dist        # Windows
```

### Check Node version

```bash
node --version
npm --version
```

### Check installed packages

```bash
npm list
npm list --global
```

---

## 📊 Common Commands Cheat Sheet

| Task | Command |
|------|---------|
| Start development | `npm run dev` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Install dependencies | `npm install` |
| Update dependencies | `npm update` |
| Check for vulnerabilities | `npm audit` |
| View installed packages | `npm list` |

---

## ✅ Verification Checklist

After following setup steps, verify everything works:

```bash
# 1. Verify Node.js is installed
node --version          # Should be v16 or higher

# 2. Verify npm is installed
npm --version           # Should be v7 or higher

# 3. Verify dependencies installed
npm list                # Should show list without errors

# 4. Verify dev server starts
npm run dev             # Should show "ready in Xms"

# 5. Verify build succeeds
npm run build           # Should show "done"

# 6. Verify dist folder created
ls dist                 # Should show dist folder

# 7. Verify production preview works
npm run preview         # Should serve successfully
```

---

## 🌍 Environment Variables (Optional)

Create a `.env` file in the project root:

```bash
# .env (development)
VITE_API_URL=http://localhost:3000

# .env.production (production)
VITE_API_URL=https://api.yourdomain.com
```

Access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 📝 Git Commands (if using version control)

```bash
# Initialize git (first time only)
git init

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to remote (GitHub, etc.)
git push origin main

# Clone repository
git clone https://github.com/username/groovehq.git
```

---

## 🎯 Full Production Deployment Example

```bash
# 1. Navigate to project
cd "Aranairad ar washalo"

# 2. Ensure latest code
git pull

# 3. Install/update dependencies
npm install

# 4. Build application
npm run build

# 5. Test production build
npm run preview

# 6. Deploy to Vercel (or your hosting)
vercel --prod

# Deployment complete!
```

---

## 📞 Troubleshooting Commands

### If "npm command not found"
```bash
# Reinstall Node.js from https://nodejs.org
```

### If "port 5173 already in use"
```bash
# Use different port
npm run dev -- --port 3000
```

### If build fails
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### If styles don't load
```bash
# Rebuild with cleared cache
npm run build
npm run preview
```

---

## 🔄 Typical Development Day

```bash
# Morning - start development
npm run dev

# During day - edit files and test

# Before lunch - commit changes
git add .
git commit -m "Feature complete"

# Before production - build and test
npm run build
npm run preview

# Deploy to production
vercel --prod

# Evening - stop dev server
# Press Ctrl+C
```

---

## 📱 Testing on Mobile Devices

```bash
# 1. Start dev server
npm run dev

# 2. Find your computer's IP address
# On Windows: ipconfig
# On Mac: ifconfig
# Look for IPv4 Address (e.g., 192.168.1.100)

# 3. On mobile device, open browser and navigate to:
# http://192.168.1.100:5173
```

---

**Remember**: All commands should be run in the project directory (`"Aranairad ar washalo"`).

For more information, see the main [README.md](README.md) file.
