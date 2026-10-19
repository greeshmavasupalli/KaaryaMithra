import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  RotateCcw,
  Search,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from 'lucide-react';

// Operational Knowledge Base for KaaryaMithra
const KNOWLEDGE_TOPICS = [
  {
    id: 'hire_worker',
    title: 'How do I find & hire a worker?',
    keywords: ['find', 'hire', 'book', 'search', 'worker', 'services', 'electrician', 'plumber', 'cleaner', 'kaise khoje', 'dhoodhe', 'vetakandi'],
    answer: {
      en: 'To hire a skilled worker on KaaryaMithra:\n1. Use the search bar on Home or go to "Find Workers".\n2. Filter by service category (e.g. Electrician, Plumber) and locality/neighborhood (e.g. MVP Colony, Visakhapatnam).\n3. Check their honest trust badges, indicative pricing, and experience.\n4. Click "Send Enquiry" to submit your service request, preferred date, and notes.\n5. Once the worker accepts, you can communicate directly via protected chat or phone!',
      hi: 'कार्यमित्र पर कुशल कारीगर खोजने के लिए:\n1. होम पेज पर सर्च बार का उपयोग करें या "कारीगर खोजें" पर जाएं।\n2. सेवा श्रेणी (जैसे इलेक्ट्रीशियन, प्लंबर) और अपने इलाके/शहर द्वारा फ़िल्टर करें।\n3. कारीगर के वास्तविक ट्रस्ट बैज और मूल्य सीमा की जांच करें।\n4. "सीधी पूछताछ भेजें" पर क्लिक करके अपनी आवश्यकता बताएं।\n5. कारीगर द्वारा अनुरोध स्वीकार करने के बाद आपसी संपर्क विवरण साझा हो जाएंगे!',
      te: 'కార్యమిత్రలో నైపుణ్యం కలిగిన పనివారిని కనుగొనడానికి:\n1. హోమ్ పేజీలో శోధన పట్టీని ఉపయోగించండి లేదా "పనివారలను వెతకండి" పై క్లిక్ చేయండి.\n2. సేవా విభాగం (ఉదా. ఎలక్ట్రీషియన్, ప్లంబర్) మరియు మీ ప్రాంతాన్ని ఎంచుకోండి.\n3. వారి నిజాయితీ ట్రస్ట్ బ్యాడ్జ్‌లు మరియు పని వివరాలను పరిశీలించండి.\n4. "విచారణ పంపండి" పై క్లిక్ చేసి మీ అవసరాన్ని నమోదు చేయండి.\n5. పనివారు మీ అభ్యర్థనను ఆమోదించిన తర్వాత ఫోన్ వివరాలు వెల్లడవుతాయి!',
    },
    actions: [
      { label: '🔍 Search Workers', path: '/search' },
      { label: '🛠️ View Categories', path: '/services' },
    ],
  },
  {
    id: 'phone_privacy',
    title: 'Why is worker phone number hidden?',
    keywords: ['phone', 'number', 'hide', 'hidden', 'private', 'privacy', 'contact', 'call', 'number kyu', 'ph no'],
    answer: {
      en: 'KaaryaMithra operates with strict Mutual Privacy Safeguards:\n• We NEVER publicly display phone numbers on open search cards or search engines to prevent spam, harassment, and unsolicited marketing.\n• Direct contact details are securely unlocked ONLY after the worker reviews and explicitly accepts your service enquiry.\n• Both parties retain complete peace of mind and control.',
      hi: 'कार्यमित्र सख्त गोपनीयता और सुरक्षा नियमों का पालन करता है:\n• स्पैम और अवांछित कॉलों से कारीगरों को बचाने के लिए फोन नंबर सार्वजनिक रूप से नहीं दिखाए जाते।\n• फोन नंबर केवल तभी अनलॉक होता है जब कारीगर आपकी पूछताछ की समीक्षा करके उसे स्वीकार करता है।\n• इससे ग्राहक और कारीगर दोनों की निजता सुरक्षित रहती है।',
      te: 'కార్యమిత్ర కఠినమైన గోప్యతా రక్షణను పాటిస్తుంది:\n• అవాంఛిత కాల్స్ మరియు స్పామ్ నుండి రక్షించడానికి ఫోన్ నంబర్లు బహిరంగంగా కనిపించవు.\n• పనివారు మీ విచారణను పరిశీలించి ఆమోదించిన తర్వాత మాత్రమే వారి సంప్రదింపు వివరాలు అందుబాటులోకి వస్తాయి.\n• ఇది ఇరువర్గాల భద్రత మరియు గోప్యతను నిర్ధారిస్తుంది.',
    },
    actions: [
      { label: '🛡️ Safety & Privacy Policy', path: '/safety-and-privacy' },
    ],
  },
  {
    id: 'fees_commission',
    title: 'Are there any platform fees or commissions?',
    keywords: ['fee', 'fees', 'commission', 'cost', 'charge', 'free', 'price', 'percentage', 'paisa', 'charges', 'commissions'],
    answer: {
      en: 'Zero (0%) Platform Fees!\n• KaaryaMithra is 100% free for informal workers and tradespeople.\n• Workers are NEVER charged commission cuts, listing fees, or lead unlocking charges.\n• Customers negotiate and pay wages directly to the worker without middleman markups.',
      hi: 'शून्य (0%) कमीशन नीति!\n• कार्यमित्र अनौपचारिक कारीगरों और सेवा प्रदाताओं के लिए पूरी तरह मुफ़्त है।\n• कारीगरों से कोई कमीशन, लिस्टिंग शुल्क या लीड शुल्क नहीं लिया जाता।\n• ग्राहक और कारीगर बिना किसी बिचौलिये के सीधे पारिश्रमिक तय करते हैं।',
      te: 'సున్నా (0%) ప్లాట్‌ఫారమ్ రుసుము!\n• కార్యమిత్ర శ్రామికులు మరియు వృత్తి నిపుణులకు 100% ఉచితం.\n• ఎటువంటి కమీషన్, జాబితా రుసుము లేదా లీడ్ ఛార్జీలు తీసుకోబడవు.\n• కస్టమర్లు నేరుగా పనివారితో మాట్లాడి ధర నిర్ణయించుకోవచ్చు.',
    },
  },
  {
    id: 'worker_join',
    title: 'How do workers join & register?',
    keywords: ['join', 'worker', 'register', 'sign up', 'profile', 'work', 'electrician join', 'plumber join', 'kaise jude', 'account banaye'],
    answer: {
      en: 'Joining KaaryaMithra as an informal worker is simple and fast:\n1. Click "Join as a Worker" or "Sign Up" and choose the "Worker" role.\n2. Enter your name, primary skill (e.g. Electrician, Carpenter), phone number, and locality.\n3. Verify your phone using the prototype OTP (use code 123456).\n4. In your Worker Dashboard, set your service radius (in km), indicative price range, and toggle your availability (Available / Busy).',
      hi: 'कार्यमित्र पर कारीगर के रूप में जुड़ना बहुत सरल है:\n1. "कारीगर के रूप में जुड़ें" या "पंजीकरण" पर क्लिक करें और "कारीगर" विकल्प चुनें।\n2. अपना नाम, मुख्य हुनर (जैसे प्लंबर, बढ़ई), फोन नंबर और इलाका दर्ज करें।\n3. प्रोटोटाइप ओटीपी (कोड 123456) से फोन सत्यापित करें।\n4. अपने वर्कर डैशबोर्ड में सर्विस रेडियस, मूल्य सीमा और उपलब्धता (Available / Busy) सेट करें।',
      te: 'కార్యమిత్రలో శ్రామికుడిగా చేరడం చాలా సులభం:\n1. "పనివారిగా చేరండి" లేదా "రిజిస్టర్" క్లిక్ చేసి "శ్రామికుడు/వర్కర్" ఎంచుకోండి.\n2. మీ పేరు, వృత్తి నైపుణ్యం, ఫోన్ నంబర్ మరియు ప్రాంతాన్ని నమోదు చేయండి.\n3. డెమో OTP కోడ్ (123456) తో ఫోన్ ధృవీకరించండి.\n4. మీ వర్కర్ డ్యాష్‌బోర్డ్‌లో ధర పరిధి, కిలోమీటర్ల పరిధి మరియు లభ్యతను సెట్ చేసుకోండి.',
    },
    actions: [
      { label: '💼 Join as Worker', path: '/join' },
      { label: '📝 Create Account', path: '/register' },
    ],
  },
  {
    id: 'trust_badges',
    title: 'What do the Trust Badges mean?',
    keywords: ['badge', 'trust', 'verified', 'evidence', 'reference', 'check', 'certified', 'proof', 'safeguard', 'vishwas'],
    answer: {
      en: 'KaaryaMithra prohibits fabricated marketing claims (e.g. "certified master" or "background checked"). Instead, we offer 3 honest, factual trust badges:\n1. 📱 Phone confirmed: The worker controls this listed mobile number (verified via OTP).\n2. 👥 Community reference added: Verified references provided by local neighbors or repeat customers.\n3. 📄 Skill evidence submitted: Real photos of tools, workshops, or past completed jobs submitted for plausibility.',
      hi: 'कार्यमित्र झूठे दावों (जैसे "प्रमाणित मास्टर" या "पुलिस सत्यापित") को प्रतिबंधित करता है। हम केवल 3 वास्तविक और पारदर्शी ट्रस्ट बैज प्रदान करते हैं:\n1. 📱 फोन पुष्ट: कारीगर के पास इस मोबाइल नंबर का सीधा नियंत्रण है (ओटीपी द्वारा सत्यापित)।\n2. 👥 स्थानीय संदर्भ संलग्न: पड़ोसियों या पुराने ग्राहकों द्वारा दिए गए संपर्क संदर्भ।\n3. 📄 हुनर प्रमाण जमा: औजारों या पिछले कार्य के वास्तविक नमूने।',
      te: 'కార్యమిత్ర తప్పుడు ప్రచారాలను (ఉదా. "సర్టిఫైడ్ మాస్టర్" లేదా "పోలీస్ వెరిఫైడ్") అనుమతించదు. కేవలం 3 వాస్తవిక ట్రస్ట్ బ్యాడ్జ్‌లను అందిస్తుంది:\n1. 📱 ఫోన్ ధృవీకరించబడింది: ఈ నంబర్‌పై శ్రామికుడికి నియంత్రణ ఉంది (OTP ద్వారా ధృవీకరించబడింది).\n2. 👥 స్థానిక సిఫార్సు జోడించబడింది: స్థానిక నివాసితులు ఇచ్చిన పని సిఫార్సు.\n3. 📄 నైపుణ్య ఆధారాలు: పనిముట్లు లేదా పనుల ఫోటో ఆధారాలు.',
    },
  },
  {
    id: 'demo_mode',
    title: 'How do I test Demo Mode & Roles?',
    keywords: ['demo', 'role', 'switch', 'reviewer', 'admin', 'customer', 'ananya', 'ramesh', 'lakshmi', 'password', 'login', 'credentials', 'otp'],
    answer: {
      en: 'KaaryaMithra includes a persistent One-Click Demo Mode Bar at the top of every screen:\n• Customer Demo: Click "Try as Customer" to log in as Ananya.\n• Worker Demo: Click "Try as Worker" to experience Ramesh (Electrician) and test accepting enquiries & setting availability.\n• Admin Demo: Click "Try as Admin" to view the Moderation Portal & audit logs.\n\n🔑 Manual Credentials:\n• Admin: admin@skilldost.demo / admin123\n• Customer: ananya.customer@skilldost.demo / demo123\n• Worker: ramesh.electrician@skilldost.demo / demo123\n• Simulated OTP Code: 123456',
      hi: 'कार्यमित्र में स्क्रीन के शीर्ष पर एक-क्लिक डेमो मोड बार उपलब्ध है:\n• ग्राहक डेमो: अनन्या के रूप में लॉगिन करने के लिए "Try as Customer" पर क्लिक करें।\n• कारीगर डेमो: रमेश (इलेक्ट्रीशियन) के रूप में डैशबोर्ड आजमाने के लिए "Try as Worker" दबाएं।\n• एडमिन डेमो: मॉडरेशन पोर्टल देखने के लिए "Try as Admin" चुनें।\n• प्रोटोटाइप ओटीपी: 123456',
      te: 'కార్యమిత్రలో ప్రతి పేజీ పైభాగంలో వన్-క్లిక్ డెమో మోడ్ బార్ ఉంది:\n• కస్టమర్ డెమో: అనన్యగా లాగిన్ అవ్వడానికి "Try as Customer" క్లిక్ చేయండి.\n• వర్కర్ డెమో: రమేష్ (ఎలక్ట్రీషియన్) డ్యాష్‌బోర్డ్ చూడటానికి "Try as Worker" క్లిక్ చేయండి.\n• అడ్మిన్ డెమో: మోడరేషన్ పోర్టల్ కోసం "Try as Admin" నొక్కండి.\n• డెమో OTP కోడ్: 123456',
    },
  },
  {
    id: 'reports_safety',
    title: 'How do I report an issue or fake listing?',
    keywords: ['report', 'complaint', 'fraud', 'fake', 'abuse', 'issue', 'problem', 'shikayat', 'block'],
    answer: {
      en: 'To keep the community safe and trustworthy:\n1. On any worker profile card or review, click the "Report Listing" flag button.\n2. Choose the reason (e.g. Inaccurate details, Unprofessional conduct, Suspicious profile).\n3. Provide optional context notes and submit.\n4. The report instantly enters the Moderator Triage Queue where platform admins review, investigate, or suspend the profile.',
      hi: 'समुदाय को सुरक्षित रखने के लिए:\n1. किसी भी कारीगर प्रोफाइल या समीक्षा पर "रिपोर्ट करें" बटन पर क्लिक करें।\n2. कारण चुनें (जैसे गलत जानकारी, संदिग्ध प्रोफाइल)।\n3. विवरण दर्ज करें और सबमिट करें। एडमिन तुरंत जांच करके आवश्यक कार्रवाई करेंगे।',
      te: 'భద్రత కోసం:\n1. ఏదైనా ప్రొఫైల్‌పై "రిపోర్ట్ చేయండి" బటన్ క్లిక్ చేయండి.\n2. కారణాన్ని ఎంచుకుని వివరాలు సమర్పించండి. అడ్మిన్ పరిశీలించి తగిన చర్యలు తీసుకుంటారు.',
    },
    actions: [
      { label: '🛡️ Moderation Portal (Admin)', path: '/admin' },
    ],
  },
  {
    id: 'languages',
    title: 'How do I change the website language?',
    keywords: ['language', 'hindi', 'telugu', 'english', 'bhasha', 'translate', 'te', 'hi', 'en'],
    answer: {
      en: 'You can change the language anytime!\n• Click the Globe icon (🌐) on the top right navigation bar.\n• Choose between English, हिन्दी (Hindi), and తెలుగు (Telugu).\n• All headings, search placeholders, trust badges, and navigation will automatically switch.',
      hi: 'आप कभी भी भाषा बदल सकते हैं!\n• शीर्ष नेविगेशन बार में ग्लोब आइकन (🌐) पर क्लिक करें।\n• English, हिन्दी, या తెలుగు चुनें। पूरा इंटरफ़ेस तुरंत बदल जाएगा।',
      te: 'మీరు ఎప్పుడైనా భాషను మార్చుకోవచ్చు!\n• కుడివైపు పైభాగంలో ఉన్న గ్లోబ్ (🌐) చిహ్నాన్ని క్లిక్ చేయండి.\n• ఇంగ్లీష్, హిందీ లేదా తెలుగు ఎంచుకోండి.',
    },
  },
];

