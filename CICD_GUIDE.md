# Junior Developer Guide: CI/CD Pipeline with GitHub and Vercel

Welcome to the **KertasFolio** project! This guide walks you through the concepts and practical steps of our **CI/CD (Continuous Integration & Continuous Deployment)** pipeline. 

By the end of this guide, you will understand how pushing your code to GitHub automatically builds, tests, and deploys KertasFolio to production on Vercel.

---

## 1. What is CI/CD?

* **Continuous Integration (CI)**: The practice of automatically merging code changes from multiple contributors into a central repository. Every time code is pushed, automated checks (like type checks, linter checks, and builds) run to ensure the new code doesn't break existing functionality.
* **Continuous Deployment (CD)**: The practice of automatically deploying the successfully integrated code changes to the live production server (Vercel) without manual intervention.

---

## 2. The KertasFolio Pipeline Workflow

```
[Write Code Locally] --> [Run local checks: npx tsc --noEmit]
                               |
                               v
                     [git push origin feature-branch]
                               |
                               v
                  [GitHub Remote Repository]
                               |
                               v
                      {Vercel Automation}
                     /                  \
      (On Feature Branch)             (On main Merge)
           /                              \
          v                                v
[Vercel Preview Deploy]          [Vercel Production Deploy]
          |                                |
          v                                v
[Team Reviews Preview URL]       [Live Site: kertasfolio.vercel.app]
```

1. **Local Development**: You edit code, resolve TypeScript issues, and verify layouts on your local machine.
2. **Push to Feature Branch**: You push changes to GitHub. Vercel intercepts this push and spins up a **Preview Deployment** (a unique clone of the website displaying only your branch changes).
3. **Merge to Main**: Once the code is reviewed and approved, it is merged into the `main` branch.
4. **Production Deployment**: Vercel triggers a **Production Deployment**, rebuilding the site and automatically updating the public domain name (`kertasfolio.vercel.app`).

---

## 3. Step-by-Step Setup Guide

### Step 1: Create a Public GitHub Repository
1. Go to [github.com](https://github.com/) and log in.
2. Click **New Repository**.
3. Name the repository: `kertasfolio`.
4. Choose **Public** so others can view it.
5. Do **not** initialize with a README, `.gitignore`, or license (we already have them in our project folder!). Click **Create repository**.

### Step 2: Link Your Local Folder to GitHub
Run the following commands in your terminal inside the `CV Thingy` project directory:

```bash
# Link your local repo to the remote GitHub repo
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/kertasfolio.git

# Rename the default branch to 'main'
git branch -M main

# Push your committed code to GitHub
git push -u origin main
```

### Step 3: Link GitHub to Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and log in.
2. Click **Add New** -> **Project**.
3. Under "Import Git Repository", find your `kertasfolio` repository and click **Import**.
4. Configure Project settings:
   - **Framework Preset**: Vercel automatically detects `Next.js`. Keep this preset.
   - **Build Command**: Keep empty (defaults to `next build`).
   - **Output Directory**: Keep empty (defaults to Next.js default `.next`).
   - **Install Command**: Keep empty (defaults to `npm install`).
5. Click **Deploy**. Vercel will clone, build, and host the app in under a minute!

---

## 4. Best Practices for Junior Developers

### 🛡️ 1. Always Run Local Checks Before Pushing
To avoid breaking the deployment build pipeline (which alerts the team), run the TypeScript compiler check locally before committing:
```bash
npx tsc --noEmit
```

### 🔑 2. How to Handle Environment Variables
Never commit API secrets, credentials, or local environment configurations to Git!
* Local variables go into a file named `.env.local` (which is already hidden in `.gitignore`).
* Production variables must be input in the **Vercel Project Settings** -> **Environment Variables** tab. Next.js will inject them securely during the cloud build phase.

### 🔄 3. Branching Strategy
* **`main`**: Represents the stable, deployed production site. Never commit directly to `main`.
* **`feature/your-feature-name`**: Create separate branches for each task:
  ```bash
  git checkout -b feature/form-sidebar
  # ... make edits ...
  git commit -m "feat: added sidebar content form editor"
  git push origin feature/form-sidebar
  ```
* Open a **Pull Request (PR)** on GitHub to merge your feature branch into `main`. Review the preview URL created by Vercel before merging!
