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
    <header className="sticky top-0 z-50 w-full border-b border-[#e6e6e6]/80 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-zinc-950 dark:text-white">
          <span className="grid size-8 place-items-center rounded-xl bg-zinc-950 text-xs font-black text-white dark:bg-white dark:text-zinc-950">
            S
          </span>
          <span className="text-base tracking-tight font-bold">Studybook LM</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right CTA / Auth controls */}
        <div className="hidden items-center gap-3.5 md:flex">
          <ThemeToggle />

          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0075de] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#005bab]"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="size-3.5" />
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3.5">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0075de] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#005bab] hover:scale-105 active:scale-95"
              >
                <span>Start for free</span>
                <ArrowRight className="size-3" />
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
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="border-b border-zinc-200 bg-white px-4 py-5 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0075de] px-4 py-2.5 text-xs font-semibold text-white"
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
                  className="flex items-center justify-center rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                >
                  Log in
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#0075de] py-2.5 text-xs font-semibold text-white"
                >
                  <span>Start for free</span>
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
