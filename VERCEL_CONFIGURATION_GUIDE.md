# Where to Find Configuration Settings in Vercel

After importing your repository, Vercel shows a configuration screen. Here's where to find it:

## After Importing Repository

When you click "Import" on your `sports-day-app` repository, you should see:

### Configuration Screen Layout

```
┌─────────────────────────────────────────┐
│  Configure Project                       │
├─────────────────────────────────────────┤
│                                         │
│  Project Name: sports-day-app           │
│                                         │
│  Framework Preset: [Dropdown ▼]        │ ← Look here
│                                         │
│  Root Directory: [./]                   │ ← And here
│                                         │
│  Build and Output Settings              │
│  ┌─────────────────────────────────┐   │
│  │ Build Command:                  │   │ ← Expand this
│  │ [cd client && npm run build]    │   │
│  │                                  │   │
│  │ Output Directory:                │   │
│  │ [client/build]                  │   │
│  │                                  │   │
│  │ Install Command:                 │   │
│  │ [npm install]                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Environment Variables (Optional)       │
│  [Add]                                 │
│                                         │
│  [Deploy]  [Cancel]                    │
└─────────────────────────────────────────┘
```

## Step-by-Step: Finding Configuration

### Option 1: Configuration Screen (Right After Import)

1. **After clicking "Import"** on your repository
2. **You should immediately see** a screen titled:
   - "Configure Project" or
   - "Import Project" or
   - "Project Settings"
3. **This screen has**:
   - Framework Preset dropdown
   - Root Directory field
   - "Build and Output Settings" section (may be collapsed)

### Option 2: If You Already Clicked Deploy

If you already clicked "Deploy" without configuring:

1. **Go to your project** in Vercel dashboard
2. **Click**: "Settings" tab (top menu)
3. **Click**: "General" (left sidebar)
4. **Scroll down** to find:
   - Build & Development Settings
   - Root Directory
   - Build Command
   - Output Directory

### Option 3: Expand Build Settings

If you see a collapsed section:

1. **Look for**: "Build and Output Settings"
2. **Click**: The arrow or "Show" button to expand
3. **You'll see**:
   - Build Command
   - Output Directory
   - Install Command

## What to Set

### Framework Preset
- **Select**: "Create React App" from dropdown
- **OR**: Leave as "Other" if "Create React App" isn't available

### Root Directory
- **Leave as**: `./` (default)
- **OR**: Leave empty

### Build and Output Settings
Click to expand if collapsed, then set:

**Build Command:**
```
cd client && npm install && npm run build
```

**Output Directory:**
```
client/build
```

**Install Command:**
```
npm install && cd client && npm install
```

## If You Don't See Configuration Screen

### Scenario 1: Auto-detected and Deployed
- Vercel might have auto-detected and started deploying
- **Solution**: 
  1. Go to your project
  2. Settings → General
  3. Edit the build settings there
  4. Redeploy

### Scenario 2: Already on Dashboard
- You might be on the main dashboard
- **Solution**:
  1. Click on your project name
  2. Go to Settings → General
  3. Find "Build & Development Settings"

### Scenario 3: Deployment in Progress
- If deployment already started
- **Solution**:
  1. Wait for it to finish (or cancel)
  2. Go to Settings → General
  3. Update settings
  4. Redeploy

## Visual Guide - What You Should See

### Screen 1: After Import
```
┌──────────────────────────────────────┐
│  Import Project                      │
│                                      │
│  Repository: sports-day-app         │
│                                      │
│  Framework Preset: [Create React App▼]│
│                                      │
│  ⚙️ Build and Output Settings       │
│     [Click to expand ▼]              │
│                                      │
│  [Deploy]                            │
└──────────────────────────────────────┘
```

### Screen 2: Expanded Settings
```
┌──────────────────────────────────────┐
│  ⚙️ Build and Output Settings       │
│                                      │
│  Build Command:                      │
│  [cd client && npm run build]       │
│                                      │
│  Output Directory:                   │
│  [client/build]                     │
│                                      │
│  Install Command:                    │
│  [npm install && cd client && npm install]│
└──────────────────────────────────────┘
```

## Quick Actions

1. **Look for**: "Framework Preset" dropdown
2. **Look for**: "Build and Output Settings" section
3. **Click**: To expand if it's collapsed
4. **Set**: The build command and output directory
5. **Click**: "Deploy"

## Still Can't Find It?

**Tell me what you see:**
- Are you on a deployment screen?
- Do you see "Deploying..." or "Building..."?
- Do you see your project dashboard?
- What buttons/options are visible?

I can guide you based on what's on your screen!
