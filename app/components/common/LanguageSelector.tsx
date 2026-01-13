// app/components/common/LanguageSelector.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/contexts/LanguageContext";

const languages = [
  { code: "vi" as const, name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en" as const, name: "English", flag: "🇺🇸" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage(); // Xóa t vì không dùng
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(l => l.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode: "vi" | "en") => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Chọn ngôn ngữ"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">{currentLanguage.flag} {currentLanguage.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            {languages.map((languageItem) => (
              <button
                key={languageItem.code}
                onClick={() => handleLanguageSelect(languageItem.code)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                  language === languageItem.code 
                    ? "bg-red-50 text-red-600 font-semibold" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={`Chọn ${languageItem.name}`}
              >
                <span className="text-lg">{languageItem.flag}</span>
                <span className="text-sm">{languageItem.name}</span>
                {language === languageItem.code && (
                  <span className="ml-auto text-red-600">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}