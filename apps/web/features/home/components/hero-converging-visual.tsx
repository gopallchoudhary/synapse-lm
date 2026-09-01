"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Globe,
  ScrollText,
  Table2,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Layers,
} from "lucide-react";

interface SourceItem {
  id: number;
  title: string;
  type: string;
  icon: React.ElementType;
  meta: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
  borderColor: string;
  snippet: string;
  sourceUrl: string;
}

const SOURCES: SourceItem[] = [
  {
    id: 1,
    title: "Quantum_Neural_Architectures.pdf",
    type: "PDF Document",
    icon: FileText,
    meta: "32 pages • 14 chunks embedded",
    iconBg: "bg-[#2a9d99]/12",
    iconColor: "text-[#2a9d99]",
    glowColor: "rgba(42, 157, 153, 0.4)",
    borderColor: "border-[#2a9d99]/60",
    snippet: "Section 3.2: Dense vector retrieval with cosine similarity guarantees bounded context window usage across partitioned workspaces.",
    sourceUrl: "Cloudinary / unpdf parsed",
  },
  {
    id: 2,
    title: "Stanford_CS224N_Lecture.txt",
    type: "YouTube Transcript",
    icon: ScrollText,
    meta: "4,200 words • 01:14:20 timestamp",
    iconBg: "bg-[#ff64c8]/12",
    iconColor: "text-[#ff64c8]",
    glowColor: "rgba(255, 100, 200, 0.4)",
    borderColor: "border-[#ff64c8]/60",
    snippet: "Prof. Manning: Multi-hop verification and source re-ranking reduce hallucination rates by up to 82% compared to ungrounded generation.",
    sourceUrl: "youtube-transcript pipeline",
  },
  {
    id: 3,
    title: "ArXiv_RAG_Advancements_2026.html",
    type: "Web Research",
    icon: Globe,
    meta: "Firecrawl scraped • 18 mins read",
    iconBg: "bg-[#62aef0]/15",
    iconColor: "text-[#0075de]",
    glowColor: "rgba(98, 174, 240, 0.4)",
    borderColor: "border-[#62aef0]/60",
    snippet: "Long-term episodic memory buffers preserve conversational entity graphs across sessions without context window bloat.",
    sourceUrl: "https://arxiv.org/abs/2602.04918",
  },
  {
    id: 4,
    title: "Benchmark_Retrieval_Metrics.csv",
    type: "Tabular Data",
    icon: Table2,
    meta: "1,250 rows • 94.8% precision",
    iconBg: "bg-[#dd5b00]/12",
    iconColor: "text-[#dd5b00]",
    glowColor: "rgba(221, 91, 0, 0.4)",
    borderColor: "border-[#dd5b00]/60",
    snippet: "Inngest async queue workers process 250 source tokens/sec with automated polling and real-time artifact compilation.",
    sourceUrl: "Postgres + Pinecone stats",
  },
];

