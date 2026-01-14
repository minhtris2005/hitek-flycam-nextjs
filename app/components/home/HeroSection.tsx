// app/components/home/HeroSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import BgServices from "@/public/assets/home/bg.png";
import LgFlycam from "@/public/assets/logo/camera-drone.png";

export default function HeroSection() {
  const { t } = useLanguage();
  
  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        duration: 1
      }
    }
  };

  return (
    <section className="relative min-h-[60vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={BgServices}
          alt="Drone Services Background"
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto h-full flex flex-col justify-center pt-8 pb-8"
        >
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            className="flex-1 flex flex-col justify-center items-center mb-4"
          >
            <div className="flex flex-col items-center gap-8 mt-16 mb-8">
              <div className="relative w-auto h-auto max-w-[90vw] max-h-[40vh]">
                <Image
                  src={LgFlycam}
                  alt="Hitek Flycam Logo"
                  className="object-contain w-full h-full"
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 60vw"
                />
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-2"
          >
            <Button 
              asChild 
              size="lg" 
              className="text-xl px-12 py-7 rounded-2xl text-white hover:text-white shadow-xl hover:shadow-2xl transition-shadow bg-linear-to-r from-primary to-red-600"
            >
              <Link 
                href="/contact" 
                className="flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                <span className="font-medium">
                  {getString(t("home.servicesPage.servicesHero.cta.contact"))}
                </span>
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}