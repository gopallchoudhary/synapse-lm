"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "~/components/theme-toggle";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const navLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Before & After", href: "#before-after" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Pricing", href: "#pricing" },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e6e6e6] bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Wordmark Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-[#000000] dark:text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-[#000000] text-xs font-bold text-white dark:bg-white dark:text-zinc-950">
            S
          </span>
          <span className="type-title text-base font-bold tracking-tight">Studybook LM</span>
        </Link>

        {/* Center Nav Links - body-sm (15px/400) */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="type-body-sm text-[#31302e] transition-colors hover:text-[#000000] dark:text-zinc-300 dark:hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Nav Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="type-button inline-flex items-center gap-1.5 rounded-full bg-[#0075de] px-4 py-2 text-sm text-white transition-all hover:bg-[#005bab] active:scale-95"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="type-body-sm px-2 font-medium text-[#31302e] transition-colors hover:text-[#000000] dark:text-zinc-300 dark:hover:text-white"
              >
                Log in
              </Link>
              {/* button-utility spec: rounded-md (8px), padding 4px 14px, 1px hairline border */}
              <Link
                href="/sign-up"
                className="type-button inline-flex items-center gap-1.5 rounded-md border border-[#e6e6e6] bg-white px-3.5 py-1.5 text-xs text-[#000000] shadow-xs transition-all hover:bg-[#f6f5f4] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
              >
                <span>Get Studybook free</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#31302e] hover:bg-[#f6f5f4] dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[#e6e6e6] bg-white px-4 py-5 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <nav className="flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="type-body-sm rounded-lg px-2.5 py-2 text-[#31302e] hover:bg-[#f6f5f4] dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-[#e6e6e6] pt-4 dark:border-zinc-800">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/dashboard"
                  className="type-button flex items-center justify-center gap-2 rounded-full bg-[#0075de] px-4 py-2.5 text-sm text-white"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <UserButton />
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="type-body-sm flex items-center justify-center rounded-md border border-[#e6e6e6] bg-white py-2.5 text-[#000000] dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="type-button flex items-center justify-center gap-2 rounded-full bg-[#0075de] py-2.5 text-sm text-white"
                >
                  <span>Get Studybook free</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
