// app/components/home/DetailedServicesSection.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import tech from '@/public/assets/services/icon2/tech.png';
import group from '@/public/assets/services/icon2/group.png';
import app from '@/public/assets/services/icon2/app.png';
import security from '@/public/assets/services/icon2/security.png';
import engineer from '@/public/assets/services/icon2/engineer.png';
import fix from '@/public/assets/services/icon2/fix.png';

interface ServiceItem {
  title: string;
  description: string;
}

export default function DetailedServicesSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const serviceItems = t<ServiceItem[]>("home.servicesPage.detailedServices.services");
  
  const serviceIcons = [tech, engineer, fix, security, group, app];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.7
      }
    }
  };

   return (
    <section ref={ref} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t<string>("home.servicesPage.detailedServices.title")}
            <span className="text-primary ml-2">
              {t<string>("home.servicesPage.detailedServices.highlight")}
            </span>
            {t<string>("home.servicesPage.detailedServices.question")}
          </h2>
          <p className="text-lg text-muted-foreground mx-auto">
            {t<string>("home.servicesPage.detailedServices.subtitle")}
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {serviceItems.map((service: ServiceItem, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group"
            >
              <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border h-full">
                {/* Icon với hiệu ứng */}
                <motion.div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-linear-to-br from-primary/10 to-primary/5"
                >
                  <motion.div 
                    className="relative w-16 h-16"
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image 
                      src={serviceIcons[index]} 
                      alt={service.title}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </motion.div>
                </motion.div>
                
                {/* Title */}
                <motion.h3 
                  className="text-2xl font-bold mb-4 text-foreground"
                >
                  {service.title}
                </motion.h3>
                
                {/* Description */}
                <motion.p 
                  className="text-muted-foreground mb-6 leading-relaxed"
                >
                  {service.description}
                </motion.p>
                
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -z-10 top-0 right-0 w-24 h-24 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Additional decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link href="/gioi-thieu">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold py-6 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t<string>("home.servicesPage.detailedServices.cta.learnMore")}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}