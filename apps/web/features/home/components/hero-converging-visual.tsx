"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Globe,
  Video,
  FileCode,
  Table2,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Network,
  MessageSquareCode,
  RotateCw,
} from "lucide-react";

interface SourceNode {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgLight: string;
  duration: number;
}

const SOURCES: SourceNode[] = [
  {
    id: "pdf",
    name: "Research.pdf",
    type: "PDF Document",
    icon: FileText,
    color: "text-[#2a9d99]",
    borderColor: "border-[#2a9d99]/50",
    bgLight: "bg-[#2a9d99]/10",
    duration: 3.8,
  },
  {
    id: "youtube",
    name: "Lecture.mp4",
    type: "YouTube Video",
    icon: Video,
    color: "text-[#ff64c8]",
    borderColor: "border-[#ff64c8]/50",
    bgLight: "bg-[#ff64c8]/10",
    duration: 4.5,
  },
  {
    id: "web",
    name: "Article.html",
    type: "Web Research",
    icon: Globe,
    color: "text-[#0075de]",
    borderColor: "border-[#62aef0]/60",
    bgLight: "bg-[#62aef0]/12",
    duration: 3.2,
  },
  {
    id: "notes",
    name: "Notes.md",
    type: "Markdown Note",
    icon: FileCode,
    color: "text-[#8b5cf6]",
    borderColor: "border-[#d6b6f6]/60",
    bgLight: "bg-[#d6b6f6]/15",
    duration: 4.0,
  },
  {
    id: "data",
    name: "Metrics.csv",
    type: "Data Sheet",
    icon: Table2,
    color: "text-[#dd5b00]",
    borderColor: "border-[#dd5b00]/50",
    bgLight: "bg-[#dd5b00]/10",
    duration: 3.5,
  },
];

interface ArtifactCard {
  id: string;
  title: string;
  type: string;
  icon: React.ElementType;
  badgeColor: string;
  textColor: string;
  description: string;
  previewElement: React.ReactNode;
}

