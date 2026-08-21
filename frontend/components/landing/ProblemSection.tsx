"use client";

import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import FunnelDiagram from "./diagrams/FunnelDiagram";
import { PROBLEM } from "@/lib/landing";

/** 문제 인식 — 이탈 퍼널 도식 중심, 텍스트 최소화 */
export default function ProblemSection() {
  return (
    <Section id="problem" bordered>
      <SectionHead
        eyebrow={PROBLEM.eyebrow}
        titleA={PROBLEM.titleA}
        titleHi={PROBLEM.titleHi}
        hiColor={PROBLEM.titleHiColor}
        desc={PROBLEM.desc}
      />

      {/* 전환 한 줄 — 읽기로 끝나는 독서 → 실행으로 남는 독서 */}
      <Reveal delay={60}>
        <div className="mt-6 flex items-center justify-center gap-3 text-[13px]">
          <span className="font-semibold text-[#ef4444]/75">
            {PROBLEM.shiftFrom}
          </span>
          <span className="text-white/25">→</span>
          <span className="font-bold text-[#a29bfe]">{PROBLEM.shiftTo}</span>
        </div>
      </Reveal>

      {/* BEFORE / AFTER 대비 도식 — 메인 비주얼 */}
      <Reveal delay={80} className="mt-8">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-6">
          <FunnelDiagram />
        </div>
      </Reveal>

      {/* 4가지 구조적 원인 → 해결 카드 */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {PROBLEM.items.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="group flex h-full flex-col rounded-[20px] border border-white/8 bg-white/[.02] p-5 transition hover:border-[#6c5ce7]/30">
              {/* 구조적 원인 태그 */}
              <span
                className="self-start rounded-full px-2.5 py-1 text-[10px] font-bold"
                style={{
                  background: `${p.causeColor}1a`,
                  color: p.causeColor,
                }}
              >
                {p.cause}
              </span>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-[24px]">{p.icon}</span>
                <p className="text-[16px] font-bold text-white">{p.title}</p>
              </div>

              <p className="mt-2 flex-1 text-[12px] leading-relaxed text-white/40">
                {p.desc}
              </p>

              <div className="mt-4 border-l-2 border-[#6c5ce7]/40 pl-3">
                <p className="text-[11px] leading-snug font-semibold text-[#a29bfe]">
                  {p.after}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <ParadigmBlock />
    </Section>
  );
}

/** 패러다임 대비 — 한국식(입력 중심) vs 핀란드식(탐구 중심) */
function ParadigmBlock() {
  const pg = PROBLEM.paradigm;
  const sides = [pg.left, pg.right];

  return (
    <Reveal delay={160} className="mt-14">
      <p className="eyebrow text-center">{pg.label}</p>
      <h3 className="mt-2 text-center text-[22px] leading-tight font-bold text-white md:text-[28px]">
        {pg.title}
      </h3>

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {sides.map((side) => (
          <div
            key={side.label}
            className="rounded-[20px] border p-5"
            style={{ borderColor: `${side.color}33`, background: `${side.color}0a` }}
          >
            <div className="text-center">
              <p className="text-[16px] font-bold" style={{ color: side.color }}>
                {side.label}
              </p>
              <p className="mt-0.5 text-[11.5px] font-semibold text-white/35">
                {side.sub}
              </p>
            </div>

            <ul className="mt-4 flex flex-col gap-2">
              {side.items.map((it) => (
                <li
                  key={it}
                  className="rounded-[10px] border border-white/6 bg-black/25 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-white/60"
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-[12px] border border-[#f97316]/25 bg-[#f97316]/[.08] px-5 py-3.5 text-center text-[13.5px] leading-snug font-bold text-[#fb923c]">
        {pg.question}
      </p>
    </Reveal>
  );
}
