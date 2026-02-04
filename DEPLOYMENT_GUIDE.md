# 🚀 Deployment Guide

This guide will help you deploy your E-commerce Analytics Dashboard to GitHub Pages with Supabase backend.

## Prerequisites

- GitHub account
- Supabase account (free tier is fine)
- Git installed on your computer

## Step-by-Step Deployment

### Part 1: Set Up Supabase (15 minutes)

#### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up or log in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name**: `ecommerce-dashboard` (or your choice)
   - **Database Password**: (save this somewhere safe!)
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait ~2 minutes for project initialization

#### 2. Set Up Database Tables

1. In your Supabase dashboard, click **SQL Editor** (in left sidebar)
2. Click "+ New query"
3. Open `supabase-setup.sql` from this repository
4. Copy ALL the SQL code
5. Paste it into the SQL Editor
6. Click "Run" (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

#### 3. Verify Tables Created

1. Click **Table Editor** (in left sidebar)
2. You should see two tables:
   - `sales_data`
   - `saved_views`
3. If you don't see them, repeat Step 2

#### 4. Get Your API Credentials

1. Click **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. Find and copy these two values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon public** key (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. Save these somewhere safe - you'll need them in the next step

### Part 2: Configure Your Dashboard (5 minutes)

1. Open `config.js` in your text editor
2. Replace the empty strings with your Supabase credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Paste your Project URL here
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Paste your anon public key here
```

3. Save the file

### Part 3: Deploy to GitHub (10 minutes)

#### Option A: Using GitHub Desktop (Easiest)

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop
3. Click "File" > "Add Local Repository"
4. Browse to your `ecommerce-dashboard` folder
5. Click "Publish repository"
6. Name it `ecommerce-dashboard`
7. Uncheck "Keep this code private" (or leave checked if you prefer)
8. Click "Publish repository"

#### Option B: Using Git Command Line

1. Create a new repository on GitHub:
   - Go to [github.com/new](https://github.com/new)
   - Name: `ecommerce-dashboard`
   - Keep it public
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. In your terminal, navigate to the project folder:
```bash
cd /path/to/ecommerce-dashboard
```

3. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-dashboard.git
```

4. Push your code:
```bash
git branch -M main
git push -u origin main
```

### Part 4: Enable GitHub Pages (2 minutes)

1. Go to your GitHub repository page
2. Click "Settings" (top right)
3. Scroll down and click "Pages" (in left sidebar)
4. Under "Source":
   - Select branch: `main`
   - Select folder: `/ (root)`
   - Click "Save"
5. Wait ~1 minute for deployment
6. Your dashboard will be available at:
   ```
   https://YOUR_USERNAME.github.io/ecommerce-dashboard/
   ```

## 🎉 You're Done!

Your dashboard is now live! Here's what you can do:

### Test It Out

1. Visit your GitHub Pages URL
2. Click "Create Account"
3. Sign up with your email
4. Check your email for verification link
5. Click the link to verify
6. Log back in to your dashboard
7. Upload a CSV file or click "Load Sample Data"
8. Explore the analytics!

## 🔄 Making Updates

### Update Your Code

When you make changes to your code:

**Using GitHub Desktop:**
1. Make your changes in your code editor
2. Open GitHub Desktop
3. You'll see your changes listed
4. Write a commit message
5. Click "Commit to main"
6. Click "Push origin"
7. GitHub Pages auto-updates in ~1 minute

**Using Command Line:**
```bash
git add .
git commit -m "Your update message"
git push
```

### Update Supabase Configuration

If you need to change Supabase settings:
1. Edit `config.js` locally
2. Commit and push changes (see above)
3. **IMPORTANT**: Never commit real credentials to public repos
   - Consider using environment variables for production

## 🔐 Security Best Practices

### For Public Repositories:

The current setup is safe for public repos because:
- Supabase Row Level Security (RLS) protects user data
- The anon key is meant to be public
- Each user can only access their own data

### Additional Security (Optional):

1. **Enable Email Confirmations**:
   - In Supabase: Authentication > Settings
   - Enable "Confirm email"

2. **Set up Custom Domain**:
   - Adds professionalism
   - Can use Cloudflare for HTTPS

3. **Rate Limiting**:
   - Supabase has built-in rate limiting
   - Configure in Project Settings > API

## 🐛 Troubleshooting

### Dashboard shows "Demo Mode"
- **Cause**: Supabase credentials not configured
- **Fix**: Check `config.js` has correct URL and key

### "Failed to fetch" errors
- **Cause**: Wrong Supabase URL or key
- **Fix**: Double-check credentials in Supabase dashboard

### Can't create account
- **Cause**: Email confirmation might be required
- **Fix**: Check your email inbox (and spam folder)

### Charts not showing
- **Cause**: No data uploaded
- **Fix**: Click "Load Sample Data" first

### GitHub Pages shows 404
- **Cause**: Pages not enabled or still deploying
- **Fix**: Wait 1-2 minutes, then refresh

### Data not saving
- **Cause**: Not logged in or database tables not created
- **Fix**: 
  1. Make sure you're logged in
  2. Re-run the SQL setup script in Supabase

## 📞 Need Help?

1. **Check the main README.md** for general usage
2. **Supabase Docs**: [docs.supabase.com](https://docs.supabase.com)
3. **GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)
4. **Open an Issue**: On your GitHub repository

## 🎯 Next Steps

Once deployed, you can:
- Share the URL with your team
- Upload your real sales data
- Customize the colors and branding
- Add more chart types
- Extend the database schema

## 💡 Pro Tips

1. **Bookmark your dashboard** for quick access
2. **Save filter views** for common analysis patterns
3. **Export charts** by right-clicking and saving as image
4. **Mobile friendly** - works great on phones and tablets
5. **Data privacy** - each user's data is completely isolated

---

**Congratulations on deploying your dashboard! 🚀📊**
