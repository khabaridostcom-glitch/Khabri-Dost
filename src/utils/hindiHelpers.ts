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
