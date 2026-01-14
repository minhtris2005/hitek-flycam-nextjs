// app/components/about/AboutSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import hero2 from "@/public/assets/about_us/team.png";
import { useLanguage } from "@/app/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();
  
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aboutData = t("about.AboutSection") as any;
  
  const title = aboutData?.title || {};
  const paragraphs = aboutData?.paragraphs || [];

  return (
    <motion.section 
      className="py-20 bg-greywhite"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              {getString(title.prefix)}{" "}
              <span className="text-primary relative">
                {getString(title.highlight)}
                <span className="absolute -bottom-1 left-0 h-1 bg-primary w-full" />
              </span>
            </h2>
            
            <div className="space-y-4 text-pure-black">
              {/* Paragraph 1 - Chữ Hitek Flycam phải highlight đỏ */}
              <p className="leading-relaxed text-foreground">
                <span className="text-primary font-bold"> {/* Sửa từ text-vibrant-red thành text-primary */}
                  {getString(title.highlight)}{" "}
                </span>
                {getString(paragraphs[0])}
              </p>
              
              {/* Paragraph 2 - Giữ nguyên */}
              <p className="leading-relaxed text-foreground">
                {getString(paragraphs[1])}
              </p>
            </div>
          </div>

          {/* Image Content */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={hero2}
                alt="Đội ngũ Hitek Flycam - Chuyên gia drone"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;