"use client";

/**
 * MatchSection 하위 블록용 커스텀 도식 3종
 * — 모두 벡터 패스로 직접 그린다 (SVG <text> 안의 이모지는 렌더링되지 않는다)
 *
 *  1) BookChoiceDiagram  — 막다른 책 vs 부딪히는 책
 *  2) CriticalDiagram    — 전제 → 어긋남 → 확인
 *  3) FrameDiagram       — 빈 종이 vs 칸이 그려진 틀
 */

const RED = "#ef4444";
const GREEN = "#22c55e";
const SKY = "#38bdf8";
const AMBER = "#f59e0b";
const VIOLET = "#8b5cf6";
const CYAN = "#06b6d4";

/* ══════════════════ 1. 어떤 책을 읽어야 하나 ══════════════════ */

/** 덮인 책 — 정답이 정해져 있어 더 갈 곳이 없는 책 */
function ClosedBook({ y, color }: { y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="1.3" fill={`${color}12`} strokeOpacity=".55">
      <rect x="-52" y={y} width="104" height="15" rx="2.5" />
      <line x1="-44" y1={y} x2="-44" y2={y + 15} strokeOpacity=".4" />
      <line x1="-34" y1={y + 7.5} x2="36" y2={y + 7.5} strokeOpacity=".25" />
    </g>
  );
}

/** 펼친 책 — 주장이 있어 반박할 수 있는 책 */
function OpenBook({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <g
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      transform={flip ? "scale(-1 1)" : undefined}
    >
      <path d="M -26,-14 C -18,-20 -8,-20 0,-14 L 0,16 C -8,10 -18,10 -26,16 Z" fill={`${color}1a`} />
      <path d="M 26,-14 C 18,-20 8,-20 0,-14 L 0,16 C 8,10 18,10 26,16 Z" fill={`${color}12`} />
      <line x1="0" y1="-14" x2="0" y2="16" strokeOpacity=".6" />
      {[-7, 0, 7].map((dy, i) => (
        <g key={i} strokeWidth="1.1" strokeOpacity=".4">
          <line x1="-19" y1={dy} x2="-6" y2={dy - 1.2} />
          <line x1="6" y1={dy - 1.2} x2="19" y2={dy} />
        </g>
      ))}
    </g>
  );
}

export function BookChoiceDiagram() {
  return (
    <svg viewBox="0 0 660 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <defs>
        <filter id="bc-spark" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ─── 왼쪽: 막다른 책 ─── */}
      <g transform="translate(150 0)">
        <text x="0" y="22" textAnchor="middle" fill={RED} fontSize="10.5" fontWeight="800" fillOpacity=".85">
          ✕ 정답이 정해진 책
        </text>

        <g transform="translate(-30 0)">
          <ClosedBook y={52} color={RED} />
          <ClosedBook y={72} color={RED} />
          <ClosedBook y={92} color={RED} />
        </g>

        {/* 흐름이 벽에 막힌다 */}
        <line x1="30" y1="82" x2="72" y2="82" stroke={RED} strokeWidth="1.6" strokeDasharray="4 4" strokeOpacity=".5" />
        <g stroke={RED} strokeWidth="2" strokeLinecap="round" strokeOpacity=".8">
          <line x1="80" y1="52" x2="80" y2="112" />
          <line x1="92" y1="74" x2="104" y2="90" />
          <line x1="104" y1="74" x2="92" y2="90" />
        </g>

        <text x="0" y="146" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="9.5">
          읽고 나면 남의 결론만 남는다
        </text>
        <text x="0" y="162" textAnchor="middle" fill={RED} fontSize="9.5" fontWeight="700" fillOpacity=".7">
          따질 여지가 없음 → 질문 0개
        </text>
      </g>

      {/* 구분선 */}
      <line x1="330" y1="30" x2="330" y2="170" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="3 5" />

      {/* ─── 오른쪽: 부딪히는 책 ─── */}
      <g transform="translate(500 0)">
        <text x="0" y="22" textAnchor="middle" fill={GREEN} fontSize="10.5" fontWeight="800" fillOpacity=".85">
          ✓ 1주제 — 3권 병렬 독서
        </text>

        {/* 서로 마주 본 세 책 */}
        <g transform="translate(-100 80) rotate(-12)">
          <OpenBook color={SKY} />
        </g>
        <g transform="translate(0 68) rotate(0)">
          <OpenBook color={CYAN} />
        </g>
        <g transform="translate(100 80) rotate(12)">
          <OpenBook color={VIOLET} />
        </g>

        {/* 부딪히는 지점 — 스파크 + 물음표 */}
        <g filter="url(#bc-spark)">
          {[
            [-50, 60, -36, 68],
            [50, 60, 36, 68],
            [-50, 104, -36, 98],
            [50, 104, 36, 98],
            [-18, 56, -8, 64],
            [18, 56, 8, 64],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={AMBER} strokeWidth="1.6" strokeLinecap="round" strokeOpacity=".6" />
          ))}
          <circle cx="0" cy="84" r="23" fill={`${AMBER}1a`} stroke={AMBER} strokeWidth="1.6" strokeOpacity=".8" />
          <g stroke={AMBER} strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M -4.6,-4.2 A 4.8,4.8 0 0 1 4.2,-2.3 C 4.2,1.2 0,1.9 0,5.2" transform="translate(0 82)" />
          </g>
          <circle cx="0" cy="92" r="1.7" fill={AMBER} />
        </g>

        <text x="0" y="146" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="9.5">
          세 권이 부딪히는 지점이 곧
        </text>
        <text x="0" y="162" textAnchor="middle" fill={GREEN} fontSize="9.5" fontWeight="700" fillOpacity=".8">
          내 질문 한 문장이 된다
        </text>
      </g>
    </svg>
  );
}

