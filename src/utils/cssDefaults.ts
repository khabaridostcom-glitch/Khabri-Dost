/**
 * Default CSS Variables defined in :root in src/index.css
 * Used for complete typography resets and admin factory resets.
 */
export const INDEX_CSS_ROOT_VARIABLES: Record<string, string> = {
  '--font-headline': "'Rozha One', 'Noto Serif Devanagari', serif",
  '--font-body': "'Mukta', 'Noto Sans Devanagari', sans-serif",
  '--font-header': "'Rozha One', 'Noto Serif Devanagari', serif",
  '--font-footer': "'Mukta', 'Noto Sans Devanagari', sans-serif",
  '--font-meta': "'Mukta', 'Noto Sans Devanagari', sans-serif",
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
