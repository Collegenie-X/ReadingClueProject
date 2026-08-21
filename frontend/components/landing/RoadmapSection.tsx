"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import GanttDiagram from "./diagrams/GanttDiagram";
import { ROADMAP, SMILE_COLOR } from "@/lib/landing";
import { MISSIONS } from "@/lib/data";

/** 4주 로드맵 — 간트 도식에서 주차를 고르면 실제 미션이 열린다 */
export default function RoadmapSection() {
  const [week, setWeek] = useState(1);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setWeek((w) => (w % MISSIONS.length) + 1), 4000);
    return () => clearInterval(t);
  }, [auto]);

  const pick = (w: number) => {
    setAuto(false);
    setWeek(w);
  };

  const m = MISSIONS.find((x) => x.week === week) ?? MISSIONS[0];
  const act = ROADMAP.acts.find((a) => a.act === m.act)!;

  return (
    <Section bordered>
      <SectionHead
        eyebrow={ROADMAP.eyebrow}
        titleA={ROADMAP.titleA}
        titleHi={ROADMAP.titleHi}
        desc={ROADMAP.desc}
      />

      {/* ACT 3막 요약 */}
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ROADMAP.acts.map((a, i) => {
          const on = a.act === m.act;
          return (
            <Reveal key={a.act} delay={i * 100}>
              <button
                onClick={() => pick(a.startWeek)}
                className="w-full rounded-[18px] border p-4 text-left transition-all duration-300"
                style={{
                  background: on
                    ? `linear-gradient(140deg, ${a.color}1f, rgba(255,255,255,.02))`
                    : "rgba(255,255,255,.02)",
                  borderColor: on ? `${a.color}55` : "rgba(255,255,255,.08)",
                  opacity: on ? 1 : 0.65,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-extrabold tracking-[1.4px]"
                    style={{ color: a.color }}
                  >
                    ACT {a.act} · {a.en}
                  </span>
                  <span className="text-[11px] font-bold text-white/40">
                    {a.weeks}
                  </span>
                </div>
                <p className="mt-1.5 text-[16px] font-bold text-white">
                  {a.name}
                </p>
                <p className="mt-1 text-[12px] leading-snug text-white/50">
                  {a.line}
                </p>
              </button>
            </Reveal>
          );
        })}
      </div>

      {/* 간트 도식 */}
      <Reveal delay={120} className="mt-6">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-6">
          <GanttDiagram
            missions={MISSIONS}
            acts={ROADMAP.acts}
            week={week}
            onSelect={pick}
          />
        </div>
      </Reveal>

      {/* 선택 주차 상세 */}
      <div
        key={week}
        className="animate-fade-up mt-5 rounded-[22px] border p-6 md:p-8"
        style={{
          background: `linear-gradient(150deg, ${act.color}14 0%, rgba(255,255,255,.02) 65%)`,
          borderColor: `${act.color}3d`,
        }}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wider"
            style={{ background: `${act.color}26`, color: act.color }}
          >
            WEEK {String(m.week).padStart(2, "0")} · ACT {m.act} {act.name}
          </span>
          {m.smile.map((s) => (
            <span
              key={s}
              className="flex h-6 w-6 items-center justify-center rounded-[8px] text-[11px] font-extrabold"
              style={{
                background: `${SMILE_COLOR[s]}26`,
                color: SMILE_COLOR[s],
              }}
            >
              {s}
            </span>
          ))}
          <span className="ml-auto text-[12px] font-bold text-white/45">
            ⏱ 이번 주 약 {m.estimatedMin}분
          </span>
        </div>

        <h3 className="mt-4 text-[24px] leading-tight font-bold text-white md:text-[28px]">
          {m.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-white/55">
          {m.summary}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {m.todos.map((t, i) => (
            <div
              key={t}
              className="rounded-[14px] border border-white/8 bg-black/30 p-3.5"
            >
              <span
                className="text-[11px] font-extrabold"
                style={{ color: act.color }}
              >
                TODO {i + 1}
              </span>
              <p className="mt-1.5 text-[13px] leading-snug text-white/70">{t}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[12px] text-white/35">
          {auto ? ROADMAP.autoHint : ROADMAP.manualHint}
        </p>
      </div>
    </Section>
  );
}
