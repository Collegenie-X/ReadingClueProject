"use client";

/**
 * 관심사 6개 영역 일러스트 — 이모지 대신 직접 그린 커스텀 SVG.
 * 모든 그림은 320×180 좌표계를 쓰고, 색은 영역 색(a.color)을 그대로 받는다.
 */

type ArtProps = { color: string };

const LINE = "rgba(255,255,255,.26)";
const SOFT = "rgba(255,255,255,.5)";

function Frame({ label, id, color, children }: { label: string; id: string; color: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id={id} cx="50%" cy="52%" r="52%">
          <stop offset="0%" stopColor={color} stopOpacity="0.26" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="180" fill={`url(#${id})`} />
      {children}
    </svg>
  );
}

/** A 나와 마음 — 거울 앞에 선 나, 그리고 되묻는 물음표 */
function SelfArt({ color }: ArtProps) {
  return (
    <Frame label="거울 앞에서 스스로에게 묻는 그림" id="rc-area-a" color={color}>
      {/* 거울 */}
      <rect x="176" y="34" width="98" height="118" rx="46" fill={`${color}14`} stroke={`${color}99`} strokeWidth="1.8" />
      <path d="M196 60 q10 -14 26 -18" stroke="rgba(255,255,255,.35)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* 거울 속 나 (반사) */}
      <g opacity="0.55">
        <circle cx="225" cy="86" r="16" fill={`${color}33`} stroke={`${color}80`} strokeWidth="1.6" />
        <path d="M199 140 q26 -34 52 0 Z" fill={`${color}26`} stroke={`${color}80`} strokeWidth="1.6" strokeLinejoin="round" />
      </g>
      {/* 나 */}
      <circle cx="86" cy="80" r="20" fill={`${color}2e`} stroke={color} strokeWidth="1.8" />
      <path d="M52 148 q34 -44 68 0 Z" fill={`${color}1f`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* 시선 */}
      <line x1="112" y1="86" x2="170" y2="86" stroke={SOFT} strokeWidth="1.6" strokeDasharray="5 6">
        <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.8s" repeatCount="indefinite" />
      </line>
      {/* 물음표 */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -5;0 0" dur="3.2s" repeatCount="indefinite" />
        <path d="M78 42 q0-11 11-11 t11 11 q0 9-11 12 v6" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <circle cx="89" cy="68" r="2.6" fill={color} />
      </g>
    </Frame>
  );
}

/** B 관계와 소통 — 두 사람 사이를 오가는 말, 그리고 어긋나는 말 */
function RelationArt({ color }: ArtProps) {
  return (
    <Frame label="두 사람이 말을 주고받는 그림" id="rc-area-b" color={color}>
      {[70, 250].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="96" r="19" fill={`${color}2e`} stroke={color} strokeWidth="1.8" />
          <path d={`M${cx - 32} 152 q32 -40 64 0 Z`} fill={`${color}1a`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" opacity={i ? 0.85 : 1} />
        </g>
      ))}
      {/* 말풍선 두 개 — 서로 다른 말 */}
      <g>
        <rect x="104" y="28" width="72" height="40" rx="14" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.6" />
        <path d="M120 68 l-3 12 l16 -12 Z" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.6" strokeLinejoin="round" />
        <line x1="118" y1="44" x2="162" y2="44" stroke={SOFT} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="118" y1="55" x2="146" y2="55" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g>
        <rect x="150" y="86" width="72" height="40" rx="14" fill={`${color}14`} stroke={`${color}80`} strokeWidth="1.6" />
        <path d="M206 126 l3 12 l-16 -12 Z" fill={`${color}14`} stroke={`${color}80`} strokeWidth="1.6" strokeLinejoin="round" />
        <line x1="164" y1="102" x2="208" y2="102" stroke={SOFT} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="164" y1="113" x2="188" y2="113" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      {/* 오가는 선 */}
      <path d="M92 88 q68 -46 138 6" fill="none" stroke={color} strokeWidth="1.6" strokeDasharray="5 7" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur="2s" repeatCount="indefinite" />
      </path>
    </Frame>
  );
}

/** C 감정과 회복 — 요동치는 감정선이 잦아들고, 깨진 자리를 다시 잇는다 */
function EmotionArt({ color }: ArtProps) {
  return (
    <Frame label="감정의 파동이 잦아들고 회복되는 그림" id="rc-area-c" color={color}>
      {/* 감정 파동 → 잔잔해짐 */}
      <path
        d="M24 96 L52 96 L62 54 L74 138 L86 72 L96 112 L108 96 L136 96 Q168 96 186 96"
        fill="none"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
      </path>
      <line x1="186" y1="96" x2="222" y2="96" stroke={`${color}80`} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="4 6" />

      {/* 깨졌다 이어 붙인 하트 */}
      <g transform="translate(252,96)">
        <path
          d="M0 26 C-30 6 -26 -20 -8 -20 C-2 -20 0 -15 0 -12 C0 -15 2 -20 8 -20 C26 -20 30 6 0 26 Z"
          fill={`${color}26`}
          stroke={color}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {/* 이어 붙인 금 */}
        <path d="M0 -12 L-6 0 L4 6 L-2 20" fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="252" cy="96" r="40" fill="none" stroke={`${color}40`} strokeWidth="1.4" strokeDasharray="3 7">
        <animateTransform attributeName="transform" type="rotate" from="0 252 96" to="360 252 96" dur="18s" repeatCount="indefinite" />
      </circle>
    </Frame>
  );
}

