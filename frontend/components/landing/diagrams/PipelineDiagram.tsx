"use client";

import type { JourneyStep } from "@/lib/landing";

const NODE_GAP = 200;
const X0 = 110;
const LINE_Y = 132;
const R = 34;

/**
 * 6단계 파이프라인 도식.
 * 위쪽에 단계명, 가운데 노드, 아래쪽에 "이 단계가 남기는 결과물"을 두어
 * 결과물 → 다음 단계 입력의 연결을 한 장으로 보여준다.
 */
export default function PipelineDiagram({
  steps,
  active,
  onSelect,
  caption,
}: {
  steps: JourneyStep[];
  active: number;
  onSelect?: (i: number) => void;
  caption?: string;
}) {
  const width = X0 * 2 + NODE_GAP * (steps.length - 1);

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[860px]">
        <svg
          viewBox={`0 0 ${width} 230`}
          className="h-auto w-full"
          role="img"
          aria-label="SMILE+P 6단계 파이프라인"
        >
          <defs>
            <marker
              id="rc-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="5.5"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,.35)" />
            </marker>
          </defs>

          {/* 연결선 */}
          {steps.slice(0, -1).map((s, i) => {
            const x1 = X0 + i * NODE_GAP + R + 8;
            const x2 = X0 + (i + 1) * NODE_GAP - R - 12;
            const done = i < active;
            return (
              <g key={`link-${s.key}`}>
                <line
                  x1={x1}
                  y1={LINE_Y}
                  x2={x2}
                  y2={LINE_Y}
                  stroke={done ? s.color : "rgba(255,255,255,.16)"}
                  strokeWidth={done ? 2.5 : 1.5}
                  strokeDasharray="6 6"
                  markerEnd="url(#rc-arrow)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="24"
                    to="0"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}

          {steps.map((s, i) => {
            const cx = X0 + i * NODE_GAP;
            const on = i === active;
            return (
              <g
                key={s.key}
                onClick={() => onSelect?.(i)}
                style={{ cursor: onSelect ? "pointer" : "default" }}
              >
                {/* 단계 라벨 */}
                <text
                  x={cx}
                  y={38}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill="rgba(255,255,255,.35)"
                  letterSpacing="1"
                >
                  STEP {s.no} · {s.weeks}
                </text>
                <text
                  x={cx}
                  y={62}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="800"
                  fill={on ? "#fff" : "rgba(255,255,255,.62)"}
                >
                  {s.label}
                </text>

                {/* 노드 */}
                <circle
                  cx={cx}
                  cy={LINE_Y}
                  r={on ? R + 5 : R}
                  fill={`${s.color}${on ? "33" : "1a"}`}
                  stroke={s.color}
                  strokeWidth={on ? 2.5 : 1.2}
                  style={{ transition: "all .35s ease" }}
                />
                {on && (
                  <circle
                    cx={cx}
                    cy={LINE_Y}
                    r={R + 5}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="1"
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from={R + 5}
                      to={R + 20}
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <text
                  x={cx}
                  y={LINE_Y + 4}
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="900"
                  fill={s.color}
                >
                  {s.key}
                </text>

                {/* 결과물 칩 */}
                <rect
                  x={cx - 88}
                  y={182}
                  width={176}
                  height={30}
                  rx={15}
                  fill={on ? `${s.color}26` : "rgba(255,255,255,.04)"}
                  stroke={on ? `${s.color}80` : "rgba(255,255,255,.1)"}
                  style={{ transition: "all .35s ease" }}
                />
                <text
                  x={cx}
                  y={201}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight="700"
                  fill={on ? s.color : "rgba(255,255,255,.5)"}
                >
                  {s.output}
                </text>
                {/* 노드 → 결과물 연결 */}
                <line
                  x1={cx}
                  y1={LINE_Y + R + 2}
                  x2={cx}
                  y2={180}
                  stroke={on ? `${s.color}99` : "rgba(255,255,255,.12)"}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>
      {caption && (
        <p className="mt-3 text-center text-[12px] text-white/35">{caption}</p>
      )}
    </div>
  );
}
