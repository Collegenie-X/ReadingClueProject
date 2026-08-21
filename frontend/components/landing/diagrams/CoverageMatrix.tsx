"use client";

import type { JourneyStep } from "@/lib/landing";

const LABEL_W = 210;
const COL = 88;
const ROW_H = 46;
const TOP = 58;

/** 기존 방식 vs ReadingClue의 6단계 커버리지 매트릭스 */
export default function CoverageMatrix({
  steps,
  headers,
  rows,
  selfLabel,
}: {
  steps: JourneyStep[];
  headers: string[];
  rows: { name: string; cover: number[] }[];
  selfLabel: string;
}) {
  const width = LABEL_W + COL * steps.length + 24;
  const height = TOP + ROW_H * (rows.length + 1) + 24;

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[760px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label="6단계 커버리지 비교 매트릭스"
        >
          {/* 헤더 */}
          {steps.map((s, i) => {
            const x = LABEL_W + i * COL + COL / 2;
            return (
              <g key={s.key}>
                <text x={x} y={22} textAnchor="middle" fontSize="11" fontWeight="900" fill={s.color}>
                  {s.key}
                </text>
                <text x={x} y={40} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="rgba(255,255,255,.45)">
                  {headers[i]}
                </text>
              </g>
            );
          })}

          {/* 기존 방식 행 */}
          {rows.map((r, ri) => {
            const y = TOP + ri * ROW_H;
            const lastCovered = r.cover.lastIndexOf(1);
            return (
              <g key={r.name}>
                <line x1={8} y1={y} x2={width - 16} y2={y} stroke="rgba(255,255,255,.07)" />
                <text x={16} y={y + 28} fontSize="11" fontWeight="700" fill="rgba(255,255,255,.6)">
                  {r.name}
                </text>
                {r.cover.map((v, ci) => {
                  const cx = LABEL_W + ci * COL + COL / 2;
                  return (
                    <g key={ci}>
                      {v ? (
                        <circle cx={cx} cy={y + 23} r={9} fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.3)" />
                      ) : (
                        <g>
                          <circle cx={cx} cy={y + 23} r={9} fill="none" stroke="rgba(255,255,255,.12)" strokeDasharray="3 3" />
                          <line x1={cx - 4} y1={y + 19} x2={cx + 4} y2={y + 27} stroke="rgba(239,68,68,.5)" strokeWidth="1.4" />
                          <line x1={cx + 4} y1={y + 19} x2={cx - 4} y2={y + 27} stroke="rgba(239,68,68,.5)" strokeWidth="1.4" />
                        </g>
                      )}
                    </g>
                  );
                })}
                {/* 어디서 끊기는지 */}
                {lastCovered >= 0 && lastCovered < steps.length - 1 && (
                  <text
                    x={LABEL_W + (lastCovered + 1) * COL + COL / 2}
                    y={y + 42}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="700"
                    fill="rgba(239,68,68,.65)"
                  >
                    여기서 끊김
                  </text>
                )}
              </g>
            );
          })}

          {/* ReadingClue 행 */}
          <g>
            <rect
              x={8}
              y={TOP + rows.length * ROW_H}
              width={width - 24}
              height={ROW_H + 6}
              rx={14}
              fill="rgba(108,92,231,.14)"
              stroke="rgba(139,92,246,.45)"
            />
            <text
              x={16 + 8}
              y={TOP + rows.length * ROW_H + 30}
              fontSize="12"
              fontWeight="900"
              fill="#fff"
            >
              {selfLabel}
            </text>
            {steps.map((s, ci) => {
              const cx = LABEL_W + ci * COL + COL / 2;
              const cy = TOP + rows.length * ROW_H + 26;
              return (
                <g key={s.key}>
                  {ci < steps.length - 1 && (
                    <line
                      x1={cx + 11}
                      y1={cy}
                      x2={cx + COL - 11}
                      y2={cy}
                      stroke={`${s.color}80`}
                      strokeWidth="2"
                    />
                  )}
                  <circle cx={cx} cy={cy} r={11} fill={s.color} />
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#0b0b16">
                    ✓
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
