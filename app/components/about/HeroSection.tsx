// app/components/about/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Rocket, Users } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import BgAbout from "@/public/assets/about_us/hero.png";
import logo from "@/public/assets/logo/camera-drone.png";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const exploreServicesUrl = "/services";
  const contactUrl = "/contact";

  return (
    <section className="relative h-[90vh] flex flex-col items-center justify-between overflow-hidden">
      {/* Background Image - chất lượng từ file services */}
      <div className="absolute inset-0">
        <Image
          src={BgAbout}
          alt="Hitek Flycam - Drone Technology Background"
          fill
          className="object-cover"
          priority
          quality={85} // GIỮ chất lượng tốt
          sizes="100vw"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center justify-center pb-8 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto text-center w-full"
        >
          {/* Logo Container - GIỮ kích thước tốt */}
          <div className="relative w-full max-w-3xl h-64 md:h-80 lg:h-96 mx-auto mb-8">
            <div className="relative w-full h-full">
              <Image
                src={logo}
                alt="Hitek Flycam Logo"
                fill
                className="object-contain"
                priority
                quality={85} // GIỮ chất lượng tốt
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 w-full mb-16 pb-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="text-xl px-10 py-7 rounded-2xl bg-linear-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <Link 
                href={exploreServicesUrl}
                className="flex items-center justify-center gap-3"
              >
                <Rocket className="w-6 h-6" />
                {getString(t("about.hero.cta.exploreServices")) || "Explore Services"}
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-xl px-10 py-7 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 shadow-2xl"
            >
              <Link 
                href={contactUrl}
                className="flex items-center justify-center gap-3"
              >
                <Users className="w-6 h-6" />
                {getString(t("about.hero.cta.contactCooperation")) || "Contact Us"}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}