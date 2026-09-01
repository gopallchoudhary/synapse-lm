"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, ShieldCheck, Cpu, BookOpen } from "lucide-react";
import { HeroConvergingVisual } from "./hero-converging-visual";

export function LandingHero() {
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Gentle background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gradient-to-br from-[#0075de]/8 via-sky-400/4 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Copy & Headline */}
        <div className="mx-auto max-w-3xl text-center">
          
          {/* Eyebrow Badge - badge-pill spec */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="type-eyebrow inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[#0075de] shadow-level-1 dark:border-zinc-800 dark:bg-zinc-900 dark:text-sky-400"
          >
            <Sparkles className="size-3" />
            <span>AI Research & Learning Workspace</span>
          </motion.div>

          {/* Main Display Headline - display-1 (64px/700/-2.125px tracking) */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="type-display-1 mt-6 text-[#000000] dark:text-[#ffffff]"
          >
            Turn scattered sources into{" "}
            <span className="text-[#0075de]">
              grounded understanding.
            </span>
          </motion.h1>

          {/* Subtitle - body-md (16px/400/1.5) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="type-body-md mt-6 text-[#31302e] dark:text-zinc-300 max-w-2xl mx-auto"
          >
            Upload PDFs, websites, YouTube lectures, and notes. Ask complex questions with
            verified line-by-line citations and generate summaries, flashcards, and quizzes in seconds.
          </motion.p>

          {/* CTA Button Group - button-primary & button-secondary spec */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4"
          >
            {/* button-primary: background primary (#0075de), on-primary (white), pill rounded.full, type.button */}
            <Link
              href="/sign-up"
              className="type-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0075de] px-7 py-3 text-white transition-all hover:bg-[#005bab] active:scale-[0.9] sm:w-auto"
            >
              <span>Start for free</span>
              <ArrowRight className="size-4" />
            </Link>

            {/* button-secondary: white surface, ink text, pill rounded.full, soft Level-1 shadow, type.button */}
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="type-button shadow-level-1 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-6 py-3 text-[#000000] transition-all hover:bg-[#f6f5f4] active:scale-[0.9] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:w-auto"
            >
              <span>See how it works</span>
              <span className="text-[#615d59] dark:text-zinc-400">↓</span>
            </a>
          </motion.div>

          {/* Micro-Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="type-caption mt-8 flex flex-wrap items-center justify-center gap-4 text-[#615d59] dark:text-zinc-400"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#1aae39]" />
              <span>Grounded in your sources</span>
            </div>
            <span className="hidden text-[#e6e6e6] dark:text-zinc-700 sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="size-3.5 text-[#0075de]" />
              <span>Pinecone Vector RAG</span>
            </div>
            <span className="hidden text-[#e6e6e6] dark:text-zinc-700 sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-[#ff64c8]" />
              <span>Studio Artifacts</span>
            </div>
          </motion.div>

        </div>

        {/* Converging Diagram Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-14 sm:mt-18"
        >
          <HeroConvergingVisual />
        </motion.div>

      </div>
    </section>
  );
}
