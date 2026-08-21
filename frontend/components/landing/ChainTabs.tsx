"use client";

import { useState } from "react";
import Highlight from "@/components/ui/Highlight";
import { OUTCOME } from "@/lib/landing";
import { CHAIN_GLYPH, CHAIN_SCENE } from "./diagrams/ChainArt";

const CHAIN = OUTCOME.chain;

/**
 * 결과물 사슬 — 5단계를 탭으로 펼친다.
 * 각 탭은 커스텀 SVG 도식 + 왜 이 단계가 필요한지 + 실제로 하는 일 3줄 + 산출물.
 * 혼자(solo) / 크루(crew) 리듬을 탭 위에 표시해 "왜 함께해야 하는가"를 드러낸다.
 */
export default function ChainTabs() {
  const [active, setActive] = useState(0);
  const s = CHAIN.steps[active];
  const Scene = CHAIN_SCENE[s.key] ?? CHAIN_SCENE.read;
  const crew = s.mode === "crew";
  const modeLabel = crew ? CHAIN.modes.crew : CHAIN.modes.solo;

  return (
    <div>
      {/* 단계 탭 — 1주 → 4주 */}
      <div
        role="tablist"
        aria-label="결과물 5단계"
        className="no-scrollbar flex items-stretch gap-1 overflow-x-auto rounded-[16px] border border-white/8 bg-white/[.02] p-1.5"
      >
        {CHAIN.steps.map((t, i) => {
          const on = i === active;
          const Glyph = CHAIN_GLYPH[t.key] ?? CHAIN_GLYPH.read;
          return (
            <div key={t.key} className="contents">
              {i > 0 && (
                <span className="hidden shrink-0 items-center px-0.5 text-[12px] font-black text-white/20 sm:flex">
                  →
                </span>
              )}
              <button
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] px-2.5 py-2 text-left transition-colors"
                style={{
                  background: on ? `${t.color}1f` : "transparent",
                  border: `1px solid ${on ? `${t.color}59` : "transparent"}`,
                }}
              >
                <Glyph color={on ? t.color : "rgba(255,255,255,.35)"} />
                <span className="min-w-0">
                  <span
                    className="block text-[9.5px] font-bold tracking-wider"
                    style={{ color: on ? t.color : "rgba(255,255,255,.3)" }}
                  >
                    {t.week} · {t.mode === "crew" ? CHAIN.modes.crew : CHAIN.modes.solo}
                  </span>
                  <span
                    className="block truncate text-[12px] font-black md:text-[12.5px]"
                    style={{ color: on ? "#fff" : "rgba(255,255,255,.45)" }}
                  >
                    {t.name}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* 패널 */}
      <div
        role="tabpanel"
        className="mt-3 grid gap-5 rounded-[20px] border p-5 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] md:p-6"
        style={{ borderColor: `${s.color}33`, background: `${s.color}0a` }}
      >
        <div className="mx-auto w-full max-w-[360px] self-center">
          <Scene color={s.color} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-black"
              style={{ background: `${s.color}26`, color: s.color }}
            >
              {s.week}
            </span>
            <span
              className="rounded-full border px-2 py-0.5 text-[11px] font-bold"
              style={{
                borderColor: crew ? "#22c55e59" : "rgba(255,255,255,.15)",
                color: crew ? "#22c55e" : "rgba(255,255,255,.45)",
                background: crew ? "#22c55e14" : "transparent",
              }}
            >
              {modeLabel}
            </span>
          </div>

          <h4 className="mt-2 text-[19px] leading-tight font-black text-white md:text-[22px]">
            {s.name}
          </h4>
          <p className="mt-1 text-[12.5px] text-white/40">{s.note}</p>

          <p className="mt-3 text-[13px] leading-relaxed text-white/60">
            <Highlight text={s.why} color={s.color} />
          </p>

          <ol className="mt-4 flex flex-col gap-1.5">
            {s.steps.map((line) => (
              <li
                key={line}
                className="rounded-[12px] border px-3 py-2 text-[12.5px] leading-snug text-white/70"
                style={{ borderColor: `${s.color}26`, background: `${s.color}0a` }}
              >
                <Highlight text={line} color={s.color} />
              </li>
            ))}
          </ol>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {s.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border px-2.5 py-1 text-[11px] font-bold text-white/55"
                style={{ borderColor: `${s.color}3d` }}
              >
                {c}
              </span>
            ))}
          </div>

          <p className="mt-4 border-t border-white/8 pt-3 text-[12px] font-bold text-white/50">
            ↳ 남는 것 — <span style={{ color: s.color }}>{s.out}</span>
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-[11.5px] leading-relaxed text-white/35">
        <Highlight text={CHAIN.note} color="#22c55e" tone="text" />
      </p>
    </div>
  );
}
