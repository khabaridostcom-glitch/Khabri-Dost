# Noto Sans Font Library & SIL Open Font License 1.1

## Project
- **Application**: Khabri Dost News Portal
- **Primary Font Family**: Noto Sans Devanagari
- **Secondary / Latin Font Family**: Noto Sans
- **License**: SIL Open Font License (OFL) Version 1.1
- **Copyright**: (c) The Noto Project Authors (https://github.com/notofonts/devanagari)

---

## Supported Font Families and Weights

### 1. Noto Sans Devanagari (Hindi, Devanagari Script, Numerals, Punctuation)
Supported Weights (100 - 900):
- **100 Thin** (`font-weight: 100`)
- **200 ExtraLight** (`font-weight: 200`)
- **300 Light** (`font-weight: 300`)
- **400 Regular** (`font-weight: 400`) — Standard body & paragraph reading
- **500 Medium** (`font-weight: 500`) — Captions, author names, badges
- **600 SemiBold** (`font-weight: 600`) — Sub-headlines, card titles
- **700 Bold** (`font-weight: 700`) — Major article headlines, H1/H2
- **800 ExtraBold** (`font-weight: 800`) — Hero banners, breaking news ticker
- **900 Black** (`font-weight: 900`) — Heavy editorial display text

### 2. Noto Sans (Latin / English / Numbers)
Supported Weights (100 - 900) & Italic Styles:
- Regular & Italic for weights 100 through 900.
- Optimized for mixed Hindi-English headlines, acronyms (ISRO, NASA, GDP, AI), URL slugs, and publication dates.

---

## Recommended Fallback Font Stack

```css
font-family: 'Noto Sans Devanagari', 'Noto Sans', system-ui, -apple-system, sans-serif;
```

---

## Loading Strategy
- Preconnect enabled for Google Fonts CDN (`https://fonts.googleapis.com` and `https://fonts.gstatic.com` with `crossorigin`).
- CSS `font-display: swap` to prevent FOIT (Flash of Invisible Text) and eliminate Cumulative Layout Shift (CLS).
- Responsive root scaling via CSS variables (`--scale-font`, `--size-heading-scale`, `--size-content-scale`).
