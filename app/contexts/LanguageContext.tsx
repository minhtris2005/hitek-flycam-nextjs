// app/contexts/LanguageContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useLayoutEffect } from 'react';

// Import translation files
import viTranslations from '@/app/locales/vi.json';
import enTranslations from '@/app/locales/en.json';

type Language = 'vi' | 'en';

// Define specific types for translation data
type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
type TranslationData = { [key: string]: JsonValue };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => JsonValue;
}

// Import both translations
const translations: Record<Language, TranslationData> = {
  vi: viTranslations as TranslationData,
  en: enTranslations as TranslationData,
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
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'vi' || browserLang === 'en') {
        return browserLang as Language;
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

  const t = (key: string): JsonValue => {
    const keys = key.split('.');
    let value: JsonValue = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value !== null && !Array.isArray(value) && k in value) {
        value = (value as TranslationData)[k];
      } else {
        console.warn(`Translation key not found: ${key} for language ${language}`);
        // Fallback to Vietnamese if key not found
        if (language === 'en') {
          let viValue: JsonValue = translations.vi;
          for (const k of keys) {
            if (viValue && typeof viValue === 'object' && viValue !== null && !Array.isArray(viValue) && k in viValue) {
              viValue = (viValue as TranslationData)[k];
            } else {
              return key; // Return key if not found in any language
            }
          }
          return viValue;
        }
        return key; // Return key if not found
      }
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};