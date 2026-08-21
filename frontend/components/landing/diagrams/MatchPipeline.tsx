"use client";

/**
 * 관심사 × 연관된 책 = 진짜 질문 → 기획안
 *
 * 이모지 대신 벡터 패스로 직접 그린 아이콘을 쓴다.
 * (SVG <text> 안의 이모지는 환경에 따라 렌더링되지 않는다)
 */

/* ─────────────── 커스텀 아이콘 — 각 아이콘은 (0,0) 중심 · 약 32×32 ─────────────── */

/** 나침반 — 관심사: 내가 어디로 갈지 방향부터 정한다 */
function CompassIcon({ color, on }: { color: string; on: boolean }) {
  return (
    <g stroke={color} strokeWidth={on ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <circle cx="0" cy="0" r="13" strokeOpacity={on ? 0.9 : 0.5} />
      {/* 눈금 — N · E · S · W */}
      {[
        [0, -13, 0, -10],
        [13, 0, 10, 0],
        [0, 13, 0, 10],
        [-13, 0, -10, 0],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={on ? 0.6 : 0.3} />
      ))}
      {/* 바늘 — 북쪽만 채운다 */}
      <path d="M 6.5,-6.5 L 2,2 L -2,-2 Z" fill={color} fillOpacity={on ? 0.95 : 0.55} stroke="none" />
      <path d="M -6.5,6.5 L -2,-2 L 2,2 Z" fill={color} fillOpacity={on ? 0.3 : 0.18} stroke="none" />
      <circle cx="0" cy="0" r="1.6" fill={color} fillOpacity={on ? 1 : 0.6} stroke="none" />
    </g>
  );
}

/** 펼친 책 — 연관된 책: 내 관심사를 먼저 파고든 사람의 기록 */
function BookIcon({ color, on }: { color: string; on: boolean }) {
  const o = on ? 0.95 : 0.5;
  return (
    <g stroke={color} strokeWidth={on ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity={o}>
      <path d="M -13,-7 C -9,-10 -4,-10 0,-7 L 0,8 C -4,5 -9,5 -13,8 Z" fill={color} fillOpacity={on ? 0.14 : 0.06} />
      <path d="M 13,-7 C 9,-10 4,-10 0,-7 L 0,8 C 4,5 9,5 13,8 Z" fill={color} fillOpacity={on ? 0.14 : 0.06} />
      <line x1="0" y1="-7" x2="0" y2="8" strokeOpacity={o * 0.7} />
      {/* 본문 줄 */}
      {[-3.5, 0, 3.5].map((dy, i) => (
        <g key={i} strokeOpacity={o * 0.45} strokeWidth="1.2">
          <line x1="-9.5" y1={dy} x2="-3" y2={dy - 0.6} />
          <line x1="3" y1={dy - 0.6} x2="9.5" y2={dy} />
        </g>
      ))}
    </g>
  );
}

/** 물음표 + 마찰 스파크 — 진짜 질문: 관심사와 책이 어긋나는 지점 */
function QuestionIcon({ color, on }: { color: string; on: boolean }) {
  const o = on ? 1 : 0.55;
  return (
    <g stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity={o}>
      <path
        d="M -5.2,-4.8 A 5.4,5.4 0 0 1 4.8,-2.6 C 4.8,1.4 0,2.2 0,6"
        strokeWidth={on ? 2.6 : 2}
      />
      <circle cx="0" cy="10" r={on ? 1.9 : 1.6} fill={color} fillOpacity={o} stroke="none" />
      {/* 마찰 스파크 — 두 생각이 부딪히는 표시 */}
      {[
        [-11, -9, -8, -6.5],
        [11, -9, 8, -6.5],
        [-12, 2, -9, 2],
        [12, 2, 9, 2],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.4" strokeOpacity={o * 0.55} />
      ))}
    </g>
  );
}

