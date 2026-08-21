"use client";

import { PRINCIPLE } from "@/lib/landing";

/** 문제 카드 5칸 해부도 — 학생이 실제로 채우는 화면과 작성 요령을 SVG로 보여준다 */
const ANATOMY = PRINCIPLE.cardAnatomy;
const SLOTS = ANATOMY.slots as Array<{
  no: string;
  title: string;
  icon: string;
  hint: string;
  lines: string[];
  color: string;
}>;

const ROW_H = 78;
const ROW_GAP = 10;
const TOP = 66;

/** 칸마다 다른 커스텀 아이콘 — 24×24 좌표계 기준 path */
function SlotIcon({ name, color }: { name: string; color: string }) {
  const stroke = { fill: "none", stroke: color, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "question": // 말풍선 + 물음표
      return (
        <g {...stroke}>
          <path d="M3 5.5h18v12H9l-4.5 4v-4H3z" />
          <path d="M9.4 9.6a2.6 2.6 0 1 1 3.1 2.6v1.4" />
          <path d="M12.5 15.6v.1" strokeWidth={2.2} />
        </g>
      );
    case "moment": // 장면(사진) + 시계바늘
      return (
        <g {...stroke}>
          <rect x="3" y="4.5" width="14" height="12" rx="2.5" />
          <path d="M3 13l3.6-3.2 3.4 3 2.6-2.2 4.4 3.8" />
          <circle cx="18" cy="16.5" r="4.5" />
          <path d="M18 14.2v2.4l1.6 1" />
        </g>
      );
    case "book": // 펼친 책 + 책갈피
      return (
        <g {...stroke}>
          <path d="M12 6.4C10.2 4.9 7.6 4.4 4 4.9v12.4c3.6-.5 6.2 0 8 1.5 1.8-1.5 4.4-2 8-1.5V4.9c-1.6-.2-3-.2-4.2 0" />
          <path d="M12 6.4v12.4" />
          <path d="M15.6 4.6v6l2.1-1.6 2.1 1.6v-6" />
        </g>
      );
    case "debate": // 마주보는 두 말풍선
      return (
        <g {...stroke}>
          <path d="M2.5 5h10v7h-6l-4 3.2V5z" />
          <path d="M21.5 10h-8v7h5l3 2.6V10z" />
          <path d="M5 8.6h5" />
          <path d="M16 13.6h3" />
        </g>
      );
    case "why": // 나 → 사회로 퍼지는 파동
      return (
        <g {...stroke}>
          <circle cx="8" cy="12" r="2.6" />
          <path d="M13 8.4a5.6 5.6 0 0 1 0 7.2" />
          <path d="M16.4 5.6a10 10 0 0 1 0 12.8" />
          <path d="M19.8 3.4v0" strokeWidth={2.2} />
        </g>
      );
    default:
      return null;
  }
}

export default function CardAnatomy() {
  const height = TOP + SLOTS.length * (ROW_H + ROW_GAP) + 14;

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[680px]">
        <svg viewBox={`0 0 760 ${height}`} className="h-auto w-full" role="img" aria-label="문제 카드 5칸 구조와 작성 요령">
          {/* 카드 외곽 */}
          <rect x="8" y="8" width="744" height={height - 16} rx="22" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.12)" />
          <text x="32" y="42" fontSize="10.5" fontWeight="800" fill="rgba(255,255,255,.4)" letterSpacing="1.4">
            {ANATOMY.title}
          </text>
          <rect x="600" y="26" width="128" height="24" rx="12" fill="rgba(108,92,231,.2)" stroke="rgba(162,155,254,.5)" />
          <text x="664" y="42" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#a29bfe">
            {ANATOMY.badge}
          </text>

          {SLOTS.map((s, i) => {
            const y = TOP + i * (ROW_H + ROW_GAP);
            return (
              <g key={s.no}>
                <rect x="32" y={y} width="696" height={ROW_H} rx="12" fill={`${s.color}12`} stroke={`${s.color}3d`} />
                <rect x="32" y={y} width="4" height={ROW_H} rx="2" fill={s.color} />

                {/* 아이콘 */}
                <g transform={`translate(${52} ${y + 16}) scale(1.05)`} opacity={0.95}>
                  <SlotIcon name={s.icon} color={s.color} />
                </g>

                {/* 번호 · 제목 · 작성 규칙 */}
                <text x="52" y={y + 56} fontSize="8.5" fontWeight="900" fill={s.color} letterSpacing="0.6">
                  {s.no}
                </text>
                <text x="88" y={y + 26} fontSize="10.5" fontWeight="800" fill="rgba(255,255,255,.88)">
                  {s.title}
                </text>
                <text x="88" y={y + 42} fontSize="8.5" fontWeight="600" fill={`${s.color}cc`}>
                  {s.hint}
                </text>

                {/* 구분선 */}
                <line x1="212" y1={y + 12} x2="212" y2={y + ROW_H - 12} stroke={`${s.color}33`} strokeWidth="1" />

                {/* 실제 작성 예시 + 실행 요령 2~3줄 */}
                <text x="228" y={y + 24} fontSize="9.5" fill="rgba(255,255,255,.5)">
                  {s.lines.map((line, li) => (
                    <tspan
                      key={li}
                      x="228"
                      dy={li === 0 ? 0 : 18}
                      fontSize={li === 0 ? 10 : 9}
                      fontWeight={li === 0 ? 700 : 400}
                      fill={li === 0 ? "rgba(255,255,255,.82)" : "rgba(255,255,255,.5)"}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
