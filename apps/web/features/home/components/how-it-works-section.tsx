"use client";

import React from "react";
import { motion } from "motion/react";
import {
  UploadCloud,
  MessageSquareCode,
  Sparkles,
  FileCheck2,
  FileText,
  Globe,
  Video,
  GraduationCap,
  Brain,
  ListTodo,
} from "lucide-react";

const STEPS = [
  {
    stepNumber: "01",
    title: "Connect your sources",
    description:
      "Upload complex PDFs, scrape websites with Firecrawl, extract YouTube lecture transcripts, or write notes. Everything is semantically chunked and embedded in your private vector workspace.",
    icon: UploadCloud,
    iconBg: "bg-[#2a9d99]/12",
    iconColor: "text-[#2a9d99]",
    badgeLabel: "Multi-modal ingestion",
    tags: [
      { name: "PDF Documents", icon: FileText },
      { name: "Websites", icon: Globe },
      { name: "YouTube Transcripts", icon: Video },
    ],
  },
  {
    stepNumber: "02",
    title: "Chat with verified citations",
    description:
      "Ask questions in natural language. Studybook LM performs dense vector retrieval, re-ranks excerpts, and streams answers where every factual statement has a clickable, verifiable citation.",
    icon: MessageSquareCode,
    iconBg: "bg-[#0075de]/12",
    iconColor: "text-[#0075de]",
    badgeLabel: "Grounded RAG Engine",
    tags: [
      { name: "Streaming RAG", icon: Brain },
      { name: "Numbered Citations", icon: FileCheck2 },
      { name: "Long-term Memory", icon: MessageSquareCode },
    ],
  },
  {
    stepNumber: "03",
    title: "Generate Studio artifacts",
    description:
      "Convert your notebooks into high-yield learning materials with one click. Generate interactive flashcards, quizzes with answer explanations, visual mind maps, and structured research reports.",
    icon: Sparkles,
    iconBg: "bg-[#ff64c8]/12",
    iconColor: "text-[#ff64c8]",
    badgeLabel: "Instant Study Tools",
    tags: [
      { name: "Flashcards", icon: GraduationCap },
      { name: "Quizzes", icon: ListTodo },
      { name: "Mind Maps & Summaries", icon: Sparkles },
    ],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* badge-pill */}
          <div className="type-eyebrow shadow-level-1 inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[#0075de] dark:border-zinc-800 dark:bg-zinc-900 dark:text-sky-400">
            <span>Simple 3-Step Workflow</span>
          </div>

          <h2 className="type-heading-1 mt-4 text-[#000000] dark:text-white">
            From raw information to deep understanding in minutes.
          </h2>

          <p className="type-body-md mt-4 text-[#31302e] dark:text-zinc-300">
            A frictionless learning loop designed for researchers, students, and engineers who work with dense materials.
          </p>
        </div>

        {/* 3 Step Cards Grid - feature-card spec: rounded-lg (12px), 24px padding, white surface, hairline border */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="shadow-level-1 group relative flex flex-col justify-between rounded-xl border border-[#e6e6e6] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid size-10 place-items-center rounded-lg ${step.iconBg} ${step.iconColor}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-xl font-bold text-[#a39e98] dark:text-zinc-600">
                      {step.stepNumber}
                    </span>
                  </div>

                  <div className="mt-5">
                    <span className="type-eyebrow uppercase tracking-wider text-[#615d59] dark:text-zinc-400">
                      {step.badgeLabel}
                    </span>
                    <h3 className="type-heading-3 mt-1 text-[#000000] dark:text-white">
                      {step.title}
                    </h3>
                    <p className="type-body-sm mt-2 text-[#31302e] dark:text-zinc-300">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Sub-feature chips */}
                <div className="mt-6 border-t border-[#e6e6e6] pt-4 dark:border-zinc-800">
                  <div className="flex flex-wrap gap-1.5">
                    {step.tags.map((tag) => {
                      const TagIcon = tag.icon;
                      return (
                        <span
                          key={tag.name}
                          className="type-caption inline-flex items-center gap-1 rounded-md bg-[#f6f5f4] px-2 py-1 text-xs text-[#31302e] dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <TagIcon className="size-3 text-[#615d59]" />
                          <span>{tag.name}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
