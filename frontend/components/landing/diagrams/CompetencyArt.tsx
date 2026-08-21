"use client";

/**
 * OECD 3대 역량 일러스트 — 텍스트 대신 그림으로 설명하는 커스텀 SVG.
 * 아이콘 폰트·이모지 대신 직접 그린 도형만 쓰고, 색은 역량 색을 그대로 받는다.
 */

type ArtProps = { color: string };

const LINE = "rgba(255,255,255,.28)";
const SOFT = "rgba(255,255,255,.55)";

/** 공통 배경 — 은은한 방사형 글로우 */
function Glow({ color, id }: { color: string; id: string }) {
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="180" fill={`url(#${id})`} />
    </>
  );
}

function Frame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

/** 01 — 새로운 가치 만들기: 책에서 물음표가 솟아오르고 불꽃이 튄다 */
export function ValueArt({ color }: ArtProps) {
  return (
    <Frame label="책에서 나만의 질문이 솟아오르는 그림">
      <Glow color={color} id="rc-art-value" />

      {/* 펼친 책 */}
      <path
        d="M52 132 L52 104 Q92 92 116 104 L116 132 Q92 122 52 132 Z"
        fill={`${color}1f`}
        stroke={`${color}99`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M116 104 Q140 92 180 104 L180 132 Q140 122 116 132 Z"
        fill={`${color}14`}
        stroke={`${color}99`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line x1="116" y1="104" x2="116" y2="132" stroke={`${color}99`} strokeWidth="1.6" />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity="0.5">
          <line x1="62" y1={110 + i * 6} x2="106" y2={112 + i * 6} stroke={LINE} strokeWidth="1.4" />
          <line x1="126" y1={112 + i * 6} x2="170" y2={110 + i * 6} stroke={LINE} strokeWidth="1.4" />
        </g>
      ))}

      {/* 솟아오르는 질문 — 말풍선 + 물음표 */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 -5; 0 0"
          dur="3.4s"
          repeatCount="indefinite"
        />
        <rect x="132" y="30" width="86" height="52" rx="16" fill={`${color}26`} stroke={color} strokeWidth="1.8" />
        <path d="M150 82 L146 96 L164 82 Z" fill={`${color}26`} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        <path
          d="M164 48 q0-9 9-9 t9 9 q0 7-9 10 v6"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="173" cy="72" r="2.6" fill={color} />
      </g>

      {/* 불꽃 — 새로 생긴 가치 */}
      <g stroke={color} strokeWidth="2.4" strokeLinecap="round">
        {[
          [246, 44, 246, 28],
          [262, 58, 276, 50],
          [230, 58, 216, 50],
          [258, 34, 268, 24],
          [234, 34, 224, 24],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.75">
            <animate
              attributeName="opacity"
              values="0.2;0.9;0.2"
              dur="2.2s"
              begin={`${i * 0.18}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}
      </g>
      <circle cx="246" cy="62" r="16" fill={`${color}2e`} stroke={color} strokeWidth="1.8" />
      <path d="M246 54 v10 M246 70 h0" stroke={color} strokeWidth="3" strokeLinecap="round" />

      {/* 화살표: 책 → 질문 */}
      <path
        d="M120 100 q14 -22 24 -30"
        fill="none"
        stroke={SOFT}
        strokeWidth="1.5"
        strokeDasharray="5 6"
      >
        <animate attributeName="stroke-dashoffset" from="22" to="0" dur="1.6s" repeatCount="indefinite" />
      </path>
    </Frame>
  );
}

/** 02 — 다른 생각 조율하기: 저울 양쪽에 반대되는 말풍선이 걸린다 */
export function TensionArt({ color }: ArtProps) {
  return (
    <Frame label="반대되는 두 주장을 저울에 올려 조율하는 그림">
      <Glow color={color} id="rc-art-tension" />

      {/* 기둥 */}
      <path d="M160 44 v82" stroke={`${color}cc`} strokeWidth="3" strokeLinecap="round" />
      <path d="M132 146 q28 -20 56 0 Z" fill={`${color}26`} stroke={`${color}cc`} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="160" cy="42" r="6" fill={color} />

      {/* 저울대 — 살짝 기울었다 균형으로 */}
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-6 160 52; 6 160 52; -6 160 52"
          dur="5s"
          repeatCount="indefinite"
        />
        <line x1="60" y1="52" x2="260" y2="52" stroke={`${color}cc`} strokeWidth="3" strokeLinecap="round" />
        <line x1="76" y1="52" x2="76" y2="78" stroke={LINE} strokeWidth="1.6" />
        <line x1="244" y1="52" x2="244" y2="78" stroke={LINE} strokeWidth="1.6" />

        {/* 왼쪽 주장 */}
        <rect x="34" y="78" width="84" height="44" rx="14" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.6" />
        <line x1="50" y1="94" x2="102" y2="94" stroke={SOFT} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="50" y1="106" x2="86" y2="106" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />

        {/* 오른쪽 반론 */}
        <rect x="202" y="78" width="84" height="44" rx="14" fill={`${color}1f`} stroke={`${color}99`} strokeWidth="1.6" />
        <line x1="218" y1="94" x2="270" y2="94" stroke={SOFT} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="218" y1="106" x2="254" y2="106" stroke={LINE} strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* 부딪히는 두 화살표 */}
      <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M118 160 h22 m-8 -6 l8 6 l-8 6" opacity="0.8" />
        <path d="M202 160 h-22 m8 -6 l-8 6 l8 6" opacity="0.8" />
      </g>
      <circle cx="160" cy="160" r="9" fill={`${color}2e`} stroke={color} strokeWidth="1.6">
        <animate attributeName="r" values="7;10;7" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </Frame>
  );
}

/** 03 — 끝까지 책임지기: 고쳐 쓴 흔적이 쌓여 결과물 깃발이 된다 */
export function ResponsibilityArt({ color }: ArtProps) {
  const steps = [
    { x: 48, y: 132, w: 58 },
    { x: 122, y: 112, w: 58 },
    { x: 196, y: 92, w: 58 },
  ];

  return (
    <Frame label="고쳐 쓴 원고가 쌓여 결과물이 되는 그림">
      <Glow color={color} id="rc-art-resp" />

      {/* 고쳐 쓴 원고 3장 — 계단처럼 올라간다 */}
      {steps.map((s, i) => (
        <g key={i}>
          <rect
            x={s.x}
            y={s.y}
            width={s.w}
            height="40"
            rx="10"
            fill={`${color}${i === 2 ? "2e" : "14"}`}
            stroke={`${color}${i === 2 ? "cc" : "80"}`}
            strokeWidth="1.6"
          />
          <line x1={s.x + 12} y1={s.y + 14} x2={s.x + s.w - 12} y2={s.y + 14} stroke={SOFT} strokeWidth="2.2" strokeLinecap="round" />
          <line x1={s.x + 12} y1={s.y + 26} x2={s.x + s.w - 22} y2={s.y + 26} stroke={LINE} strokeWidth="2.2" strokeLinecap="round" />
          {/* 고친 흔적 — 취소선 */}
          {i < 2 && (
            <line
              x1={s.x + 10}
              y1={s.y + 26}
              x2={s.x + s.w - 18}
              y2={s.y + 22}
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}
          {i < 2 && (
            <path
              d={`M${s.x + s.w} ${s.y + 8} q14 -8 20 -18 m-6 0 h7 v7`}
              fill="none"
              stroke={SOFT}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="4 5"
            >
              <animate attributeName="stroke-dashoffset" from="18" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
          )}
        </g>
      ))}

      {/* 결과물 깃발 */}
      <g>
        <line x1="252" y1="92" x2="252" y2="40" stroke={`${color}cc`} strokeWidth="3" strokeLinecap="round" />
        <path d="M252 42 q22 6 40 -2 q-10 12 0 22 q-20 8 -40 2 Z" fill={`${color}33`} stroke={color} strokeWidth="1.8" strokeLinejoin="round">
          <animate attributeName="opacity" values="0.75;1;0.75" dur="2.8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* 체크 — 끝까지 갔다 */}
      <circle cx="225" cy="146" r="15" fill={`${color}26`} stroke={color} strokeWidth="1.8" />
      <path d="M218 146 l5 6 l10 -12" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

export const COMPETENCY_ART: Record<string, (p: ArtProps) => React.ReactElement> = {
  value: ValueArt,
  tension: TensionArt,
  responsibility: ResponsibilityArt,
};
