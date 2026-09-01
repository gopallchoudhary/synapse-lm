"use client";

import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-[#e6e6e6] bg-[#f6f5f4] py-14 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-950 dark:text-white">
              <span className="grid size-8 place-items-center rounded-xl bg-zinc-950 text-xs font-black text-white dark:bg-white dark:text-zinc-950">
                S
              </span>
              <span className="text-base tracking-tight font-bold">Studybook LM</span>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              An AI-powered research and learning workspace. Create notebooks, add PDFs, websites, YouTube lectures, and text to synthesize grounded answers with verifiable citations.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500">
              <span className="flex size-2 rounded-full bg-emerald-500" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Product Links (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#before-after" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Before & After
                </a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Stack (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Technology Stack
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li className="text-zinc-500">Next.js 16 (App Router & React 19)</li>
              <li className="text-zinc-500">Pinecone Serverless Vector Index</li>
              <li className="text-zinc-500">Inngest Async Background Jobs</li>
              <li className="text-zinc-500">PostgreSQL + Prisma 7</li>
              <li className="text-zinc-500">Clerk Authentication</li>
            </ul>
          </div>

          {/* Legal / Account (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Account
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link href="/login" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                  Workspace Dashboard
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-zinc-200/80 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-600 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Studybook LM. Grounded AI workspace.</p>
          <p className="mt-2 sm:mt-0">Read deeply. Remember more.</p>
        </div>
      </div>
    </footer>
  );
}