/** D 삶과 성장 — 씨앗에서 새싹, 그리고 나무로 */
function GrowthArt({ color }: ArtProps) {
  return (
    <Frame label="씨앗이 새싹을 거쳐 나무가 되는 그림" id="rc-area-d" color={color}>
      <line x1="20" y1="150" x2="300" y2="150" stroke={LINE} strokeWidth="1.6" strokeLinecap="round" />

      {/* 씨앗 */}
      <ellipse cx="62" cy="136" rx="11" ry="14" fill={`${color}2e`} stroke={color} strokeWidth="1.7" />
      <path d="M62 130 q4 6 0 12" fill="none" stroke={`${color}cc`} strokeWidth="1.4" />

      {/* 새싹 */}
      <path d="M158 150 v-34" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M158 124 q-22 -4 -24 -22 q22 0 24 22 Z" fill={`${color}2e`} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M158 116 q22 -6 26 -24 q-24 2 -26 24 Z" fill={`${color}1f`} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />

      {/* 나무 */}
      <path d="M256 150 v-40" stroke={color} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M256 118 l-20 -16 M256 104 l20 -16" stroke={`${color}cc`} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="256" cy="72" r="30" fill={`${color}26`} stroke={color} strokeWidth="1.8">
        <animate attributeName="r" values="28;31;28" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="232" cy="88" r="16" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.5" />
      <circle cx="280" cy="88" r="14" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.5" />

      {/* 진행 화살표 */}
      {[[86, 118], [190, 222]].map(([x1, x2], i) => (
        <path key={i} d={`M${x1} 140 H${x2} m-8 -6 l8 6 l-8 6`} fill="none" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 6">
          <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.8s" repeatCount="indefinite" />
        </path>
      ))}
    </Frame>
  );
}

/** E 사회와 세계 — 지구를 둘러싼 사람들, 그리고 저울 위의 규칙 */
function SocietyArt({ color }: ArtProps) {
  const nodes = [
    [66, 52],
    [66, 140],
    [254, 52],
    [254, 140],
    [286, 96],
  ];
  return (
    <Frame label="세계와 사람들이 규칙으로 연결된 그림" id="rc-area-e" color={color}>
      {/* 지구 */}
      <circle cx="150" cy="96" r="46" fill={`${color}1f`} stroke={color} strokeWidth="1.8" />
      <ellipse cx="150" cy="96" rx="46" ry="18" fill="none" stroke={`${color}80`} strokeWidth="1.4" />
      <path d="M150 50 v92" stroke={`${color}80`} strokeWidth="1.4" />
      <path d="M126 62 q22 12 4 30 q-20 14 6 30" fill="none" stroke={`${color}cc`} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M176 66 q-14 16 6 26 q14 8 2 22" fill="none" stroke={`${color}cc`} strokeWidth="1.8" strokeLinecap="round" />

      {/* 연결된 사람들 */}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line x1="150" y1="96" x2={x} y2={y} stroke={`${color}59`} strokeWidth="1.3" strokeDasharray="4 6">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur={`${1.6 + i * 0.2}s`} repeatCount="indefinite" />
          </line>
          <circle cx={x} cy={y} r="11" fill={`${color}2e`} stroke={color} strokeWidth="1.6" />
        </g>
      ))}

      {/* 규칙 = 저울 */}
      <g transform="translate(40,96)">
        <line x1="-18" y1="0" x2="18" y2="0" stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2="16" stroke={SOFT} strokeWidth="2" strokeLinecap="round" />
        <path d="M-18 0 l-6 10 h12 Z M18 0 l-6 10 h12 Z" fill={`${color}33`} stroke={SOFT} strokeWidth="1.4" strokeLinejoin="round" />
      </g>
    </Frame>
  );
}

/** F 미래와 상상 — 회로에서 출발한 로켓이 별 사이를 지난다 */
function FutureArt({ color }: ArtProps) {
  return (
    <Frame label="회로에서 출발한 로켓이 미래로 향하는 그림" id="rc-area-f" color={color}>
      {/* 별 */}
      {[[40, 40], [96, 26], [268, 46], [230, 22], [286, 118], [58, 118]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={color} opacity="0.8">
          <animate attributeName="opacity" values="0.25;0.95;0.25" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* 궤도 */}
      <path d="M28 148 q80 -104 250 -108" fill="none" stroke={`${color}66`} strokeWidth="1.5" strokeDasharray="6 8">
        <animate attributeName="stroke-dashoffset" from="28" to="0" dur="2.2s" repeatCount="indefinite" />
      </path>

      {/* 로켓 */}
      <g transform="translate(168,74) rotate(38)">
        <animateTransform attributeName="transform" type="translate" values="168 74; 176 66; 168 74" dur="3.4s" repeatCount="indefinite" additive="sum" />
        <path d="M0 -30 q14 16 14 32 h-28 q0 -16 14 -32 Z" fill={`${color}33`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="0" cy="-6" r="6" fill={`${color}59`} stroke={color} strokeWidth="1.5" />
        <path d="M-14 2 l-10 14 h10 Z M14 2 l10 14 h-10 Z" fill={`${color}26`} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M-6 14 q6 18 6 18 q0 0 6 -18" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite" />
        </path>
      </g>

      {/* 회로 — 기술이 출발점 */}
      <g stroke={`${color}cc`} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <rect x="34" y="126" width="34" height="28" rx="6" fill={`${color}1f`} />
        <path d="M68 134 h20 M68 146 h14 M34 134 h-14 M34 146 h-8" />
        <circle cx="51" cy="140" r="4" fill={color} stroke="none" />
      </g>
    </Frame>
  );
}

export const AREA_ART: Record<string, (p: ArtProps) => React.ReactElement> = {
  A: SelfArt,
  B: RelationArt,
  C: EmotionArt,
  D: GrowthArt,
  E: SocietyArt,
  F: FutureArt,
};
