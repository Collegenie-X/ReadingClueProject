"use client";

import { ECOSYSTEM } from "@/lib/landing";

const CX = 280;
const CY = 280;

/** 층별 궤도 반지름 + 노드 배치 각도(0°=오른쪽, 90°=아래) — 위쪽(250~290°)은 층 이름 자리라 비워둔다 */
const GEOM = [
  { r: 250, nodeR: 20, angles: [25, 80, 135, 190] },
  { r: 195, nodeR: 20, angles: [50, 105, 160, 205] },
  { r: 140, nodeR: 20, angles: [0, 50, 100, 150, 200, 310] },
  { r: 85, nodeR: 18, angles: [30, 90, 150] },
];

/** 좌표는 소수 둘째 자리로 고정한다 — 서버/클라이언트 부동소수 직렬화 차이로 인한 하이드레이션 불일치 방지 */
const round = (n: number) => Math.round(n * 100) / 100;

const pos = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [round(CX + r * Math.cos(a)), round(CY + r * Math.sin(a))];
};

/**
 * 거시적(사회학) 관점의 동심원 생태계 도식
 * 사회 → 교육 시스템 → 학교 → 학생·ReadingClue
 * 노드 라벨은 오른쪽 설명 패널이 담당한다 — 도식 안에는 층 이름만 두어 텍스트가 겹치지 않는다
 */
export default function EcosystemDiagram({
  active,
  activeNode,
}: {
  /** 강조할 층 인덱스 — null이면 전체 표시 */
  active: number | null;
  /** 강조할 노드 인덱스 (active 층 기준) */
  activeNode: number | null;
}) {
  const layers = ECOSYSTEM.layers;

  return (
    <svg
      viewBox="0 0 560 560"
      className="mx-auto h-auto w-full max-w-[560px]"
      role="img"
      aria-label="ReadingClue 교육 생태계 동심원 도식"
    >
      <defs>
        <radialGradient id="eco-core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#6c5ce7" stopOpacity="0" />
        </radialGradient>
        {layers.map((l, i) => (
          <radialGradient key={l.key} id={`eco-fill-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor={l.color} stopOpacity="0.02" />
            <stop offset="100%" stopColor={l.color} stopOpacity="0.13" />
          </radialGradient>
        ))}
      </defs>

      {layers.map((layer, li) => {
        const g = GEOM[li];
        const isActive = active === li;
        const dim = active !== null && !isActive;
        /* 실행 가능한 안쪽 두 층(현장·학생)은 아무것도 선택하지 않아도 진하게 — 이 섹션의 초점 */
        const focus = Boolean(layer.focus);
        const baseOpacity = focus ? 1 : 0.62;

        return (
          <g key={layer.key} opacity={dim ? 0.22 : baseOpacity} style={{ transition: "opacity .35s" }}>
            {/* 궤도 원 */}
            <circle
              cx={CX}
              cy={CY}
              r={g.r}
              fill={`url(#eco-fill-${li})`}
              stroke={layer.color}
              strokeOpacity={isActive ? 0.9 : focus ? 0.6 : 0.18}
              strokeWidth={isActive ? 2.4 : focus ? 1.8 : 1}
              strokeDasharray={li === 0 ? "6 5" : undefined}
              style={{ transition: "stroke-opacity .35s, stroke-width .35s" }}
            />

            {/* 층 이름 — 각 궤도 정상(12시)에만 둔다. 궤도 간격 60px이라 서로 겹치지 않는다 */}
            <text
              x={CX}
              y={CY - g.r - 11}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={layer.color}
              opacity={isActive ? 1 : focus ? 0.95 : 0.5}
              style={{ transition: "opacity .35s" }}
            >
              {layer.name}
            </text>

            {/* 실행 층 배지 — 어디부터 손대면 되는지 도식 안에서 바로 읽히게 */}
            {focus && layer.focusLabel && (
              <text
                x={CX}
                y={CY - g.r + 4}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={layer.color}
                opacity={dim ? 0.4 : 0.8}
                style={{ transition: "opacity .35s" }}
              >
                {layer.focusLabel}
              </text>
            )}

            {/* 궤도 위 노드 — 이모지만, 라벨은 오른쪽 패널이 담당 */}
            {layer.nodes.map((node, ni) => {
              const [x, y] = pos(g.r, g.angles[ni] ?? 0);
              const hot = isActive && activeNode === ni;
              const r = hot ? g.nodeR + 4 : g.nodeR;

              return (
                <g key={node.label}>
                  <title>{`${layer.name} · ${node.label}`}</title>
                  {hot && (
                    <circle cx={x} cy={y} r={r + 7} fill="none" stroke={layer.color} strokeOpacity="0.5" strokeWidth="1.5">
                      <animate attributeName="r" values={`${r + 4};${r + 11};${r + 4}`} dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.55;0;0.55" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={`${layer.color}${hot ? "38" : "1a"}`}
                    stroke={layer.color}
                    strokeOpacity={hot ? 0.95 : isActive ? 0.7 : focus ? 0.5 : 0.25}
                    strokeWidth="1"
                    style={{ transition: "r .3s, fill .3s, stroke-opacity .3s" }}
                  />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize={hot ? 17 : 14} style={{ transition: "font-size .3s" }}>
                    {node.emoji}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* 코어 — ReadingClue */}
      <g opacity={active !== null && active !== layers.length - 1 ? 0.35 : 1} style={{ transition: "opacity .35s" }}>
        <circle cx={CX} cy={CY} r="56" fill="url(#eco-core-glow)" />
        <circle cx={CX} cy={CY} r="44" fill="#6c5ce7" fillOpacity="0.18" stroke="#6c5ce7" strokeWidth="2" strokeOpacity="0.65">
          <animate attributeName="r" values="42;46;42" dur="3.4s" repeatCount="indefinite" />
        </circle>
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize="16" fontWeight="900" fill="#a29bfe">
          Reading
        </text>
        <text x={CX} y={CY + 14} textAnchor="middle" fontSize="16" fontWeight="900" fill="#a29bfe">
          Clue
        </text>
      </g>
    </svg>
  );
}
