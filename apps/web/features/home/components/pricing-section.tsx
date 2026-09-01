"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Sparkles, ArrowRight, Zap } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* badge-pill */}
          <div className="type-eyebrow shadow-level-1 inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[#0075de] dark:border-zinc-800 dark:bg-zinc-900 dark:text-sky-400">
            <span>Simple Pricing</span>
          </div>

          <h2 className="type-heading-1 mt-4 text-[#000000] dark:text-white">
            Start for free. Scale when you need more power.
          </h2>

          <p className="type-body-md mt-4 text-[#31302e] dark:text-zinc-300">
            Everything you need to ground your learning without hidden fees or lock-in.
          </p>
        </div>

        {/* Pricing Cards Grid - pricing-plan-card & pricing-plan-card-featured */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* FREE STARTER PLAN - pricing-plan-card spec */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="shadow-level-1 flex flex-col justify-between rounded-xl border border-[#e6e6e6] bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 sm:p-7"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="type-eyebrow uppercase tracking-wider text-[#615d59] dark:text-zinc-400">
                  Starter Plan
                </span>
                <span className="type-eyebrow rounded-full bg-[#f6f5f4] px-2.5 py-0.5 text-[#31302e] dark:bg-zinc-800 dark:text-zinc-300">
                  Free Forever
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="type-display-2 text-[#000000] dark:text-white font-bold">
                  $0
                </span>
                <span className="type-caption text-[#615d59]">/ forever</span>
              </div>

              <p className="type-body-sm mt-3 text-[#31302e] dark:text-zinc-300">
                For students and solo learners wanting to chat with notes and PDFs.
              </p>

              {/* Feature Checklist */}
              <ul className="type-body-sm mt-6 space-y-3 border-t border-[#e6e6e6] pt-6 text-[#31302e] dark:border-zinc-800 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#1aae39]" />
                  <span>Up to 5 active research notebooks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#1aae39]" />
                  <span>PDF, YouTube transcript, and web URL ingestion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#1aae39]" />
                  <span>Pinecone RAG vector search with line citations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#1aae39]" />
                  <span>Basic flashcards and summary generation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#1aae39]" />
                  <span>Community support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {/* button-utility spec: rounded-md (8px), padding 4px 14px */}
              <Link
                href="/sign-up"
                className="type-button inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#e6e6e6] bg-[#f6f5f4] py-2.5 text-sm text-[#000000] transition-all hover:bg-white hover:border-[#a39e98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <span>Get started free</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>

          {/* PRO PLAN - pricing-plan-card-featured spec */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="shadow-level-2 relative flex flex-col justify-between rounded-xl border-2 border-[#0075de] bg-white p-6 dark:border-sky-500 dark:bg-zinc-900 sm:p-7"
          >
            {/* Pill ribbon */}
            <div className="absolute -top-3 right-6">
              <span className="type-eyebrow inline-flex items-center gap-1 rounded-full bg-[#0075de] px-2.5 py-0.5 font-bold text-white shadow-xs">
                <Sparkles className="size-3" />
                Featured
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="type-eyebrow uppercase tracking-wider text-[#0075de] dark:text-sky-400 font-bold">
                  Researcher Pro
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="type-display-2 text-[#000000] dark:text-white font-bold">
                  $12
                </span>
                <span className="type-caption text-[#615d59]">/ month</span>
              </div>

              <p className="type-body-sm mt-3 text-[#31302e] dark:text-zinc-300">
                For researchers, professionals, and teams analyzing dense sources.
              </p>

              {/* Feature Checklist */}
              <ul className="type-body-sm mt-6 space-y-3 border-t border-[#e6e6e6] pt-6 text-[#31302e] dark:border-zinc-800 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#0075de] dark:text-sky-400" />
                  <span className="font-semibold text-[#000000] dark:text-white">Unlimited notebooks & source documents</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#0075de] dark:text-sky-400" />
                  <span>Deep Mem0 conversational long-term memory</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#0075de] dark:text-sky-400" />
                  <span>Unlimited Studio artifacts (Quizzes, Mind Maps, Reports)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#0075de] dark:text-sky-400" />
                  <span>Live Tavily web-search tool calling integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#0075de] dark:text-sky-400" />
                  <span>Priority access to OpenRouter flagship models</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              {/* button-primary pill */}
              <Link
                href="/sign-up"
                className="type-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0075de] py-3 text-white transition-all hover:bg-[#005bab] active:scale-[0.9]"
              >
                <Zap className="size-4" />
                <span>Start 14-day free trial</span>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Night Hero Callout Banner - hero-band spec with colors.secondary (#213183) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-20 overflow-hidden rounded-2xl bg-[#213183] p-8 text-center text-white shadow-level-2 sm:p-14"
        >
          <div className="relative mx-auto max-w-2xl">
            <span className="type-eyebrow inline-flex items-center gap-1.5 rounded-full border border-sky-300/30 bg-white/10 px-3 py-1 text-sky-200">
              <Sparkles className="size-3" />
              <span>Get Started in 30 Seconds</span>
            </span>

            <h3 className="type-heading-1 mt-4 text-white font-bold">
              Ready to turn your documents into understanding?
            </h3>

            <p className="type-body-md mt-4 text-zinc-200">
              Create your first notebook today. Upload your sources and experience grounded, citation-backed AI without hallucinations.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {/* button-secondary pill on dark hero */}
              <Link
                href="/sign-up"
                className="type-button inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-[#000000] shadow-level-1 transition-all hover:bg-[#f6f5f4] active:scale-[0.9] sm:w-auto font-semibold"
              >
                <span>Start for free</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <p className="type-caption mt-4 text-zinc-300">
              No credit card required • Free forever starter tier
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
