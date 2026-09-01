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
    accentColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
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
    accentColor: "bg-[#0075de]/10 text-[#0075de] dark:text-sky-400 border-[#0075de]/20",
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
    accentColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
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
    <section id="how-it-works" className="relative scroll-mt-20 py-20 md:py-28 bg-[#f6f5f4]/60 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white px-3.5 py-1 text-xs font-semibold text-zinc-800 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <span>Simple 3-Step Workflow</span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            From raw information to deep understanding in minutes.
          </h2>

          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            A frictionless learning loop designed for researchers, students, and engineers who work with dense materials.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.stepNumber}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid size-11 place-items-center rounded-xl border ${step.accentColor}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-zinc-300 dark:text-zinc-700">
                      {step.stepNumber}
                    </span>
                  </div>

                  <div className="mt-6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      {step.badgeLabel}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Sub-feature chips */}
                <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {step.tags.map((tag) => {
                      const TagIcon = tag.icon;
                      return (
                        <span
                          key={tag.name}
                          className="inline-flex items-center gap-1 rounded-md bg-zinc-100/90 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                          <TagIcon className="size-3 text-zinc-500" />
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
