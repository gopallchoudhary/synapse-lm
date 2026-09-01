"use client";

import React from "react";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { HowItWorksSection } from "./how-it-works-section";
import { BeforeAfterSection } from "./before-after-section";
import { UseCasesSection } from "./use-cases-section";
import { PricingSection } from "./pricing-section";
import { LandingFooter } from "./landing-footer";

export function LandingPageView() {
  return (
    <div className="min-h-screen bg-[#f6f5f4] text-[#000000] selection:bg-[#0075de]/15 selection:text-[#0075de] dark:bg-[#09090b] dark:text-[#ffffff]">
      <LandingHeader />
      <main>
        <LandingHero />
        <HowItWorksSection />
        <BeforeAfterSection />
        <UseCasesSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}
