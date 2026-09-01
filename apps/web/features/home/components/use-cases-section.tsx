"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Scale,
  GraduationCap,
  Code2,
  BarChart3,
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
    dotBg: "bg-[#2a9d99]",
    badgeBg: "bg-[#2a9d99]/10 text-[#2a9d99]",
    promptExample: "Compare the exclusion criteria and standard of care between Exhibit A and Exhibit B.",
  },
  {
    id: "study-finals",
    title: "Study for finals & exams",
    category: "University & Higher Ed",
    description:
      "Feed 400-page textbooks and YouTube lecture recordings into Studybook LM. Turn dense chapters into interactive flashcards and customized practice quizzes with answer rationales.",
    icon: GraduationCap,
    dotBg: "bg-[#ff64c8]",
    badgeBg: "bg-[#ff64c8]/10 text-[#ff64c8]",
    promptExample: "Generate a 10-question practice exam on cellular respiration with detailed explanations.",
  },
  {
    id: "codebase-onboarding",
    title: "Onboard to codebases & docs",
    category: "Engineering & Architecture",
    description:
      "Index technical RFCs, API references, and architecture blueprints. Trace microservice dependencies and query integration contracts without context-switching.",
    icon: Code2,
    dotBg: "bg-[#0075de]",
    badgeBg: "bg-[#62aef0]/15 text-[#0075de]",
    promptExample: "What are the retry mechanisms and error codes implemented in the payment webhook router?",
  },
  {
    id: "market-reports",
    title: "Summarize executive reports",
    category: "Finance & Strategy",
    description:
      "Synthesize quarterly 10-K filings and competitor market surveys into structured executive briefs, financial breakdown tables, and key strategic takeaways.",
    icon: BarChart3,
    dotBg: "bg-[#dd5b00]",
    badgeBg: "bg-[#dd5b00]/10 text-[#dd5b00]",
    promptExample: "Extract YoY gross margins and EBITDA guidance revisions across our top 3 competitors.",
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* badge-pill */}
          <div className="type-eyebrow shadow-level-1 inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[#0075de] dark:border-zinc-800 dark:bg-zinc-900 dark:text-sky-400">
            <span>Built for High-Density Work</span>
          </div>

          <h2 className="type-heading-1 mt-4 text-[#000000] dark:text-white">
            Designed for anyone who works with dense information.
          </h2>

          <p className="type-body-md mt-4 text-[#31302e] dark:text-zinc-300">
            Whether you're preparing for a bar exam, analyzing earnings calls, or studying for finals, Studybook LM keeps you grounded.
          </p>
        </div>

        {/* 4 Cards Grid - feature-card spec: rounded-lg (12px), 24px padding, white surface, hairline border */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="shadow-level-1 group relative flex flex-col justify-between rounded-xl border border-[#e6e6e6] bg-white p-6 transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 sm:p-7"
              >
                <div>
                  {/* Category & Dot */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`type-eyebrow inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-semibold ${useCase.badgeBg}`}
                    >
                      <Icon className="size-3.5" />
                      <span>{useCase.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${useCase.dotBg}`} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="type-heading-3 mt-5 text-[#000000] transition-colors group-hover:text-[#0075de] dark:text-white">
                    {useCase.title}
                  </h3>

                  <p className="type-body-sm mt-2 text-[#31302e] dark:text-zinc-300">
                    {useCase.description}
                  </p>
                </div>

                {/* Example Prompt Box */}
                <div className="mt-6 rounded-md border border-[#e6e6e6] bg-[#f6f5f4] p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                  <div className="type-eyebrow flex items-center gap-1.5 text-[#615d59] dark:text-zinc-400">
                    <MessageCircle className="size-3 text-[#0075de]" />
                    <span>Typical Query</span>
                  </div>
                  <p className="type-body-sm mt-1 italic text-[#31302e] dark:text-zinc-300">
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
