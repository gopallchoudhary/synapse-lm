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
      {/* Subtle background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-gradient-to-br from-[#0075de]/10 via-sky-400/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Copy & Headline */}
        <div className="mx-auto max-w-3xl text-center">
          
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50/80 px-3.5 py-1.5 text-xs font-semibold text-[#0075de] shadow-xs backdrop-blur-xs dark:border-sky-500/30 dark:bg-sky-950/40 dark:text-sky-300"
          >
            <Sparkles className="size-3.5" />
            <span>AI Research & Study Workspace</span>
          </motion.div>

          {/* Main Display Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-4xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-6xl sm:tracking-[-0.035em]"
          >
            Turn scattered sources into{" "}
            <span className="bg-gradient-to-r from-[#0075de] via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              grounded understanding.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg sm:leading-8"
          >
            Upload PDFs, websites, YouTube lectures, and notes. Ask complex questions with
            verified line-by-line citations and generate summaries, flashcards, and quizzes in seconds.
          </motion.p>

          {/* CTA Button Group */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4"
          >
            <Link
              href="/sign-up"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0075de] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#0075de]/25 transition-all hover:bg-[#005bab] hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            >
              <span>Start for free</span>
              <ArrowRight className="size-4" />
            </Link>

            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-zinc-800 shadow-xs transition-all hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/90 dark:text-zinc-200 dark:hover:bg-zinc-700 sm:w-auto"
            >
              <span>See how it works</span>
              <span className="text-zinc-400">↓</span>
            </a>
          </motion.div>

          {/* Feature Micro-Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Grounded in your sources</span>
            </div>
            <span className="hidden text-zinc-300 dark:text-zinc-700 sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="size-3.5 text-[#0075de]" />
              <span>Pinecone Vector RAG</span>
            </div>
            <span className="hidden text-zinc-300 dark:text-zinc-700 sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-purple-600 dark:text-purple-400" />
              <span>Studio Artifacts</span>
            </div>
          </motion.div>

        </div>

        {/* Converging Diagram Visual */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 sm:mt-18"
        >
          <HeroConvergingVisual />
        </motion.div>

      </div>
    </section>
  );
}
