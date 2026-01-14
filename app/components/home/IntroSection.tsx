// app/components/home/IntroSection.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function IntroSection() {
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
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const textVariants: Variants = {
    hidden: { 
      opacity: 0, 
      x: -30,
      y: 10 
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 100,
        duration: 0.7
      }
    }
  };

  const lineVariants: Variants = {
    hidden: { 
      scaleY: 0,
      opacity: 0 
    },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
        duration: 0.8
      }
    }
  };

  const linkVariants: Variants = {
    hidden: { 
      opacity: 0,
      x: -20 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 120,
        duration: 0.6,
        delay: 0.3
      }
    },
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const highlightVariants: Variants = {
    hidden: { 
      opacity: 0.8,
      textShadow: "0 0 0px rgba(var(--primary), 0)" 
    },
    visible: {
      opacity: 1,
      textShadow: [
        "0 0 0px rgba(var(--primary), 0)",
        "0 0 15px rgba(var(--primary), 0.3)", 
        "0 0 5px rgba(var(--primary), 0.1)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  const aboutUrl = "/about";

  return (
    <motion.section 
      className="py-16 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div 
            className="flex"
            variants={textVariants}
          >
            {/* Animated vertical line */}
            <motion.div 
              className="w-1 h-48 bg-primary mr-6 rounded-full"
              variants={lineVariants}
            />
            
            <div>
              <h2 className="text-[38px] leading-10 font-bold text-foreground mb-4">
                {getString(t("home.servicesPage.servicesIntro.left.title"))}
              </h2>
              
              <p className="text-lg text-foreground mb-4">
                {getString(t("home.servicesPage.servicesIntro.left.line1"))}<br />
                {getString(t("home.servicesPage.servicesIntro.left.line2"))}
              </p>
              
              <Link href={aboutUrl}>
                <motion.div 
                  className="flex items-center text-primary font-semibold cursor-pointer"
                  variants={linkVariants}
                  whileHover="hover"
                >
                  {getString(t("home.servicesPage.servicesIntro.left.learnMore"))}
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: 0.5
                    }}
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.span>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Right Column */}
          <div className="space-y-4 text-foreground">
            <p className="leading-relaxed">
              <motion.span 
                className="font-bold text-primary"
                variants={highlightVariants}
                animate="visible"
              >
                {getString(t("home.servicesPage.servicesIntro.right.part1.brand"))}{" "}
              </motion.span>
              {getString(t("home.servicesPage.servicesIntro.right.part1.text1"))}{" "}
              <motion.span 
                className="font-bold text-primary"
                variants={highlightVariants}
                animate="visible"
                style={{ animationDelay: "0.2s" }}
              >
                {getString(t("home.servicesPage.servicesIntro.right.part1.group"))}{" "}
              </motion.span>
              {getString(t("home.servicesPage.servicesIntro.right.part1.text2"))}{" "}
              <motion.span 
                className="font-bold text-primary"
                variants={highlightVariants}
                animate="visible"
                style={{ animationDelay: "0.4s" }}
              >
                {getString(t("home.servicesPage.servicesIntro.right.part1.highlight"))}{" "}
              </motion.span>
              {getString(t("home.servicesPage.servicesIntro.right.part1.text3"))}
            </p>
            
            <p className="leading-relaxed">
              {getString(t("home.servicesPage.servicesIntro.right.part2"))}
            </p>

            {/* Decorative floating elements */}
            <div className="relative">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full"
                  style={{
                    left: `${i * 60}%`,
                    top: "50%",
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}