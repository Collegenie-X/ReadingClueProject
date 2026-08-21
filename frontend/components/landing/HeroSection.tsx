"use client";

import { useEffect, useState } from "react";
import StarField from "@/components/StarField";
import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui";
import Highlight from "@/components/ui/Highlight";
import { HERO, JOURNEY } from "@/lib/landing";

/** SMILE+P 여정을 우주 지도처럼 표현하는 SVG */
function JourneyMapSvg({ tick }: { tick: number }) {
  const steps = JOURNEY.steps;
  // 곡선 경로 위의 노드 좌표
  const nodes = [
    { x: 80, y: 320 },
    { x: 160, y: 200 },
    { x: 280, y: 260 },
    { x: 370, y: 140 },
    { x: 460, y: 210 },
    { x: 540, y: 90 },
  ];

  return (
    <svg
      viewBox="0 0 620 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      {/* 글로우 필터 */}
      <defs>
        {steps.map((s, i) => (
          <filter key={s.key} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={tick % 6 === i ? 8 : 4} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        <linearGradient id="path-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* 배경 장식 — 십자 별 */}
      {[
        { x: 30, y: 60 },
        { x: 520, y: 40 },
        { x: 590, y: 180 },
        { x: 40, y: 250 },
        { x: 300, y: 380 },
        { x: 560, y: 350 },
      ].map((p, i) => (
        <text
          key={i}
          x={p.x}
          y={p.y}
          fill="white"
          fillOpacity={0.15 + (tick % 3 === i % 3 ? 0.1 : 0)}
          fontSize="14"
          className="transition-all duration-700"
        >
          ✦
        </text>
      ))}

      {/* 연결 곡선 */}
      <path
        d={`M${nodes[0].x},${nodes[0].y} C${nodes[0].x + 40},${nodes[0].y - 60} ${nodes[1].x - 40},${nodes[1].y + 30} ${nodes[1].x},${nodes[1].y} S${nodes[2].x - 30},${nodes[2].y + 30} ${nodes[2].x},${nodes[2].y} S${nodes[3].x - 30},${nodes[3].y + 50} ${nodes[3].x},${nodes[3].y} S${nodes[4].x - 20},${nodes[4].y + 30} ${nodes[4].x},${nodes[4].y} S${nodes[5].x - 30},${nodes[5].y + 50} ${nodes[5].x},${nodes[5].y}`}
        stroke="url(#path-grad)"
        strokeWidth="2.5"
        strokeDasharray="8 6"
        fill="none"
      />

      {/* 각 노드 */}
      {nodes.map((n, i) => {
        const s = steps[i];
        const active = tick % 6 === i;
        const r = active ? 28 : 22;

        return (
          <g key={s.key} filter={`url(#glow-${i})`} className="transition-all duration-500">
            {/* 외곽 원 */}
            <circle
              cx={n.x}
              cy={n.y}
              r={r}
              fill={active ? `${s.color}25` : `${s.color}10`}
              stroke={s.color}
              strokeWidth={active ? 2.5 : 1.5}
              strokeOpacity={active ? 1 : 0.4}
              className="transition-all duration-500"
            />
            {/* 이모지 */}
            <text
              x={n.x}
              y={n.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={active ? 22 : 16}
              className="transition-all duration-500"
              style={{ opacity: active ? 1 : 0.6 }}
            >
              {s.emoji}
            </text>
            {/* 라벨 말풍선 */}
            <rect
              x={n.x - 36}
              y={n.y - r - 30}
              width="72"
              height="22"
              rx="6"
              fill={active ? `${s.color}` : "rgba(255,255,255,0.06)"}
              fillOpacity={active ? 0.2 : 1}
              stroke={active ? s.color : "rgba(255,255,255,0.08)"}
              strokeWidth="1"
              className="transition-all duration-500"
            />
            <text
              x={n.x}
              y={n.y - r - 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill={active ? "white" : "rgba(255,255,255,0.5)"}
              fontSize="10"
              fontWeight={active ? 700 : 500}
              className="transition-all duration-500"
            >
              {s.key} · {s.label}
            </text>
            {/* 활성 노드 펄스 */}
            {active && (
              <circle
                cx={n.x}
                cy={n.y}
                r={r + 6}
                fill="none"
                stroke={s.color}
                strokeWidth="1"
                strokeOpacity="0.3"
              >
                <animate
                  attributeName="r"
                  from={String(r + 4)}
                  to={String(r + 16)}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  from="0.4"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })}

      {/* "무료 시작" 배지 — 첫 번째 노드 옆 */}
      <g>
        <rect
          x={nodes[0].x - 24}
          y={nodes[0].y + 36}
          width="52"
          height="20"
          rx="10"
          fill="#22c55e"
          fillOpacity="0.2"
          stroke="#22c55e"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <circle cx={nodes[0].x - 14} cy={nodes[0].y + 46} r="3" fill="#22c55e" />
        <text
          x={nodes[0].x + 12}
          y={nodes[0].y + 47}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#22c55e"
          fontSize="9"
          fontWeight="600"
        >
          {HERO.freeBadge}
        </text>
      </g>
    </svg>
  );
}

/** 히어로 — 왼쪽 텍스트 + 오른쪽 SVG 레이아웃 */
export default function HeroSection() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const word = HERO.rotating[tick % HERO.rotating.length];

  return (
    <section className="relative flex min-h-[100vh] items-center overflow-hidden">
      <StarField />

      <div className="shell relative z-10 py-20 md:py-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* ─── 왼쪽: 텍스트 영역 ─── */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 text-[12px] font-semibold text-white/70">
              {HERO.badge}
            </span>

            <h1 className="mt-7 text-[29px] leading-[1.18] font-extrabold tracking-[-1.2px] sm:text-[38px] md:text-[46px]">
              {/* 1번째 줄 — 앞 문장의 결과가 다음 문장의 조건이 되어 이어진다 */}
              <span
                key={`lead-${word.text}`}
                className="animate-fade-up inline-block whitespace-nowrap text-white/70"
              >
                {word.lead ?? HERO.titleTop}
              </span>
              <br />
              {/* 2번째 줄 — 단어와 서술어가 함께 교체된다 */}
              <span key={word.text} className="animate-fade-up inline-block whitespace-nowrap">
                <span style={{ color: word.color }}>{word.text}</span>
                <span className="text-white">{word.tail ?? HERO.titleTail}</span>
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/50 lg:mx-0 mx-auto">
              <Highlight text={HERO.desc} color="#a78bfa" />
            </p>

            {/* 목표 배너 — 위 문장(질문 → 기획안 → 프로젝트)과 함께 바뀐다 */}
            <a
              key={`goal-${word.text}`}
              href="#outcome"
              className="animate-fade-up mt-6 flex min-h-[104px] max-w-md flex-col gap-1 rounded-[14px] border p-4 text-left transition lg:mx-0 mx-auto"
              style={{
                borderColor: `${word.color}4d`,
                background: `${word.color}12`,
              }}
            >
              <span
                className="text-[11px] font-bold tracking-[1px]"
                style={{ color: word.color }}
              >
                {word.goal.label}
              </span>
              <span className="text-[16px] leading-snug font-semibold text-white/90">
                <Highlight text={word.goal.text} color={word.color} />
              </span>
              <span className="text-[12.5px] leading-snug text-white/45">
                {word.goal.sub}
              </span>
            </a>

            {/* CTA 버튼 */}
            <Reveal delay={200} className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
              <Button href={HERO.primaryCta.href} variant="primary">
                {HERO.primaryCta.label}
              </Button>
              <Button href={HERO.ghostCta.href} variant="ghost">
                {HERO.ghostCta.label}
              </Button>
            </Reveal>

            {/* 하단 요약 카드 */}
            <div className="mt-8 grid grid-cols-3 gap-3 lg:max-w-md">
              {HERO.summaryCards.map((c) => (
                <div
                  key={c.title}
                  className="flex flex-col items-center gap-1 rounded-xl border border-white/8 bg-white/[0.03] py-3"
                >
                  <span className="text-[20px]">{c.icon}</span>
                  <span className="text-[13px] font-bold text-white/90">{c.title}</span>
                  <span className="text-[11px] text-white/40">{c.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── 오른쪽: SVG 여정 지도 ─── */}
          <Reveal delay={300} className="flex-1 w-full max-w-[560px] lg:max-w-none">
            <JourneyMapSvg tick={tick} />
          </Reveal>
        </div>
      </div>

      <a
        href="#ecosystem"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] font-semibold text-white/25 transition hover:text-white/60 md:flex"
      >
        <span>{HERO.scrollHint}</span>
        <span className="animate-float text-[18px]">↓</span>
      </a>
    </section>
  );
}
