# 🚀 Deploying SLP Implicit Association Test to Render

This guide will walk you through deploying your React + Vite + Supabase application to Render.

## Prerequisites

- [ ] Render account (free tier available)
- [ ] GitHub repository with your code
- [ ] Supabase project set up

## Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Required Files
Make sure these files are in your repository:
- ✅ `package.json` (with build script)
- ✅ `vite.config.ts`
- ✅ `render.yaml` (created for you)
- ✅ `render-build.sh` (created for you)

## Step 2: Deploy to Render

### 2.1 Create a New Web Service

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Your Repository**
   - Choose "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Select your repository

### 2.2 Configure Build Settings

**Basic Settings:**
- **Name**: `slp-implicit-association-test` (or your preferred name)
- **Environment**: `Static Site`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: `18` (or latest LTS)

### 2.3 Environment Variables (Optional)

If you want to use different Supabase credentials for production:

1. Go to "Environment" tab in Render dashboard
2. Add these variables:
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   ```

**Note**: Your app will work with the current hardcoded values, but using environment variables is more secure.

### 2.4 Advanced Settings

**Headers (for SPA routing):**
- Add custom header: `/*` → `X-Frame-Options: DENY`
- Add custom header: `/*` → `X-Content-Type-Options: nosniff`

**Redirects/Rewrites:**
- Add rewrite rule: `/*` → `/index.html` (for React Router)

## Step 3: Deploy

1. **Click "Create Web Service"**
2. **Wait for Build**
   - First build may take 5-10 minutes
   - Subsequent builds are faster

3. **Get Your URL**
   - Render will provide a URL like: `https://slp-implicit-association-test.onrender.com`
   - You can customize this in settings

## Step 4: Configure Supabase (if needed)

### 4.1 Update Supabase Settings

1. **Go to Supabase Dashboard**
   - Visit your project at [supabase.com](https://supabase.com)

2. **Update Site URL**
   - Go to Authentication → Settings
   - Add your Render URL to "Site URL"
   - Add your Render URL to "Redirect URLs"

3. **CORS Settings**
   - Go to Settings → API
   - Add your Render domain to allowed origins

### 4.2 Database Configuration

Your database should already be configured, but verify:
- ✅ Tables are created
- ✅ RLS policies are set up
- ✅ Functions are deployed

## Step 5: Test Your Deployment

1. **Visit Your Render URL**
2. **Test Key Features**:
   - ✅ Device restriction (mobile/tablet blocked)
   - ✅ Survey functionality
   - ✅ IAT test completion
   - ✅ Data saving to Supabase

## Step 6: Custom Domain (Optional)

1. **In Render Dashboard**:
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain

2. **Update DNS**:
   - Point your domain to Render's provided CNAME

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check Node version (use 18+)
- Verify all dependencies in package.json
- Check build logs in Render dashboard

**App Doesn't Load:**
- Verify publish directory is `dist`
- Check if rewrite rules are set up
- Look at browser console for errors

**Supabase Connection Issues:**
- Verify environment variables
- Check Supabase project is active
- Update CORS settings in Supabase

**Mobile/Tablet Not Blocked:**
- Check device detection logic
- Verify CSS media queries work
- Test on actual mobile devices

### Getting Help:

1. **Render Logs**: Check build and runtime logs
2. **Browser DevTools**: Check console for errors
3. **Supabase Logs**: Check database logs
4. **GitHub Issues**: Check your repository issues

## Performance Optimization

### After Deployment:

1. **Enable CDN** (automatic with Render)
2. **Compress Assets** (handled by Vite build)
3. **Monitor Performance** in Render dashboard
4. **Set up Alerts** for downtime

## Security Checklist

- ✅ Environment variables for sensitive data
- ✅ HTTPS enabled (automatic with Render)
- ✅ Security headers configured
- ✅ Supabase RLS policies active
- ✅ Mobile/tablet access blocked

## Cost Management

**Render Free Tier:**
- ✅ 750 hours/month free
- ✅ Automatic sleep after 15 minutes of inactivity
- ✅ Perfect for development and small projects

**Upgrade When:**
- Need 24/7 uptime
- High traffic volume
- Custom domains required

---

## Quick Reference

**Your App URL**: `https://slp-implicit-association-test.onrender.com`
**Render Dashboard**: [render.com/dashboard](https://render.com/dashboard)
**Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)

**Need Help?** Check the troubleshooting section above or contact support.
