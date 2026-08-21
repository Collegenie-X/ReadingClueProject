"use client";

/**
 * 결과물 사슬(1주 → 4주) 일러스트 — 이모지를 쓰지 않고 직접 그린 커스텀 SVG.
 * · Glyph : 탭 버튼에 들어가는 20px 미니 아이콘 (이모지 대체)
 * · Scene : 패널에 들어가는 320×180 설명 도식
 * 색은 각 단계 색(step.color)을 그대로 받는다.
 */

type P = { color: string };

const LINE = "rgba(255,255,255,.26)";
const SOFT = "rgba(255,255,255,.55)";

/* ───────────────────────── 미니 글리프 (이모지 대체) ───────────────────────── */

function G({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/** 책 3권이 나란히 — 병렬 독서 */
export const ReadGlyph = ({ color }: P) => (
  <G color={color}>
    <rect x="3" y="5" width="4.6" height="14" rx="1.2" fill={`${color}33`} />
    <rect x="9.7" y="3.5" width="4.6" height="15.5" rx="1.2" fill={`${color}22`} />
    <rect x="16.4" y="6.5" width="4.6" height="12.5" rx="1.2" fill={`${color}33`} />
    <path d="M3 21h18" />
  </G>
);

/** 삼각 프리즘 — 세 렌즈로 나눠 보기 */
export const LensGlyph = ({ color }: P) => (
  <G color={color}>
    <path d="M12 3 21 19H3z" fill={`${color}26`} />
    <path d="M2 11h6M15.5 13l5.5-2M14.5 16l6 1" />
  </G>
);

/** 부딪히는 두 말풍선 — 마찰 */
export const FrictionGlyph = ({ color }: P) => (
  <G color={color}>
    <path d="M2.5 5.5h9v7h-5l-3 2.5v-2.5h-1z" fill={`${color}2e`} />
    <path d="M21.5 9.5h-8v7h4l3 2.5V16.5h1z" fill={`${color}1f`} />
    <path d="M12 3v2M16.5 4.5l-1 1.6" />
  </G>
);

/** 두 원이 겹치는 자리 — 관심사 융합 */
export const FusionGlyph = ({ color }: P) => (
  <G color={color}>
    <circle cx="9" cy="12" r="6.2" fill={`${color}1f`} />
    <circle cx="15" cy="12" r="6.2" fill={`${color}1f`} />
    <path d="M12 6.6a6.2 6.2 0 000 10.8 6.2 6.2 0 000-10.8z" fill={`${color}59`} stroke="none" />
  </G>
);

/** 사람 + 타임라인 — 유저 시나리오 */
export const ScenarioGlyph = ({ color }: P) => (
  <G color={color}>
    <circle cx="8" cy="7" r="3" fill={`${color}33`} />
    <path d="M3.5 14c1-3 8-3 9 0" />
    <path d="M3 19.5h18" />
    <circle cx="9" cy="19.5" r="1.6" fill={`${color}59`} />
    <circle cx="15" cy="19.5" r="1.6" fill={`${color}59`} />
    <circle cx="20" cy="19.5" r="1.6" fill={`${color}59`} />
  </G>
);

/** 다섯 칸 문서 — 기획안 */
export const PlanGlyph = ({ color }: P) => (
  <G color={color}>
    <path d="M5 2.8h9l5 5v13.4H5z" fill={`${color}26`} />
    <path d="M14 2.8v5h5" />
    <path d="M8 12h8M8 15h8M8 18h5" />
  </G>
);

export const CHAIN_GLYPH: Record<string, (p: P) => React.ReactElement> = {
  read: ReadGlyph,
  lens: LensGlyph,
  friction: FrictionGlyph,
  fusion: FusionGlyph,
  scenario: ScenarioGlyph,
  plan: PlanGlyph,
};

/* ───────────────────────── 패널 도식 ───────────────────────── */

function Scene({ label, id, color, children }: { label: string; id: string; color: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id={id} cx="50%" cy="52%" r="52%">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#${id})`} />
      {children}
    </svg>
  );
}

/** 1주 — 입장이 다른 3권이 나란히, 어긋나는 자리에서 질문 3개가 솟는다 */
function ReadScene({ color }: P) {
  const books = [
    { x: 40, h: 74, o: "1f" },
    { x: 84, h: 92, o: "33" },
    { x: 128, h: 66, o: "1f" },
  ];
  return (
    <Scene label="같은 주제 3권을 나란히 읽고 질문 3개를 뽑는 그림" id="rc-chain-read" color={color}>
      <line x1="24" y1="150" x2="180" y2="150" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />
      {books.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={150 - b.h} width="32" height={b.h} rx="5" fill={`${color}${b.o}`} stroke={color} strokeWidth="1.7" />
          <line x1={b.x + 7} y1={150 - b.h + 14} x2={b.x + 25} y2={150 - b.h + 14} stroke={SOFT} strokeWidth="1.8" strokeLinecap="round" />
          <line x1={b.x + 7} y1={150 - b.h + 24} x2={b.x + 19} y2={150 - b.h + 24} stroke={LINE} strokeWidth="1.8" strokeLinecap="round" />
          {/* 어긋나는 지점 → 질문으로 가는 선 */}
          <path
            d={`M${b.x + 16} ${150 - b.h - 6} Q${b.x + 60} ${120 - b.h} 236 ${52 + i * 38}`}
            fill="none"
            stroke={`${color}80`}
            strokeWidth="1.4"
            strokeDasharray="4 6"
          >
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${1.6 + i * 0.25}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      {/* 질문 3개 */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(252,${52 + i * 38})`}>
          <circle r="16" fill={`${color}26`} stroke={color} strokeWidth="1.7" />
          <path d="M-5 -5 q0-6 5-6 t5 6 q0 5-5 6 v3" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="0" cy="8" r="1.8" fill={color} />
        </g>
      ))}
      <text x="98" y="172" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="rgba(255,255,255,.4)">
        1주제 · 입장이 다른 3권
      </text>
    </Scene>
  );
}

/** 2주 — 질문 한 줄기가 프리즘을 통과해 철학·사회학·심리학 세 갈래로 갈린다 */
function LensScene({ color }: P) {
  const rays = [
    { y: 60, label: "철학", c: "#a855f7" },
    { y: 96, label: "사회학", c: "#38bdf8" },
    { y: 132, label: "심리학", c: "#22c55e" },
  ];
  return (
    <Scene label="질문이 프리즘을 지나 철학·사회학·심리학으로 갈리는 그림" id="rc-chain-lens" color={color}>
      {/* 들어오는 질문 */}
      <line x1="16" y1="90" x2="116" y2="90" stroke={SOFT} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="6 6">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.4s" repeatCount="indefinite" />
      </line>
      <circle cx="16" cy="90" r="6" fill={color} opacity="0.9" />
      <text x="52" y="80" fontSize="10.5" fontWeight="700" fill="rgba(255,255,255,.45)">
        내 질문
      </text>

      {/* 프리즘 */}
      <path d="M140 34 L186 132 L94 132 Z" fill={`${color}26`} stroke={color} strokeWidth="1.9" strokeLinejoin="round" />

      {/* 갈라지는 세 갈래 */}
      {rays.map((r, i) => (
        <g key={r.label}>
          <line x1="150" y1="96" x2="238" y2={r.y} stroke={r.c} strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
            <animate attributeName="opacity" values="0.35;1;0.35" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </line>
          <rect x="238" y={r.y - 12} width="66" height="24" rx="8" fill={`${r.c}1f`} stroke={`${r.c}99`} strokeWidth="1.4" />
          <text x="271" y={r.y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={r.c}>
            {r.label}
          </text>
        </g>
      ))}
    </Scene>
  );
}

/** 2–3주 — 크루의 반론이 내 카드를 때려 금이 가고, 고쳐 쓴다 */
function FrictionScene({ color }: P) {
  return (
    <Scene label="크루의 반론이 내 문제 카드에 부딪히는 그림" id="rc-chain-friction" color={color}>
      {/* 내 카드 */}
      <rect x="106" y="46" width="104" height="94" rx="12" fill={`${color}1f`} stroke={color} strokeWidth="1.9" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="120" y1={66 + i * 16} x2={i % 2 ? 182 : 196} y2={66 + i * 16} stroke={i ? LINE : SOFT} strokeWidth="2.2" strokeLinecap="round" />
      ))}
      {/* 금 간 자리 */}
      <path d="M150 46 l-8 26 l14 12 l-10 24 l12 32" fill="none" stroke="#ef4444" strokeWidth="1.7" strokeLinecap="round" opacity="0.75">
        <animate attributeName="opacity" values="0.25;0.9;0.25" dur="2.6s" repeatCount="indefinite" />
      </path>

      {/* 크루 3명의 반론 화살 */}
      {[
        { x: 26, y: 56 },
        { x: 26, y: 128 },
        { x: 268, y: 92 },
      ].map((c, i) => (
        <g key={i}>
          <circle cx={c.x} cy={c.y} r="14" fill={`${color}2e`} stroke={color} strokeWidth="1.7" />
          <circle cx={c.x} cy={c.y - 3} r="4.5" fill={`${color}80`} />
          <path d={`M${c.x - 7} ${c.y + 9} q7 -8 14 0`} fill="none" stroke={`${color}cc`} strokeWidth="1.6" />
          <path
            d={c.x < 160 ? `M${c.x + 18} ${c.y} L100 ${c.y < 90 ? 64 : 122}` : `M${c.x - 18} ${c.y} L216 93`}
            stroke="#ef4444"
            strokeWidth="1.8"
            strokeDasharray="5 5"
            markerEnd="url(#rc-chain-arrow)"
          >
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
      <defs>
        <marker id="rc-chain-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
        </marker>
      </defs>
      <text x="160" y="166" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="rgba(255,255,255,.4)">
        반론 2건 이상 · 재반박해야 통과
      </text>
    </Scene>
  );
}

/** 3주 — 서로 다른 관심사 두 개가 겹치는 자리에서 새 문제가 태어난다 */
function FusionScene({ color }: P) {
  return (
    <Scene label="다른 두 관심사가 겹쳐 새 문제가 나오는 그림" id="rc-chain-fusion" color={color}>
      <circle cx="122" cy="88" r="54" fill={`${color}14`} stroke={`${color}99`} strokeWidth="1.8" />
      <circle cx="198" cy="88" r="54" fill={`${color}14`} stroke={`${color}99`} strokeWidth="1.8" />
      {/* 겹친 영역 */}
      <path
        d="M160 42 a54 54 0 000 92 a54 54 0 000 -92 z"
        fill={`${color}4d`}
        stroke={color}
        strokeWidth="1.8"
      >
        <animate attributeName="opacity" values="0.65;1;0.65" dur="2.8s" repeatCount="indefinite" />
      </path>
      <text x="84" y="92" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="rgba(255,255,255,.6)">
        내 관심사
      </text>
      <text x="238" y="92" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="rgba(255,255,255,.6)">
        크루 관심사
      </text>
      <text x="160" y="84" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
        겹치는
      </text>
      <text x="160" y="100" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
        자리
      </text>
      {/* 아래로 떨어지는 새 문제 */}
      <path d="M160 146 v14 m-6 -6 l6 6 l6 -6" fill="none" stroke={SOFT} strokeWidth="1.6" strokeLinecap="round" />
      <text x="160" y="176" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="rgba(255,255,255,.45)">
        증상 → 구조를 가리키는 한 문장
      </text>
    </Scene>
  );
}

/** 4주 — 사람 하나의 하루 동선 위에 막히는 지점을 찍는다 */
function ScenarioScene({ color }: P) {
  const stops = [
    { x: 76, label: "누가" },
    { x: 148, label: "언제" },
    { x: 220, label: "어디서" },
    { x: 284, label: "무엇을" },
  ];
  return (
    <Scene label="사용자의 하루 동선에서 막히는 지점을 찾는 그림" id="rc-chain-scenario" color={color}>
      {/* 사람 */}
      <circle cx="40" cy="70" r="15" fill={`${color}2e`} stroke={color} strokeWidth="1.8" />
      <path d="M20 118 q20 -30 40 0 Z" fill={`${color}1f`} stroke={color} strokeWidth="1.7" strokeLinejoin="round" />

      {/* 동선 */}
      <path d="M76 132 C112 96, 148 160, 220 116 S 268 96, 292 108" fill="none" stroke={`${color}99`} strokeWidth="2" strokeDasharray="6 7">
        <animate attributeName="stroke-dashoffset" from="26" to="0" dur="2s" repeatCount="indefinite" />
      </path>

      {stops.map((s, i) => {
        const y = [132, 128, 116, 108][i];
        return (
          <g key={s.label}>
            <circle cx={s.x} cy={y} r="7" fill={i === 2 ? "#ef4444" : `${color}59`} stroke={i === 2 ? "#ef4444" : color} strokeWidth="1.6" />
            <text x={s.x} y={y - 16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="rgba(255,255,255,.55)">
              {s.label}
            </text>
          </g>
        );
      })}
      {/* 막히는 지점 표시 */}
      <text x="220" y="152" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ef4444">
        여기서 막힌다
      </text>

      {/* 직접 모은 자료 */}
      <g transform="translate(96,34)">
        <rect x="0" y="0" width="52" height="34" rx="8" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.5" />
        <path d="M10 12h32M10 20h22" stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
        <text x="26" y="-6" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="rgba(255,255,255,.45)">
          설문
        </text>
      </g>
      <g transform="translate(170,34)">
        <rect x="0" y="0" width="52" height="34" rx="8" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.5" />
        <path d="M10 10h24M10 18h32M10 26h16" stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
        <text x="26" y="-6" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="rgba(255,255,255,.45)">
          인터뷰
        </text>
      </g>
    </Scene>
  );
}

/** 4주 — 초안 → 크루 합평 → 고치고 성찰 남기기 — 고친 이력이 가장 중요하다 */
function PlanScene({ color }: P) {
  return (
    <Scene label="기획안 초안을 크루와 합평하고 고친 이력을 남기는 그림" id="rc-chain-plan" color={color}>
      {/* ─ 왼쪽: 초안 문서 (취소선) ─ */}
      <g>
        <path d="M18 22 h72 l14 14 v88 h-86 z" fill={`${color}14`} stroke={`${color}99`} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M90 22 v14 h14" fill="none" stroke={`${color}99`} strokeWidth="1.4" strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <line x1="30" y1={50 + i * 18} x2="92" y2={50 + i * 18} stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
            <line x1="28" y1={52 + i * 18} x2="94" y2={48 + i * 18} stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
          </g>
        ))}
        <text x="60" y="118" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="rgba(255,255,255,.35)">
          초안
        </text>
      </g>

      {/* ─ 가운데: 크루 합평 (사람 + 코멘트) ─ */}
      <g>
        {/* 크루원 2명 */}
        {[{ x: 148, y: 36 }, { x: 148, y: 126 }].map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="13" fill={`${color}2e`} stroke={color} strokeWidth="1.6" />
            <circle cx={c.x} cy={c.y - 3} r="4.5" fill={`${color}80`} />
            <path d={`M${c.x - 7} ${c.y + 8} q7 -7 14 0`} fill="none" stroke={`${color}cc`} strokeWidth="1.5" />
          </g>
        ))}
        {/* 코멘트 말풍선 */}
        <rect x="168" y="22" width="56" height="28" rx="10" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.4" />
        <path d="M170 44 l-4 8 l12 -8" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.4" strokeLinejoin="round" />
        <line x1="178" y1="33" x2="214" y2="33" stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
        <line x1="178" y1="42" x2="204" y2="42" stroke={LINE} strokeWidth="2" strokeLinecap="round" />

        <rect x="168" y="112" width="56" height="28" rx="10" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.4" />
        <path d="M170 134 l-4 8 l12 -8" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.4" strokeLinejoin="round" />
        <line x1="178" y1="123" x2="214" y2="123" stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
        <line x1="178" y1="132" x2="200" y2="132" stroke={LINE} strokeWidth="2" strokeLinecap="round" />

        {/* 화살표: 초안 → 합평 */}
        <path d="M108 80 H134 m-6 -5 l6 5 l-6 5" fill="none" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 5">
          <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.4s" repeatCount="indefinite" />
        </path>

        <text x="172" y="88" fontSize="10" fontWeight="800" fill="rgba(255,255,255,.4)">
          합평
        </text>
      </g>

      {/* ─ 오른쪽: 고친 문서 + 성찰 기록 ─ */}
      <g>
        {/* 화살표: 합평 → 수정 */}
        <path d="M228 80 H248 m-6 -5 l6 5 l-6 5" fill="none" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 5">
          <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.4s" repeatCount="indefinite" />
        </path>

        <path d="M252 22 h50 l12 12 v62 h-62 z" fill={`${color}2e`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M302 22 v12 h12" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="262" y1={44 + i * 16} x2="304" y2={44 + i * 16} stroke={SOFT} strokeWidth="2.2" strokeLinecap="round" />
        ))}
        {/* 체크 */}
        <path d="M298 82 l4 4 l8 -9" fill="none" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="opacity" values="0;1" dur="0.8s" fill="freeze" />
        </path>

        {/* 성찰 메모 */}
        <rect x="252" y="104" width="62" height="34" rx="8" fill="#22c55e14" stroke="#22c55e80" strokeWidth="1.4" />
        <text x="258" y="116" fontSize="8.5" fontWeight="800" fill="#22c55e">
          왜 고쳤나
        </text>
        <line x1="258" y1="126" x2="306" y2="126" stroke="#22c55e59" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="258" y1="132" x2="290" y2="132" stroke="#22c55e40" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      <text x="160" y="172" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="rgba(255,255,255,.4)">
        초안 → 크루 합평 → 고치고 성찰까지 남긴다
      </text>
    </Scene>
  );
}

export const CHAIN_SCENE: Record<string, (p: P) => React.ReactElement> = {
  read: ReadScene,
  lens: LensScene,
  friction: FrictionScene,
  fusion: FusionScene,
  scenario: ScenarioScene,
  plan: PlanScene,
};
