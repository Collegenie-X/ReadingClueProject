"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import Highlight from "@/components/ui/Highlight";
import { Section, SectionHead } from "./Section";
import SmileTimelineDiagram from "./diagrams/SmileTimelineDiagram";
import { JOURNEY } from "@/lib/landing";

/** SMILE+P 6단계 — 좌측 레일에서 단계를 고르면 우측에 상세가 열린다 */
export default function JourneySection() {
  const steps = JOURNEY.steps;
  const [open, setOpen] = useState(0);

  return (
    <Section id="journey">
      <SectionHead
        eyebrow={JOURNEY.eyebrow}
        titleA={JOURNEY.titleA}
        titleHi={JOURNEY.titleHi}
        desc={JOURNEY.desc}
      />

      <Reveal delay={80} className="mt-10">
        <div className="mx-auto max-w-[880px] rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-5">
          <SmileTimelineDiagram
            steps={steps}
            active={open}
            onSelect={(i: number) => setOpen(i)}
          />
        </div>
      </Reveal>

      <p className="mt-3 text-center text-[11px] text-white/30">
        {JOURNEY.diagramCaption}
      </p>

      {/* 리딩 리듬 — 1–3단계는 혼자, 4–6단계는 크루와 함께 */}
      <Reveal delay={120} className="mt-6">
        <div className="mx-auto max-w-[880px] grid gap-3 sm:grid-cols-2">
          {(["solo", "crew"] as const).map((k) => {
            const m = JOURNEY.modes[k];
            const crew = k === "crew";
            const accent = crew ? "#06b6d4" : "#94a3b8";
            return (
              <div
                key={k}
                className="rounded-[14px] border px-4 py-3.5"
                style={{
                  borderColor: crew ? `${accent}3d` : "rgba(255,255,255,.07)",
                  background: crew ? `${accent}0f` : "rgba(255,255,255,.02)",
                }}
              >
                <p className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-[1px]" style={{ color: `${accent}cc` }}>
                  <span className="text-[13px]">{m.icon}</span>
                  {m.short} · {m.label}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                  <Highlight text={m.note} color={accent} />
                </p>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-3 max-w-[720px] text-center text-[12.5px] leading-relaxed text-white/45">
          <Highlight text={JOURNEY.rhythmNote} color="#06b6d4" />
        </p>
      </Reveal>

      <p className="mt-6 text-center text-[13px] text-white/40">
        {JOURNEY.freeNote.split(JOURNEY.freeNoteHi).map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span className="font-bold text-white/60">{JOURNEY.freeNoteHi}</span>
            )}
          </span>
        ))}
      </p>
    </Section>
  );
}
