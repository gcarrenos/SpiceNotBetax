# Quick Deploy to Vercel

## Step 1: Push to GitHub

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `spice-not-web`
3. Choose Public or Private
4. **Don't** check "Initialize with README"
5. Click "Create repository"

### Push Your Code

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/spice-not-web.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import your `spice-not-web` repository
5. Vercel will auto-detect Next.js settings
6. **IMPORTANT:** Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     - `MUX_TOKEN_ID` = (your MUX token ID)
     - `MUX_TOKEN_SECRET` = (your MUX token secret)
   - Select all environments (Production, Preview, Development)
7. Click **"Deploy"**
8. Wait 2-3 minutes for build
9. Your app will be live! 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? spice-not-web
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add MUX_TOKEN_ID
vercel env add MUX_TOKEN_SECRET

# Deploy to production
vercel --prod
```

## Step 3: Verify Deployment

1. Visit your Vercel URL (e.g., `https://spice-not-web.vercel.app`)
2. Test creating a stream
3. Test viewing streams
4. Check that MUX integration works

## Important Notes

- ✅ Your `.env.local` file is NOT pushed to GitHub (it's in `.gitignore`)
- ✅ You MUST add environment variables in Vercel dashboard
- ✅ After adding env vars, Vercel will auto-redeploy
- ✅ Future pushes to `main` branch will auto-deploy

## Troubleshooting

**Build fails?**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles

**MUX errors?**
- Double-check environment variables in Vercel
- Verify MUX credentials are correct
- Redeploy after adding env vars

## Next Steps

- Set up custom domain (optional)
- Enable Vercel Analytics
- Configure preview deployments for PRs

