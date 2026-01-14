// app/components/common/Header.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import LanguageSelector from "@/app/components/common/LanguageSelector";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import logo_light from "@/public/assets/logo/logo_light.png";

const services = [
  { name: "nav.services.droneRepair", path: "/services/drone-repair" },
  { name: "nav.services.surveyingDrone", path: "/services/surveying-drone" },
  { name: "nav.services.deliveryDrone", path: "/services/delivery-drone" },
  { name: "nav.services.flightPermit", path: "/services/flight-permit" },
  { name: "nav.services.droneImport", path: "/services/drone-import" },
  { name: "nav.services.droneFilming", path: "/services/drone-filming" },
];

export default function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function để lấy string từ translation
  const getString = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : String(value || key);
  };

  // Hàm scroll lên đầu trang
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
    setIsMobileServicesOpen(false);
  }, []);

  // ----- SCROLL EFFECT -----
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ----- CLICK OUTSIDE DROPDOWN -----
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ----- HOVER HANDLERS -----
  const handleMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setIsServicesOpen(true);
  };

  const handleMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    };
  }, []);

  // ----- NAVIGATION LINKS -----
  const navLinks = [
    { name: getString('nav.home'), href: "/", onClick: scrollToTop },
    { name: getString('nav.about'), href: "/about", onClick: scrollToTop }, // Đổi thành /about
    { name: getString('nav.services.title'), href: "/services", hasDropdown: true, onClick: scrollToTop }, // Đổi thành /services
    { name: getString('nav.document'), href: "/documents", onClick: scrollToTop }, // Đổi thành /documents
    { name: getString('nav.blog'), href: "/blog", onClick: scrollToTop },
    { name: getString('nav.contact'), href: "/contact", onClick: scrollToTop }, // Thêm contact nếu cần
  ];

  // ----- RENDER SERVICES DROPDOWN -----
  const renderServicesDropdown = () => (
    <motion.div 
      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {services.map((service) => (
        <Link
          key={service.path}
          href={service.path}
          className="block px-4 py-3 text-gray-800 hover:text-red-600 hover:bg-gray-100 transition-colors"
          onClick={scrollToTop}
        >
          {getString(service.name)}
        </Link>
      ))}
    </motion.div>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${isScrolled ? "shadow-lg" : ""}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" onClick={scrollToTop} className="flex items-center gap-3">
              <div className="relative w-16 h-16 lg:w-18 lg:h-18">
                <Image
                  src={logo_light}
                  alt="Hitek Flycam Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 64px, 72px"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative"
                onMouseEnter={link.hasDropdown ? handleMouseEnter : undefined}
                onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
                ref={link.hasDropdown ? servicesDropdownRef : null}
              >
                {link.hasDropdown ? (
                  <div className="flex items-center cursor-pointer">
                    <Link
                      href={link.href}
                      className="text-gray-800 hover:text-red-600 transition-colors font-medium"
                      onClick={link.onClick}
                    >
                      {link.name}
                    </Link>
                    <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                    <AnimatePresence>
                      {isServicesOpen && renderServicesDropdown()}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="text-gray-800 hover:text-red-600 transition-colors font-medium"
                    onClick={link.onClick}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSelector />
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-800 h-9 w-9"
                aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-4 space-y-1 border-t border-gray-200">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown ? (
                      <div className="space-y-1">
                        <button
                          onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                          className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-800 hover:text-red-600 hover:bg-gray-100 transition-colors"
                          aria-expanded={isMobileServicesOpen}
                        >
                          <span className="font-medium">{link.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isMobileServicesOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isMobileServicesOpen && (
                          <motion.div 
                            className="space-y-1"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {services.map((service) => (
                              <Link
                                key={service.path}
                                href={service.path}
                                className="block px-8 py-2 text-sm text-gray-800 hover:text-red-600 hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                  scrollToTop();
                                  setIsMobileServicesOpen(false);
                                }}
                              >
                                {getString(service.name)}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block px-4 py-3 text-gray-800 hover:text-red-600 hover:bg-gray-100 transition-colors font-medium"
                        onClick={scrollToTop}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Hotline Mobile */}
                <div className="px-4 py-3 mt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Phone className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hotline hỗ trợ 24/7</p>
                      <div className="font-bold text-sm text-red-600">
                        <div>028 99 95 95 88</div>
                        <div>034 612 4230</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}