export const AiAssistantBot = () => {
  const { lang } = useLanguage();
  const { quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  const messagesEndRef = useRef(null);

  // Initialize greeting on first load or language change
  useEffect(() => {
    const greetingText =
      lang === 'te'
        ? 'నమస్కారం! నేను కార్యమిత్ర AI సహాయకుడిని. ఈ వెబ్‌సైట్‌ను ఎలా ఉపయోగించాలో, పనివారలను కనుగొనడం, రిజిస్ట్రేషన్ లేదా డెమో మోడ్ గురించి మీకు ఏవైనా సందేహాలు ఉంటే నన్ను అడగండి.'
        : lang === 'hi'
        ? 'नमस्ते! मैं कार्यमित्र AI सहायक हूँ। इस वेबसाइट के संचालन, कारीगर खोजने, पंजीकरण, या किसी भी अन्य सुविधा के बारे में अपने प्रश्न पूछें।'
        : 'Hello! I am KaaryaMithra AI Sahayak. Ask me anything about operating this platform, hiring local workers, worker onboarding, privacy policies, or demo mode.';

    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTopics: KNOWLEDGE_TOPICS.slice(0, 4),
      },
    ]);
  }, [lang]);

  // Scroll to bottom of message list
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const copyDemoOtp = () => {
    navigator.clipboard.writeText('123456');
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleTopicClick = (topic) => {
    const currentLang = ['hi', 'te'].includes(lang) ? lang : 'en';
    const answerText = topic.answer[currentLang] || topic.answer.en;

    // Add user query
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: topic.title,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: answerText,
        actions: topic.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 450);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim().toLowerCase();
    setInputValue('');

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const matched = findBestAnswer(query, lang);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: matched.text,
        actions: matched.actions,
        suggestedTopics: matched.suggestedTopics,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 550);
  };

  const findBestAnswer = (query, currentLang) => {
    const activeLang = ['hi', 'te'].includes(currentLang) ? currentLang : 'en';

    // Check knowledge topics with scoring
    let bestMatch = null;
    let highestScore = 0;

    for (const topic of KNOWLEDGE_TOPICS) {
      let score = 0;
      for (const kw of topic.keywords) {
        if (query.includes(kw)) score += 2;
      }
      if (topic.title.toLowerCase().includes(query)) score += 3;
      if (score > highestScore) {
        highestScore = score;
        bestMatch = topic;
      }
    }

    if (bestMatch && highestScore >= 2) {
      return {
        text: bestMatch.answer[activeLang] || bestMatch.answer.en,
        actions: bestMatch.actions,
      };
    }

    // Default intelligent conversational response
    if (query.includes('hello') || query.includes('hi') || query.includes('namaste') || query.includes('namaskaram')) {
      return {
        text:
          activeLang === 'te'
            ? 'నమస్కారం! కార్యమిత్ర గురించి మీ సందేహాలను నివృత్తి చేయడానికి నేను సిద్ధంగా ఉన్నాను. క్రింది ప్రముఖ అంశాలలో దేనినైనా ఎంచుకోండి లేదా మీ సందేహాన్ని టైప్ చేయండి.'
            : activeLang === 'hi'
            ? 'नमस्ते! कार्यमित्र के संचालन संबंधी किसी भी प्रश्न का समाधान करने के लिए मैं यहाँ हूँ। आप नीचे दिए गए सुझावों में से चुन सकते हैं या अपना प्रश्न लिख सकते हैं।'
            : 'Hello! I am here to help you navigate and use KaaryaMithra seamlessly. You can ask about hiring, registration, pricing, trust badges, or demo roles.',
        suggestedTopics: KNOWLEDGE_TOPICS.slice(0, 3),
      };
    }

    // Fallback guidance with topic chips
    return {
      text:
        activeLang === 'te'
          ? 'కార్యమిత్ర అనేది స్థానిక శ్రామికులను ఇళ్లతో నేరుగా కలిపే ఉచిత వేదిక. మీ ప్రశ్నకు సహాయపడే కొన్ని ప్రధాన అంశాలు ఇక్కడ ఉన్నాయి:'
          : activeLang === 'hi'
          ? 'कार्यमित्र स्थानीय कारीगरों को सीधे परिवारों से जोड़ने वाला एक मुफ़्त मंच है। आपकी सहायता के लिए मुख्य विषय नीचे दिए गए हैं:'
          : 'KaaryaMithra is an inclusive, 0% commission discovery platform for local informal workers and tradespeople. Here are helpful operating topics you can explore:',
      suggestedTopics: KNOWLEDGE_TOPICS.slice(0, 4),
    };
  };

  const resetChat = () => {
    const greetingText =
      lang === 'te'
        ? 'సంభాషణ రీసెట్ చేయబడింది. మీకు ఏ సమాచారం కావాలి?'
        : lang === 'hi'
        ? 'बातचीत रीसेट कर दी गई है। आप क्या जानना चाहते हैं?'
        : 'Chat reset. What would you like to know about operating KaaryaMithra?';

    setMessages([
      {
        id: 'reset',
        sender: 'bot',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedTopics: KNOWLEDGE_TOPICS.slice(0, 4),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle Attention Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white text-teal-800 text-xs font-semibold rounded-full shadow-md border border-teal-200 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Need Help</span>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            id="ai-assistant-toggle-btn"
            aria-label="Open KaaryaMithra AI Assistant"
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400/40 cursor-pointer"
          >
            <Bot className="w-7 h-7 group-hover:rotate-6 transition-transform" />
            {/* Pulsing online status indicator */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col shadow-2xl bg-white border border-slate-200 overflow-hidden ${
            isMinimized
              ? 'bottom-6 right-6 w-72 h-14 rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 text-white px-4 py-3 flex items-center justify-between select-none shadow-xs">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white">KaaryaMithra AI</h3>
                  <span className="text-[10px] bg-teal-800/80 text-teal-200 px-1.5 py-0.2 rounded font-semibold border border-teal-600/50">
                    Sahayak
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-teal-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Doubts & Operations Bot</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center space-x-1 text-slate-300">
              <button
                onClick={resetChat}
                title="Reset conversation"
                className="p-1 hover:text-teal-300 hover:bg-white/10 rounded transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1 hover:text-teal-300 hover:bg-white/10 rounded transition"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1 hover:text-rose-400 hover:bg-white/10 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Demo OTP Bar for Quick Reference */}
          {!isMinimized && (
            <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
              <span>Demo OTP Code: <strong className="text-teal-800 font-mono">123456</strong></span>
              <button
                onClick={copyDemoOtp}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-teal-50 text-teal-700 rounded border border-slate-300 transition text-[10px] font-medium"
              >
                {copiedOtp ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedOtp ? 'Copied' : 'Copy OTP'}</span>
              </button>
            </div>
          )}

          {/* Messages Container */}
          {!isMinimized && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl shadow-xs leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(act.path);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white border border-teal-300 hover:border-teal-600 rounded-lg font-semibold text-[11px] transition shadow-xs cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Suggested Question Chips */}
                    {msg.suggestedTopics && (
                      <div className="space-y-1 pt-1.5">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                          Frequently Asked:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedTopics.map((topic) => (
                            <button
                              key={topic.id}
                              onClick={() => handleTopicClick(topic)}
                              className="px-2.5 py-1 bg-white hover:bg-teal-50 text-teal-700 hover:text-teal-900 border border-slate-200 hover:border-teal-400 rounded-lg text-[11px] font-medium transition text-left shadow-xs cursor-pointer"
                            >
                              {topic.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <span className="text-[9px] text-slate-400 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input Form */}
          {!isMinimized && (
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask any doubt about KaaryaMithra..."
                className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800 placeholder:text-slate-400 transition"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                aria-label="Send query"
                className="p-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};
