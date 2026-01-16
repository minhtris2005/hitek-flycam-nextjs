"use client";

import { Phone, Mail, MapPin, Facebook, Linkedin, Youtube, Instagram, PhoneCall } from "lucide-react";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Xóa interface ContactInfoProps hoàn toàn
const ContactInfo = () => { // Không cần parameter
  const { t } = useLanguage();

  const contactItems = [
    {
      icon: Phone,
      title: t("contact.info.contactItems.phone.title") as string,
      details: [
        { label: t("contact.info.contactItems.phone.hotline") as string, value: t("contact.info.contactItems.phone.hotlineValue") as string },
        { label: t("contact.info.contactItems.phone.mobile") as string, value: t("contact.info.contactItems.phone.mobileValue") as string }
      ]
    },
    {
      icon: Mail,
      title: t("contact.info.contactItems.email.title") as string,
      details: [
        { label: t("contact.info.contactItems.email.info") as string, value: t("contact.info.contactItems.email.infoValue") as string },
        { label: t("contact.info.contactItems.email.support") as string, value: t("contact.info.contactItems.email.supportValue") as string }
      ]
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      name: t("contact.info.social.facebook") as string,
      url: "https://facebook.com/hitekflycam",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Linkedin,
      name: t("contact.info.social.linkedin") as string,
      url: "https://linkedin.com/company/hitekflycam",
      color: "bg-blue-700 hover:bg-blue-800"
    },
    {
      icon: Youtube,
      name: t("contact.info.social.youtube") as string,
      url: "https://youtube.com/@hitekflycam",
      color: "bg-red-500 hover:bg-red-600"
    },
    {
      icon: PhoneCall,
      name: t("contact.info.social.whatsapp") as string,
      url: "https://t.me/hitekflycam",
      color: "bg-blue-400 hover:bg-blue-500"
    },
    {
      icon: Instagram,
      name: t("contact.info.social.instagram") as string,
      url: "https://instagram.com/hitekflycam",
      color: "bg-pink-500 hover:bg-pink-600"
    }
  ];

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Compact Contact Information */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {t("contact.info.title") as string}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactItems.map((item, index) => (
            <div key={index} className="bg-linear-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {item.title}
                </h3>
              </div>
              
              <div className="space-y-3">
                {item.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {detail.label}:
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Section - More Compact */}
      <div className="bg-linear-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-primary">
            {t("contact.info.social.title") as string}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {socialLinks.map((social, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center h-20 rounded-lg hover:scale-105 transition-all duration-300 bg-white border border-gray-200 hover:border-primary/30 hover:shadow-sm"
              onClick={() => handleSocialClick(social.url)}
              aria-label={`Follow us on ${social.name}`}
            >
              <div className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center mb-1`}>
                <social.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-foreground">
                {social.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Map - More Compact */}
      <div className="rounded-xl overflow-hidden h-64">
        <div className="relative h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.026905683275!2d106.66160506142168!3d10.809251108541229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293ccc17367d%3A0x776e13bbfa8a0eef!2zSEFJIEFVIEJVSUxESU5HLCAzOUIgVHLGsOG7nW5nIFPGoW4sIFBoxrDhu51uZyAyLCBUw6JuIELDrG5oLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1764823019547!5m2!1svi!2s"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 border-0"
            title="Hitek Flycam Location"
          />
          
          {/* Map Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-white/80 to-transparent pointer-events-none"></div>
          
          {/* Location Info */}
          <div className="absolute top-3 left-80 right-4">
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-primary" />
                <span className="text-gray-700">{t("contact.info.map.location") as string}</span>
              </div>
              <a 
                href="https://maps.google.com/?q=HAI+AU+BUILDING,+39B+Trường+Sơn,+Phường+2,+Tân+Bình,+Hồ+Chí+Minh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-xs font-medium"
              >
                {t("contact.info.map.directions") as string}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;