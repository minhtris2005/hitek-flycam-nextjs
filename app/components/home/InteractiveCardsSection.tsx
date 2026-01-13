// app/components/home/InteractiveCardsSection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Import images
import image1 from "@/public/assets/bg_cut/flycam1.jpg";
import image2 from "@/public/assets/bg_cut/flycam2.jpg";
import image3 from "@/public/assets/bg_cut/flycam3.jpg";
import image4 from "@/public/assets/bg_cut/flycam4.jpg";
import image5 from "@/public/assets/bg_cut/flycam5.jpg";
import image6 from "@/public/assets/bg_cut/flycam6.jpg";

const serviceRoutes = {
  repair: "/services/drone-repair",
  surveying: "/services/surveying-drone",
  delivery: "/services/delivery-drone",
  flightPermit: "/services/flight-permit-service",
  droneImport: "/services/drone-import",
  droneFilming: "/services/drone-filming",
};

const serviceCards = [
  { 
    key: "repair" as const, 
    title: "01", 
    image: image1,
    namePath: "home.servicesCards.cards.repair.name",
    detailPath: "home.servicesCards.cards.repair.detail"
  },
  { 
    key: "surveying" as const, 
    title: "02", 
    image: image2,
    namePath: "home.servicesCards.cards.surveying.name",
    detailPath: "home.servicesCards.cards.surveying.detail"
  },
  { 
    key: "delivery" as const, 
    title: "03", 
    image: image3,
    namePath: "home.servicesCards.cards.delivery.name",
    detailPath: "home.servicesCards.cards.delivery.detail"
  },
  { 
    key: "flightPermit" as const, 
    title: "04", 
    image: image4,
    namePath: "home.servicesCards.cards.flightPermit.name",
    detailPath: "home.servicesCards.cards.flightPermit.detail"
  },
  {
    key: "droneImport" as const,
    title: "05",
    image: image5,
    namePath: "home.servicesCards.cards.droneImport.name",
    detailPath: "home.servicesCards.cards.droneImport.detail"
  },
  {
    key: "droneFilming" as const,
    title: "06",
    image: image6,
    namePath: "home.servicesCards.cards.droneFilming.name",
    detailPath: "home.servicesCards.cards.droneFilming.detail"
  },
] as const;

interface InteractiveCardsSectionProps {
  showTitle?: boolean;
}

export default function InteractiveCardsSection({ showTitle = true }: InteractiveCardsSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-greywhite">
      <div className="container mx-auto px-4">
        {showTitle && (
          <h2 className="pb-3 text-3xl md:text-4xl lg:text-7xl font-bold text-center mb-12
            text-vibrant-red drop-shadow-lg leading-[1.2]"
          >
            {t<string>("home.servicesCards.sectionTitle")}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-1">
          {serviceCards.map((card) => (
            <div
              key={card.key}
              className="relative group overflow-hidden rounded-xl
                h-112.5 md:h-125 lg:h-137.5 cursor-pointer"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={t<string>(card.namePath)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

              {/* Default content */}
              <div
                className="relative h-full flex flex-col justify-end p-6
                  transition-all duration-500
                  group-hover:opacity-0 group-hover:translate-y-4"
              >
                <div>
                  <h3 className="text-white font-bold text-6xl mb-3 h-18 flex items-center">
                    {card.title}
                  </h3>
                  <p className="text-white text-2xl font-bold mb-4 line-clamp-2 h-16 flex items-center">
                    {t<string>(card.namePath)}
                  </p>
                  <div className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover content */}
              <div
                className="absolute inset-0 p-6 flex flex-col justify-end
                  opacity-0 translate-y-10
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-500"
              >
                <div className="relative z-10 space-y-4">
                  <div>
                    <h3 className="text-white font-bold text-6xl mb-3 h-18 flex items-center">
                      {card.title}
                    </h3>
                    <p className="text-white text-2xl font-bold mb-2 line-clamp-2 h-14 flex items-center">
                      {t<string>(card.namePath)}
                    </p>
                    <p className="text-white text-sm mb-6 leading-relaxed">
                      {t<string>(card.detailPath)}
                    </p>
                  </div>

                  <Link
                    href={serviceRoutes[card.key]}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="bg-white text-red-600 font-semibold
                        py-3 px-6 rounded-lg w-full
                        flex items-center justify-between
                        transition-all duration-300
                        hover:bg-gray-100 hover:scale-105"
                      type="button"
                    >
                      <span>{t<string>("home.servicesCards.cta.learnMore")}</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </Link>
                </div>

                {/* Red overlay on hover */}
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}