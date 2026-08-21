"use client";

/** 지도자 준비 흐름 — 3단계 5분 도식 */
export default function LeaderFlow({
  steps,
}: {
  steps: { no: string; title: string; desc: string; min: string }[];
}) {
  const X0 = 20;
  const W = 210;
  const GAP = 246;

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[700px]">
        <svg viewBox="0 0 760 150" className="h-auto w-full" role="img" aria-label="지도자 준비 3단계">
          <defs>
            <marker id="rc-leader-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#a29bfe" />
            </marker>
          </defs>

          {steps.map((s, i) => {
            const x = X0 + i * GAP;
            return (
              <g key={s.no}>
                <rect x={x} y={24} width={W} height={82} rx={18} fill="rgba(255,255,255,.05)" stroke="rgba(162,155,254,.35)" />
                <text x={x + 20} y={54} fontSize="18" fontWeight="900" fill="#a29bfe">
                  {s.no}
                </text>
                <text x={x + 48} y={54} fontSize="14" fontWeight="800" fill="#fff">
                  {s.title}
                </text>
                <text x={x + 20} y={80} fontSize="12" fill="rgba(255,255,255,.5)">
                  {s.desc}
                </text>
                <rect x={x + W - 58} y={72} width={44} height={20} rx={10} fill="rgba(108,92,231,.25)" />
                <text x={x + W - 36} y={86} textAnchor="middle" fontSize="11" fontWeight="800" fill="#c4b5fd">
                  {s.min}
                </text>
                {i < steps.length - 1 && (
                  <line x1={x + W + 6} y1={65} x2={x + GAP - 8} y2={65} stroke="#a29bfe" strokeWidth="1.8" strokeDasharray="5 5" markerEnd="url(#rc-leader-arrow)">
                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.2s" repeatCount="indefinite" />
                  </line>
                )}
              </g>
            );
          })}

          <text x={X0} y={132} fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,.4)">
            합계 5분 · 이후 매주 대시보드 확인 10분
          </text>
        </svg>
      </div>
    </div>
  );
}
