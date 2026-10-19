/**
 * AI Voice & Multilingual Translation Service for KaaryaMithra
 * Supports Telugu (తెలుగు), Hindi (हिन्दी), English, Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Bengali (বাংলা)
 */

export const SUPPORTED_VOICE_LANGUAGES = [
  { code: 'te', name: 'Telugu', localName: 'తెలుగు', voiceLang: 'te-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', localName: 'हिन्दी', voiceLang: 'hi-IN', flag: '🇮🇳' },
  { code: 'en', name: 'English', localName: 'English', voiceLang: 'en-IN', flag: '🇬🇧' },
  { code: 'ta', name: 'Tamil', localName: 'தமிழ்', voiceLang: 'ta-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', localName: 'ಕನ್ನಡ', voiceLang: 'kn-IN', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', localName: 'বাংলা', voiceLang: 'bn-IN', flag: '🇮🇳' },
];

// Common phrases and trade terms dictionary for natural colloquial translations
const PHRASE_DICTIONARY = {
  // Common service problem descriptions
  'switchboard': {
    te: 'స్విచ్‌బోర్డ్',
    hi: 'स्विचबोर्ड',
    ta: 'சுவிட்ச்போர்டு',
    kn: 'ಸ್ವಿಚ್‌ಬೋರ್ಡ್',
    bn: 'সুইচবোর্ড',
  },
  'air conditioner': {
    te: 'ఏసీ (AC)',
    hi: 'एसी (AC)',
    ta: 'ஏசி (AC)',
    kn: 'ಎಸಿ (AC)',
    bn: 'এসি (AC)',
  },
  'tripping': {
    te: 'ట్రిప్ అవుతోంది',
    hi: 'ट्रिप हो रहा है',
    ta: 'ட்ரிப் ஆகிறது',
    kn: 'ಟ್ರಿಪ್ ಆಗುತ್ತಿದೆ',
    bn: 'ট্রিপ করছে',
  },
  'water leakage': {
    te: 'నీరు కారుతోంది (లీకేజ్)',
    hi: 'पानी का रिसाव (लीकेज)',
    ta: 'தண்ணீர் கசிவு',
    kn: 'ನೀರು ಸೋರಿಕೆ',
    bn: 'জল লিক করছে',
  },
  'bathroom': {
    te: 'బాత్‌రూమ్',
    hi: 'स्नानघर / बाथरूम',
    ta: 'குளியலறை',
    kn: 'ಸ್ನಾನಗೃಹ',
    bn: 'বাথরুম',
  },
  'pipe': {
    te: 'పైపు',
    hi: 'पाइप',
    ta: 'குழாய்',
    kn: 'ಪೈಪ್',
    bn: 'পাইপ',
  },
  'cleaning': {
    te: 'శుభ్రం చేయడం (క్లీనింగ్)',
    hi: 'सफाई',
    ta: 'சுத்தம் செய்தல்',
    kn: 'ಸ್ವಚ್ಛತೆ',
    bn: 'পরিষ্কার করা',
  },
  'kitchen': {
    te: 'వంటగది (కిచెన్)',
    hi: 'रसोईघर',
    ta: 'சமையலறை',
    kn: 'ಅಡುಗೆಮನೆ',
    bn: 'রান্নাঘর',
  },
};

// Known full translation templates for standard notifications
const TEMPLATE_TRANSLATIONS = {
  // Main switchboard tripping
  'main switchboard keeps tripping when air conditioner starts. need inspection of mcb and connection.': {
    te: 'ఎయిర్ కండీషనర్ ప్రారంభించినప్పుడు మెయిన్ స్విచ్‌బోర్డ్ ట్రిప్ అవుతోంది. MCB మరియు కనెక్షన్‌ను తనిఖీ చేసి రిపేర్ చేయాలి.',
    hi: 'एयर कंडीशनर चालू करने पर मेन स्विचबोर्ड ट्रिप हो रहा है। एमसीबी और वायरिंग कनेक्शन की तुरंत जांच और मरम्मत की आवश्यकता है।',
    ta: 'ஏர் கண்டிஷனர் தொடங்கும் போது மெயின் சுவிட்ச்போர்டு ட்ரிப் ஆகிறது. MCB மற்றும் இணைப்பை ஆய்வு செய்து சரிசெய்ய வேண்டும்.',
    kn: 'ಏರ್ ಕಂಡಿಷನರ್ ಪ್ರಾರಂಭವಾದಾಗ ಮುಖ್ಯ ಸ್ವಿಚ್‌ಬೋರ್ಡ್ ಟ್ರಿಪ್ ಆಗುತ್ತಿದೆ. MCB ಮತ್ತು ವೈರಿಂಗ್ ಸಂಪರ್ಕವನ್ನು ಪರಿಶೀಲಿಸಿ ದುರಸ್ತಿ ಮಾಡಬೇಕಾಗಿದೆ.',
    bn: 'এয়ার কন্ডিশনার চালু করলে প্রধান সুইচবোর্ড ট্রিপ করছে। MCB এবং সংযোগ পরিদর্শন ও মেরামত প্রয়োজন।',
  },
  // Deep cleaning
  'complete deep cleaning of modular kitchen and utility wash area before festival.': {
    te: 'పండుగకు ముందు మోడ్యులర్ కిచెన్ మరియు యుటిలిటీ వాష్ ప్రాంతాన్ని పూర్తిగా డీప్ క్లీనింగ్ చేయాలి.',
    hi: 'त्योहार से पहले मॉड्यूलर किचन और वॉश एरिया की पूरी डीप क्लीनिंग (गहरी सफाई) करवानी है।',
    ta: 'பண்டிகைக்கு முன் மாடுலர் கிச்சன் மற்றும் வாஷ் பகுதியை முழுமையாக ஆழமாக சுத்தம் செய்ய வேண்டும்.',
    kn: 'ಹಬ್ಬದ ಮೊದಲು ಮಾಡ್ಯುಲರ್ ಅಡುಗೆಮನೆ ಮತ್ತು ವಾಶ್ ಪ್ರದೇಶವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಬೇಕು.',
    bn: 'উৎসবের আগে মডুলার রান্নাঘর এবং ওয়াশ এরিয়া সম্পূর্ণ ডিপ ক্লিনিং করাতে হবে।',
  },
  // Water leakage
  'water leakage in bathroom concealed cpvc pipe near shower mixer. water dripping onto wall.': {
    te: 'షవర్ మిక్సర్ దగ్గర బాత్‌రూమ్ లోపలి CPVC పైపు నుండి నీరు లీక్ అవుతోంది. గోడపై నీళ్లు కారుతున్నాయి.',
    hi: 'बाथरूम में शॉवर मिक्सर के पास सीपीवीसी पाइप से पानी का रिसाव हो रहा है। दीवार पर पानी टपक रहा है।',
    ta: 'குளியலறையில் ஷவர் மிக்சர் அருகே சிபிவிசி பைப்பில் தண்ணீர் கசிகிறது. சுவரில் தண்ணீர் சொட்டுகிறது.',
    kn: 'ಸ್ನಾನಗೃಹದಲ್ಲಿ ಶವರ್ ಮಿಕ್ಸರ್ ಬಳಿ ಸಿಪಿವಿಸಿ ಪೈಪ್‌ನಿಂದ ನೀರು ಸೋರುತ್ತಿದೆ. ಗೋಡೆಯ ಮೇಲೆ ನೀರು ತೊಟ್ಟಿಕ್ಕುತ್ತಿದೆ.',
    bn: 'বাথরুমে শাওয়ার মিক্সারের কাছে পাইপ থেকে জল লিক করছে। দেওয়ালে জল পড়ছে।',
  },
};

/**
 * Intelligent Multilingual Translator for Notification Messages
 */
export const translateNotificationText = (originalMessage, targetLang, context = {}) => {
  if (!originalMessage) return '';
  if (targetLang === 'en') {
    return originalMessage;
  }

  const cleanKey = originalMessage.trim().toLowerCase();

  // 1. Direct template match
  if (TEMPLATE_TRANSLATIONS[cleanKey] && TEMPLATE_TRANSLATIONS[cleanKey][targetLang]) {
    return TEMPLATE_TRANSLATIONS[cleanKey][targetLang];
  }

  // Check if any template is a substring
  for (const [key, transMap] of Object.entries(TEMPLATE_TRANSLATIONS)) {
    if (cleanKey.includes(key) && transMap[targetLang]) {
      return transMap[targetLang];
    }
  }

  // 2. Synthesize using phrase dictionary and contextual rules
  let translated = originalMessage;

  // Replacements
  for (const [engWord, langMap] of Object.entries(PHRASE_DICTIONARY)) {
    if (langMap[targetLang]) {
      const regex = new RegExp(`\\b${engWord}\\b`, 'gi');
      translated = translated.replace(regex, langMap[targetLang]);
    }
  }

  // Language specific prefixes and framing for natural listening
  if (targetLang === 'te') {
    return `కస్టమర్ విన్నపం: ${translated}. దయచేసి పరిశీలించండి.`;
  }
  if (targetLang === 'hi') {
    return `ग्राहक का अनुरोध: ${translated}। कृपया विवरण देखें।`;
  }
  if (targetLang === 'ta') {
    return `வாடிக்கையாளர் கோரிக்கை: ${translated}. தயவுசெய்து கவனிக்கவும்.`;
  }
  if (targetLang === 'kn') {
    return `ಗ್ರಾಹಕರ ವಿನಂತಿ: ${translated}. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.`;
  }
  if (targetLang === 'bn') {
    return `গ্রাহকের অনুরোধ: ${translated}। অনুগ্রহ করে দেখুন।`;
  }

  return originalMessage;
};

/**
 * Creates full natural spoken script including Customer Name, Locality, Service, and Timing
 */
export const generateSpokenNotificationScript = ({
  customerName = 'Customer',
  locality = '',
  categoryName = 'Service',
  message = '',
  preferredTime = '',
  lang = 'en',
}) => {
  const cleanMessage = message || 'Requires local service assistance';
  const translatedMessage = translateNotificationText(cleanMessage, lang);

  if (lang === 'te') {
    return `నమస్కారం! ${locality ? locality + ' నుండి' : ''} కస్టమర్ ${customerName} గారి కొత్త నోటిఫికేషన్. ${categoryName} సేవ కోసం సంప్రదించారు. సమస్య వివరాలు: ${translatedMessage}. ${preferredTime ? 'కోరిన సమయం: ' + preferredTime + '.' : ''} వివరాలు చూసి యాక్సెప్ట్ చేయగలరు.`;
  }

  if (lang === 'hi') {
    return `नमस्ते! ${locality ? locality + ' से' : ''} ग्राहक ${customerName} की नई सूचना प्राप्त हुई है। ${categoryName} सेवा के लिए अनुरोध किया गया है। समस्या विवरण: ${translatedMessage}। ${preferredTime ? 'पसंदीदा समय: ' + preferredTime + '।' : ''} कृपया विवरण देखकर स्वीकार करें।`;
  }

  if (lang === 'ta') {
    return `வணக்கம்! ${locality ? locality + ' பகுதியிலிருந்து' : ''} வாடிக்கையாளர் ${customerName} அவர்களின் புதிய அறிவிப்பு. ${categoryName} சேவைக்கான கோரிக்கை. விவரம்: ${translatedMessage}. ${preferredTime ? 'விரும்பிய நேரம்: ' + preferredTime + '.' : ''}`;
  }

  if (lang === 'kn') {
    return `ನಮಸ್ಕಾರ! ${locality ? locality + ' ಇಂದ' : ''} ಗ್ರಾಹಕ ${customerName} ಅವರಿಂದ ಹೊಸ ನೋಟಿಫಿಕೇಶನ್ ಬಂದಿದೆ. ${categoryName} ಸೇವೆಗಾಗಿ ಕೋರಲಾಗಿದೆ. ಸಮಸ್ಯೆ ವಿವರ: ${translatedMessage}. ${preferredTime ? 'ಸಮಯ: ' + preferredTime + '.' : ''}`;
  }

  if (lang === 'bn') {
    return `নমস্কার! ${locality ? locality + ' থেকে' : ''} গ্রাহক ${customerName} এর নতুন বিজ্ঞপ্তি। ${categoryName} সেবার জন্য অনুরোধ। সমস্যা: ${translatedMessage}। ${preferredTime ? 'সময়: ' + preferredTime + '।' : ''}`;
  }

  // English default
  return `Hello! New work notification from customer ${customerName}${locality ? ' in ' + locality : ''} for ${categoryName}. Details: ${cleanMessage}. ${preferredTime ? 'Preferred time: ' + preferredTime + '.' : ''}`;
};

/**
 * Global Voice Audio Coordinator
 * Ensures only ONE voice notification plays at any time.
 */
class VoicePlaybackCoordinator {
  constructor() {
    this.activeId = null;
    this.currentUtterance = null;
    this.onStopCallback = null;
  }

  registerActive(id, onStop) {
    if (this.activeId && this.activeId !== id) {
      this.stop();
    }
    this.activeId = id;
    this.onStopCallback = onStop;
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.onStopCallback) {
      try {
        this.onStopCallback();
      } catch (err) {
        // Ignore callback error
      }
    }
    this.activeId = null;
    this.currentUtterance = null;
    this.onStopCallback = null;
  }

  isActive(id) {
    return this.activeId === id;
  }
}