export function HeroConvergingVisual() {
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [engineHovered, setEngineHovered] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Outer Card Container with DESIGN.md surface styling */}
      <div className="shadow-level-1 relative overflow-hidden rounded-2xl border border-[#e6e6e6] bg-white p-5 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">
        
        {/* Top Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e6e6] pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-[#1aae39] animate-pulse" />
            <span className="type-eyebrow uppercase tracking-wider text-[#615d59] dark:text-zinc-400">
              Live Synthesis Engine Pipeline
            </span>
          </div>

          <div className="type-caption flex items-center gap-2 text-xs text-[#615d59] dark:text-zinc-400">
            <span className="hidden sm:inline">Messy Multi-modal Sources</span>
            <ArrowRight className="size-3 text-[#a39e98]" />
            <span className="font-semibold text-[#0075de]">Neural Engine</span>
            <ArrowRight className="size-3 text-[#a39e98]" />
            <span className="hidden sm:inline font-semibold text-[#1aae39]">Clean Artifacts</span>
          </div>
        </div>

        {/* Visual Workflow Canvas */}
        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center min-h-[460px]">
          
          {/* LEFT: 5 Floating Raw Source Badges (3 cols) */}
          <div className="flex flex-row flex-wrap justify-center gap-2.5 lg:col-span-3 lg:flex-col lg:justify-between lg:gap-3">
            <div className="w-full text-center lg:text-left mb-1">
              <span className="type-eyebrow uppercase tracking-widest text-[#a39e98] dark:text-zinc-500">
                Raw Input Sources
              </span>
            </div>

            {SOURCES.map((source, index) => {
              const Icon = source.icon;
              const isHighlighted =
                activeSourceId === source.id ||
                engineHovered ||
                (activeArtifactId !== null && index < 3);

              return (
                <motion.div
                  key={source.id}
                  animate={{
                    y: [0, -5, 0],
                    x: [0, index % 2 === 0 ? 2 : -2, 0],
                  }}
                  transition={{
                    duration: source.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onMouseEnter={() => setActiveSourceId(source.id)}
                  onMouseLeave={() => setActiveSourceId(null)}
                  className={`group relative flex cursor-pointer items-center gap-2.5 rounded-xl border p-2.5 transition-all duration-200 ${
                    isHighlighted
                      ? `bg-white shadow-level-1 ring-2 ring-[#0075de]/30 dark:bg-zinc-800 ${source.borderColor}`
                      : "border-[#e6e6e6] bg-[#f6f5f4]/80 hover:border-[#a39e98] hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div
                    className={`grid size-7 shrink-0 place-items-center rounded-md ${source.bgLight} ${source.color}`}
                  >
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0 pr-1">
                    <p className="type-body-sm truncate font-semibold text-[#000000] dark:text-zinc-100">
                      {source.name}
                    </p>
                    <p className="type-caption text-[11px] text-[#615d59] dark:text-zinc-400">
                      {source.type}
                    </p>
                  </div>

                  {/* Flow connector dot on right edge */}
                  <div className="hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 size-2 rounded-full border border-white bg-[#0075de] dark:border-zinc-900" />
                </motion.div>
              );
            })}
          </div>

          {/* CENTER: Converging & Diverging SVG Motion Curves (6 cols on Desktop) */}
          <div className="relative flex flex-col items-center justify-center lg:col-span-4 h-full py-4">
            
            {/* SVG Connecting Flow Canvas */}
            <svg
              className="absolute inset-0 hidden lg:block h-full w-full overflow-visible pointer-events-none"
              viewBox="0 0 240 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="stream-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0075de" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2a9d99" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0075de" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1aae39" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Ingress Paths: Left Sources to Center Hub */}
              <motion.path
                d="M 10 40 C 70 40, 80 190, 115 190"
                stroke={activeSourceId === "pdf" || engineHovered ? "#0075de" : "#e6e6e6"}
                strokeWidth={activeSourceId === "pdf" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 10 115 C 70 115, 80 190, 115 190"
                stroke={activeSourceId === "youtube" || engineHovered ? "#ff64c8" : "#e6e6e6"}
                strokeWidth={activeSourceId === "youtube" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 10 190 C 70 190, 80 190, 115 190"
                stroke={activeSourceId === "web" || engineHovered ? "#0075de" : "#e6e6e6"}
                strokeWidth={activeSourceId === "web" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 10 265 C 70 265, 80 190, 115 190"
                stroke={activeSourceId === "notes" || engineHovered ? "#8b5cf6" : "#e6e6e6"}
                strokeWidth={activeSourceId === "notes" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 10 340 C 70 340, 80 190, 115 190"
                stroke={activeSourceId === "data" || engineHovered ? "#dd5b00" : "#e6e6e6"}
                strokeWidth={activeSourceId === "data" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />

              {/* Egress Paths: Center Hub to Right Artifacts */}
              <motion.path
                d="M 125 190 C 160 190, 170 50, 230 50"
                stroke={activeArtifactId === "chat" || engineHovered ? "#0075de" : "#e6e6e6"}
                strokeWidth={activeArtifactId === "chat" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 125 190 C 160 190, 170 145, 230 145"
                stroke={activeArtifactId === "flashcard" || engineHovered ? "#ff64c8" : "#e6e6e6"}
                strokeWidth={activeArtifactId === "flashcard" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 125 190 C 160 190, 170 240, 230 240"
                stroke={activeArtifactId === "quiz" || engineHovered ? "#1aae39" : "#e6e6e6"}
                strokeWidth={activeArtifactId === "quiz" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />
              <motion.path
                d="M 125 190 C 160 190, 170 330, 230 330"
                stroke={activeArtifactId === "mindmap" || engineHovered ? "#8b5cf6" : "#e6e6e6"}
                strokeWidth={activeArtifactId === "mindmap" || engineHovered ? "2.5" : "1.5"}
                strokeDasharray="4 4"
                className="transition-colors duration-200 dark:stroke-zinc-700"
              />

              {/* Animated Light Flow Particle along stream */}
              <motion.circle
                r="3.5"
                fill="#0075de"
                animate={{
                  cx: [15, 115, 230],
                  cy: [115, 190, 50],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.4,
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                r="3.5"
                fill="#1aae39"
                animate={{
                  cx: [15, 115, 230],
                  cy: [265, 190, 240],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.8,
                  delay: 0.8,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Central Synthesis Engine Card */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              onMouseEnter={() => setEngineHovered(true)}
              onMouseLeave={() => setEngineHovered(false)}
              className="relative z-10 flex flex-col items-center justify-center rounded-2xl border-2 border-[#0075de]/30 bg-white p-4 shadow-level-2 text-center dark:border-sky-500/40 dark:bg-zinc-900 max-w-[200px]"
            >
              {/* Animated Pulsing Core Aura */}
              <div className="relative mb-2 grid size-12 place-items-center rounded-xl bg-gradient-to-br from-[#0075de]/15 via-sky-400/10 to-transparent">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="absolute inset-0 rounded-xl border border-dashed border-[#0075de]/40"
                />
                <Cpu className="size-6 text-[#0075de] animate-pulse" />
              </div>

              <h4 className="type-title text-xs font-bold text-[#000000] dark:text-white">
                Studybook Engine
              </h4>
              <p className="type-caption mt-0.5 text-[10px] text-[#615d59] dark:text-zinc-400">
                Chunk • Embed • Synthesize
              </p>

              {/* Status Chips */}
              <div className="mt-2.5 flex items-center gap-1 rounded-md bg-[#f6f5f4] px-2 py-0.5 text-[9px] font-semibold text-[#31302e] dark:bg-zinc-800 dark:text-zinc-300">
                <Sparkles className="size-2.5 text-[#0075de]" />
                <span>RAG & Vector Core</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: 4 Clean Output Artifact Cards (5 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:col-span-5">
            <div className="col-span-full mb-0.5">
              <span className="type-eyebrow uppercase tracking-widest text-[#a39e98] dark:text-zinc-500">
                Grounded Output Artifacts
              </span>
            </div>

            {/* Artifact 1: Grounded Chat Answer with Citations */}
            <motion.div
              whileHover={{ y: -3 }}
              onMouseEnter={() => setActiveArtifactId("chat")}
              onMouseLeave={() => setActiveArtifactId(null)}
              className={`shadow-level-1 relative rounded-xl border p-3 transition-all duration-200 ${
                activeArtifactId === "chat" || engineHovered
                  ? "border-[#0075de] bg-white ring-1 ring-[#0075de]/30 dark:bg-zinc-800"
                  : "border-[#e6e6e6] bg-white hover:border-[#a39e98] dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-2 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <MessageSquareCode className="size-3.5 text-[#0075de]" />
                  <span className="type-eyebrow font-bold text-[#000000] dark:text-white">
                    Grounded Chat
                  </span>
                </div>
                <span className="type-caption text-[10px] text-[#1aae39] font-semibold">
                  Verified
                </span>
              </div>

              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-4/5 rounded-full bg-[#e6e6e6] dark:bg-zinc-700" />
                <p className="type-caption text-[11px] leading-tight text-[#31302e] dark:text-zinc-300">
                  Cosine similarity bounded across partitioned chunks{" "}
                  <span className="rounded-xs bg-[#0075de]/15 px-1 py-0.2 font-bold text-[#0075de] text-[10px]">
                    [1]
                  </span>{" "}
                  <span className="rounded-xs bg-[#2a9d99]/15 px-1 py-0.2 font-bold text-[#2a9d99] text-[10px]">
                    [2]
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Artifact 2: Interactive Flashcard Stack */}
            <motion.div
              whileHover={{ y: -3 }}
              onMouseEnter={() => setActiveArtifactId("flashcard")}
              onMouseLeave={() => setActiveArtifactId(null)}
              className={`shadow-level-1 relative rounded-xl border p-3 transition-all duration-200 ${
                activeArtifactId === "flashcard" || engineHovered
                  ? "border-[#ff64c8] bg-white ring-1 ring-[#ff64c8]/30 dark:bg-zinc-800"
                  : "border-[#e6e6e6] bg-white hover:border-[#a39e98] dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-2 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-[#ff64c8]" />
                  <span className="type-eyebrow font-bold text-[#000000] dark:text-white">
                    Flashcards
                  </span>
                </div>
                <span className="type-caption text-[10px] text-[#ff64c8] font-semibold">
                  12 Cards
                </span>
              </div>

              <div className="mt-2 rounded-md bg-[#ff64c8]/5 border border-[#ff64c8]/20 p-2 text-[11px]">
                <p className="font-semibold text-[#000000] dark:text-white">
                  Q: Vector index recall?
                </p>
                <p className="text-[10px] text-[#615d59] dark:text-zinc-400 mt-0.5">
                  A: 99.2% accuracy per workspace
                </p>
              </div>
            </motion.div>

            {/* Artifact 3: Practice Quiz */}
            <motion.div
              whileHover={{ y: -3 }}
              onMouseEnter={() => setActiveArtifactId("quiz")}
              onMouseLeave={() => setActiveArtifactId(null)}
              className={`shadow-level-1 relative rounded-xl border p-3 transition-all duration-200 ${
                activeArtifactId === "quiz" || engineHovered
                  ? "border-[#1aae39] bg-white ring-1 ring-[#1aae39]/30 dark:bg-zinc-800"
                  : "border-[#e6e6e6] bg-white hover:border-[#a39e98] dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-2 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="size-3.5 text-[#1aae39]" />
                  <span className="type-eyebrow font-bold text-[#000000] dark:text-white">
                    Practice Quiz
                  </span>
                </div>
                <span className="type-caption text-[10px] text-[#1aae39] font-bold">
                  +10 XP
                </span>
              </div>

              <div className="mt-2 space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 rounded-md bg-[#1aae39]/10 px-2 py-1 text-[#1aae39] font-medium">
                  <CheckCircle2 className="size-3 shrink-0" />
                  <span className="truncate">Dense Retrieval (Correct)</span>
                </div>
              </div>
            </motion.div>

            {/* Artifact 4: Visual Mind Map */}
            <motion.div
              whileHover={{ y: -3 }}
              onMouseEnter={() => setActiveArtifactId("mindmap")}
              onMouseLeave={() => setActiveArtifactId(null)}
              className={`shadow-level-1 relative rounded-xl border p-3 transition-all duration-200 ${
                activeArtifactId === "mindmap" || engineHovered
                  ? "border-[#8b5cf6] bg-white ring-1 ring-[#8b5cf6]/30 dark:bg-zinc-800"
                  : "border-[#e6e6e6] bg-white hover:border-[#a39e98] dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-2 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <Network className="size-3.5 text-[#8b5cf6]" />
                  <span className="type-eyebrow font-bold text-[#000000] dark:text-white">
                    Visual Mind Map
                  </span>
                </div>
                <span className="type-caption text-[10px] text-[#8b5cf6]">
                  Nodes
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="rounded-xs bg-[#f6f5f4] px-1.5 py-0.5 font-medium text-[#31302e] dark:bg-zinc-800 dark:text-zinc-300">
                  Sources
                </span>
                <span className="text-[#a39e98]">➔</span>
                <span className="rounded-xs bg-[#0075de]/15 px-1.5 py-0.5 font-bold text-[#0075de]">
                  Vector
                </span>
                <span className="text-[#a39e98]">➔</span>
                <span className="rounded-xs bg-[#8b5cf6]/15 px-1.5 py-0.5 font-bold text-[#8b5cf6]">
                  Insights
                </span>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
}
