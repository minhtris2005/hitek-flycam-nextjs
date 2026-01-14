// app/components/home/IconServicesSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import repair from '@/public/assets/services/icon1/repair.png';
import map from '@/public/assets/services/icon1/map.png';
import delivery from '@/public/assets/services/icon1/delivery.png';
import listence from '@/public/assets/services/icon1/listence.png';
import buy from '@/public/assets/services/icon1/buy.png';
import camera from '@/public/assets/services/icon1/camera.png';

interface Service {
  title: string;
  description: string;
}

export default function IconServicesSection() {
  const { t } = useLanguage();
  const router = useRouter();

  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to safely get array
  const getArray = <T,>(value: unknown): T[] => {
    if (Array.isArray(value)) return value as T[];
    return [];
  };

  const services: Service[] = getArray(t("home.services"));

  const iconServices = [
    { icon: repair, label: services[0]?.title || "", path: "/services/drone-repair" },
    { icon: map, label: services[1]?.title || "", path: "/services/surveying-drone" },
    { icon: delivery, label: services[2]?.title || "", path: "/services/delivery-drone" },
    { icon: listence, label: services[3]?.title || "", path: "/services/flight-permit" }, // Updated path
    { icon: buy, label: services[4]?.title || "", path: "/services/drone-import" },
    { icon: camera, label: services[5]?.title || "", path: "/services/drone-filming" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      scale: 0.95,
      filter: "blur(3px)"
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.5
      }
    }
  };

  const handleServiceClick = (path: string) => {
    router.push(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.section
      className="py-12 bg-greywhite"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {iconServices.map((service, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
              onClick={() => handleServiceClick(service.path)}
              type="button"
              aria-label={`Navigate to ${service.label} service`}
            >
              <div className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-gray-200 shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-200 w-full h-full">
                {/* Icon container with glow effect */}
                <div className="relative mb-3">
                  {/* Glow effect background */}
                  <motion.div 
                    className="absolute inset-0 bg-primary/10 rounded-full blur-sm"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.15
                    }}
                  />
                  
                  {/* Main icon */}
                  <motion.div
                    className="relative w-12 h-12 rounded-full bg-linear-to-br from-card to-card/50 flex items-center justify-center"
                  >
                    <div className="relative w-10 h-10">
                      <Image 
                        src={service.icon} 
                        alt={service.label}
                        fill
                        className="object-contain p-1"
                        sizes="40px"
                      />
                    </div>
                    
                    {/* Floating particles */}
                    {[...Array(2)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        style={{
                          left: `${Math.cos((i * 180) * Math.PI / 180) * 16 + 8}px`,
                          top: `${Math.sin((i * 180) * Math.PI / 180) * 16 + 8}px`,
                        }}
                        animate={{
                          scale: [0, 0.8, 0],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2 + index * 0.08,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Label */}
                <motion.p 
                  className="text-center font-medium text-card-foreground text-sm leading-tight"
                  initial={{ opacity: 0.6 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.04, duration: 0.3 }}
                >
                  {getString(service.label)}
                </motion.p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}