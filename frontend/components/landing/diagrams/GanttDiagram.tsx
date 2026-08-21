"use client";

import { SMILE_COLOR, type RoadmapAct } from "@/lib/landing";
import type { Mission } from "@/lib/types";

const X0 = 56;
const COL = 62;
const TOP = 74;

/** 4주 간트 도식 — ACT 3막 위에 주차별 SMILE 단계가 얹힌다 */
export default function GanttDiagram({
  missions,
  acts,
  week,
  onSelect,
}: {
  missions: Mission[];
  acts: RoadmapAct[];
  week: number;
  onSelect: (w: number) => void;
}) {
  const width = X0 * 2 + COL * missions.length;

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[820px]">
        <svg viewBox={`0 0 ${width} 218`} className="h-auto w-full" role="img" aria-label="4주 로드맵 간트 도식">
          {/* ACT 밴드 */}
          {acts.map((a) => {
            const ws = missions.filter((m) => m.act === a.act);
            const x = X0 + (ws[0].week - 1) * COL;
            const w = ws.length * COL;
            return (
              <g key={a.act}>
                <rect x={x + 3} y={26} width={w - 6} height={30} rx={10} fill={`${a.color}1f`} stroke={`${a.color}59`} />
                <text x={x + w / 2} y={46} textAnchor="middle" fontSize="12" fontWeight="800" fill={a.color}>
                  ACT {a.act} · {a.name} ({a.weeks})
                </text>
              </g>
            );
          })}

          {/* 주차 열 */}
          {missions.map((m) => {
            const x = X0 + (m.week - 1) * COL;
            const act = acts.find((a) => a.act === m.act)!;
            const on = m.week === week;
            return (
              <g key={m.week} onClick={() => onSelect(m.week)} style={{ cursor: "pointer" }}>
                <rect
                  x={x + 4}
                  y={TOP}
                  width={COL - 8}
                  height={96}
                  rx={12}
                  fill={on ? `${act.color}2e` : "rgba(255,255,255,.03)"}
                  stroke={on ? act.color : "rgba(255,255,255,.09)"}
                  strokeWidth={on ? 2 : 1}
                  style={{ transition: "all .3s ease" }}
                />
                <text
                  x={x + COL / 2}
                  y={TOP + 22}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="800"
                  fill={on ? "#fff" : "rgba(255,255,255,.5)"}
                >
                  {m.week}주
                </text>

                {/* 해당 주차 SMILE 배지 */}
                {m.smile.map((s, k) => {
                  const cy = TOP + 46 + k * 26;
                  return (
                    <g key={s}>
                      <rect
                        x={x + COL / 2 - 11}
                        y={cy - 11}
                        width={22}
                        height={22}
                        rx={7}
                        fill={`${SMILE_COLOR[s] ?? "#888"}2e`}
                        stroke={`${SMILE_COLOR[s] ?? "#888"}80`}
                      />
                      <text
                        x={x + COL / 2}
                        y={cy + 5}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="900"
                        fill={SMILE_COLOR[s] ?? "#888"}
                      >
                        {s}
                      </text>
                    </g>
                  );
                })}

                {/* 소요 시간 */}
                <text x={x + COL / 2} y={TOP + 116} textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,.35)">
                  {m.estimatedMin}분
                </text>
              </g>
            );
          })}

          {/* 기준선 */}
          <line x1={X0} y1={TOP + 124} x2={width - X0} y2={TOP + 124} stroke="rgba(255,255,255,.08)" />
          <text x={X0} y={20} fontSize="11" fontWeight="700" fill="rgba(255,255,255,.35)" letterSpacing="1.2">
            12 WEEKS · 주차를 누르면 그 주 미션이 열립니다
          </text>
        </svg>
      </div>
    </div>
  );
}
