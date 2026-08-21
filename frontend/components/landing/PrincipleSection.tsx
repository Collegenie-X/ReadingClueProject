"use client";

import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import LoopDiagram from "./diagrams/LoopDiagram";
import CardAnatomy from "./diagrams/CardAnatomy";
import { PRINCIPLE } from "@/lib/landing";

/** 반응 3종 + 반증 라운드 순환 + 문제 카드 해부도 */
export default function PrincipleSection() {
  return (
    <Section bordered>
      <SectionHead eyebrow={PRINCIPLE.eyebrow} titleA={PRINCIPLE.title} />

      {/* 문제 카드 해부도 */}
      <Reveal delay={80} className="mt-10">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-6">
          <CardAnatomy />
        </div>
      </Reveal>

      {/* 반응 3종 */}
      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        {PRINCIPLE.reactions.map((r, i) => (
          <Reveal key={r.label} delay={i * 110}>
            <div
              className="h-full rounded-[16px] border p-6 text-center"
              style={{ background: `${r.color}14`, borderColor: `${r.color}3d` }}
            >
              <span className="text-[32px]">{r.emoji}</span>
              <p
                className="mt-2 text-[17px] font-bold"
                style={{ color: r.color }}
              >
                {r.label}
              </p>
              <p className="mt-1.5 text-[13px] text-white/55">{r.desc}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-[11px] font-bold text-white/40">
                {r.rule}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 반증 라운드 순환 */}
      <Reveal delay={140} className="mt-10">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-6">
          <LoopDiagram nodes={PRINCIPLE.loop} caption={PRINCIPLE.loopCaption} />
        </div>
      </Reveal>

      <Reveal delay={180}>
        <p className="mx-auto mt-8 max-w-xl text-center text-[14px] leading-relaxed text-white/45">
          {PRINCIPLE.desc}
        </p>
      </Reveal>

      <DivisionBlock />
    </Section>
  );
}

/** AI 분업 명세서 — 인간 주도 70 / AI 실행 20 / 협업 10 */
function DivisionBlock() {
  const dv = PRINCIPLE.division;

  return (
    <Reveal delay={220} className="mt-14">
      <p className="eyebrow text-center">{dv.label}</p>
      <h3 className="mt-2 text-center text-[22px] leading-tight font-bold text-white md:text-[28px]">
        {dv.title}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[13.5px] leading-relaxed text-white/45">
        {dv.desc}
      </p>

      {/* 비율 바 */}
      <div className="mt-7 flex h-11 w-full overflow-hidden rounded-[10px]">
        {dv.bars.map((b) => (
          <div
            key={b.key}
            className="flex flex-col items-center justify-center"
            style={{ width: `${b.pct}%`, background: `${b.color}2e` }}
          >
            <span className="text-[12.5px] font-bold" style={{ color: b.color }}>
              {b.label}
            </span>
            <span className="text-[11px] font-semibold text-white/45">{b.pct}%</span>
          </div>
        ))}
      </div>

      {/* 담당 업무 */}
      <div className="mt-3 grid gap-3 sm:grid-cols-[7fr_2fr_1fr]">
        {dv.bars.map((b) => (
          <div
            key={b.key}
            className="rounded-[12px] border p-3.5"
            style={{ borderColor: `${b.color}2e`, background: `${b.color}0a` }}
          >
            <ul className="flex flex-col gap-1.5">
              {b.items.map((it) => (
                <li
                  key={it}
                  className="flex items-start gap-2 text-[12px] leading-snug text-white/60"
                >
                  <span
                    className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: b.color }}
                  />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* AI ✕ / 인간 ✓ 대비 */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {dv.notes.map((n) => (
          <div
            key={n.title}
            className="rounded-[14px] border border-white/8 bg-white/[.02] p-4"
          >
            <p className="text-[13px] font-bold text-white">{n.title}</p>
            <p className="mt-2.5 flex items-start gap-2 text-[12.5px] leading-snug text-white/45">
              <span className="shrink-0 text-[#22d3ee]">{dv.aiLabel}</span>
              {n.ai}
            </p>
            <p className="mt-1.5 flex items-start gap-2 text-[12.5px] leading-snug font-semibold text-white/75">
              <span className="shrink-0 text-[#f97316]">{dv.humanLabel}</span>
              {n.human}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
