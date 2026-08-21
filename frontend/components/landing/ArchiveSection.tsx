"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import { Badge } from "@/components/ui";
import { ARCHIVE } from "@/lib/landing";
import { PUBLIC_CARDS, BOOKS, getInterest, interestColor } from "@/lib/data";

/** 전국 문제 카드 아카이브 미리보기 */
export default function ArchiveSection() {
  return (
    <Section bordered>
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{ARCHIVE.eyebrow}</p>
          <h2 className="mt-2 text-[28px] leading-tight font-bold text-white md:text-[34px]">
            {ARCHIVE.title}
          </h2>
          <p className="mt-3 text-[14px] text-white/45">
            {ARCHIVE.countCaption.replace("{books}", String(BOOKS.length)).replace("{cards}", String(PUBLIC_CARDS.length))}
          </p>
        </div>
        <Link
          href={ARCHIVE.moreHref}
          className="text-[14px] font-semibold text-[#a29bfe] transition hover:text-white"
        >
          {ARCHIVE.moreLabel}
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PUBLIC_CARDS.slice(0, 6).map((c, i) => {
          const color = interestColor(c.interestId);
          const interest = getInterest(c.interestId);
          return (
            <Reveal key={c.id} delay={(i % 3) * 100}>
              <Link
                href={ARCHIVE.moreHref}
                className="block h-full rounded-[16px] border p-5 transition duration-300 hover:-translate-y-1.5"
                style={{ background: `${color}0d`, borderColor: `${color}2e` }}
              >
                <Badge color={color}>
                  {interest?.emoji} #{c.interestId} {interest?.name}
                </Badge>
                <p className="mt-3 text-[16px] leading-snug font-bold text-white">
                  {c.title}
                </p>
                <p className="mt-2.5 text-[12px] text-white/40">📖 《{c.bookTitle}》</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2.5 text-[12px] font-bold">
                    <span className="text-[#22c55e]">🤝 {c.agree}</span>
                    <span className="text-[#fbbf24]">🔍 {c.symptom}</span>
                    <span className="text-[#ef4444]">⚔️ {c.rebut}</span>
                  </div>
                  <span className="text-[11px] text-white/30">
                    {c.region} · {c.schoolLabel}
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
