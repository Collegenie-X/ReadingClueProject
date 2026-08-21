"use client";

import Link from "next/link";
import Highlight, { stripHighlight } from "@/components/ui/Highlight";
import { JOURNEY, type JourneyStep } from "@/lib/landing";

/**
 * SMILE+P 6단계 도식 — 좌: 세로 레일(좁게) / 우: 선택 단계 상세
 */
export default function SmileTimelineDiagram({
  steps,
  active,
  onSelect,
}: {
  steps: JourneyStep[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const cur = steps[active] ?? steps[0];

  return (
    <div className="grid grid-cols-[104px_1fr] items-start gap-4 md:grid-cols-[124px_1fr] md:gap-6">
      <Rail steps={steps} active={active} onSelect={onSelect} />
      <Detail step={cur} index={active} total={steps.length} />
    </div>
  );
}

/* ── 좌: 세로 레일 (커스텀 SVG) ───────────────────────── */
function Rail({
  steps,
  active,
  onSelect,
}: {
  steps: JourneyStep[];
  active: number;
  onSelect: (i: number) => void;
}) {
  const W = 124;
  const TOP = 32;
  const GAP = 62;
  const R = 21;
  const cx = 34;
  const H = TOP + GAP * (steps.length - 1) + 32;
  const lastY = TOP + GAP * (steps.length - 1);
  const activeY = TOP + GAP * active;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="SMILE+P 6단계 선택"
    >
      <defs>
        <linearGradient id="sml-rail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6c5ce7" />
        </linearGradient>
        <filter id="sml-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 트랙 */}
      <line
        x1={cx} y1={TOP} x2={cx} y2={lastY}
        stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" strokeLinecap="round"
      />
      {/* 진행 */}
      {active > 0 && (
        <line
          x1={cx} y1={TOP} x2={cx} y2={activeY}
          stroke="url(#sml-rail)" strokeWidth="2.5" strokeLinecap="round"
        />
      )}
      {/* CREW 구간 — 함께 달리는 구간을 레일 위에 표시 */}
      {(() => {
        const firstCrew = steps.findIndex((s) => s.mode === "crew");
        if (firstCrew < 0) return null;
        const y0 = TOP + GAP * firstCrew - R - 6;
        const y1 = lastY + R + 6;
        return (
          <g>
            <rect
              x={cx - R - 9} y={y0} width={(R + 9) * 2} height={y1 - y0} rx="18"
              fill="rgba(6,182,212,0.05)" stroke="rgba(6,182,212,0.22)" strokeDasharray="4 4"
            />
            <text
              x={cx} y={y0 - 5} textAnchor="middle"
              fontSize="8.5" fontWeight="900" letterSpacing="1"
              fill="rgba(6,182,212,0.8)"
            >
              {JOURNEY.modes.crew.short}
            </text>
          </g>
        );
      })()}

      {/* 남은 구간 점선 */}
      <line
        x1={cx} y1={activeY} x2={cx} y2={lastY}
        stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="2 5"
      />

      {steps.map((s, i) => {
        const cy = TOP + GAP * i;
        const on = i === active;
        const done = i <= active;

        return (
          <g
            key={s.key}
            onClick={() => onSelect(i)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label={`STEP ${s.no} ${s.label}`}
          >
            {/* 히트 영역 */}
            <rect x="0" y={cy - GAP / 2} width={W} height={GAP} fill="transparent" />

            {on && (
              <circle cx={cx} cy={cy} r={R + 7} fill={`${s.color}14`} stroke={`${s.color}33`} filter="url(#sml-glow)">
                <animate attributeName="r" values={`${R + 5};${R + 9};${R + 5}`} dur="2.4s" repeatCount="indefinite" />
              </circle>
            )}

            <circle
              cx={cx} cy={cy} r={R}
              fill={done ? `${s.color}26` : "rgba(255,255,255,0.03)"}
              stroke={done ? s.color : "rgba(255,255,255,0.14)"}
              strokeWidth={on ? 2.4 : 1.4}
            />
            <text
              x={cx} y={cy + 7} textAnchor="middle"
              fontSize="20" fontWeight="900"
              fill={done ? s.color : "rgba(255,255,255,0.3)"}
            >
              {s.key}
            </text>

            {/* 우측 STEP 번호 */}
            <text
              x={cx + R + 11} y={cy - 3}
              fontSize="10" fontWeight="800" letterSpacing="0.6"
              fill={on ? s.color : "rgba(255,255,255,0.26)"}
            >
              STEP
            </text>
            <text
              x={cx + R + 11} y={cy + 12}
              fontSize="14" fontWeight="900"
              fill={on ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.32)"}
            >
              {s.no}
            </text>

            {/* 선택 표시 caret */}
            {on && (
              <path
                d={`M ${W - 3} ${cy} l -7 -6 l 0 12 z`}
                fill={s.color}
                opacity="0.75"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── 우: 상세 ─────────────────────────────────────── */
function Detail({
  step: s,
  index,
  total,
}: {
  step: JourneyStep;
  index: number;
  total: number;
}) {
  return (
    <div
      className="rounded-[16px] border p-4 md:p-5"
      style={{
        borderColor: `${s.color}33`,
        background: `linear-gradient(150deg, ${s.color}10 0%, rgba(255,255,255,.015) 65%)`,
      }}
    >
      {/* 헤더 */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2 py-[3px] text-[10px] font-extrabold tracking-[1px]"
          style={{ background: `${s.color}22`, color: s.color }}
        >
          {s.key} · STEP {s.no}
        </span>
        <span className="text-[16px]">{s.emoji}</span>
        <span className="text-[17px] font-bold text-white">{s.label}</span>
        <ModeBadge step={s} />
        <span className="ml-auto text-[11px] font-semibold text-white/40">
          {s.weeks} · {index + 1}/{total}
        </span>
      </div>

      <p className="mt-3 text-[14px] leading-snug font-bold text-white/85">
        <Highlight text={s.headline} color={s.color} />
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/45">
        <Highlight text={s.desc} color={s.color} />
      </p>

      {/* 리딩 리듬 — 혼자 / 함께의 이유 */}
      <RhythmBox step={s} />

      {/* 핵심 원칙 — 이 단계를 한 줄로 */}
      <div
        className="mt-3 rounded-[10px] border-l-2 py-2 pr-3 pl-3"
        style={{ borderColor: s.color, background: `${s.color}0d` }}
      >
        <p className="text-[9px] font-bold tracking-[1px]" style={{ color: `${s.color}aa` }}>
          {JOURNEY.principleLabel}
        </p>
        <p className="mt-0.5 text-[12.5px] leading-snug font-semibold text-white/80">
          <Highlight text={s.principle} color={s.color} />
        </p>
      </div>

      {/* INPUT → PROCESS → OUTPUT */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <Cell label="INPUT" value={s.input} />
        <Arrow color={s.color} />
        <Cell
          label="PROCESS"
          value={JOURNEY.processLabel
            .replace("{n}", String(s.todos.length))
            .replace("{weeks}", s.weeks)}
        />
        <Arrow color={s.color} />
        <Cell label="OUTPUT" value={s.output} color={s.color} />
      </div>

      {/* 할 일 전체 */}
      <p className="mt-4 text-[10px] font-bold tracking-[1px] text-white/30">
        {JOURNEY.todosLabel}
      </p>
      <ul className="mt-2 grid grid-cols-1 gap-x-5 gap-y-1.5 sm:grid-cols-2">
        {s.todos.map((t) => (
          <li
            key={t}
            className="flex items-start gap-2 text-[12px] leading-snug text-white/55"
          >
            <span
              className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: s.color }}
            />
            <Highlight text={t} color={s.color} />
          </li>
        ))}
      </ul>

      {/* 산출물 예시 */}
      <div className="mt-4 rounded-[12px] border border-white/6 bg-black/25 p-3.5">
        <p className="text-[10px] font-bold tracking-[1px] text-white/30">
          {s.sample.label}
        </p>
        <div className="mt-1.5 space-y-1">
          {s.sample.lines.map((line) => (
            <p key={stripHighlight(line)} className="text-[12px] leading-relaxed text-white/55">
              <Highlight text={line} color={s.color} />
            </p>
          ))}
        </div>
      </div>

      {/* 산출물 트랙 — 트랙은 달라도 끝은 기획안 */}
      {s.tracks && s.tracks.length > 0 && <Tracks step={s} />}

      <Link
        href={s.href}
        className="mt-3.5 inline-flex items-center text-[12px] font-bold transition hover:brightness-125"
        style={{ color: s.color }}
      >
        {s.hrefLabel} →
      </Link>
    </div>
  );
}

/** 최종 산출물 트랙 — 논문 · 웹 · 피지컬 AI · 캠페인 */
function Tracks({ step: s }: { step: JourneyStep }) {
  const tracks = s.tracks ?? [];
  return (
    <div className="mt-4">
      <p className="text-[10px] font-bold tracking-[1px] text-white/30">
        <Highlight text={JOURNEY.tracksLabel} color={s.color} tone="text" />
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tracks.map((t) => (
          <div
            key={t.name}
            className="rounded-[10px] border px-3 py-2"
            style={{ borderColor: `${t.color}33`, background: `${t.color}0d` }}
          >
            <p className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color: t.color }}>
              <span className="text-[13px]">{t.icon}</span>
              {t.name}
            </p>
            <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">{t.plan}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11.5px] leading-relaxed text-white/40">
        <Highlight text={JOURNEY.tracksNote} color={s.color} />
      </p>
    </div>
  );
}

/** SOLO / CREW 배지 */
function ModeBadge({ step: s }: { step: JourneyStep }) {
  const m = JOURNEY.modes[s.mode];
  const crew = s.mode === "crew";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[10px] font-extrabold"
      style={{
        borderColor: crew ? "rgba(6,182,212,.42)" : "rgba(255,255,255,.14)",
        background: crew ? "rgba(6,182,212,.12)" : "rgba(255,255,255,.04)",
        color: crew ? "#67e8f9" : "rgba(255,255,255,.45)",
      }}
      title={m.label}
    >
      <span className="text-[11px]">{m.icon}</span>
      {m.short}
    </span>
  );
}

/** 리딩 리듬 — 왜 혼자인지 / 왜 함께여야 하는지 */
function RhythmBox({ step: s }: { step: JourneyStep }) {
  const m = JOURNEY.modes[s.mode];
  const crew = s.mode === "crew";
  const accent = crew ? "#06b6d4" : "#94a3b8";

  return (
    <div
      className="mt-3 rounded-[10px] border px-3 py-2.5"
      style={{
        borderColor: crew ? `${accent}3d` : "rgba(255,255,255,.07)",
        background: crew ? `${accent}0f` : "rgba(255,255,255,.02)",
      }}
    >
      <p className="flex items-center gap-1.5 text-[9px] font-bold tracking-[1px]" style={{ color: `${accent}bb` }}>
        <span className="text-[11px]">{m.icon}</span>
        {JOURNEY.rhythmLabel} · {m.label}
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-white/60">
        <Highlight text={s.rhythm} color={accent} />
      </p>
    </div>
  );
}

function Cell({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      className="rounded-[10px] border px-3 py-2"
      style={{
        borderColor: color ? `${color}40` : "rgba(255,255,255,.08)",
        background: color ? `${color}0d` : "rgba(0,0,0,.25)",
      }}
    >
      <p
        className="text-[9px] font-bold tracking-[1px]"
        style={{ color: color ? `${color}99` : "rgba(255,255,255,.3)" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 text-[12px] leading-snug font-semibold"
        style={{ color: color ? `${color}dd` : "rgba(255,255,255,.62)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Arrow({ color }: { color: string }) {
  return (
    <span className="flex justify-center">
      <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden className="rotate-90 sm:rotate-0">
        <path d="M1 7h11" stroke={`${color}55`} strokeWidth="1.2" />
        <path d="M11 3l5 4-5 4z" fill={color} opacity="0.85" />
      </svg>
    </span>
  );
}
