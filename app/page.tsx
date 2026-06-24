"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gauge, MapPin, Gavel } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import HeroSection from "@/components/HeroSection";
import StatsRow from "@/components/StatsRow";
import ProcessSection from "@/components/ProcessSection";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  const [activeNav, setActiveNav] = useState("how-it-works");

  const handleNavClick = (section: string) => {
    setActiveNav(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar activeNav={activeNav} onNavClick={handleNavClick} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection onHowItWorksClick={() => handleNavClick("how-it-works")} />

        {/* Stats Row */}
        <StatsRow />

        {/* Engineered for Efficiency Section */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 bg-white">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Engineered for Efficiency</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed font-semibold">
              MuniFix Ctg uses advanced tracking and verification to ensure every report reaches the right department immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              variant="teal"
              title="Fast Response"
              description="Automated routing directs your complaints directly to the relevant municipal officer, reducing bureaucratic delays by up to 60%."
              icon={<Gauge className="w-6 h-6 text-white" />}
            />
            <FeatureCard
              variant="blue"
              title="Real-time Tracking"
              description="Follow your report from submission to resolution with live status updates and notifications."
              icon={<MapPin className="w-6 h-6 text-blue-600" />}
            />
            <FeatureCard
              variant="orange"
              title="Transparent Governance"
              description="Every resolution is publicly verifiable, ensuring accountability and building trust within our community."
              icon={<Gavel className="w-6 h-6 text-[#7c2d12]" />}
            />
            <FeatureCard
              variant="white"
              title="Verified Impact"
              description="Photos and geolocation data ensure that reports are accurate, preventing spam and prioritizing urgent fixes like open manholes."
              className="md:col-span-2"
            >
              <div className="relative w-full max-w-[240px] aspect-[4/3] sm:aspect-square md:aspect-[4/3] shrink-0 self-end overflow-hidden mt-6 sm:mt-0">
                <Image
                  src="/phone-mockup.png"
                  alt="Citizen App Interface Preview"
                  fill
                  className="object-contain object-bottom sm:object-right-bottom"
                />
              </div>
            </FeatureCard>
          </div>
        </section>

        {/* Process Section ("Four Steps to a Better City") */}
        <ProcessSection />

        {/* CTA Banner */}
        <CtaBanner />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
