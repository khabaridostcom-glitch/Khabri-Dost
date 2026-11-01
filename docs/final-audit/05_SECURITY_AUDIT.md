# 05 — CYBERSECURITY & ACCESS CONTROL AUDIT
**Project:** Khabri Dost (khabridost.com)  
**System Type:** Production Digital News Publishing Platform  
**Audit Date:** October 2026  
**Auditor:** Senior Cybersecurity & Cloud Security Specialist  

---

## 1. Security Architecture Summary

Khabri Dost follows a **defense-in-depth** security architecture tailored for high-profile news outlets vulnerable to traffic spikes, defacement attempts, and unauthorized content tampering. The security framework bridges database security rules, backend server isolation, and client-side XSS safeguards.

---

## 2. Firestore Security Rules Audit (`firestore.rules`)

The system implements strict declarative access controls:

### 2.1. Role-Based Access Control (RBAC) Functions
- `isSignedIn()`: Verifies valid Firebase Authentication token (`request.auth != null`).
- `isAdmin()`: Validates admin custom claim or email verified against authorized admin records (`request.auth.token.role == 'admin'`).
- `isEditor()`: Validates editorial publishing privileges.
- `isStaff()`: Validates authenticated newsroom reporters.

### 2.2. Collection Rules Breakdown
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public Read / Restricted Write for News Articles
    match /articles/{articleId} {
      allow read: if true;
      allow create, update: if isSignedIn() && (isAdmin() || isEditor() || isStaff());
      allow delete: if isSignedIn() && isAdmin();
      
      // Atomic increment exception for public view counts
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['viewCount'])
                   && request.resource.data.viewCount == resource.data.viewCount + 1;
    }
    
    // Taxonomy & Categories
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isSignedIn() && (isAdmin() || isEditor());
    }
    
    // Site Configuration & Credentials
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isSignedIn() && isAdmin();
    }
    
    // User Roles & Profiles
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && (request.auth.uid == userId || isAdmin());
    }
    
    // Media Library Assets
    match /media/{mediaId} {
      allow read: if true;
      allow write: if isSignedIn() && (isAdmin() || isEditor() || isStaff());
    }

    // Default Deny Rule for any unmapped path
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2.3. Security Rule Evaluation
- **Zero Anonymous Writes:** Unauthenticated visitors cannot create, update, or delete articles, categories, or settings.
- **Tamper-Resistant View Counts:** The `affectedKeys().hasOnly(['viewCount'])` condition strictly allows incrementing view counts without allowing readers to alter article headlines, body content, or publishing status.
- **Default Deny:** Enforced globally for any unmatched paths.

---

## 3. Client-Side Sanitization & XSS Mitigation

### 3.1. Dangerous HTML Injection Protection
- In `ArticlePageView.tsx` and editorial previewers, user-provided rich content is strictly validated.
- Any raw HTML output undergoes sanitization to strip inline `javascript:`, `<script>` tags, and malicious event handlers (`onerror=`, `onload=`).
- Link tags automatically receive `rel="noopener noreferrer"` attributes to prevent tab-nabbing vulnerabilities.

### 3.2. Form Input Cleansing
- Comment submissions, search queries, and contact form inputs are sanitized, trimming whitespace and encoding HTML entities (`&`, `<`, `>`, `"`, `'`).

---

## 4. API Key Insulation & Credential Management

### 4.1. Server-Side Insulation
- **Gemini AI API Key:** Insulated entirely on the backend in `server.ts`. The client requests `/api/generate-seo`, and the server interacts with `@google/genai` using `process.env.GEMINI_API_KEY`. The private key is never shipped to client JavaScript bundles.
- **Environment Separation:** `.env.example` provides non-secret placeholders. Production runtime variables are injected via server environment variables.

### 4.2. Client-Exposed Firebase Configuration
- The Firebase client configuration (`apiKey`, `authDomain`, `projectId`) contains public connection identifiers designed to be public. Security is completely enforced by Firestore Security Rules rather than key secrecy.

---

## 5. Network, Headers & Transport Security

- **HTTPS Enforcement:** Production deployment enforces TLS 1.3 with automatic HSTS (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).
- **Frame Options:** Dev server and public endpoints are guarded against clickjacking via `X-Frame-Options: SAMEORIGIN`.
- **Content Type Sniffing:** Protected via `X-Content-Type-Options: nosniff`.
- **Referrer Policy:** Configured as `Referrer-Policy: strict-origin-when-cross-origin`.
- **Admin Disallow:** `/admin` and `/api/` are blocked in `robots.txt` to prevent automated search engine bot indexing of administrative forms.

---

## 6. Audit Verdict

| Security Vector | Risk Level | Mitigation Status | Assessment |
|:---|:---:|:---:|:---:|
| **Unauthorized Article Modification** | Critical | Enforced via Firestore Rules + Firebase Auth | **SECURED** |
| **View Count Exploitation** | Medium | Atomic increment diff check | **SECURED** |
| **API Key Leakage (Gemini AI)** | High | Server-side proxy endpoint | **SECURED** |
| **Stored / Reflected XSS** | High | Sanitized HTML rendering engine | **SECURED** |
| **Search Engine Admin Exposure** | Low | Directives in `robots.txt` | **SECURED** |
