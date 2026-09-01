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
  badgeColor: string;
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
    badgeColor: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
    glowColor: "rgba(42, 157, 153, 0.45)",
    borderColor: "border-teal-500/50 dark:border-teal-400/60",
    snippet: "Section 3.2: Dense vector retrieval with cosine similarity guarantees bounded context window usage across partitioned workspaces.",
    sourceUrl: "Cloudinary / unpdf parsed",
  },
  {
    id: 2,
    title: "Stanford_CS224N_Lecture.txt",
    type: "YouTube Transcript",
    icon: ScrollText,
    meta: "4,200 words • 01:14:20 timestamp",
    badgeColor: "bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30",
    glowColor: "rgba(255, 100, 200, 0.45)",
    borderColor: "border-pink-500/50 dark:border-pink-400/60",
    snippet: "Prof. Manning: Multi-hop verification and source re-ranking reduce hallucination rates by up to 82% compared to ungrounded generation.",
    sourceUrl: "youtube-transcript pipeline",
  },
  {
    id: 3,
    title: "ArXiv_RAG_Advancements_2026.html",
    type: "Web Research",
    icon: Globe,
    meta: "Firecrawl scraped • 18 mins read",
    badgeColor: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
    glowColor: "rgba(98, 174, 240, 0.45)",
    borderColor: "border-sky-500/50 dark:border-sky-400/60",
    snippet: "Long-term episodic memory buffers preserve conversational entity graphs across sessions without context window bloat.",
    sourceUrl: "https://arxiv.org/abs/2602.04918",
  },
  {
    id: 4,
    title: "Benchmark_Retrieval_Metrics.csv",
    type: "Tabular Data",
    icon: Table2,
    meta: "1,250 rows • 94.8% precision",
    badgeColor: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    glowColor: "rgba(221, 91, 0, 0.45)",
    borderColor: "border-amber-500/50 dark:border-amber-400/60",
    snippet: "Inngest async queue workers process 250 source tokens/sec with automated polling and real-time artifact compilation.",
    sourceUrl: "Postgres + Pinecone stats",
  },
];