/* ══════════════════ 2. 비판적 사고 3단계 ══════════════════ */

export function CriticalDiagram() {
  return (
    <svg viewBox="0 0 660 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* ── 01 전제 — 수면 아래 깔려 있는 것 ── */}
      <g transform="translate(105 0)">
        <text x="0" y="20" textAnchor="middle" fill={VIOLET} fontSize="9.5" fontWeight="800">
          01 · 저자의 전제를 찾는다
        </text>

        {/* 보이는 주장 */}
        <g stroke={VIOLET} strokeWidth="1.4" strokeLinecap="round">
          <rect x="-52" y="36" width="104" height="34" rx="5" fill={`${VIOLET}14`} strokeOpacity=".7" />
          {[47, 55, 63].map((y, i) => (
            <line key={i} x1="-42" y1={y} x2={i === 2 ? 18 : 42} y2={y} strokeWidth="1.1" strokeOpacity=".4" />
          ))}
        </g>
        <text x="60" y="56" fill="rgba(255,255,255,.35)" fontSize="8" fontWeight="600">
          보이는 주장
        </text>

        {/* 수면 */}
        <line x1="-64" y1="80" x2="64" y2="80" stroke="rgba(255,255,255,.25)" strokeWidth="1" strokeDasharray="4 4" />

        {/* 숨은 전제 */}
        <g>
          <rect x="-52" y="90" width="104" height="34" rx="5" fill={`${VIOLET}0a`} stroke={VIOLET} strokeWidth="1.3" strokeDasharray="4 3" strokeOpacity=".55" />
          <text x="0" y="111" textAnchor="middle" fill={VIOLET} fontSize="10" fontWeight="800" fillOpacity=".85">
            숨은 전제
          </text>
        </g>
        {/* 아래를 가리키는 화살표 */}
        <path d="M 0,72 L 0,86 M -4,82 L 0,87 L 4,82" stroke={VIOLET} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <text x="0" y="146" textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize="9">
          말하지 않고 깔아 둔 것
        </text>
      </g>

      {/* 화살표 1 */}
      <path d="M 205,80 L 240,80 M 233,74 L 240,80 L 233,86" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* ── 02 어긋남 — 내 경험 vs 책의 주장 ── */}
      <g transform="translate(330 0)">
        <text x="0" y="20" textAnchor="middle" fill={AMBER} fontSize="9.5" fontWeight="800">
          02 · 어긋나는 지점을 찾는다
        </text>

        <circle cx="-24" cy="78" r="36" fill={`${SKY}12`} stroke={SKY} strokeWidth="1.4" strokeOpacity=".6" />
        <circle cx="24" cy="78" r="36" fill={`${VIOLET}12`} stroke={VIOLET} strokeWidth="1.4" strokeOpacity=".6" />
        <text x="-46" y="78" textAnchor="middle" fill={SKY} fontSize="8.5" fontWeight="700" fillOpacity=".8">
          내 경험
        </text>
        <text x="46" y="78" textAnchor="middle" fill={VIOLET} fontSize="8.5" fontWeight="700" fillOpacity=".8">
          책의 주장
        </text>

        {/* 겹치는 자리의 균열 */}
        <path
          d="M 0,46 L -5,62 L 4,72 L -4,86 L 5,96 L 0,110"
          stroke={AMBER}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        <text x="0" y="146" textAnchor="middle" fill={AMBER} fontSize="9" fontWeight="700" fillOpacity=".8">
          납득이 안 되는 그 한 칸
        </text>
      </g>

      {/* 화살표 2 */}
      <path d="M 430,80 L 465,80 M 458,74 L 465,80 L 458,86" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* ── 03 확인 — 직접 모으는 1차 데이터 ── */}
      <g transform="translate(555 0)">
        <text x="0" y="20" textAnchor="middle" fill={GREEN} fontSize="9.5" fontWeight="800">
          03 · 직접 확인한다
        </text>

        {/* 클립보드 */}
        <g stroke={GREEN} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-38" y="38" width="76" height="82" rx="6" fill={`${GREEN}10`} strokeOpacity=".7" />
          <rect x="-13" y="32" width="26" height="12" rx="3" fill={`${GREEN}20`} strokeOpacity=".8" />
          {[60, 78, 96].map((y, i) => (
            <g key={i}>
              <path d={`M -26,${y} L -22,${y + 4} L -14,${y - 4}`} strokeWidth="1.8" fill="none" strokeOpacity=".85" />
              <line x1="-6" y1={y} x2="26" y2={y} strokeWidth="1.2" strokeOpacity=".35" />
            </g>
          ))}
        </g>

        <text x="0" y="146" textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize="9">
          설문 · 인터뷰 · 관찰
        </text>
      </g>
    </svg>
  );
}

