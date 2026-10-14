// Daily Rashifal data with official symbols, ruling planets and daily predictions
export interface ZodiacItem {
  id: string;
  sign: string;
  signEnglish: string;
  symbol: string;
  ruler: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
}

export const OFFICIAL_ZODIAC_LIST: ZodiacItem[] = [
  {
    id: 'aries',
    sign: 'मेष',
    signEnglish: 'Aries',
    symbol: '♈',
    ruler: 'मंगल',
    prediction: 'आज का दिन आपके लिए नई ऊर्जा और सफलता लेकर आएगा। कार्यक्षेत्र में आपकी मेहनत की सराहना होगी और आर्थिक लाभ के योग हैं।',
    luckyNumber: 9,
    luckyColor: 'लाल (Red)',
  },
  {
    id: 'taurus',
    sign: 'वृषभ',
    signEnglish: 'Taurus',
    symbol: '♉',
    ruler: 'शुक्र',
    prediction: 'परिवार में सुख-शांति का माहौल रहेगा। धन संबंधी मामलों में शुभ समाचार मिलेगा। किसी पुराने मित्र से मुलाकात मन प्रसन्न करेगी।',
    luckyNumber: 6,
    luckyColor: 'सफ़ेद (White)',
  },
  {
    id: 'gemini',
    sign: 'मिथुन',
    signEnglish: 'Gemini',
    symbol: '♊',
    ruler: 'बुध',
    prediction: 'संवाद और व्यापार के लिए उत्तम दिन है। नए काम की शुरुआत से लाभ होगा। स्वास्थ्य का थोड़ा ध्यान रखें और तनाव से बचें।',
    luckyNumber: 5,
    luckyColor: 'हरा (Green)',
  },
  {
    id: 'cancer',
    sign: 'कर्क',
    signEnglish: 'Cancer',
    symbol: '♋',
    ruler: 'चंद्रमा',
    prediction: 'मानसिक शांति मिलेगी और रचनात्मक कार्यों में मन लगेगा। पारिवारिक सहयोग से कठिन कार्य भी आसानी से पूरे होंगे।',
    luckyNumber: 2,
    luckyColor: 'चांदी/सफ़ेद (Silver)',
  },
  {
    id: 'leo',
    sign: 'सिंह',
    signEnglish: 'Leo',
    symbol: '♌',
    ruler: 'सूर्य',
    prediction: 'नेतृत्व क्षमता में वृद्धि होगी। समाज में मान-सम्मान बढ़ेगा। उच्च अधिकारियों से सहयोग मिलेगा और आर्थिक स्थिति मजबूत होगी।',
    luckyNumber: 1,
    luckyColor: 'सुनहरा/केसरिया (Gold)',
  },
  {
    id: 'virgo',
    sign: 'कन्या',
    signEnglish: 'Virgo',
    symbol: '♍',
    ruler: 'बुध',
    prediction: 'बुद्धि और सूझबूझ से लिए गए फैसले लाभकारी साबित होंगे। व्यापार में मुनाफा और विद्यार्थियों के लिए अध्ययन में सफलता के योग हैं।',
    luckyNumber: 5,
    luckyColor: 'हल्का हरा (Light Green)',
  },
  {
    id: 'libra',
    sign: 'तुला',
    signEnglish: 'Libra',
    symbol: '♎',
    ruler: 'शुक्र',
    prediction: 'जीवन में संतुलन और खुशहाली का अनुभव होगा। नए अनुबंध या साझेदारी में लाभ हो सकता है। जीवनसाथी का भरपूर सहयोग मिलेगा।',
    luckyNumber: 7,
    luckyColor: 'गुलाबी (Pink)',
  },
  {
    id: 'scorpio',
    sign: 'वृश्चिक',
    signEnglish: 'Scorpio',
    symbol: '♏',
    ruler: 'मंगल',
    prediction: 'आत्मविश्वास में जबरदस्त बढ़ोतरी होगी। लंबे समय से रुका हुआ काम गति पकड़ेगा। गुप्त शत्रुओं से सावधान रहें और वाणी पर संयम रखें।',
    luckyNumber: 8,
    luckyColor: 'गहरा लाल (Maroon)',
  },
  {
    id: 'sagittarius',
    sign: 'धनु',
    signEnglish: 'Sagittarius',
    symbol: '♐',
    ruler: 'गुरु',
    prediction: 'धार्मिक और आध्यात्मिक गतिविधियों में रुचि बढ़ेगी। यात्रा के योग बन रहे हैं जो लाभकारी रहेंगे। घर में मांगलिक कार्य संभव हैं।',
    luckyNumber: 3,
    luckyColor: 'पीला (Yellow)',
  },
  {
    id: 'capricorn',
    sign: 'मकर',
    signEnglish: 'Capricorn',
    symbol: '♑',
    ruler: 'शनि',
    prediction: 'मेहनत का पूरा फल मिलेगा। करियर में पदोन्नति या नए अवसर प्राप्त हो सकते हैं। फिजूलखर्ची से बचें और बजट का ध्यान रखें।',
    luckyNumber: 4,
    luckyColor: 'नीला (Navy Blue)',
  },
  {
    id: 'aquarius',
    sign: 'कुंभ',
    signEnglish: 'Aquarius',
    symbol: '♒',
    ruler: 'शनि',
    prediction: 'सामाजिक दायरे में विस्तार होगा। नए विचारों पर काम करने के लिए बेहतरीन समय है। मित्रों की मदद से महत्वपूर्ण कार्य संपन्न होंगे।',
    luckyNumber: 11,
    luckyColor: 'आसमानी (Sky Blue)',
  },
  {
    id: 'pisces',
    sign: 'मीन',
    signEnglish: 'Pisces',
    symbol: '♓',
    ruler: 'गुरु',
    prediction: 'सकारात्मक सोच से हर समस्या का समाधान मिलेगा। निवेश से अच्छा लाभ होने की संभावना है। बड़ों का आशीर्वाद साथ रहेगा।',
    luckyNumber: 12,
    luckyColor: 'हल्दी पीला (Golden Yellow)',
  },
];

/**
 * Generates dynamic daily variations so horoscope rotates and feels fresh every morning!
 */
export function getDailyDynamicRashifal(dateStr?: string): ZodiacItem[] {
  const d = dateStr ? new Date(dateStr) : new Date();
  const daySeed = d.getDate() + d.getMonth() * 31;

  const dynamicPhrases = [
    'आज भाग्य का पूरा साथ मिलेगा और रुके हुए कार्य पूरे होंगे।',
    'आर्थिक मामलों में सकारात्मक परिणाम और सुखद समाचार प्राप्त होंगे।',
    'कार्यक्षेत्र में नई जिम्मेदारियां और मान-सम्मान में वृद्धि होगी।',
    'पारिवारिक जीवन में मधुरता और पुराने विवाद सुलझने के योग हैं।',
    'व्यापार में नए ग्राहक और अप्रत्याशित धन लाभ की संभावना है।',
    'आत्मविश्वास चरम पर रहेगा और महत्वपूर्ण निर्णय सही साबित होंगे।',
  ];

  return OFFICIAL_ZODIAC_LIST.map((item, idx) => {
    const phraseIndex = (daySeed + idx) % dynamicPhrases.length;
    return {
      ...item,
      prediction: `${item.prediction} ${dynamicPhrases[phraseIndex]}`,
      luckyNumber: ((item.luckyNumber + daySeed) % 9) + 1,
    };
  });
}
