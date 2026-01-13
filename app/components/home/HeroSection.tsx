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

export default function ServicesHero() {
  const { t } = useLanguage();
  
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
    <section className="relative min-h-[55vh] md:min-h-[65vh] overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src={BgServices}
      alt="Drone Services Background"
      fill
      className="object-cover"
      priority
      quality={85}
      sizes="100vw"
    />
  </div>

  <div className="container mx-auto px-4 relative z-10 h-full">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto h-full flex flex-col justify-between pt-16 pb-8" 
    >
      {/* Logo và Tiêu đề */}
      <motion.div
        variants={itemVariants}
        className="flex-1 flex flex-col justify-center"
      >
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <Image
              src={LgFlycam}
              alt="Hitek Flycam Logo"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </motion.div>

      {/* CTA Buttons - Thêm wrapper để đẩy lên */}
      <motion.div
        variants={itemVariants}
        className="flex justify-center -mt-10"
      >
        <Button 
          asChild 
          size="lg" 
          className="text-xl text-white px-12 py-7 rounded-2xl shadow-xl"
        >
          <Link href="/lien-he" className="flex items-center justify-center gap-3">
            <Phone className="w-6 h-6" />
            {t<string>("home.servicesPage.servicesHero.cta.contact")}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  </div>
</section>
  );
}