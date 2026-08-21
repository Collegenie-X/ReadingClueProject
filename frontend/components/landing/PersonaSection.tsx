"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import { PERSONA } from "@/lib/landing";

const tabs = PERSONA.tabs as Array<{
  key: string;
  level: string;
  label: string;
  grade: string;
  icon: string;
  color: string;
  avatar: string;
  profileTitle: string;
  tags: string[];
  xp: { current: number; max: number };
  stats: Array<{ label: string; value: number }>;
  concern: string;
  questGoal: string;
  aiJourney: string;
  href: string;
  ctaLabel: string;
}>;

/** 대상별 페르소나 — 탭 전환으로 레벨별 프로필을 보여준다 */
export default function PersonaSection() {
  const [active, setActive] = useState(0);
  const t = tabs[active];

  return (
    <Section>
      <SectionHead
        eyebrow={PERSONA.eyebrow}
        titleA={PERSONA.title}
        desc={PERSONA.desc}
      />

      {/* 탭 버튼 */}
      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
        {tabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(i)}
              className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200"
              style={{
                borderColor: isActive ? tab.color : "rgba(255,255,255,0.12)",
                background: isActive ? `${tab.color}18` : "transparent",
                color: isActive ? tab.color : "rgba(255,255,255,0.5)",
              }}
            >
              <span className="text-base">{tab.icon}</span>
              <span>
                {tab.level} {tab.label}
              </span>
              <span className="opacity-60">{tab.grade}</span>
            </button>
          );
        })}
      </div>

      {/* 프로필 카드 */}
      <Reveal key={t.key} className="mt-8">
        <div
          className="mx-auto grid max-w-5xl gap-0 overflow-hidden rounded-2xl border lg:grid-cols-2"
          style={{ borderColor: `${t.color}30`, background: "rgba(255,255,255,0.03)" }}
        >
          {/* 왼쪽 — 프로필 */}
          <div className="flex flex-col gap-5 border-b border-white/5 p-6 md:p-8 lg:border-b-0 lg:border-r">
            {/* 아바타 + 레벨 배지 */}
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-3xl">
                {t.avatar}
              </span>
              <div>
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                  style={{ background: `${t.color}25`, color: t.color }}
                >
                  {t.level} · {t.label}
                </span>
                <p className="mt-1 text-[15px] font-bold text-white">{t.profileTitle}</p>
              </div>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1.5">
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* XP 바 */}
            <div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-white/40">EXPERIENCE</span>
                <span style={{ color: t.color }}>
                  {t.xp.current} / {t.xp.max} XP
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(t.xp.current / t.xp.max) * 100}%`,
                    background: `linear-gradient(90deg, ${t.color}, ${t.color}88)`,
                  }}
                />
              </div>
            </div>

            {/* 스탯 바 */}
            <div className="flex flex-col gap-3">
              {t.stats.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-white/40">{s.label}</span>
                    <span className="text-white/70">{s.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${s.value}%`,
                        background: `linear-gradient(90deg, ${t.color}cc, ${t.color}44)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽 — 고민 + 퀘스트 + AI 여정 */}
          <div className="flex flex-col gap-5 p-6 md:p-8">
            {/* 현재 고민 */}
            <div>
              <p className="text-[12px] font-semibold text-white/40">
                <span className="mr-1">{t.avatar}</span> {PERSONA.concernLabel}
              </p>
              <blockquote
                className="mt-2 border-l-2 pl-4 text-[15px] leading-relaxed text-white/80"
                style={{ borderColor: t.color }}
              >
                &ldquo;{t.concern}&rdquo;
              </blockquote>
            </div>

            {/* 퀘스트 목표 */}
            <div>
              <p className="text-[12px] font-semibold text-white/40">
                {PERSONA.questLabel}
              </p>
              <p className="mt-1.5 text-[18px] font-bold text-white">{t.questGoal}</p>
            </div>

            {/* AI 여정 */}
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: `${t.color}30`, background: `${t.color}08` }}
            >
              <p className="text-[12px] font-bold" style={{ color: t.color }}>
                {PERSONA.journeyLabel}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                {t.aiJourney}
              </p>
            </div>

            {/* 무료 안내 + CTA */}
            <div className="mt-auto flex flex-col gap-3">
              <p className="text-[12px] leading-relaxed text-white/40">
                <span className="mr-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[10px] font-bold text-green-400">
                  {PERSONA.freeBadge}
                </span>
                {PERSONA.freeNote}
              </p>
              <Link
                href={t.href}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg px-5 py-2.5 text-[14px] font-bold text-white transition hover:brightness-110"
                style={{ background: t.color }}
              >
                {t.ctaLabel} →
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
