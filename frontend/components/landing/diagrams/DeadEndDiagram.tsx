"use client";

/**
 * "기존 독서는 3단계에서 멈춘다"를 보여주는 도식.
 * 읽기 → 요약 → 감상문 뒤에 막힌 벽, 그 아래로 ReadingClue의 3단계가 이어진다.
 */
export default function DeadEndDiagram({
  flow,
  deadEnd,
  next,
}: {
  flow: { no: string; label: string; emoji: string }[];
  deadEnd: string;
  next: { key: string; label: string; color: string }[];
}) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[720px]">
        <svg
          viewBox="0 0 900 250"
          className="h-auto w-full"
          role="img"
          aria-label="기존 독서 흐름과 ReadingClue 흐름 비교"
        >
          <defs>
            <marker id="rc-a1" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,.3)" />
            </marker>
            <marker id="rc-a2" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#a29bfe" />
            </marker>
          </defs>

          {/* ── 윗줄: 기존 독서 ── */}
          <text x="0" y="18" fontSize="11" fontWeight="700" fill="rgba(255,255,255,.35)" letterSpacing="1.2">
            기존 독서
          </text>
          {flow.map((f, i) => {
            const x = 30 + i * 170;
            return (
              <g key={f.no}>
                <rect x={x} y={34} width={140} height={62} rx={16} fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" />
                <text x={x + 70} y={60} textAnchor="middle" fontSize="18">
                  {f.emoji}
                </text>
                <text x={x + 70} y={84} textAnchor="middle" fontSize="13" fontWeight="700" fill="rgba(255,255,255,.7)">
                  {f.no}. {f.label}
                </text>
                {i < flow.length - 1 && (
                  <line x1={x + 146} y1={65} x2={x + 164} y2={65} stroke="rgba(255,255,255,.3)" strokeWidth="1.5" markerEnd="url(#rc-a1)" />
                )}
              </g>
            );
          })}

          {/* 막힌 벽 */}
          <line x1={546} y1={65} x2={566} y2={65} stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#rc-a1)" />
          <g>
            <rect x={570} y={30} width={12} height={70} fill="#ef4444" opacity="0.55" />
            <text x={600} y={60} fontSize="13" fontWeight="800" fill="#ef4444">
              {deadEnd}
            </text>
            <text x={600} y={82} fontSize="11.5" fill="rgba(255,255,255,.4)">
              질문도 · 반증도 · 실행도 없음
            </text>
          </g>

          {/* ── 분기 ── */}
          <path d="M100,100 L100,150" stroke="#a29bfe" strokeWidth="1.5" strokeDasharray="5 5" markerEnd="url(#rc-a2)" />
          <text x="116" y="134" fontSize="11.5" fontWeight="700" fill="#a29bfe">
            ReadingClue는 여기서부터 이어갑니다
          </text>

          {/* ── 아랫줄: ReadingClue ── */}
          {next.map((n, i) => {
            const x = 30 + i * 170;
            return (
              <g key={n.key}>
                <rect
                  x={x}
                  y={165}
                  width={140}
                  height={62}
                  rx={16}
                  fill={`${n.color}1f`}
                  stroke={`${n.color}66`}
                />
                <circle cx={x + 26} cy={196} r={14} fill={`${n.color}33`} />
                <text x={x + 26} y={201} textAnchor="middle" fontSize="13" fontWeight="900" fill={n.color}>
                  {n.key}
                </text>
                <text x={x + 50} y={201} fontSize="13" fontWeight="700" fill="#fff">
                  {n.label}
                </text>
                {i < next.length - 1 && (
                  <line x1={x + 146} y1={196} x2={x + 164} y2={196} stroke={`${n.color}cc`} strokeWidth="1.8" markerEnd="url(#rc-a2)" />
                )}
              </g>
            );
          })}
          <g>
            <rect x={540} y={165} width={190} height={62} rx={16} fill="rgba(108,92,231,.16)" stroke="rgba(162,155,254,.5)" />
            <text x={635} y={191} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">
              🎤 기획안 발표 · 4주차
            </text>
            <text x={635} y={211} textAnchor="middle" fontSize="11.5" fill="rgba(255,255,255,.5)">
              프로젝트 산출물이 남습니다
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
