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
  BookOpen,
  Check,
} from "lucide-react";

export function BeforeAfterSection() {
  return (
    <section id="before-after" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* badge-pill */}
          <div className="type-eyebrow shadow-level-1 inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[#0075de] dark:border-zinc-800 dark:bg-zinc-900 dark:text-sky-400">
            <span>Before & After</span>
          </div>

          <h2 className="type-heading-1 mt-4 text-[#000000] dark:text-white">
            From document chaos to grounded clarity.
          </h2>

          <p className="type-body-md mt-4 text-[#31302e] dark:text-zinc-300">
            See the difference between wrestling with 30 browser tabs and studying with a grounded knowledge workspace.
          </p>
        </div>

        {/* Before / After Comparison Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          
          {/* LEFT: Before (Document Chaos) */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
            className="shadow-level-1 flex flex-col justify-between rounded-xl border border-red-200/80 bg-white p-6 dark:border-red-900/40 dark:bg-zinc-900 sm:p-7"
          >
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <span className="type-eyebrow inline-flex items-center gap-1.5 rounded-full bg-red-100/80 px-2.5 py-1 text-red-700 dark:bg-red-950/60 dark:text-red-300">
                  <XCircle className="size-3.5" />
                  Without Studybook LM
                </span>
                <span className="type-caption text-xs text-[#a39e98]">The Tab Nightmare</span>
              </div>

              <h3 className="type-heading-3 mt-4 text-[#000000] dark:text-white">
                Scattered tabs, lost citations, and hallucinated AI answers
              </h3>

              {/* Visual messy stack representation */}
              <div className="relative mt-6 h-56 w-full overflow-hidden rounded-lg border border-[#e6e6e6] bg-[#f6f5f4] p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                {/* Angled Stack Card 1 */}
                <div className="absolute left-6 top-4 w-[85%] -rotate-2 rounded-lg border border-[#e6e6e6] bg-white p-3 shadow-xs dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="type-caption flex items-center gap-2 text-xs font-semibold text-[#615d59]">
                    <FileText className="size-3.5 text-[#a39e98]" />
                    <span>Quarterly_Report_2025_Final_v2.pdf</span>
                  </div>
                  <div className="mt-2 h-1.5 w-3/4 rounded-full bg-[#e6e6e6] dark:bg-zinc-700" />
                </div>

                {/* Angled Stack Card 2 */}
                <div className="absolute left-10 top-14 w-[85%] rotate-1 rounded-lg border border-[#e6e6e6] bg-white p-3 shadow-xs dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="type-caption flex items-center gap-2 text-xs font-semibold text-[#615d59]">
                    <Globe className="size-3.5 text-[#a39e98]" />
                    <span>34 open Chrome research tabs...</span>
                  </div>
                  <div className="mt-2 h-1.5 w-1/2 rounded-full bg-[#e6e6e6] dark:bg-zinc-700" />
                </div>

                {/* Angled Stack Card 3 (Top alert) */}
                <div className="absolute left-8 top-26 w-[88%] -rotate-1 rounded-lg border border-red-200 bg-white p-3.5 shadow-level-1 dark:border-red-900/40 dark:bg-zinc-800">
                  <div className="type-caption flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span>Generic AI hallucination: "Source not found"</span>
                  </div>
                  <p className="type-caption mt-1 text-xs text-[#615d59] dark:text-zinc-400">
                    Flipping back and forth between 5 files trying to verify which claim came from where.
                  </p>
                </div>
              </div>

              {/* Bullet list in body-sm */}
              <ul className="type-body-sm mt-6 space-y-2 text-[#31302e] dark:text-zinc-300">
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
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="shadow-level-1 flex flex-col justify-between rounded-xl border border-[#0075de]/30 bg-white p-6 dark:border-sky-500/30 dark:bg-zinc-900 sm:p-7"
          >
            <div>
              {/* Header Pill */}
              <div className="flex items-center justify-between">
                <span className="type-eyebrow inline-flex items-center gap-1.5 rounded-full bg-[#0075de]/10 px-2.5 py-1 text-[#0075de] dark:bg-sky-950/60 dark:text-sky-300">
                  <CheckCircle2 className="size-3.5 text-[#1aae39]" />
                  With Studybook LM
                </span>
                <span className="type-eyebrow text-[#1aae39] font-bold">
                  100% Grounded
                </span>
              </div>

              <h3 className="type-heading-3 mt-4 text-[#000000] dark:text-white">
                Unified notebooks, streaming citations, and instant study tools
              </h3>

              {/* Visual organized synthesis card */}
              <div className="relative mt-6 rounded-lg border border-[#e6e6e6] bg-[#f6f5f4] p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-2 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-[#0075de]" />
                    <span className="type-body-sm font-semibold text-[#000000] dark:text-zinc-100">
                      Synthesized Research Answer
                    </span>
                  </div>
                  <span className="type-eyebrow rounded-xs bg-[#1aae39]/15 px-2 py-0.5 font-bold text-[#1aae39]">
                    Verified
                  </span>
                </div>

                <p className="type-body-sm mt-3 text-[#31302e] dark:text-zinc-300">
                  "The benchmark shows an 84% speedup in cross-document synthesis{" "}
                  <span className="rounded-xs bg-[#0075de]/15 px-1 py-0.2 font-bold text-[#0075de]">
                    [1]
                  </span>{" "}
                  while citation accuracy reaches 99.2% through dense vector re-ranking{" "}
                  <span className="rounded-xs bg-[#0075de]/15 px-1 py-0.2 font-bold text-[#0075de]">
                    [2]
                  </span>
                  ."
                </p>

                {/* Studio Artifacts Bar */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e6e6e6] pt-3 dark:border-zinc-700">
                  <span className="type-eyebrow text-[#a39e98]">Generated:</span>
                  <span className="type-caption inline-flex items-center gap-1 rounded-md bg-[#ff64c8]/10 px-2 py-0.5 font-medium text-[#ff64c8]">
                    <BookOpen className="size-2.5" /> 12 Flashcards
                  </span>
                  <span className="type-caption inline-flex items-center gap-1 rounded-md bg-[#1aae39]/10 px-2 py-0.5 font-medium text-[#1aae39]">
                    <Check className="size-2.5" /> 5-Question Quiz
                  </span>
                </div>
              </div>

              {/* Bullet list in body-sm */}
              <ul className="type-body-sm mt-6 space-y-2 text-[#31302e] dark:text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#1aae39] shrink-0" />
                  <span>Click any numbered citation to jump directly to the source page and chunk</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#1aae39] shrink-0" />
                  <span>Pinecone serverless vector index keeps responses lightning-fast & accurate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-[#1aae39] shrink-0" />
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
