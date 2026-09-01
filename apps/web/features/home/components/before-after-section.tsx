"use client";

import React from "react";
import { motion } from "motion/react";
import {
  XCircle,
  CheckCircle2,
  FileText,
  Globe,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
} from "lucide-react";

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white px-3.5 py-1 text-xs font-semibold text-zinc-800 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <span>Before & After</span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            From document chaos to grounded clarity.
          </h2>

          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            See the difference between wrestling with 30 browser tabs and studying with a grounded knowledge workspace.
          </p>
        </div>

        {/* Before / After Comparison Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          
          {/* LEFT: Before (Document Chaos) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between rounded-3xl border border-red-200/70 bg-gradient-to-b from-red-50/40 to-white/90 p-6 shadow-sm dark:border-red-900/30 dark:from-red-950/20 dark:to-zinc-900/90 sm:p-8"
          >
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300">
                  <XCircle className="size-3.5" />
                  Without Studybook LM
                </span>
                <span className="text-xs font-medium text-zinc-400">The Tab Nightmare</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Scattered tabs, lost citations, and hallucinated AI answers
              </h3>

              {/* Visual messy stack representation */}
              <div className="relative mt-6 h-56 w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                {/* Angled Stack Card 1 */}
                <div className="absolute left-6 top-4 w-[85%] -rotate-3 rounded-xl border border-zinc-300/80 bg-white/95 p-3 shadow-xs dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                    <FileText className="size-3.5 text-zinc-400" />
                    <span>Quarterly_Report_2025_Final_v2.pdf</span>
                  </div>
                  <div className="mt-2 h-2 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </div>

                {/* Angled Stack Card 2 */}
                <div className="absolute left-10 top-14 w-[85%] rotate-2 rounded-xl border border-zinc-300/80 bg-white/95 p-3 shadow-xs dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
                    <Globe className="size-3.5 text-zinc-400" />
                    <span>34 open Chrome research tabs...</span>
                  </div>
                  <div className="mt-2 h-2 w-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                </div>

                {/* Angled Stack Card 3 (Top alert) */}
                <div className="absolute left-8 top-28 w-[88%] -rotate-1 rounded-xl border border-red-200 bg-white p-3.5 shadow-md dark:border-red-900/40 dark:bg-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span>Generic AI hallucination: "Source not found"</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    Flipping back and forth between 5 files trying to verify which claim came from where.
                  </p>
                </div>
              </div>

              {/* Bullet list */}
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-400" />
                  <span>Manual copy-pasting into chat prompts losing crucial context</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-400" />
                  <span>No guarantee whether answers are accurate or invented</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-red-400" />
                  <span>Hours spent building study notes, flashcards, and summaries by hand</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* RIGHT: After (Grounded Clarity) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col justify-between rounded-3xl border border-[#0075de]/30 bg-gradient-to-b from-sky-50/40 to-white/95 p-6 shadow-md shadow-[#0075de]/5 dark:border-sky-500/30 dark:from-sky-950/20 dark:to-zinc-900/90 sm:p-8"
          >
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0075de]/10 px-3 py-1 text-xs font-semibold text-[#0075de] dark:bg-sky-950/60 dark:text-sky-300">
                  <CheckCircle2 className="size-3.5" />
                  With Studybook LM
                </span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-semibold">
                  100% Grounded
                </span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                Unified notebooks, streaming citations, and instant study tools
              </h3>

              {/* Visual organized synthesis card */}
              <div className="relative mt-6 rounded-2xl border border-zinc-200/90 bg-white p-4.5 shadow-sm dark:border-zinc-700/80 dark:bg-zinc-800/90">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-700/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-[#0075de]" />
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Synthesized Research Answer
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    Verified
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                  "The benchmark shows an 84% speedup in cross-document synthesis{" "}
                  <span className="rounded-md bg-[#0075de]/15 px-1 py-0.2 font-bold text-[#0075de]">
                    [1]
                  </span>{" "}
                  while citation accuracy reaches 99.2% through dense vector re-ranking{" "}
                  <span className="rounded-md bg-[#0075de]/15 px-1 py-0.2 font-bold text-[#0075de]">
                    [2]
                  </span>
                  ."
                </p>

                {/* Studio Artifacts Bar */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-700/60">
                  <span className="text-[10px] font-semibold text-zinc-400">Generated:</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                    <BookOpen className="size-2.5" /> 12 Flashcards
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <Check className="size-2.5" /> 5-Question Quiz
                  </span>
                </div>
              </div>

              {/* Bullet list */}
              <ul className="mt-6 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Click any numbered citation to jump directly to the source page and chunk</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Pinecone serverless vector index keeps responses lightning-fast & accurate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Automated studio pipelines create quizzes and mind maps while you read</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
