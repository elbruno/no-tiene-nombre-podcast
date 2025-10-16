import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import pageTextsEs from './page-texts.json';
import pageTextsEn from './page-texts-en.json';

type Language = 'es' | 'en';

type PageTexts = typeof pageTextsEs;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  texts: PageTexts;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to Spanish
    const saved = localStorage.getItem('language');
    return (saved === 'es' || saved === 'en') ? saved : 'es';
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('language', language);
  }, [language]);

  const texts = language === 'en' ? pageTextsEn : pageTextsEs;

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, texts }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
