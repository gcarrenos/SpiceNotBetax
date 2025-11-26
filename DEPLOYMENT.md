# Deployment Guide - Vercel

## Prerequisites

1. **GitHub Account** (or GitLab/Bitbucket)
2. **Vercel Account** (sign up at https://vercel.com)
3. **MUX Credentials** (already configured in `.env.local`)

## Step 1: Push to GitHub

### Option A: Using GitHub CLI (if installed)

```bash
# Create a new repository on GitHub
gh repo create spice-not-web --public --source=. --remote=origin --push
```

### Option B: Manual GitHub Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `spice-not-web` (or your preferred name)
   - Choose Public or Private
   - **Don't** initialize with README, .gitignore, or license

2. **Connect and push:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/spice-not-web.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign in with GitHub (or create account)

2. **Import Project:**
   - Click "Add New Project"
   - Select your GitHub repository (`spice-not-web`)
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   - In the project settings, go to "Environment Variables"
   - Add the following:
     ```
     MUX_TOKEN_ID=your_mux_token_id_here
     MUX_TOKEN_SECRET=your_mux_token_secret_here
     ```
   - Make sure to add them for:
     - Production
     - Preview
     - Development

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option B: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about environment variables, add:
     - `MUX_TOKEN_ID`
     - `MUX_TOKEN_SECRET`

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

**Important:** Make sure to add your MUX credentials in Vercel:

1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add:
   - `MUX_TOKEN_ID` = (your token ID)
   - `MUX_TOKEN_SECRET` = (your token secret)
4. Select all environments (Production, Preview, Development)
5. Redeploy after adding variables

## Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors
- Check Vercel build logs for specific errors

### Environment Variables Not Working

- Make sure variables are added in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### MUX API Errors

- Verify MUX credentials are correct
- Check MUX dashboard for API limits
- Ensure credentials have proper permissions

## Post-Deployment

1. **Test the deployment:**
   - Visit your Vercel URL
   - Test creating a stream
   - Test viewing streams

2. **Monitor:**
   - Check Vercel Analytics
   - Monitor MUX dashboard for usage

3. **Update:**
   - Push changes to GitHub
   - Vercel will auto-deploy on push to main branch

## Continuous Deployment

Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches

No manual deployment needed after initial setup!

