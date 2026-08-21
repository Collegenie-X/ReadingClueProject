"use client";

/** 반증 라운드 순환 도식 — 승급되지 않으면 다시 반론 단계로 돌아온다 */
export default function LoopDiagram({
  nodes,
  caption,
}: {
  nodes: { emoji: string; label: string; color: string }[];
  caption?: string;
}) {
  const X0 = 108;
  const GAP = 205;
  const Y = 96;

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[760px]">
        <svg viewBox="0 0 830 220" className="h-auto w-full" role="img" aria-label="반증 라운드 순환 도식">
          <defs>
            <marker id="rc-loop-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,.45)" />
            </marker>
            <marker id="rc-loop-back" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
            </marker>
          </defs>

          {nodes.map((n, i) => {
            const cx = X0 + i * GAP;
            return (
              <g key={n.label}>
                <circle cx={cx} cy={Y} r={44} fill={`${n.color}1f`} stroke={`${n.color}80`} strokeWidth="1.6" />
                <text x={cx} y={Y - 4} textAnchor="middle" fontSize="22">
                  {n.emoji}
                </text>
                <text x={cx} y={Y + 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={n.color}>
                  {i + 1}단계
                </text>
                <text x={cx} y={Y + 66} textAnchor="middle" fontSize="13" fontWeight="700" fill="rgba(255,255,255,.8)">
                  {n.label}
                </text>
                {i < nodes.length - 1 && (
                  <line
                    x1={cx + 50}
                    y1={Y}
                    x2={cx + GAP - 52}
                    y2={Y}
                    stroke="rgba(255,255,255,.3)"
                    strokeWidth="1.6"
                    strokeDasharray="6 6"
                    markerEnd="url(#rc-loop-arrow)"
                  >
                    <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.4s" repeatCount="indefinite" />
                  </line>
                )}
              </g>
            );
          })}

          {/* 되돌아가는 루프 — 반론 0건이면 승급 불가 */}
          <path
            d={`M ${X0 + 3 * GAP} ${Y - 46} C ${X0 + 3 * GAP} ${Y - 88}, ${X0 + GAP} ${Y - 88}, ${X0 + GAP} ${Y - 48}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.6"
            strokeDasharray="6 5"
            markerEnd="url(#rc-loop-back)"
          />
          <text x={X0 + 2 * GAP} y={Y - 62} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#ef4444">
            반론 0건 · 승급 불가 → 재라운드
          </text>
        </svg>
      </div>
      {caption && <p className="mt-2 text-center text-[12px] text-white/35">{caption}</p>}
    </div>
  );
}
