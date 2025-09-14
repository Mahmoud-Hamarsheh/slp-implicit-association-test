# 🔧 Build Troubleshooting Guide

## Common Build Errors & Solutions

### ❌ "Exited with status 1 while building your code"

This error can have several causes. Here are the most common solutions:

## 🚀 **Solution 1: Use the Updated Configuration**

I've updated your configuration files. Make sure to:

1. **Update your Render settings:**
   ```
   Build Command: npm ci && npm run build
   Publish Directory: dist
   Node Version: 18
   ```

2. **Push the updated files:**
   ```bash
   git add .
   git commit -m "Fix build configuration"
   git push origin main
   ```

## 🔍 **Solution 2: Check Build Logs**

In your Render dashboard:
1. Go to your service
2. Click on "Logs" tab
3. Look for specific error messages

Common error patterns:
- `Module not found` → Missing dependency
- `TypeScript error` → Type issues
- `Permission denied` → File permission issues
- `Out of memory` → Need more resources

## 🛠️ **Solution 3: Manual Build Test**

Test locally first:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build test
npm run build

# Check output
ls -la dist/
```

## 📋 **Solution 4: Alternative Build Commands**

Try these build commands in Render:

**Option A (Recommended):**
```
npm ci && npm run build
```

**Option B (If A fails):**
```
npm install --legacy-peer-deps && npm run build
```

**Option C (If B fails):**
```
npm install && npm run build --verbose
```

## 🔧 **Solution 5: Environment Variables**

Add these environment variables in Render:
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096
```

## 📦 **Solution 6: Package.json Issues**

If you have dependency conflicts, try:

1. **Update package.json:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0",
       "npm": ">=8.0.0"
     }
   }
   ```

2. **Clear cache:**
   ```bash
   npm cache clean --force
   ```

## 🐛 **Solution 7: TypeScript Issues**

If TypeScript errors occur:

1. **Check tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "skipLibCheck": true,
       "noImplicitAny": false,
       "strict": false
     }
   }
   ```

2. **Add to vite.config.ts:**
   ```typescript
   export default defineConfig({
     build: {
       rollupOptions: {
         external: []
       }
     }
   })
   ```

## 🚨 **Solution 8: Memory Issues**

If you get memory errors:

1. **Add to Render environment:**
   ```
   NODE_OPTIONS=--max-old-space-size=4096
   ```

2. **Update build command:**
   ```
   NODE_OPTIONS=--max-old-space-size=4096 npm ci && npm run build
   ```

## 📊 **Solution 9: Check Dependencies**

Verify all dependencies are installed:

```bash
# Check for missing dependencies
npm ls --depth=0

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🔄 **Solution 10: Clean Deploy**

If nothing works, try a clean deploy:

1. **Delete the service in Render**
2. **Create a new service**
3. **Use the updated configuration**

## 📞 **Getting Help**

If you're still stuck:

1. **Check Render logs** for specific error messages
2. **Test locally** with `npm run build`
3. **Share the error logs** from Render dashboard
4. **Try the alternative build commands** above

## ✅ **Quick Fix Checklist**

- [ ] Updated build command to `npm ci && npm run build`
- [ ] Set Node version to 18
- [ ] Added NODE_OPTIONS environment variable
- [ ] Tested build locally
- [ ] Checked Render logs for specific errors
- [ ] Pushed latest changes to GitHub

## 🎯 **Most Likely Fix**

The most common cause is the build command. Try this in Render:

**Build Command:** `npm ci && npm run build`
**Publish Directory:** `dist`
**Node Version:** `18`

This should resolve the "Exited with status 1" error!