/* ══════════════════ 3. 와꾸 — 빈 종이 vs 칸이 그려진 틀 ══════════════════ */

const SLOTS = ["배경", "주장", "반론", "근거", "확인"];

export function FrameDiagram() {
  return (
    <svg viewBox="0 0 660 190" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* ─── 왼쪽: 빈 종이 ─── */}
      <g transform="translate(112 0)">
        <text x="0" y="22" textAnchor="middle" fill={RED} fontSize="10" fontWeight="800" fillOpacity=".8">
          “일단 책부터 읽어라”
        </text>

        <rect x="-56" y="38" width="112" height="112" rx="7" fill="rgba(255,255,255,.02)" stroke="rgba(255,255,255,.14)" strokeWidth="1.3" strokeDasharray="5 4" />
        {/* 막막한 물음표 */}
        <g stroke="rgba(255,255,255,.22)" strokeWidth="3.4" strokeLinecap="round" fill="none">
          <path d="M -8,-8 A 8.5,8.5 0 0 1 7.5,-4 C 7.5,2 0,3.4 0,9" transform="translate(0 90)" />
        </g>
        <circle cx="0" cy="107" r="2.8" fill="rgba(255,255,255,.22)" />

        <text x="0" y="170" textAnchor="middle" fill={RED} fontSize="9.5" fontWeight="700" fillOpacity=".7">
          무엇을 채울지 아무도 안 알려 준다
        </text>
      </g>

      {/* 변환 화살표 */}
      <g transform="translate(238 94)">
        <line x1="-14" y1="0" x2="34" y2="0" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeOpacity=".6" />
        <path d="M 26,-7 L 34,0 L 26,7" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeOpacity=".8" />
        <text x="10" y="-12" textAnchor="middle" fill={GREEN} fontSize="8.5" fontWeight="800" fillOpacity=".7">
          틀을 준다
        </text>
      </g>

      {/* ─── 오른쪽: 칸이 그려진 틀 ─── */}
      <g transform="translate(300 0)">
        <text x="170" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="800" fillOpacity=".85">
          문제 카드 5칸 — 빈칸만 채우면 된다
        </text>

        <rect x="0" y="38" width="340" height="112" rx="9" fill={`${GREEN}07`} stroke={`${GREEN}`} strokeWidth="1.3" strokeOpacity=".35" />

        {SLOTS.map((s, i) => {
          const x = 14 + i * 65;
          const done = i < 2;
          const color = done ? GREEN : CYAN;
          return (
            <g key={s}>
              <rect
                x={x}
                y="54"
                width="57"
                height="64"
                rx="6"
                fill={done ? `${GREEN}18` : "rgba(255,255,255,.03)"}
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity={done ? 0.7 : 0.35}
                strokeDasharray={done ? undefined : "4 3"}
              />
              <text x={x + 28.5} y="72" textAnchor="middle" fill={color} fontSize="9.5" fontWeight="800" fillOpacity={done ? 0.95 : 0.6}>
                {s}
              </text>
              {done ? (
                <g stroke={GREEN} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1={x + 12} y1="86" x2={x + 45} y2="86" strokeWidth="1.1" strokeOpacity=".4" />
                  <line x1={x + 12} y1="94" x2={x + 38} y2="94" strokeWidth="1.1" strokeOpacity=".4" />
                  <path d={`M ${x + 18},${106} L ${x + 25},${112} L ${x + 39},${99}`} strokeWidth="2" strokeOpacity=".9" />
                </g>
              ) : (
                <g stroke={CYAN} strokeOpacity=".25" strokeWidth="1.1" strokeLinecap="round">
                  <line x1={x + 12} y1="88" x2={x + 45} y2="88" />
                  <line x1={x + 12} y1="98" x2={x + 45} y2="98" />
                  <line x1={x + 12} y1="108" x2={x + 33} y2="108" />
                </g>
              )}
            </g>
          );
        })}

        {/* 채우고 있는 펜 */}
        <g transform="translate(190 122)" stroke={CYAN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 0,10 L 2,2 L 16,-12 L 20,-8 L 6,6 Z" fill={`${CYAN}22`} strokeOpacity=".8" />
          <line x1="14" y1="-10" x2="18" y2="-6" strokeOpacity=".5" />
        </g>

        <text x="170" y="170" textAnchor="middle" fill={GREEN} fontSize="9.5" fontWeight="700" fillOpacity=".75">
          채울 칸이 정해져 있어야 끝까지 간다
        </text>
      </g>
    </svg>
  );
}
