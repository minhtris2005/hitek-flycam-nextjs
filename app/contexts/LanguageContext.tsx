// app/contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useLayoutEffect } from 'react';

// Import translation files
import viTranslations from '@/app/locales/vi.json';

type Language = 'vi' | 'en';

// Define recursive type for translations
type TranslationValue = 
  | string 
  | number 
  | boolean 
  | { [key: string]: TranslationValue } 
  | TranslationValue[];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: <T = unknown>(key: string) => T;
}

// For now, only Vietnamese translations
const translations: Record<Language, TranslationValue> = {
  vi: viTranslations as TranslationValue,
  en: viTranslations as TranslationValue, // Temporarily use Vietnamese for English
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Initialize state with default value
  const [language, setLanguage] = useState<Language>(() => {
    // Check if we're on client side
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'vi' || savedLanguage === 'en')) {
        return savedLanguage;
      }
    }
    return 'vi'; // default
  });

  // Save language preference to localStorage whenever it changes
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  const t = <T = unknown>(key: string): T => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && !Array.isArray(value) && k in value) {
        value = (value as { [key: string]: TranslationValue })[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key as unknown as T;
      }
    }
    
    return value as T;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};