"use client";

import { useState } from "react";
import Highlight from "@/components/ui/Highlight";
import { ECOSYSTEM } from "@/lib/landing";
import { COMPETENCY_ART } from "./diagrams/CompetencyArt";

const OECD = ECOSYSTEM.why.oecd;

/**
 * OECD 3대 역량 × 학습 사이클(예측 → 행동 → 성찰) — 탭 하나에 한 칸씩.
 * 역량 카드와 사이클 도식을 따로 늘어놓지 않고 하나의 탭으로 합쳐,
 * 각 탭은 커스텀 SVG 그림 + 한 줄 설명만 보여준다. 한 바퀴 = 4주.
 */
export default function OecdTabs() {
  const [active, setActive] = useState(0);
  const c = OECD.competencies[active];
  const Art = COMPETENCY_ART[c.key] ?? COMPETENCY_ART.value;

  return (
    <div className="mt-6">
      {/* 탭 — 사이클 순서(예측 → 행동 → 성찰) 그대로 */}
      <div
        role="tablist"
        aria-label="OECD 3대 역량과 학습 사이클"
        className="no-scrollbar flex items-stretch gap-1 overflow-x-auto rounded-[16px] border border-white/8 bg-white/[.02] p-1.5"
      >
        {OECD.competencies.map((t, i) => {
          const on = i === active;
          return (
            <div key={t.key} className="contents">
              {i > 0 && (
                <span className="hidden shrink-0 items-center px-0.5 text-[13px] font-black text-white/20 sm:flex">
                  →
                </span>
              )}
              <button
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left transition-colors"
                style={{
                  background: on ? `${t.color}1f` : "transparent",
                  border: `1px solid ${on ? `${t.color}59` : "transparent"}`,
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-black"
                  style={{
                    background: on ? t.color : "rgba(255,255,255,.08)",
                    color: on ? "#0b0b12" : "rgba(255,255,255,.5)",
                  }}
                >
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className="block truncate text-[9.5px] font-bold tracking-wider"
                    style={{ color: on ? t.color : "rgba(255,255,255,.3)" }}
                  >
                    {t.phase}
                  </span>
                  <span
                    className="block truncate text-[12.5px] font-black md:text-[13.5px]"
                    style={{ color: on ? "#fff" : "rgba(255,255,255,.45)" }}
                  >
                    {t.ko}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 패널 — 그림 왼쪽 / 문장 오른쪽 */}
      <div
        role="tabpanel"
        className="mt-3 grid items-center gap-5 rounded-[20px] border p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:p-6"
        style={{ borderColor: `${c.color}33`, background: `${c.color}0a` }}
      >
        <div className="mx-auto w-full max-w-[360px]">
          <Art color={c.color} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-black"
              style={{ background: `${c.color}26`, color: c.color }}
            >
              {c.weeks}
            </span>
            <span className="text-[11px] font-bold text-white/45">{c.phaseKo}</span>
            <span className="text-[11px] font-bold text-white/25">{c.en}</span>
          </div>

          <h5 className="mt-2 text-[20px] leading-tight font-black text-white md:text-[24px]">
            {c.ko}
          </h5>

          <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">
            <Highlight text={c.one} color={c.color} />
          </p>

          <p className="mt-3 text-[13.5px] leading-relaxed text-white/75">
            <Highlight text={c.how} color={c.color} />
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {c.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border px-2.5 py-1 text-[11.5px] font-bold text-white/60"
                style={{ borderColor: `${c.color}3d`, background: `${c.color}0f` }}
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-4 border-t border-white/8 pt-3 text-[11.5px] font-bold text-white/40">
            ↳ {c.phaseRc}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11.5px] leading-relaxed text-white/35">
        <Highlight text={OECD.tabsNote} color="#38bdf8" tone="text" />
      </p>
    </div>
  );
}
