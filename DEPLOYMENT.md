# Deployment Guide

This document covers deploying the **HireHub Onboarding Portal** to Vercel as a static single-page application (SPA).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
  - [Option 1: Vercel Git Integration (Recommended)](#option-1-vercel-git-integration-recommended)
  - [Option 2: Vercel CLI](#option-2-vercel-cli)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD via Vercel Git Integration](#cicd-via-vercel-git-integration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- Git repository hosted on GitHub, GitLab, or Bitbucket

---

## Build Configuration

The project uses **Vite 5** as the build tool. The relevant build settings are:

| Setting          | Value            |
| ---------------- | ---------------- |
| Build Command    | `npm run build`  |
| Output Directory | `dist/`          |
| Install Command  | `npm install`    |
| Node Version     | 18.x or later   |

To build locally and verify the output:

```bash
npm install
npm run build
```

This produces a `dist/` directory containing the static assets (`index.html`, JavaScript bundles, and CSS).

To preview the production build locally:

```bash
npm run preview
```

This starts a local server (default `http://localhost:4173`) serving the `dist/` directory.

---

## Vercel Deployment

### Option 1: Vercel Git Integration (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository from the Git provider.
4. Vercel auto-detects the Vite framework. Confirm the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**.

Vercel will build and deploy the application. A unique URL is assigned automatically (e.g., `https://hirehub-onboarding-portal.vercel.app`).

### Option 2: Vercel CLI

1. Install the Vercel CLI globally:

   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:

   ```bash
   vercel login
   ```

3. From the project root, run:

   ```bash
   vercel
   ```

4. Follow the prompts:
   - **Set up and deploy?** Yes
   - **Which scope?** Select your account or team
   - **Link to existing project?** No (for first deployment)
   - **Project name:** `hirehub-onboarding-portal` (or your preferred name)
   - **Directory:** `./`
   - **Override settings?** No (Vercel detects Vite automatically)

5. For subsequent production deployments:

   ```bash
   vercel --prod
   ```

---

## SPA Rewrite Configuration

The project includes a `vercel.json` file at the repository root that configures SPA routing rewrites:

```json
{
  "rewrites": [
    {
      "source": "/((?!assets/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### What this does

- All requests that do **not** match the `/assets/` path prefix are rewritten to `/index.html`.
- This ensures that client-side routes (`/apply`, `/admin`, etc.) handled by React Router DOM are served correctly when accessed directly via the browser address bar or on page refresh.
- Static assets (JavaScript bundles, CSS files, images) located under `/assets/` are served as-is without rewriting.

### Why this is necessary

Without this rewrite rule, navigating directly to `https://your-app.vercel.app/apply` would result in a **404 error** because Vercel would look for a physical file at `/apply/index.html`, which does not exist. The rewrite ensures that `index.html` is always served, allowing React Router to handle the routing on the client side.

---

## Environment Variables

**This project does not require any environment variables.**

- Authentication uses hardcoded credentials (`admin` / `admin`) stored in the client-side code.
- Data persistence uses the browser's `localStorage` (submissions) and `sessionStorage` (admin authentication).
- There are no external API calls, database connections, or third-party service integrations.

No `.env` file is needed for local development or production deployment.

---

## CI/CD via Vercel Git Integration

When connected via Git integration, Vercel provides automatic CI/CD:

### Production Deployments

- Every push to the **main** (or **master**) branch triggers a production deployment.
- The production URL remains stable across deployments.

### Preview Deployments

- Every push to a **non-production branch** (e.g., feature branches) triggers a preview deployment.
- Each preview deployment receives a unique URL for testing and review.
- Pull requests automatically receive a comment with the preview URL.

### Running Tests Before Deployment

To run the test suite before deploying, you can configure a custom build command in Vercel:

1. Go to your project settings on Vercel.
2. Navigate to **Settings** > **General** > **Build & Development Settings**.
3. Set the **Build Command** to:

   ```bash
   npm run test && npm run build
   ```

This ensures that the test suite (`vitest run`) passes before the production build is created. If any test fails, the deployment is blocked.

### Branch Configuration

To customize which branches trigger production vs. preview deployments:

1. Go to **Settings** > **Git** in your Vercel project dashboard.
2. Set the **Production Branch** to your desired branch (default is `main`).

---

## Troubleshooting

### 404 errors on page refresh or direct URL access

**Symptom:** Navigating directly to `/apply` or `/admin` returns a 404 page.

**Cause:** The SPA rewrite rule is not being applied.

**Solution:**
- Verify that `vercel.json` exists at the repository root (not inside `src/` or another subdirectory).
- Confirm the file contains the correct rewrite configuration as shown above.
- Redeploy after making changes to `vercel.json`.

### Blank page after deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Cause:** JavaScript bundle paths may be incorrect, or the build failed silently.

**Solution:**
- Open the browser developer console (F12) and check for errors.
- Verify the build completes successfully locally with `npm run build`.
- Ensure the **Output Directory** in Vercel is set to `dist` (not `build` or `public`).
- Check that `index.html` references `/src/main.jsx` in development but the bundled assets in production (Vite handles this automatically).

### Assets not loading (CSS, JS, images)

**Symptom:** The page loads but styles are missing or JavaScript does not execute.

**Cause:** The rewrite rule may be intercepting asset requests.

**Solution:**
- The `vercel.json` rewrite pattern `/((?!assets/).*)` excludes the `/assets/` path. Vite places all bundled assets under `/assets/` by default.
- If you have customized the `build.assetsDir` in `vite.config.js`, update the regex in `vercel.json` to match the new directory name.

### Build fails on Vercel

**Symptom:** Deployment fails during the build step.

**Cause:** Node.js version mismatch or dependency issues.

**Solution:**
- Ensure Vercel is using Node.js 18.x or later. You can set this in **Settings** > **General** > **Node.js Version**.
- Delete `node_modules/` and `package-lock.json` locally, run `npm install`, and push the updated `package-lock.json`.
- Check the Vercel build logs for specific error messages.

### Tests fail in CI but pass locally

**Symptom:** `npm run test` passes locally but fails on Vercel or another CI environment.

**Cause:** Tests may depend on browser APIs or environment-specific behavior.

**Solution:**
- The test suite uses `vitest` with the `jsdom` environment, which simulates browser APIs. Ensure `vitest.config.js` has `environment: 'jsdom'` configured.
- Check that `setupTests.js` imports `@testing-library/jest-dom` for custom matchers.
- Ensure no tests rely on real `localStorage` or `sessionStorage` state from previous test runs — each test should start with a clean state.

### Session lost on page refresh

**Symptom:** Admin is logged out after refreshing the page.

**Cause:** This is expected behavior. Admin authentication uses `sessionStorage`, which persists only for the duration of the browser tab session.

**Note:** This is by design. Closing the tab or refreshing clears the session. The admin must log in again with the credentials `admin` / `admin`.