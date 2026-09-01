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
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white px-3.5 py-1 text-xs font-semibold text-zinc-800 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <span>Simple Pricing</span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            Start for free. Scale when you need more power.
          </h2>

          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Everything you need to ground your learning without hidden fees or surprise lock-in.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between rounded-3xl border border-[#e6e6e6] bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Starter Plan
                </span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  Free Forever
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                  $0
                </span>
                <span className="text-sm text-zinc-500">/ forever</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                Perfect for students and solo learners wanting to chat with notes and PDFs.
              </p>

              {/* Feature Checklist */}
              <ul className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Up to 5 active research notebooks</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>PDF, YouTube transcript, and web URL ingestion</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Pinecone RAG vector search with line citations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Basic flashcards and summary generation</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Community support</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 py-3 text-sm font-semibold text-zinc-800 shadow-xs transition-all hover:bg-zinc-100 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                <span>Get started free</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>

          {/* PRO PLAN (FEATURED) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="relative flex flex-col justify-between rounded-3xl border-2 border-[#0075de] bg-[#fcfdfe] p-7 shadow-xl shadow-[#0075de]/10 dark:border-sky-500 dark:bg-zinc-900 sm:p-8"
          >
            {/* Pill ribbon */}
            <div className="absolute -top-3.5 right-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0075de] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                <Sparkles className="size-3" />
                Most Popular
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-[#0075de] dark:text-sky-400">
                  Researcher Pro
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
                  $12
                </span>
                <span className="text-sm text-zinc-500">/ month</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                For researchers, professionals, and teams analyzing hundreds of documents.
              </p>

              {/* Feature Checklist */}
              <ul className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 shrink-0 text-[#0075de] dark:text-sky-400" />
                  <span className="font-medium">Unlimited research notebooks & sources</span>
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
              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0075de] py-3 text-sm font-semibold text-white shadow-md shadow-[#0075de]/25 transition-all hover:bg-[#005bab] hover:scale-[1.01] active:scale-[0.99]"
              >
                <Zap className="size-4" />
                <span>Start 14-day free trial</span>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Final High-Impact Call to Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-20 overflow-hidden rounded-[2.5rem] border border-[#e6e6e6] bg-zinc-950 p-8 text-center text-white shadow-2xl dark:border-zinc-800 sm:p-14"
        >
          {/* Ambient glow inside banner */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[#0075de]/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-950/60 px-3.5 py-1 text-xs font-semibold text-sky-300">
              <Sparkles className="size-3.5" />
              <span>Get Started in 30 Seconds</span>
            </span>

            <h3 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to turn your documents into understanding?
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Create your first notebook today. Upload your sources and experience grounded, citation-backed AI without hallucinations.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/sign-up"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0075de] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0075de]/30 transition-all hover:bg-[#005bab] hover:scale-105 active:scale-95 sm:w-auto"
              >
                <span>Start for free</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              No credit card required • Free tier included forever
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