export const globalVoiceCoordinator = new VoicePlaybackCoordinator();

/**
 * Select best available system voice for the given language code
 */
export const getBestVoiceForLanguage = (langCode) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const targetLangConfig = SUPPORTED_VOICE_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_VOICE_LANGUAGES[0];
  const targetPrefix = targetLangConfig.voiceLang.toLowerCase(); // e.g. te-in

  // 1. Exact match e.g. te-IN
  let matched = voices.find((v) => v.lang.toLowerCase() === targetPrefix);
  if (matched) return matched;

  // 2. Starts with language code e.g. te
  matched = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangConfig.code));
  if (matched) return matched;

  // 3. Indian English fallback for Indian context
  matched = voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'));
  if (matched) return matched;

  // 4. Default system voice
  return voices.find((v) => v.default) || voices[0];
};

/**
 * Estimates duration in seconds based on word count and speech rate
 */
export const estimateDurationSeconds = (text, rate = 0.92) => {
  if (!text) return 5;
  const words = text.trim().split(/\s+/).length;
  // Average reading speed ~ 130 words per minute at 1.0 rate
  const wordsPerSecond = (130 / 60) * rate;
  const estimated = Math.ceil(words / wordsPerSecond);
  return Math.max(4, Math.min(estimated, 60)); // Clamp between 4s and 60s
};
