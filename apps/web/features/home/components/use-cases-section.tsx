"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Scale,
  GraduationCap,
  Code2,
  BarChart3,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

const USE_CASES = [
  {
    id: "legal-research",
    title: "Research a complex case",
    category: "Legal & Academic Research",
    description:
      "Upload 50+ case briefs or clinical trials into a single notebook. Compare conflicting precedents, find subtle clauses, and extract exact page citations in seconds.",
    icon: Scale,
    dotColor: "bg-teal-500",
    badgeBg: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20",
    promptExample: "Compare the exclusion criteria and standard of care between Exhibit A and Exhibit B.",
  },
  {
    id: "study-finals",
    title: "Study for finals & exams",
    category: "University & Higher Ed",
    description:
      "Feed 400-page textbooks and YouTube lecture recordings into Studybook LM. Turn dense chapters into interactive flashcards and customized practice quizzes with answer rationales.",
    icon: GraduationCap,
    dotColor: "bg-pink-500",
    badgeBg: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/20",
    promptExample: "Generate a 10-question practice exam on cellular respiration with detailed explanations.",
  },
  {
    id: "codebase-onboarding",
    title: "Onboard to codebases & docs",
    category: "Engineering & Architecture",
    description:
      "Index technical RFCs, API references, and architecture blueprints. Trace microservice dependencies and query integration contracts without context-switching.",
    icon: Code2,
    dotColor: "bg-[#0075de]",
    badgeBg: "bg-sky-500/10 text-[#0075de] dark:text-sky-300 border-[#0075de]/20",
    promptExample: "What are the retry mechanisms and error codes implemented in the payment webhook router?",
  },
  {
    id: "market-reports",
    title: "Summarize executive reports",
    category: "Finance & Strategy",
    description:
      "Synthesize quarterly 10-K filings and competitor market surveys into structured executive briefs, financial breakdown tables, and key strategic takeaways.",
    icon: BarChart3,
    dotColor: "bg-amber-500",
    badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    promptExample: "Extract YoY gross margins and EBITDA guidance revisions across our top 3 competitors.",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="relative scroll-mt-20 py-20 md:py-28 bg-[#f6f5f4]/50 dark:bg-zinc-950/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white px-3.5 py-1 text-xs font-semibold text-zinc-800 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <span>Built for High-Density Work</span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            Designed for anyone who works with dense information.
          </h2>

          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Whether you're preparing for a bar exam, analyzing earnings calls, or studying for finals, Studybook LM keeps you grounded.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 sm:p-7"
              >
                <div>
                  {/* Top Category & Icon */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-semibold ${useCase.badgeBg}`}
                    >
                      <Icon className="size-3.5" />
                      <span>{useCase.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${useCase.dotColor}`} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#0075de] transition-colors">
                    {useCase.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {useCase.description}
                  </p>
                </div>

                {/* Example Prompt Box */}
                <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/90 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    <MessageCircle className="size-3 text-[#0075de]" />
                    <span>Typical Prompt</span>
                  </div>
                  <p className="mt-1 text-xs italic text-zinc-700 dark:text-zinc-300">
                    "{useCase.promptExample}"
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
