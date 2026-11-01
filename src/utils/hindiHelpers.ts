// Helper utilities for Hindi News Portal

export const HINDI_DAYS = [
  'रविवार',
  'सोमवार',
  'मंगलवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार',
];

export const HINDI_MONTHS = [
  'जनवरी',
  'फ़रवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितम्बर',
  'अक्टूबर',
  'नवंबर',
  'दिसम्बर',
];

export function getTodayHindiDate(): string {
  const now = new Date();
  const dayName = HINDI_DAYS[now.getDay()];
  const dateNum = now.getDate();
  const monthName = HINDI_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  return `${dayName}, ${dateNum} ${monthName} ${year}`;
}

export function formatHindiDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dateNum = d.getDate();
    const monthName = HINDI_MONTHS[d.getMonth()] || '';
    const year = d.getFullYear();
    return `${dateNum} ${monthName} ${year}`;
  } catch {
    return isoString;
  }
}

export function formatHindiTimeAgo(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    if (diffMins < 1) return 'अभी-अभी';
    if (diffMins < 60) return `${diffMins} मिनट पहले`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'कल';
    if (diffDays < 30) return `${diffDays} दिन पहले`;
    return new Date(isoString).toLocaleDateString('hi-IN');
  } catch {
    return 'हाल ही में';
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Speak Hindi text using Web Speech API with rate support
export function speakHindiText(
  text: string,
  onEnd?: () => void,
  options?: {
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onError?: (err: any) => void;
  }
): SpeechSynthesisUtterance | null {
  if (!isSpeechSupported()) {
    console.warn('Speech synthesis is not supported in this browser environment.');
    if (onEnd) onEnd();
    return null;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1;

    // Try to find a Hindi voice, or fallback to Indian English/regional
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(
      (v) => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    if (options?.onStart) {
      utterance.onstart = options.onStart;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = (e) => {
        if (options?.onError) options.onError(e);
        onEnd();
      };
    }

    window.speechSynthesis.speak(utterance);
    return utterance;
  } catch (err) {
    console.warn('Error starting speech synthesis:', err);
    if (onEnd) onEnd();
    return null;
  }
}

export function pauseHindiSpeech() {
  if (isSpeechSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeHindiSpeech() {
  if (isSpeechSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function stopSpeaking() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}

export const stopHindiSpeech = stopSpeaking;

/**
 * Transliterates and slugifies Hindi/Devanagari headlines into clean,
 * Google News-friendly URL slugs (e.g. "kendriya-budget-2026-tax-rahat").
 */
export function slugifyHindiText(text: string): string {
  if (!text || !text.trim()) return '';

  // 1. If the text already has substantial English/Latin words, prioritize them
  const englishWords = text.match(/[a-zA-Z0-9]+/g);
  if (englishWords && englishWords.length >= 3) {
    return englishWords.slice(0, 6).join('-').toLowerCase();
  }

  // 2. Comprehensive Devanagari to Latin phonetic mapping
  const devanagariMap: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
    'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',
    'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h',
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy', 'श्र': 'shr',
    'क़': 'q', 'ख़': 'kh', 'ग़': 'gh', 'ज़': 'z', 'फ़': 'f', 'ड़': 'd', 'ढ़': 'dh',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };

  let transliterated = '';
  const chars = Array.from(text.trim());

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (/[a-zA-Z0-9]/.test(ch)) {
      transliterated += ch.toLowerCase();
    } else if (devanagariMap[ch]) {
      transliterated += devanagariMap[ch];
    } else if (/\s|[-_:,|]/.test(ch)) {
      transliterated += '-';
    }
  }

  // Filter out redundant stop-words common in Hindi titles
  const stopWords = new Set(['ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'par', 'aur', 'hai', 'hain', 'tha', 'thi', 'the']);
  
  const tokens = transliterated
    .split('-')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 1 && !stopWords.has(t));

  const slug = (tokens.length > 0 ? tokens.slice(0, 7).join('-') : 'khabri-dost-news')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug || 'news-story';
}
