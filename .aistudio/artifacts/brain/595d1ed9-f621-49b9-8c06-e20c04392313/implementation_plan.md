# Khabri Dost — Master Implementation Plan (Post-Audit Roadmap)

Following the comprehensive 13-part codebase and architectural audit, this implementation plan outlines the prioritized execution roadmap for **Khabri Dost** (`khabridost.com`).

---

## PRIORITY ROADMAP

### [P0] Immediate Critical Tasks

#### P0.1: Sticky Footer Banner Advertisement with Left-Side Controls (Request 9)
- **Goal**: Provide an ad experience that floats sticky across all pages and news reading sessions with Left-Side Close (✕) and Minimize (−/+) controls.
- **Placement**:
  - **Desktop**: Docked at `bottom-0` (`fixed bottom-0 inset-x-0 z-40`), centered container up to `max-w-5xl`.
  - **Mobile**: Docked at `bottom-[56px]` (`fixed bottom-[56px] inset-x-0 z-30`), directly above the 5-item mobile bottom navigation bar (`bottom-0 z-40`) to avoid collision.
- **Controls**:
  - **Close Button (✕)** on the far left: Dismisses the ad banner for the session.
  - **Minimize Button (−/+)** adjacent to the close button: Smoothly collapses the ad to a slim 28px bar with an "Ad / Expand" trigger and re-expands upon click.
- **Ad Content Support**:
  - Image banner (with separate Desktop 728x90 and Mobile 320x50 asset URLs).
  - Custom HTML snippet.
  - Custom AdSense / Third-party script.
- **Target Files**:
  - `src/components/Footer.tsx`: Extract sticky container logic or render sticky overlay.
  - `src/types/news.ts`: Verify `FooterBannerAdConfig`.
  - `src/components/admin/HeaderFooterSettingsTab.tsx`: Confirm admin controls for sticky footer ad.

#### P0.2: Enforce 100% English Language Across Admin Panel Navigation & Tabs
- **Goal**: Convert all admin navigation labels, tab titles, category groups, descriptions, and tooltips in `AdminSettingsModal.tsx` and `AdminBackendPanel.tsx` to 100% clean English.
- **Current Defect**: Strings such as `(सम्पूर्ण सेटिंग्स)`, `(फुटर व पार्टनर)`, `(मोबाइल बॉटम नेविगेशन व फुटर)`, `(मोबाइल साइडबार)`, and `(मीडिया लाइब्रेरी)` must be replaced with English equivalents.
- **Target Files**:
  - `src/components/AdminSettingsModal.tsx`
  - `src/components/AdminBackendPanel.tsx`

---

### [P1] Important Tasks (CMS Parity)

#### P1.1: Header Leaderboard Ad Parity
- **Goal**: Ensure the top header leaderboard slot dynamically renders admin-configured HTML or scripts, with responsive fallback images.
- **Target Files**: `src/components/Header.tsx`, `src/components/admin/AdvertisementTab.tsx`.

#### P1.2: In-Content Article Ad Injections
- **Goal**: Automatically inject `AdSlot` components after paragraphs 2 and 5 in `ArticlePageView.tsx` using `splitArticleContent`.
- **Target Files**: `src/components/ArticlePageView.tsx`.

---

### [P2] Enhancements & Polish

#### P2.1: Navigation Category Order & Visibility Manager
- **Goal**: Allow administrators to reorder category tabs and toggle their visibility on the frontend.
- **Target Files**: `src/components/admin/HeaderFooterSettingsTab.tsx`.

#### P2.2: Breaking News Push Drawer
- **Goal**: Wire the header notification bell to open a slide-over panel displaying the latest alerts and breaking bulletins.
- **Target Files**: `src/components/Header.tsx`.

---

## VERIFICATION CHECKLIST
1. **Compilation**: Run `compile_applet` to ensure zero TypeScript and Vite build regressions.
2. **Desktop Responsiveness**: Test sticky footer banner at 1280px and 1440px; verify left-side close and minimize controls.
3. **Mobile Responsiveness**: Test sticky footer banner at 375px and 390px; verify placement at `bottom-[56px]` above mobile bottom navigation.
4. **Admin Panel Language**: Open Admin Backend Panel and Admin Settings Modal; confirm 100% English labels.
