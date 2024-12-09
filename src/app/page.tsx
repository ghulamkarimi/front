"use client"

import HeroCards from "@/components/cards/HeroCards";
import HomeCarouselHero from "@/components/carousel/HomeCarouselHero";
import dynamic from "next/dynamic";

// Dynamisches Laden der OfferCards-Komponente
const OfferCards = dynamic(() => import("@/components/offer/OfferCards"), {
  ssr: false, // Verhindert serverseitiges Rendern
});

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center h-[700px]"
        style={{ backgroundImage: "url('/homeBackground.jpg')" }}
      ></div>

      <div className="relative z-10 flex flex-col items-center pt-16">
        <h1 className="text-xl text-orange-500 lg:text-4xl font-bold text-center">
          <span>Herzlich willkommen</span>
          <br />
          <span>bei Ihrem Partner rund ums Auto</span>
          <br />
          <span>A & O</span>
        </h1>

        <div className="relative flex justify-center">
          <HeroCards />
        </div>
      </div>

      {/* Dynamisch geladene OfferCards */}
      <OfferCards />

      <div className="relative z-10 w-full">
        <HomeCarouselHero />
      </div>
    </div>
  );
}
