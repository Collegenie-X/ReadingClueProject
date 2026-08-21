"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import Highlight from "@/components/ui/Highlight";
import { Button } from "@/components/ui";
import { Section, SectionHead } from "./Section";
import MatchPipeline from "./diagrams/MatchPipeline";
import { BookChoiceDiagram, CriticalDiagram, FrameDiagram } from "./diagrams/MatchDiagrams";
import { MATCH } from "@/lib/landing";
import interestsJson from "@/data/interests.json";

const AREAS = interestsJson.areas;
const INTERESTS = interestsJson.interests;

/** 관심사 6개 영역 · 50개 — 진단이 무엇을 골라 주는지 한눈에 */
function AreaGrid() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      {AREAS.map((a) => {
        const list = INTERESTS.filter((i) => i.area === a.code);
        return (
          <div
            key={a.code}
            className="rounded-[14px] border p-3"
            style={{ borderColor: `${a.color}33`, background: `${a.color}0a` }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[14px]">{a.emoji}</span>
              <span className="text-[13px] font-black text-white">{a.name}</span>
              <span className="ml-auto text-[10px] font-bold" style={{ color: a.color }}>
                {list.length}개
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {list.map((i) => (
                <span
                  key={i.id}
                  title={i.description}
                  className="rounded-full border border-white/6 bg-white/[.02] px-1.5 py-px text-[10.5px] text-white/50"
                >
                  {i.emoji} {i.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * MatchSection — 관심 분야를 먼저 정하고, 그 관심사와 연관된 책을 비판적으로 읽는다.
 * 파이프라인 SVG → 관심사 50개 → (어떤 책 · 비판적 사고 · 틀) 3단 통합 카드
 * 각 블록은 커스텀 벡터 도식을 시각 앵커로 쓴다.
 */
export default function MatchSection() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <Section id="match" bordered>
      <SectionHead
        eyebrow={MATCH.eyebrow}
        titleA={MATCH.titleA}
        titleHi={MATCH.titleHi}
        titleTail={MATCH.titleTail}
        hiColor={MATCH.hiColor}
        desc={MATCH.desc}
      />

      {/* ─── 전체 흐름 파이프라인 ─── */}
      <Reveal delay={80} className="mx-auto mt-8 max-w-[720px]">
        <MatchPipeline tick={tick} />
        <p className="mt-1 text-center text-[11px] text-white/30">
          <Highlight text={MATCH.formula.caption} color="#fbbf24" tone="text" />
        </p>
      </Reveal>

      {/* ─── 관심사 50개 ─── */}
      <Reveal delay={120} className="mt-8">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-[16px] font-black text-white">{MATCH.areasLabel}</h3>
            <Button href={MATCH.areasCta.href} variant="ghost">
              {MATCH.areasCta.label}
            </Button>
          </div>
          <p className="mt-1.5 text-[12.5px] text-white/40">
            <Highlight text={MATCH.areasNote} color="#a78bfa" />
          </p>
          <div className="mt-4">
            <AreaGrid />
          </div>
        </div>
      </Reveal>

      {/* ─── 어떤 책 + 비판적 사고 + 틀 — 3단 통합 ─── */}
      <Reveal delay={150} className="mt-8">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-5 md:p-7">
          {/* ① 어떤 책을 읽어야 하나 */}
          <p className="text-[11px] font-bold tracking-[.16em] text-sky-300/60">{MATCH.book.label}</p>
          <h3 className="mt-1.5 text-[19px] leading-tight font-black text-white md:text-[22px]">
            {MATCH.book.title}
          </h3>
          <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-white/45">
            <Highlight text={MATCH.book.desc} color="#38bdf8" />
          </p>

          <div className="mt-4">
            <BookChoiceDiagram />
          </div>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {[MATCH.book.bad, MATCH.book.good].map((col, ci) => (
              <div
                key={ci}
                className="rounded-[16px] border p-4"
                style={{ borderColor: `${col.color}33`, background: `${col.color}08` }}
              >
                <p className="text-[12px] font-black" style={{ color: col.color }}>
                  {ci === 0 ? "✕" : "✓"} {col.label}
                </p>
                <ul className="mt-2.5 flex flex-col gap-1.5">
                  {col.items.map((it) => (
                    <li key={it.t} className="text-[12px] leading-snug">
                      <span className="font-bold text-white/80">{it.t}</span>
                      <span className="ml-1 text-white/40">
                        — <Highlight text={it.d} color={col.color} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ② 비판적 사고 3단계 */}
          <div className="mt-6 border-t border-white/6 pt-5">
            <p className="text-[11px] font-bold tracking-[.16em] text-amber-300/60">
              {MATCH.critical.label}
            </p>
            <h4 className="mt-1 text-[17px] font-black text-white md:text-[19px]">
              {MATCH.critical.title}
            </h4>

            <div className="mt-3">
              <CriticalDiagram />
            </div>

            <p className="mt-1 text-[12px] leading-relaxed text-white/35">
              <Highlight text={MATCH.critical.note} color="#fbbf24" tone="text" />
            </p>
          </div>

          {/* ③ 틀(와꾸) 위에서 한다 */}
          <div className="mt-6 border-t border-white/6 pt-5">
            <p className="text-[11px] font-bold tracking-[.16em] text-emerald-300/60">
              {MATCH.frame.label}
            </p>
            <h4 className="mt-1 text-[17px] font-black text-white md:text-[19px]">
              {MATCH.frame.title}
            </h4>

            <div className="mt-3">
              <FrameDiagram />
            </div>

            <ul className="mt-3 flex flex-col gap-1.5">
              {MATCH.frame.rows.map((r) => (
                <li
                  key={r.bad}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-[12px] border border-white/6 bg-white/[.02] px-3 py-2"
                >
                  <span className="text-[12.5px] text-rose-300/50 line-through">{r.bad}</span>
                  <span className="text-emerald-400">→</span>
                  <span className="text-[12.5px] font-bold text-white/85">{r.good}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[12px] leading-relaxed text-white/35">
              <Highlight text={MATCH.frame.note} color="#22c55e" tone="text" />
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