export function HeroConvergingVisual() {
  const [activeId, setActiveId] = useState<number | null>(1);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-b from-[#0075de]/5 via-sky-500/5 to-transparent blur-2xl" />

      {/* Main Container Card */}
      <div className="relative rounded-[2rem] border border-[#e6e6e6] bg-[#fdfcfb] p-5 shadow-xl shadow-zinc-950/5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90 sm:p-8">
        
        {/* Top bar indicator */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Live Synthesis Engine
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-xs dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            <Layers className="size-3.5 text-[#0075de]" />
            <span>4 Sources Connected</span>
          </div>
        </div>

        {/* Desktop / Tablet Layout: Left Sources, Center Animated SVG Flow, Right Answer Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: 4 Source Document Cards (5 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            <p className="px-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Connected Notebook Sources
            </p>

            {SOURCES.map((source, index) => {
              const Icon = source.icon;
              const isActive = activeId === source.id;

              return (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  onMouseEnter={() => setActiveId(source.id)}
                  onClick={() => setActiveId(source.id)}
                  className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-300 ${
                    isActive
                      ? `bg-white shadow-md shadow-zinc-900/5 ring-2 ring-[#0075de]/30 dark:bg-zinc-800/90 ${source.borderColor}`
                      : "border-zinc-200/90 bg-white/70 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-9 shrink-0 place-items-center rounded-lg border text-sm font-semibold transition-colors ${source.badgeColor}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {source.title}
                          </h4>
                          <span className="grid size-4 shrink-0 place-items-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200">
                            [{source.id}]
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                          {source.meta}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      className={`size-3.5 transition-transform duration-200 ${
                        isActive
                          ? "translate-x-0.5 -translate-y-0.5 text-[#0075de]"
                          : "text-zinc-400 opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>

                  {/* Active highlight indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSourceGlow"
                      className="absolute -inset-px -z-10 rounded-xl"
                      style={{
                        boxShadow: `0 0 20px ${source.glowColor}`,
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Center Column: Animated Converging Flow Lines (2 cols on large screen) */}
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

              {/* Path 1: Source 1 (top left) to Center */}
              <motion.path
                d="M 5 30 C 50 30, 50 120, 95 120"
                stroke={activeId === 1 ? "url(#gradient-line-active)" : "currentColor"}
                className={activeId === 1 ? "" : "text-zinc-300 dark:text-zinc-700"}
                strokeWidth={activeId === 1 ? "3" : "1.5"}
                strokeDasharray={activeId === 1 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {/* Path 2: Source 2 (mid-top left) to Center */}
              <motion.path
                d="M 5 90 C 50 90, 50 120, 95 120"
                stroke={activeId === 2 ? "url(#gradient-line-active)" : "currentColor"}
                className={activeId === 2 ? "" : "text-zinc-300 dark:text-zinc-700"}
                strokeWidth={activeId === 2 ? "3" : "1.5"}
                strokeDasharray={activeId === 2 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.15, ease: "easeInOut" }}
              />

              {/* Path 3: Source 3 (mid-bottom left) to Center */}
              <motion.path
                d="M 5 150 C 50 150, 50 120, 95 120"
                stroke={activeId === 3 ? "url(#gradient-line-active)" : "currentColor"}
                className={activeId === 3 ? "" : "text-zinc-300 dark:text-zinc-700"}
                strokeWidth={activeId === 3 ? "3" : "1.5"}
                strokeDasharray={activeId === 3 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }}
              />

              {/* Path 4: Source 4 (bottom left) to Center */}
              <motion.path
                d="M 5 210 C 50 210, 50 120, 95 120"
                stroke={activeId === 4 ? "url(#gradient-line-active)" : "currentColor"}
                className={activeId === 4 ? "" : "text-zinc-300 dark:text-zinc-700"}
                strokeWidth={activeId === 4 ? "3" : "1.5"}
                strokeDasharray={activeId === 4 ? "none" : "3 3"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.45, ease: "easeInOut" }}
              />

              {/* Center converging hub icon */}
              <motion.circle
                cx="95"
                cy="120"
                r="5"
                fill="#0075de"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
            </svg>
          </div>

          {/* Right Column: Synthesized Answer Card with Citations (5 cols) */}
          <div className="flex flex-col lg:col-span-5">
            <p className="px-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Grounded AI Response
            </p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-2 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-lg shadow-zinc-950/5 dark:border-zinc-700/80 dark:bg-zinc-800"
            >
              {/* Question header */}
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-200">
                <Sparkles className="size-3.5 shrink-0 text-[#0075de]" />
                <span className="truncate">"How do vector embeddings ground responses without hallucination?"</span>
              </div>

              {/* Synthesized answer text with interactive citation badges */}
              <div className="mt-4 space-y-2.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <p>
                  Documents are partitioned into semantically chunked vectors stored in Pinecone per workspace{" "}
                  <button
                    type="button"
                    onClick={() => setActiveId(1)}
                    onMouseEnter={() => setActiveId(1)}
                    className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 font-bold transition-all ${
                      activeId === 1
                        ? "bg-[#0075de] text-white shadow-xs scale-105"
                        : "bg-teal-100 text-teal-800 hover:bg-teal-200 dark:bg-teal-900/60 dark:text-teal-300"
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
                    className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 font-bold transition-all ${
                      activeId === 2
                        ? "bg-[#0075de] text-white shadow-xs scale-105"
                        : "bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/60 dark:text-pink-300"
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
                    className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 font-bold transition-all ${
                      activeId === 3
                        ? "bg-[#0075de] text-white shadow-xs scale-105"
                        : "bg-sky-100 text-sky-800 hover:bg-sky-200 dark:bg-sky-900/60 dark:text-sky-300"
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
                    className={`inline-flex items-center justify-center rounded-md px-1.5 py-0.5 font-bold transition-all ${
                      activeId === 4
                        ? "bg-[#0075de] text-white shadow-xs scale-105"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/60 dark:text-amber-300"
                    }`}
                  >
                    [4]
                  </button>
                  .
                </p>
              </div>

              {/* Interactive Source Snippet Tray */}
              <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-700/60">
                <AnimatePresence mode="wait">
                  {activeId && (
                    <motion.div
                      key={activeId}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-2.5 text-[11px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-400"
                    >
                      <div className="flex items-center justify-between font-semibold text-zinc-800 dark:text-zinc-200">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                          Verified Excerpt [{activeId}]
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {SOURCES[activeId - 1]?.type}
                        </span>
                      </div>
                      <p className="mt-1 italic leading-relaxed">
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
