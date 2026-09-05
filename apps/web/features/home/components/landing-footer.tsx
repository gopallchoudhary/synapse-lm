"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "~/components/brand-logo";

export function LandingFooter() {
	return (
		<footer className="border-t border-[#e6e6e6] bg-[#f6f5f4] py-12 text-[#31302e] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
					{/* Brand Info (5 cols) */}
					<div className="md:col-span-5">
						<Link
							href="/"
							className="flex items-center gap-2 font-bold tracking-tight text-[#000000] dark:text-white"
						>
							<BrandLogo className="size-12 rounded-md" size={28} />
							<span className="type-title font-bold tracking-tight">
								Studybook LM
							</span>
						</Link>

						<p className="type-caption mt-3.5 max-w-sm text-[#615d59] dark:text-zinc-400 leading-relaxed">
							An AI-powered research and learning workspace. Create notebooks,
							add PDFs, websites, YouTube lectures, and notes to synthesize
							grounded answers with verifiable citations.
						</p>

						<div className="type-caption mt-5 flex items-center gap-2 text-[#615d59]">
							<span className="flex size-2 rounded-full bg-[#1aae39]" />
							<span>All systems operational</span>
						</div>
					</div>

					{/* Product Links (2 cols) */}
					<div className="md:col-span-2">
						<h4 className="type-eyebrow uppercase tracking-wider text-[#000000] dark:text-zinc-100 font-bold">
							Product
						</h4>
						<ul className="type-caption mt-3.5 space-y-2.5">
							<li>
								<a
									href="#how-it-works"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									How It Works
								</a>
							</li>
							<li>
								<a
									href="#before-after"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Before & After
								</a>
							</li>
							<li>
								<a
									href="#use-cases"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Use Cases
								</a>
							</li>
							<li>
								<a
									href="#pricing"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Pricing Plans
								</a>
							</li>
						</ul>
					</div>

					{/* Architecture & Stack (3 cols) */}
					<div className="md:col-span-3">
						<h4 className="type-eyebrow uppercase tracking-wider text-[#000000] dark:text-zinc-100 font-bold">
							Technology Stack
						</h4>
						<ul className="type-caption mt-3.5 space-y-2.5 text-[#615d59] dark:text-zinc-400">
							<li>Next.js 16 (App Router & React 19)</li>
							<li>Pinecone Serverless Vector Index</li>
							<li>Inngest Async Background Jobs</li>
							<li>PostgreSQL + Prisma 7</li>
							<li>Clerk Authentication</li>
						</ul>
					</div>

					{/* Legal / Account (2 cols) */}
					<div className="md:col-span-2">
						<h4 className="type-eyebrow uppercase tracking-wider text-[#000000] dark:text-zinc-100 font-bold">
							Account
						</h4>
						<ul className="type-caption mt-3.5 space-y-2.5">
							<li>
								<Link
									href="/login"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Sign In
								</Link>
							</li>
							<li>
								<Link
									href="/sign-up"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Create Account
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard"
									className="text-[#31302e] hover:text-[#000000] dark:text-zinc-400 dark:hover:text-white transition-colors"
								>
									Workspace Dashboard
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="type-caption mt-10 border-t border-[#e6e6e6] pt-5 text-[#a39e98] dark:border-zinc-800 dark:text-zinc-500 sm:flex sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()} Studybook LM. Grounded AI workspace.
					</p>
					<p className="mt-1 sm:mt-0">Read deeply. Remember more.</p>
				</div>
			</div>
		</footer>
	);
}