export function HeroConvergingVisual() {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Main Container Card - white surface on warm canvas-soft */}
      <div className="shadow-level-1 relative rounded-2xl border border-[#e6e6e6] bg-white p-5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        
        {/* Top bar indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e6e6] pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-[#1aae39] animate-pulse" />
            <span className="type-eyebrow uppercase tracking-wider text-[#615d59] dark:text-zinc-400">
              Live Synthesis Engine
            </span>
          </div>
          <div className="type-caption flex items-center gap-1.5 rounded-md border border-[#e6e6e6] bg-[#f6f5f4] px-2.5 py-1 text-xs text-[#31302e] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <Layers className="size-3 text-[#0075de]" />
            <span>4 Sources Connected</span>
          </div>
        </div>

        {/* Layout: Left Sources, Center Animated SVG Flow, Right Answer Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: 4 Source Document Cards (5 cols) */}
          <div className="flex flex-col gap-2.5 lg:col-span-5">
            <p className="type-eyebrow px-1 uppercase tracking-widest text-[#a39e98] dark:text-zinc-500">
              Connected Notebook Sources
            </p>

            {SOURCES.map((source, index) => {
              const Icon = source.icon;
              const isActive = activeId === source.id;

              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.35 }}
                  onMouseEnter={() => setActiveId(source.id)}
                  onClick={() => setActiveId(source.id)}
                  className={`group relative cursor-pointer rounded-xl border p-3 transition-all duration-200 ${
                    isActive
                      ? `bg-white shadow-level-1 ring-1 ring-[#0075de]/40 dark:bg-zinc-800 ${source.borderColor}`
                      : "border-[#e6e6e6] bg-white hover:border-[#a39e98] dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`grid size-8 shrink-0 place-items-center rounded-lg ${source.iconBg} ${source.iconColor}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="type-body-sm truncate font-semibold text-[#000000] dark:text-zinc-100">
                            {source.title}
                          </h4>
                          <span className="type-eyebrow grid size-4 shrink-0 place-items-center rounded-xs bg-[#f6f5f4] text-[10px] font-bold text-[#31302e] dark:bg-zinc-700 dark:text-zinc-200">
                            [{source.id}]
                          </span>
                        </div>
                        <p className="type-caption text-xs text-[#615d59] dark:text-zinc-400">
                          {source.meta}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      className={`size-3.5 transition-transform duration-200 ${
                        isActive
                          ? "translate-x-0.5 -translate-y-0.5 text-[#0075de]"
                          : "text-[#a39e98] opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center Column: Animated Flow Lines (2 cols) */}
          <div className="relative hidden h-72 w-full items-center justify-center lg:col-span-2 lg:flex">
            <svg
              className="h-full w-full overflow-visible"
              viewBox="0 0 100 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradient-line-active" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0075de" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#005bab" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Path 1: Source 1 to Center */}
              <motion.path
                d="M 5 30 C 50 30, 50 120, 95 120"
                stroke={activeId === 1 ? "url(#gradient-line-active)" : "#e6e6e6"}
                strokeWidth={activeId === 1 ? "2.5" : "1"}
                strokeDasharray={activeId === 1 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />

              {/* Path 2: Source 2 to Center */}
              <motion.path
                d="M 5 90 C 50 90, 50 120, 95 120"
                stroke={activeId === 2 ? "url(#gradient-line-active)" : "#e6e6e6"}
                strokeWidth={activeId === 2 ? "2.5" : "1"}
                strokeDasharray={activeId === 2 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
              />

              {/* Path 3: Source 3 to Center */}
              <motion.path
                d="M 5 150 C 50 150, 50 120, 95 120"
                stroke={activeId === 3 ? "url(#gradient-line-active)" : "#e6e6e6"}
                strokeWidth={activeId === 3 ? "2.5" : "1"}
                strokeDasharray={activeId === 3 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              />

              {/* Path 4: Source 4 to Center */}
              <motion.path
                d="M 5 210 C 50 210, 50 120, 95 120"
                stroke={activeId === 4 ? "url(#gradient-line-active)" : "#e6e6e6"}
                strokeWidth={activeId === 4 ? "2.5" : "1"}
                strokeDasharray={activeId === 4 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Center converging hub */}
              <motion.circle
                cx="95"
                cy="120"
                r="4.5"
                fill="#0075de"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
            </svg>
          </div>

          {/* Right Column: Synthesized Answer Card with Citations (5 cols) */}
          <div className="flex flex-col lg:col-span-5">
            <p className="type-eyebrow px-1 uppercase tracking-widest text-[#a39e98] dark:text-zinc-500">
              Grounded AI Response
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="shadow-level-1 mt-2 rounded-xl border border-[#e6e6e6] bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800"
            >
              {/* Question header in title style */}
              <div className="flex items-center gap-2 rounded-md bg-[#f6f5f4] px-3 py-2 text-xs font-semibold text-[#000000] dark:bg-zinc-900/80 dark:text-zinc-200">
                <Sparkles className="size-3.5 shrink-0 text-[#0075de]" />
                <span className="type-body-sm font-semibold truncate">"How do vector embeddings ground responses without hallucination?"</span>
              </div>

              {/* Synthesized answer text with citations */}
              <div className="type-body-sm mt-3.5 space-y-2.5 text-[#31302e] dark:text-zinc-300">
                <p>
                  Documents are partitioned into semantically chunked vectors stored in Pinecone per workspace{" "}
                  <button
                    type="button"
                    onClick={() => setActiveId(1)}
                    onMouseEnter={() => setActiveId(1)}
                    className={`inline-flex items-center justify-center rounded-xs px-1.5 py-0.5 text-xs font-bold transition-all ${
                      activeId === 1
                        ? "bg-[#0075de] text-white"
                        : "bg-[#2a9d99]/15 text-[#2a9d99] hover:bg-[#2a9d99]/25"
                    }`}
                  >
                    [1]
                  </button>
                  .
                </p>

                <p>
                  Multi-hop verification dynamically re-ranks retrieved chunks before prompt injection, eliminating up to 82% of ungrounded assertions{" "}
                  <button
                    type="button"
                    onClick={() => setActiveId(2)}
                    onMouseEnter={() => setActiveId(2)}
                    className={`inline-flex items-center justify-center rounded-xs px-1.5 py-0.5 text-xs font-bold transition-all ${
                      activeId === 2
                        ? "bg-[#0075de] text-white"
                        : "bg-[#ff64c8]/15 text-[#ff64c8] hover:bg-[#ff64c8]/25"
                    }`}
                  >
                    [2]
                  </button>
                  .
                </p>

                <p>
                  Conversational rolling summaries preserve long-term episodic context without exceeding token quotas{" "}
                  <button
                    type="button"
                    onClick={() => setActiveId(3)}
                    onMouseEnter={() => setActiveId(3)}
                    className={`inline-flex items-center justify-center rounded-xs px-1.5 py-0.5 text-xs font-bold transition-all ${
                      activeId === 3
                        ? "bg-[#0075de] text-white"
                        : "bg-[#62aef0]/20 text-[#0075de] hover:bg-[#62aef0]/30"
                    }`}
                  >
                    [3]
                  </button>
                  .
                </p>

                <p>
                  Studio artifacts (quizzes, flashcards, mind maps) are queued asynchronously for immediate rendering{" "}
                  <button
                    type="button"
                    onClick={() => setActiveId(4)}
                    onMouseEnter={() => setActiveId(4)}
                    className={`inline-flex items-center justify-center rounded-xs px-1.5 py-0.5 text-xs font-bold transition-all ${
                      activeId === 4
                        ? "bg-[#0075de] text-white"
                        : "bg-[#dd5b00]/15 text-[#dd5b00] hover:bg-[#dd5b00]/25"
                    }`}
                  >
                    [4]
                  </button>
                  .
                </p>
              </div>

              {/* Interactive Source Snippet Tray */}
              <div className="mt-4 border-t border-[#e6e6e6] pt-3 dark:border-zinc-700">
                <AnimatePresence mode="wait">
                  {activeId && (
                    <motion.div
                      key={activeId}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="rounded-md border border-[#e6e6e6] bg-[#f6f5f4] p-2.5 text-xs text-[#31302e] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#000000] dark:text-zinc-100">
                        <span className="type-eyebrow flex items-center gap-1.5">
                          <CheckCircle2 className="size-3 text-[#1aae39]" />
                          Verified Excerpt [{activeId}]
                        </span>
                        <span className="type-caption text-[11px] text-[#615d59]">
                          {SOURCES[activeId - 1]?.type}
                        </span>
                      </div>
                      <p className="type-caption mt-1 italic leading-relaxed text-[#31302e] dark:text-zinc-300">
                        "{SOURCES[activeId - 1]?.snippet}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
