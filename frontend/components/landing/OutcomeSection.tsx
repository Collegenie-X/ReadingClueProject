"use client";

import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui";
import Highlight from "@/components/ui/Highlight";
import { Section, SectionHead } from "./Section";
import { OUTCOME } from "@/lib/landing";
import ChainTabs from "./ChainTabs";

/**
 * 최종 결과물 선언 섹션 — 히어로 바로 다음에 온다.
 * "이 독서의 도착지는 기획안(유저 시나리오 포함)이다"를 한 화면에서 못 박고,
 * 독서 이후에 실제로 일어나는 일까지 명시한다.
 */
export default function OutcomeSection() {
  return (
    <Section id="outcome" bordered>
      <SectionHead
        eyebrow={OUTCOME.eyebrow}
        titleA={OUTCOME.titleA}
        titleHi={OUTCOME.titleHi}
        titleTail={OUTCOME.titleTail}
        hiColor={OUTCOME.hiColor}
        desc={OUTCOME.desc}
      />

      <ChainBlock />
      <ContentsBlock />
      <TracksBlock />
      <AfterBlock />
      <ContrastBlock />

      <Reveal delay={120} className="mt-12 text-center">
        <p className="mx-auto max-w-xl text-[13px] leading-relaxed text-white/40">
          {OUTCOME.note}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={OUTCOME.primaryCta.href} variant="primary">
            {OUTCOME.primaryCta.label}
          </Button>
          <Button href={OUTCOME.ghostCta.href} variant="ghost">
            {OUTCOME.ghostCta.label}
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}

/** ① 결과물 사슬 — 5단계 탭 (혼자 → 크루 → 혼자) */
function ChainBlock() {
  return (
    <Reveal delay={80} className="mt-12">
      <p className="text-center text-[12px] font-semibold text-white/35">{OUTCOME.chain.label}</p>
      <div className="mt-5">
        <ChainTabs />
      </div>
    </Reveal>
  );
}

function ContentsBlock() {
  const { label, items } = OUTCOME.contents;

  return (
    <Reveal delay={120} className="mt-10">
      <div className="rounded-[22px] border border-[#06b6d4]/25 bg-[#06b6d4]/[.05] p-5 md:p-7">
        <p className="text-[12px] font-semibold text-[#22d3ee]">{label}</p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map((it) => (
            <li
              key={it.no}
              className="flex items-start gap-3 rounded-[12px] border border-white/8 bg-black/30 p-3.5"
            >
              <span className="mt-[1px] text-[15px] font-bold text-[#22d3ee]">
                {it.no}
              </span>
              <div>
                <p className="text-[14px] font-bold text-white">{it.title}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-white/50">
                  {it.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/** ③ 트랙별 최종 결과물 */
function TracksBlock() {
  const { label, items } = OUTCOME.tracks;

  return (
    <Reveal delay={160} className="mt-10">
      <p className="text-center text-[12px] font-semibold text-white/35">{label}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((t) => (
          <div
            key={t.name}
            className="flex h-full flex-col rounded-[16px] border p-4"
            style={{ borderColor: `${t.color}30`, background: `${t.color}0a` }}
          >
            <span className="text-[24px]">{t.icon}</span>
            <p className="mt-2 text-[14.5px] font-bold" style={{ color: t.color }}>
              {t.name}
            </p>
            <p className="mt-2 text-[12px] leading-snug text-white/45">{t.plan}</p>
            <p
              className="mt-3 border-t pt-3 text-[12.5px] leading-snug font-semibold text-white/80"
              style={{ borderColor: `${t.color}24` }}
            >
              → {t.result}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** ④ 독서 이후 — 기획안이 나온 다음에 실제로 일어나는 일 */
function AfterBlock() {
  const { label, desc, items } = OUTCOME.after;

  return (
    <Reveal delay={200} className="mt-14">
      <p className="eyebrow text-center">{label}</p>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[14px] leading-relaxed text-white/50">
        <Highlight text={desc} color="#22c55e" />
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex gap-3.5 rounded-[16px] border p-4"
            style={{ borderColor: `${it.color}2e`, background: `${it.color}0a` }}
          >
            <span className="text-[24px] leading-none">{it.icon}</span>
            <div>
              <p className="text-[14px] font-bold" style={{ color: it.color }}>
                {it.title}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/50">
                {it.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/** ⑤ 남는 것 / 남지 않는 것 대비 */
function ContrastBlock() {
  const { before, after } = OUTCOME.contrast;

  return (
    <Reveal delay={240} className="mt-10 grid gap-3 md:grid-cols-2">
      <div className="rounded-[16px] border border-white/8 bg-white/[.02] p-5">
        <p className="text-[13px] font-bold text-white/40">{before.label}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {before.items.map((t) => (
            <li key={t} className="flex items-start gap-2 text-[13px] text-white/35">
              <span className="mt-[2px] shrink-0 text-white/20">✕</span>
              <span className="line-through decoration-white/15">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[16px] border border-[#06b6d4]/30 bg-[#06b6d4]/[.06] p-5">
        <p className="text-[13px] font-bold text-[#22d3ee]">{after.label}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {after.items.map((t) => (
            <li
              key={t}
              className="flex items-start gap-2 text-[13px] font-semibold text-white/80"
            >
              <span className="mt-[2px] shrink-0 text-[#22d3ee]">✓</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