/** 문서 + 체크 — 기획안: 실제로 만들 수 있게 적어 둔 것 */
function PlanIcon({ color, on }: { color: string; on: boolean }) {
  const o = on ? 0.95 : 0.5;
  return (
    <g stroke={color} strokeWidth={on ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity={o}>
      <path
        d="M -9,-13 L 4,-13 L 10,-7 L 10,13 L -9,13 Z"
        fill={color}
        fillOpacity={on ? 0.14 : 0.06}
      />
      <path d="M 4,-13 L 4,-7 L 10,-7" strokeOpacity={o * 0.8} />
      {/* 본문 줄 */}
      {[-3.5, -0.2].map((dy, i) => (
        <line key={i} x1="-5" y1={dy} x2="6" y2={dy} strokeWidth="1.2" strokeOpacity={o * 0.45} />
      ))}
      {/* 체크 */}
      <path d="M -5,6.5 L -1.8,9.5 L 6,3.5" strokeWidth={on ? 2.2 : 1.7} />
    </g>
  );
}

/* ─────────────── 노드 · 연산자 정의 ─────────────── */

const NODES = [
  { key: "interest", label: "관심사 50개", sub: "먼저 방향을 정한다", color: "#8b5cf6", x: 72, Icon: CompassIcon },
  { key: "book", label: "연관된 책", sub: "같은 문제를 다룬 책", color: "#38bdf8", x: 252, Icon: BookIcon },
  { key: "question", label: "진짜 질문", sub: "어긋나는 지점", color: "#fbbf24", x: 432, Icon: QuestionIcon },
  { key: "plan", label: "기획안", sub: "직접 만드는 문서", color: "#06b6d4", x: 612, Icon: PlanIcon },
] as const;

const OPS = [
  { symbol: "×", x: 162, color: "#a78bfa" },
  { symbol: "=", x: 342, color: "#fbbf24" },
  { symbol: "→", x: 522, color: "#06b6d4" },
];

const CRITICAL = [
  { no: "01", color: "#8b5cf6", t: "전제 찾기" },
  { no: "02", color: "#f59e0b", t: "어긋난 지점" },
  { no: "03", color: "#22c55e", t: "확인 방법" },
];

const CY = 104;

export default function MatchPipeline({ tick }: { tick: number }) {
  const active = tick % NODES.length;

  return (
    <svg viewBox="0 0 684 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        {NODES.map((n, i) => (
          <filter key={n.key} id={`mp-glow-${i}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={active === i ? 6 : 2} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        <linearGradient id="mp-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".45" />
          <stop offset="38%" stopColor="#38bdf8" stopOpacity=".35" />
          <stop offset="68%" stopColor="#fbbf24" stopOpacity=".35" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity=".45" />
        </linearGradient>
      </defs>

      {/* 흐름선 — 왼쪽에서 오른쪽으로 흐른다 */}
      <line x1={NODES[0].x} y1={CY} x2={NODES[3].x} y2={CY} stroke="url(#mp-line)" strokeWidth="2" />
      <line
        x1={NODES[0].x}
        y1={CY}
        x2={NODES[3].x}
        y2={CY}
        stroke="url(#mp-line)"
        strokeWidth="2.5"
        strokeDasharray="5 11"
        strokeLinecap="round"
      >
        <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1.6s" repeatCount="indefinite" />
      </line>

      {/* 비판적 사고 브래킷 — 책과 질문 사이에서 일어나는 일 */}
      <g>
        <path
          d={`M ${NODES[1].x},46 L ${NODES[1].x},34 L ${NODES[2].x},34 L ${NODES[2].x},46`}
          stroke="rgba(255,255,255,.14)"
          strokeWidth="1"
          fill="none"
        />
        <text
          x={(NODES[1].x + NODES[2].x) / 2}
          y="24"
          textAnchor="middle"
          fill="rgba(255,255,255,.35)"
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.6"
        >
          CRITICAL THINKING · 비판적으로 따지는 구간
        </text>
        {CRITICAL.map((c, i) => {
          const cx = (NODES[1].x + NODES[2].x) / 2 + (i - 1) * 96;
          return (
            <g key={c.no}>
              <circle cx={cx - 30} cy="45" r="2.6" fill={c.color} fillOpacity=".9" />
              <text x={cx - 23} y="48" fill={c.color} fontSize="8" fontWeight="800" fillOpacity=".85">
                {c.no}
              </text>
              <text x={cx - 8} y="48" fill="rgba(255,255,255,.45)" fontSize="8.5" fontWeight="600">
                {c.t}
              </text>
            </g>
          );
        })}
      </g>

      {/* 연산자 */}
      {OPS.map((o) => (
        <g key={o.x}>
          <circle cx={o.x} cy={CY} r="15" fill="#000" />
          <circle cx={o.x} cy={CY} r="15" fill={`${o.color}18`} stroke={o.color} strokeWidth="1.3" strokeOpacity=".55" />
          <text
            x={o.x}
            y={CY + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill={o.color}
            fontSize="15"
            fontWeight="900"
          >
            {o.symbol}
          </text>
        </g>
      ))}

      {/* 노드 */}
      {NODES.map((n, i) => {
        const on = active === i;
        const r = on ? 33 : 27;
        const { Icon } = n;
        return (
          <g key={n.key} className="transition-all duration-500">
            {/* 원판 — 배경을 덮어 흐름선이 아이콘을 관통하지 않게 한다 */}
            <circle cx={n.x} cy={CY} r={r} fill="#000" />
            <g filter={`url(#mp-glow-${i})`}>
              <circle
                cx={n.x}
                cy={CY}
                r={r}
                fill={on ? `${n.color}1f` : `${n.color}0b`}
                stroke={n.color}
                strokeWidth={on ? 2.2 : 1.1}
                strokeOpacity={on ? 1 : 0.32}
                className="transition-all duration-500"
              />
              <g transform={`translate(${n.x} ${CY}) scale(${on ? 1 : 0.86})`} className="transition-all duration-500">
                <Icon color={n.color} on={on} />
              </g>
            </g>

            {/* 활성 펄스 */}
            {on && (
              <circle cx={n.x} cy={CY} r={r + 6} fill="none" stroke={n.color} strokeWidth="1" strokeOpacity=".3">
                <animate attributeName="r" from={String(r + 3)} to={String(r + 17)} dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" from=".4" to="0" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}

            {/* 라벨 */}
            <rect
              x={n.x - 47}
              y={CY + r + 9}
              width="94"
              height="21"
              rx="6"
              fill={on ? n.color : "rgba(255,255,255,.05)"}
              fillOpacity={on ? 0.18 : 1}
              stroke={on ? n.color : "rgba(255,255,255,.08)"}
              strokeWidth="1"
              className="transition-all duration-500"
            />
            <text
              x={n.x}
              y={CY + r + 20}
              textAnchor="middle"
              dominantBaseline="central"
              fill={on ? "#fff" : "rgba(255,255,255,.5)"}
              fontSize="10.5"
              fontWeight={on ? 800 : 500}
              className="transition-all duration-500"
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={CY + r + 40}
              textAnchor="middle"
              dominantBaseline="central"
              fill={on ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.28)"}
              fontSize="9"
              className="transition-all duration-500"
            >
              {n.sub}
            </text>
          </g>
        );
      })}

      {/* 50개 배지 — 나침반 옆 */}
      <g>
        <rect x={NODES[0].x - 20} y={CY - 52} width="40" height="17" rx="8.5" fill="#8b5cf620" stroke="#8b5cf6" strokeWidth="1" strokeOpacity=".45" />
        <text x={NODES[0].x} y={CY - 43} textAnchor="middle" dominantBaseline="central" fill="#a78bfa" fontSize="9" fontWeight="800">
          50개
        </text>
      </g>
    </svg>
  );
}
