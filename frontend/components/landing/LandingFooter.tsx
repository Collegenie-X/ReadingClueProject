"use client";

import Link from "next/link";
import { FOOTER } from "@/lib/landing";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="shell">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2.5">
            <span className="grad-brand flex h-8 w-8 items-center justify-center rounded-[14px] text-[15px]">
              📖
            </span>
            <span className="text-[17px] font-bold text-white">{FOOTER.brand}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-white/45">
            {FOOTER.links.map((l) => (
              <Link key={l.href} href={l.href} className="transition hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-center text-[12px] text-white/25">{FOOTER.quote}</p>
      </div>
    </footer>
  );
}
