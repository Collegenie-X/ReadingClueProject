"use client";

import { PROBLEM } from "@/lib/landing";

/**
 * 기존 독서 이탈 퍼널 ↔ ReadingClue 6단계 대비 도식
 * 같은 6줄 축에 BEFORE / AFTER를 나란히 두어 각 이탈 지점에 대응하는 장치를 보여준다
 */
export default function FunnelDiagram() {
  const before = PROBLEM.beforeStages;
  const after = PROBLEM.afterStages;

  return (
    <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr]">
      {/* BEFORE — 이탈 퍼널 */}
      <div className="rounded-[18px] border border-white/8 bg-white/[.02] p-4 md:p-5">
        <p className="mb-4 text-center text-[10px] font-extrabold tracking-[1.5px] text-white/30">
          {PROBLEM.beforeLabel}
        </p>

        <div className="space-y-1.5">
          {before.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2"
              style={{
                background: s.wall
                  ? "rgba(239,68,68,0.08)"
                  : "rgba(255,255,255,0.03)",
              }}
            >
              <span className="text-[14px]">{s.emoji}</span>
              <span
                className="text-[12px] font-medium"
                style={{
                  color: s.wall
                    ? "rgba(239,68,68,0.75)"
                    : "rgba(255,255,255,0.55)",
                }}
              >
                {s.label}
              </span>

              {/* 잔존율 막대 */}
              <span className="ml-auto flex items-center gap-2">
                <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-white/6 sm:block">
                  <span
                    className="block h-full rounded-full transition-[width] duration-700"
                    style={{
                      width: `${s.pct}%`,
                      background: s.wall
                        ? "rgba(239,68,68,0.5)"
                        : "rgba(255,255,255,0.28)",
                    }}
                  />
                </span>
                <span
                  className="w-9 text-right text-[12px] font-bold tabular-nums"
                  style={{
                    color: s.wall
                      ? "rgba(239,68,68,0.85)"
                      : "rgba(255,255,255,0.45)",
                  }}
                >
                  {s.pct}%
                </span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[10px] text-white/25">
          {PROBLEM.beforeNote}
        </p>
      </div>

      {/* 전환 화살표 */}
      <div className="flex items-center justify-center py-1 text-[20px] text-[#6c5ce7]/50">
        <span className="lg:hidden">↓</span>
        <span className="hidden lg:inline">→</span>
      </div>

      {/* AFTER — SMILE+P 6단계 */}
      <div className="rounded-[18px] border border-[#6c5ce7]/25 bg-[#6c5ce7]/[.04] p-4 md:p-5">
        <p className="mb-4 text-center text-[10px] font-extrabold tracking-[1.5px] text-[#a29bfe]">
          {PROBLEM.afterLabel}
        </p>

        <div className="space-y-1.5">
          {after.map((s) => (
            <div
              key={s.key}
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2"
              style={{ background: `${s.color}12` }}
            >
              <span className="text-[14px]">{s.emoji}</span>
              <span className="text-[12px] font-medium text-white/70">
                {s.label}
              </span>
              <span
                className="ml-auto rounded-md px-2 py-0.5 text-[10px] font-extrabold"
                style={{ background: `${s.color}22`, color: s.color }}
              >
                {s.key}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-center text-[10px] font-semibold text-[#a29bfe]/70">
          {PROBLEM.afterNote}
        </p>
      </div>
    </div>
  );
}
