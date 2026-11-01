import React from 'react';

/**
 * Safely renders a headline with an editorial highlight accent phrase,
 * inspired by classical Indian newspaper typography (e.g. leading phrase in bold red/orange).
 * Retains complete semantic accessibility and SEO text integrity.
 */
export function renderStyledHeadline(
  title: string,
  highlightPhrase?: string,
  highlightColor?: string,
  defaultAccentColor = '#dc2626'
): React.ReactNode {
  if (!title) return null;
  if (!highlightPhrase || !highlightPhrase.trim()) {
    return title;
  }

  const cleanHighlight = highlightPhrase.trim();
  const accentColor = highlightColor || defaultAccentColor;

  const lowerTitle = title.toLowerCase();
  const lowerHighlight = cleanHighlight.toLowerCase();

  // Case 1: Highlight phrase starts the title
  if (lowerTitle.startsWith(lowerHighlight)) {
    const matchedPart = title.slice(0, cleanHighlight.length);
    const remainingPart = title.slice(cleanHighlight.length);

    return (
      <span className="[overflow-wrap:anywhere] [word-break:normal]">
        <span
          style={{ color: accentColor }}
          className="font-black drop-shadow-2xs inline mr-1 [overflow-wrap:anywhere] [word-break:normal]"
        >
          {matchedPart}
        </span>
        <span className="[overflow-wrap:anywhere] [word-break:normal]">{remainingPart}</span>
      </span>
    );
  }

  // Case 2: Highlight phrase is somewhere inside the title
  const matchIndex = lowerTitle.indexOf(lowerHighlight);
  if (matchIndex !== -1) {
    const before = title.slice(0, matchIndex);
    const matched = title.slice(matchIndex, matchIndex + cleanHighlight.length);
    const after = title.slice(matchIndex + cleanHighlight.length);

    return (
      <span className="[overflow-wrap:anywhere] [word-break:normal]">
        {before && <span className="[overflow-wrap:anywhere] [word-break:normal]">{before}</span>}
        <span
          style={{ color: accentColor }}
          className="font-black drop-shadow-2xs inline mx-0.5 [overflow-wrap:anywhere] [word-break:normal]"
        >
          {matched}
        </span>
        {after && <span className="[overflow-wrap:anywhere] [word-break:normal]">{after}</span>}
      </span>
    );
  }

  // Case 3: Highlight phrase is a standalone kicker / prefix tag (e.g. "सरकार का फैसला:")
  return (
    <span className="[overflow-wrap:anywhere] [word-break:normal]">
      <span
        style={{ color: accentColor }}
        className="font-black drop-shadow-2xs inline mr-1.5 [overflow-wrap:anywhere] [word-break:normal]"
      >
        {cleanHighlight}:
      </span>
      <span className="[overflow-wrap:anywhere] [word-break:normal]">{title}</span>
    </span>
  );
}
