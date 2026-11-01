import { EPaperSettings } from '../types/news';
import { EPaperEditionRecord, ResolvedEPaperMode } from '../types/epaper';

/**
 * Returns the current date in Asia/Kolkata timezone in YYYY-MM-DD format
 */
export function getKolkataDateString(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/**
 * Formats a YYYY-MM-DD date into Hindi newspaper date string (e.g. "बुधवार, 21 अक्टूबर, 2026")
 */
export function formatHindiNewspaperDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d, 6, 0, 0));
    const weekdaysHindi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const monthsHindi = [
      'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
    ];
    const weekday = weekdaysHindi[dateObj.getUTCDay()];
    const day = dateObj.getUTCDate();
    const month = monthsHindi[dateObj.getUTCMonth()];
    const year = dateObj.getUTCFullYear();
    return `${weekday}, ${day} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Pure PDF Edition Resolver:
 * Finds the published PDF edition matching date and editionCode.
 * If found and valid, returns PDF mode.
 * If not found, returns not_available mode.
 * (No article-card fallbacks)
 */
export function resolveEPaperEdition(
  targetDate: string,
  editionCode: string = 'national',
  settings?: EPaperSettings
): ResolvedEPaperMode {
  const editions = (settings?.editionsList || []).filter((e) => e.status !== 'draft');

  // 1. Exact match by date & editionCode
  let matched = editions.find(
    (ed) => ed.date === targetDate && ed.editionCode === editionCode
  );

  // 2. Fallback to any published edition on that date if requested region is missing
  if (!matched) {
    matched = editions.find((ed) => ed.date === targetDate);
  }

  // 3. Fallback to main customPdfUrl if targetDate matches customPdfDate
  const defaultPdfDate = settings?.customPdfDate || getKolkataDateString();
  const mainPdfUrl = settings?.customPdfUrl;

  if (!matched && mainPdfUrl && (targetDate === defaultPdfDate || editions.length === 0)) {
    const defaultPages = settings?.customPdfPageCount || 15;
    matched = {
      id: `edition_${editionCode}_${targetDate}`,
      date: targetDate,
      editionName: settings?.customPdfEdition || 'राष्ट्रीय संस्करण (नई दिल्ली)',
      editionCode: editionCode,
      pdfUrl: mainPdfUrl,
      pdfFileName: mainPdfUrl.split('/').pop() || 'Dainik_KhabriDost.pdf',
      pdfFileSize: '28.6 MB',
      pageCount: defaultPages,
      status: 'published',
      allowDownload: settings?.allowDownload !== false,
      allowPrint: settings?.allowPrint !== false,
      price: settings?.price || '₹ 4.50',
      issueNumber: settings?.issueNumber || 'वर्ष 1 • अंक 245',
    };
  }

  // If a valid PDF edition was resolved
  if (matched && matched.pdfUrl && matched.pdfUrl.trim() !== '') {
    return {
      type: 'pdf',
      edition: matched,
      pdfUrl: matched.pdfUrl,
      totalPages: matched.pageCount || settings?.customPdfPageCount || 15,
      dateString: formatHindiNewspaperDate(matched.date || targetDate),
    };
  }

  // No PDF edition available for the date
  return {
    type: 'not_available',
    date: targetDate,
    message: `${formatHindiNewspaperDate(targetDate)} के लिए कोई ई-पेपर PDF संस्करण उपलब्ध नहीं है। कृपया नवीनतम या अन्य दिनांक का चयन करें।`,
  };
}
