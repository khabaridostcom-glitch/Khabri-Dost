# 12 — DEPLOYMENT, SMOKE TESTING & ROLLBACK RUNBOOK
**Project:** Khabri Dost (khabridost.com)  
**System Type:** Production Deployment Manual  
**Audit Date:** October 2026  
**Auditor:** Senior DevOps & Site Reliability Engineer (SRE)  

---

## 1. Pre-Deployment Readiness Checklist

Before initiating production deployment to `khabridost.com`, verify the following conditions:

- [x] **Source Code Health:** `tsc --noEmit` completes with 0 errors.
- [x] **Build Integrity:** `npm run build` completes without warnings.
- [x] **Light Mode Verification:** Global CSS variables and admin headers confirmed 100% light mode.
- [x] **Typography Assets:** Google Fonts preconnect and Noto Sans Devanagari links confirmed in `index.html`.
- [x] **Crawler Directives:** `server.ts` outputs valid `/robots.txt` and `/news-sitemap.xml`.
- [x] **Mobile Ad Dock Clearance:** `Footer.tsx` bottom offset confirmed at `bottom-[56px] sm:bottom-[60px] md:bottom-0`.
- [x] **Security Rules Audited:** `firestore.rules` enforces role-based access control and atomic view count increments.

---

## 2. Production Environment Variables Checklist

Ensure the production hosting provider (Cloud Run, VPS, or Vercel/Node environment) has configured:

| Variable Name | Environment | Description | Required? |
|:---|:---:|:---|:---:|
| `PORT` | Server | Set to `3000` (or injected by Cloud host) | Yes |
| `NODE_ENV` | Server | Set to `production` | Yes |
| `GEMINI_API_KEY` | Server | Google Gemini API key for newsroom AI Assistant | Optional (Recommended) |
| `VITE_FIREBASE_API_KEY` | Client / Server | Firebase Web API key | When Firebase is connected |
| `VITE_FIREBASE_PROJECT_ID` | Client / Server | Firebase project ID | When Firebase is connected |
| `VITE_FIREBASE_AUTH_DOMAIN`| Client / Server | Firebase Auth domain | When Firebase is connected |

---

## 3. Step-by-Step Deployment Procedure

### Step 1: Install Dependencies
```bash
npm ci --prefer-offline
```

### Step 2: Build Production Frontend Assets
```bash
npm run build
```
This outputs compiled, minified HTML/CSS/JS into the `/dist` directory.

### Step 3: Deploy Firestore Security Rules
```bash
firebase deploy --only firestore:rules
```
Verifies that rules are active before traffic routes to the cluster.

### Step 4: Launch Production Express Server
```bash
npm start
# Equivalent to: node server.ts (or tsx server.ts)
```

---

## 4. Post-Deployment Smoke Testing Runbook

Execute these quick verification steps within 5 minutes of traffic cutover:

1. **Root Health Check:**
   ```bash
   curl -I https://khabridost.com/api/health
   # Expected: HTTP 200 OK
   ```
2. **Robots.txt Directive Check:**
   ```bash
   curl -s https://khabridost.com/robots.txt | grep -E "Disallow: /admin|news-sitemap.xml"
   # Expected: Matches both rules
   ```
3. **Google News Sitemap Validation:**
   ```bash
   curl -s https://khabridost.com/news-sitemap.xml | head -n 10
   # Expected: Valid XML with xmlns:news namespace
   ```
4. **Mobile Navigation & Sticky Ad Test:**
   - Open `https://khabridost.com` on a mobile browser or Chrome DevTools (375px width).
   - Verify that the bottom 5-button dock (`Home`, `Categories`, `Videos`, `E-Paper`, `Menu`) is fully visible and clickable.
   - Verify that the sticky advertisement stays docked above the bottom bar without covering buttons.
5. **Visual Editor Verification:**
   - Access `https://khabridost.com/admin`.
   - Open News Publisher, type text in the visual editor, select and click Bold.
   - Verify that text displays bold in the editor (no `**` Markdown asterisks).
6. **Deep Route Refresh Test:**
   - Navigate to any article: `https://khabridost.com/article/<slug>`.
   - Perform a hard browser refresh (Ctrl+F5 / Cmd+Shift+R).
   - Verify the article reloads instantly without a 404 or white screen.

---

## 5. Emergency Rollback Plan

If unexpected failures occur post-deployment:

### 5.1. Instant Traffic Rollback (Cloud Run / Container / Reverse Proxy)
1. In Cloud Run or Kubernetes, re-route 100% of traffic to the previous known good revision tag:
   ```bash
   gcloud run services update-traffic khabridost-portal --to-revisions=PREVIOUS_REVISION=100
   ```
2. If running via PM2 or Docker on a VPS:
   ```bash
   git checkout tags/v1.0.0-stable
   npm ci
   npm run build
   pm2 restart khabridost-server
   ```

### 5.2. Database & Rules Rollback
If rule changes blocked legitimate editor traffic:
```bash
git checkout HEAD~1 -- firestore.rules
firebase deploy --only firestore:rules
```

---

## 6. Disaster Recovery & Backup Routine

- **Settings & Config Backup:** Newsroom admins can click **Export Configuration** inside the Admin Settings module to download a complete JSON backup of navigation menus, typography tokens, ad slots, and layout preferences.
- **Article Database Backup:** Configure daily Firestore automated exports to a Google Cloud Storage bucket (`gs://khabridost-backups/firestore`).
