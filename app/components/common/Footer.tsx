// app/components/common/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import facebook from '@/public/assets/footer/facebook-app-symbol.png';
import linkedin from '@/public/assets/footer/linkedin-big-logo.png';
import telegram from '@/public/assets/footer/telegram.png';
import whatsapp from '@/public/assets/footer/whatsapp.png';
import youtube from '@/public/assets/footer/youtube.png';
import logo from '@/public/assets/logo/Hitek-Flycam-Logo-5.png';

export default function Footer() {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-greydark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <div className="relative w-32 h-16">
                <Image
                  src={logo}
                  alt="Hitek Flycam Logo"
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t<string>("footer.contact.title")}</h3>
            <ul className="space-y-3">
              <li className="leading-tight">
                <div className="text-white/70 text-sm">
                  <div className="font-medium mb-1">{t<string>("footer.contact.company.name")}</div>
                  <div className="text-white/60">{t<string>("footer.contact.company.hotline")}</div>
                  <div className="text-white/60">{t<string>("footer.contact.company.email")}</div>
                </div>
              </li>
              <li className="leading-tight">
                <div className="text-white/70 text-sm">
                  <div className="font-medium mb-1">{t<string>("footer.contact.ceo.title")}</div>
                  <div className="text-white/60">{t<string>("footer.contact.ceo.hotline")}</div>
                  <div className="text-white/60">{t<string>("footer.contact.ceo.email")}</div>
                </div>
              </li>
              <li className="leading-tight">
                <div className="text-white/70 text-sm">
                  <div className="font-medium mb-1">{t<string>("footer.contact.manager.title")}</div>
                  <div className="text-white/60">{t<string>("footer.contact.manager.hotline")}</div>
                  <div className="text-white/60">{t<string>("footer.contact.manager.email")}</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t<string>("footer.services.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/drone-repair" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.services.items.droneRepair")}
                </Link>
              </li>
              <li>
                <Link href="/services/surveying-drone" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.services.items.surveyingDrone")}
                </Link>
              </li>
              <li>
                <Link href="/services/delivery-drone" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.services.items.deliveryDrone")}
                </Link>
              </li>
              <li>
                <Link href="/services/flight-permit-service" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.services.items.flightPermit")}
                </Link>
              </li>
              <li>
                <Link href="/services/drone-import" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.services.items.droneImport")}
                </Link>
              </li>
              <li>
                <Link href="/services/drone-filming" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.services.items.droneFilming")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t<string>("footer.policy.title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dieu-khoan-chung" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.policy.items.general")}
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.policy.items.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-an-toan-bay" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.policy.items.flightSafety")}
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-xin-phep-bay" className="text-white/70 hover:text-red-500 transition-colors text-sm block py-1">
                  {t<string>("footer.policy.items.flightPermit")}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect with us */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t<string>("footer.connect.title")}</h3>
            <div className="flex gap-3 mb-6">
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image 
                    src={facebook} 
                    alt="Facebook" 
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image 
                    src={whatsapp} 
                    alt="WhatsApp" 
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image 
                    src={youtube} 
                    alt="YouTube" 
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image 
                    src={linkedin} 
                    alt="LinkedIn" 
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <div className="relative w-8 h-8">
                  <Image 
                    src={telegram} 
                    alt="Telegram" 
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/50">
          <p>© {currentYear} {t<string>("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}