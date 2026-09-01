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
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#0075de]/20 selection:text-[#0075de] dark:bg-zinc-950 dark:text-zinc-100">
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
