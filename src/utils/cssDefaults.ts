/**
 * Default CSS Variables defined in :root in src/index.css
 * Used for complete typography resets and admin factory resets.
 */
export const INDEX_CSS_ROOT_VARIABLES: Record<string, string> = {
  '--font-noto-devanagari': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-noto-latin': "'Noto Sans', sans-serif",
  '--font-global': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--weight-global': '400',
  '--line-height-global': '1.6',
  '--letter-spacing-global': '0px',
  '--font-size-desktop-global': '16px',
  '--font-size-mobile-global': '15px',

  '--font-header': "'Rozha One', 'Noto Serif Devanagari', serif",
  '--weight-header': '700',
  '--font-nav': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-homepage': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-homepage-headings': "'Rozha One', 'Noto Serif Devanagari', serif",
  '--font-cards': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-category': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-single-article': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-article-headline': "'Rozha One', 'Noto Serif Devanagari', serif",
  '--weight-article-headline': '700',
  '--font-article-body': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--weight-article-body': '400',
  '--font-article-subheadings': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-article-desc': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-author': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-caption': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-sidebar': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-widget-headings': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-footer': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-legal': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-admin-editor': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",

  '--font-headline': "'Rozha One', 'Noto Serif Devanagari', serif",
  '--font-body': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--font-meta': "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
  '--weight-headline': '700',
  '--weight-body': '400',
  '--scale-font': '1.0',
  '--mobile-scale': '1.0',
  '--base-font-size': '16px',
  '--size-heading-scale': '1',
  '--size-title-scale': '1',
  '--size-content-scale': '1',
  '--size-archive-scale': '1',
  '--size-meta-scale': '1',
  '--size-header-scale': '1',
  '--size-footer-scale': '1',
  '--size-homepage-title-scale': '1',
  '--size-article-title-scale': '1',
  '--size-excerpt-scale': '1',
  '--size-meta-desc-scale': '1',
  '--font-section-heading-size': '20px',
  '--font-hero-title-size': '26px',
  '--font-grid-card-title-size': '16px',
  '--font-grid-card-excerpt-size': '13px',
  '--font-card-meta-size': '11px',
  '--font-nav-link-size': '14px',
  '--font-ticker-size': '13px',
  '--font-article-lead-size': '18px',
  '--font-article-body-size': '17px',
  '--line-height-article-body': '1.75',
  '--font-sidebar-heading-size': '15px',
  '--font-sidebar-item-title': '13px',
  '--font-footer-heading-size': '16px',
  '--font-footer-text-size': '13px',
};

/**
 * Resets all CSS variables on :root (document.documentElement) back to their
 * default values defined in src/index.css.
 */
export function resetRootCssVariablesToDefault(): void {
  if (typeof document === 'undefined' || !document.documentElement) return;
  const root = document.documentElement;
  for (const [key, value] of Object.entries(INDEX_CSS_ROOT_VARIABLES)) {
    root.style.setProperty(key, value);
  }
}
