"use client";

import { HOW_IT_WORKS } from "@/lib/landing";

/**
 * 3단계 "어떻게 동작하는가" 플로우 도식
 * 진단 → 실행 → 성장 (심플하고 직관적인 흐름)
 */
export default function HowItWorksDiagram() {
  const steps = HOW_IT_WORKS.stages;

  const W = 860;
  const H = 300;
  const CARD_W = 220;
  const CARD_H = 210;
  const GAP = 50;
  const startX = (W - CARD_W * 3 - GAP * 2) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="ReadingClue 3단계 동작 흐름">
      {steps.map((s, i) => {
        const x = startX + i * (CARD_W + GAP);
        const y = 40;
        const cx = x + CARD_W / 2;

        return (
          <g key={i}>
            {/* 연결 화살표 */}
            {i < 2 && (
              <g>
                <line
                  x1={x + CARD_W + 4} y1={y + CARD_H / 2}
                  x2={x + CARD_W + GAP - 4} y2={y + CARD_H / 2}
                  stroke={`${s.color}50`} strokeWidth="2" strokeDasharray="6 4"
                >
                  <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
                </line>
                <polygon
                  points={`${x + CARD_W + GAP - 10},${y + CARD_H / 2 - 5} ${x + CARD_W + GAP - 2},${y + CARD_H / 2} ${x + CARD_W + GAP - 10},${y + CARD_H / 2 + 5}`}
                  fill={`${steps[i + 1].color}60`}
                />
              </g>
            )}

            {/* 카드 배경 */}
            <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={18} fill={`${s.color}0c`} stroke={`${s.color}30`} strokeWidth="1.5" />

            {/* 번호 뱃지 */}
            <circle cx={cx} cy={y + 30} r={18} fill={`${s.color}20`} stroke={`${s.color}50`} strokeWidth="1.5" />
            <text x={cx} y={y + 35} textAnchor="middle" fontSize="12" fontWeight="900" fill={s.color}>{s.no}</text>

            {/* 이모지 */}
            <text x={cx} y={y + 70} textAnchor="middle" fontSize="24">{s.emoji}</text>

            {/* 제목 */}
            <text x={cx} y={y + 96} textAnchor="middle" fontSize="18" fontWeight="900" fill="white">{s.title}</text>
            <text x={cx} y={y + 114} textAnchor="middle" fontSize="11" fontWeight="600" fill={s.color}>{s.subtitle}</text>

            {/* 항목들 */}
            {s.items.map((item, j) => (
              <g key={j}>
                <circle cx={x + 24} cy={y + 138 + j * 20} r={2.5} fill={s.color} opacity="0.6" />
                <text x={x + 34} y={y + 142 + j * 20} fontSize="10.5" fontWeight="600" fill="rgba(255,255,255,0.55)">{item}</text>
              </g>
            ))}

            {/* 소요시간 뱃지 */}
            <rect x={cx - 35} y={y + CARD_H - 8} width={70} height={18} rx={9} fill={`${s.color}20`} stroke={`${s.color}40`} />
            <text x={cx} y={y + CARD_H + 5} textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>{s.desc}</text>
          </g>
        );
      })}
    </svg>
  );
}
