// Utility to parse or extract clean editorial bullet points (Key Highlights / मुख्य बिंदु)

export function extractArticleHighlights(article: {
  title?: string;
  summary?: string;
  content?: string;
  highlights?: string[];
}): string[] {
  // 1. If explicit highlights exist and are non-empty, prioritize them
  if (Array.isArray(article.highlights) && article.highlights.length > 0) {
    const valid = article.highlights
      .map((h) => (typeof h === 'string' ? h.trim() : ''))
      .filter((h) => h.length > 5);
    if (valid.length > 0) {
      return valid.slice(0, 5);
    }
  }

  // 2. Otherwise, extract 3-4 concise points from summary & content
  const points: string[] = [];
  const added = new Set<string>();

  const cleanText = (raw?: string) => {
    if (!raw) return '';
    return raw
      .replace(/<[^>]*>/g, ' ') // Strip HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const summaryClean = cleanText(article.summary);
  const contentClean = cleanText(article.content);

  // If summary is available, it provides a strong lead highlight
  if (summaryClean && summaryClean.length >= 20) {
    // Check if summary has multiple clauses separated by punctuation
    const subParts = summaryClean
      .split(/[।\.|\n]/)
      .map((p) => p.trim())
      .filter((p) => p.length >= 15 && p.length <= 220);

    for (const part of subParts) {
      if (!added.has(part.toLowerCase())) {
        points.push(part);
        added.add(part.toLowerCase());
      }
      if (points.length >= 2) break;
    }

    if (points.length === 0 && summaryClean.length <= 220) {
      points.push(summaryClean);
      added.add(summaryClean.toLowerCase());
    }
  }

  // Next, extract key sentences from the content
  if (contentClean) {
    const sentences = contentClean
      .split(/[।\.|\n]/)
      .map((s) => s.trim())
      .filter((s) => {
        // Exclude too short or extremely long sentences, or media captions
        if (s.length < 25 || s.length > 200) return false;
        if (s.startsWith('फोटो:') || s.startsWith('चित्र:') || s.startsWith('यह भी पढ़ें:')) return false;
        return true;
      });

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      // Skip if already present in summary or points
      if (!added.has(lower) && !points.some((p) => p.includes(sentence) || sentence.includes(p))) {
        points.push(sentence);
        added.add(lower);
      }
      if (points.length >= 4) break;
    }
  }

  // If still less than 2 points, use title or fallback
  if (points.length === 0 && article.title) {
    points.push(article.title.trim());
  }

  return points.slice(0, 5);
}
