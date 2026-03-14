import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    home: 'Home',
    dashboard: 'Dashboard',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    adminPanel: 'Admin Panel',
    adminLogout: 'Admin Logout',
    navSubtitle: 'AI-Powered Scheme Navigator',

    // Hero Section
    heroParagraph: "Not sure which government scheme you qualify for? SarkarSetu AI scans your profile to find the best matching schemes and explains them in simple language.",
    checkEligibility: 'Setup Profile & Check Eligibility',
    viewMySchemes: 'View My Schemes',
    browseAllSchemes: 'Browse All Schemes',

    // Stats
    beneficiaries: 'Beneficiaries Covered',
    schemes: 'Government Schemes',
    accuracy: 'Matching Accuracy',

    // How It Works
    howItWorks: 'How It Works?',
    howItWorksSub: 'Discover which government schemes you are eligible for in just 3 simple steps',
    step1Title: 'Tell Us About You',
    step1Desc: 'Fill a simple form with your age, income, state, and category.',
    step2Title: 'AI Matches Schemes',
    step2Desc: 'Our engine scans 100+ schemes and finds the best matches for you.',
    step3Title: 'Apply Instantly',
    step3Desc: 'Get AI-explained scheme details and apply directly to government portals.',

    // CTA
    ctaHeading: 'Check Your Eligibility Today! 🚀',
    ctaSub: 'Free • No Registration • Instant AI Results',
    startNow: "Start Now — It's Free!",
    goToDashboard: 'Go to Dashboard',

    // Footer
    footerText: "SarkarSetu AI — Every Citizen's Right",
    adminAccess: 'Admin Access',

    // Chatbot
    botGreeting: 'Hello! 🙏 I am SarkarSetu AI. You can ask me about any government scheme.',
    botPlaceholder: 'Ask anything about schemes...',
    botError: 'Sorry, the service is currently unavailable. Please try again later.',
    botTitle: 'SarkarSetu AI',
    botSubtitle: 'Scheme Assistant • Online',
  },
  hi: {
    // Navbar
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    register: 'रजिस्टर करें',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    adminPanel: 'एडमिन पैनल',
    adminLogout: 'एडमिन लॉगआउट',
    navSubtitle: 'AI-संचालित योजना मार्गदर्शक',

    // Hero Section
    heroParagraph: 'कौन सी सरकारी योजना आपके लिए है, पता नहीं? SarkarSetu AI आपकी प्रोफ़ाइल को स्कैन करके सबसे उपयुक्त योजनाएं ढूंढता है और आसान भाषा में समझाता है।',
    checkEligibility: 'प्रोफ़ाइल बनाएं और पात्रता जांचें',
    viewMySchemes: 'मेरी योजनाएं देखें',
    browseAllSchemes: 'सभी योजनाएं देखें',

    // Stats
    beneficiaries: 'लाभार्थी कवर किए गए',
    schemes: 'सरकारी योजनाएं',
    accuracy: 'मिलान सटीकता',

    // How It Works
    howItWorks: 'यह कैसे काम करता है?',
    howItWorksSub: 'सिर्फ 3 आसान चरणों में जानें कि आप किस योजना के पात्र हैं',
    step1Title: 'हमें अपने बारे में बताएं',
    step1Desc: 'अपनी उम्र, आय, राज्य और श्रेणी के साथ एक सरल फॉर्म भरें।',
    step2Title: 'AI योजनाएं मिलाता है',
    step2Desc: 'हमारा इंजन 100+ योजनाओं को स्कैन करके आपके लिए सर्वोत्तम मिलान ढूंढता है।',
    step3Title: 'तुरंत आवेदन करें',
    step3Desc: 'AI-व्याख्यायित योजना विवरण प्राप्त करें और सीधे सरकारी पोर्टल पर आवेदन करें।',

    // CTA
    ctaHeading: 'आज ही अपनी पात्रता जांचें! 🚀',
    ctaSub: 'मुफ्त • कोई पंजीकरण नहीं • तत्काल AI परिणाम',
    startNow: 'अभी शुरू करें — बिल्कुल मुफ्त!',
    goToDashboard: 'डैशबोर्ड पर जाएं',

    // Footer
    footerText: 'SarkarSetu AI — हर नागरिक का अधिकार',
    adminAccess: 'एडमिन एक्सेस',

    // Chatbot
    botGreeting: 'नमस्ते! 🙏 मैं SarkarSetu AI हूँ। आप किसी भी सरकारी योजना के बारे में पूछ सकते हैं।',
    botPlaceholder: 'किसी भी योजना के बारे में पूछें...',
    botError: 'माफ़ कीजिए, अभी सर्विस उपलब्ध नहीं है। थोड़ी देर बाद प्रयास करें।',
    botTitle: 'SarkarSetu AI',
    botSubtitle: 'योजना सहायक • ऑनलाइन',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
