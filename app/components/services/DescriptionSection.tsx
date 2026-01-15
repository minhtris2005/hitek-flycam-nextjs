// app/components/services/DescriptionSection.tsx
"use client";

import { useLanguage } from '@/app/contexts/LanguageContext';
import vi from '@/app/locales/vi.json';
import en from '@/app/locales/en.json';

export default function DescriptionSection() {
  const { language } = useLanguage();
  const t = language === 'vi' ? vi : en;
  const { servicesPage } = t;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-black">{servicesPage.title.part1} </span>
              <span className="text-primary">{servicesPage.title.highlight}</span>
            </h1>
            <p className="text-[19px] leading-7 text-gray-700">
              {servicesPage.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}