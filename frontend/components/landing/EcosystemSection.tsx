"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import EcosystemDiagram from "./diagrams/EcosystemDiagram";
import WhyReadBlock from "./WhyReadBlock";
import { ECOSYSTEM } from "@/lib/landing";

/** 거시적 생태계 — 좌: 동심원 도식 / 우: 층별 설명 패널 */
export default function EcosystemSection() {
  const layers = ECOSYSTEM.layers;
  /* 기본 선택은 코어(학생 · ReadingClue) — 이 섹션이 결국 말하려는 층 */
  const [active, setActive] = useState(layers.length - 1);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const layer = layers[active];

  return (
    <Section id="ecosystem" bordered>
      <SectionHead
        eyebrow={ECOSYSTEM.eyebrow}
        titleA={ECOSYSTEM.titleA}
        titleHi={ECOSYSTEM.titleHi}
        desc={ECOSYSTEM.desc}
      />

      <Reveal delay={100} className="mt-10">
        <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          {/* 좌 — 동심원 도식 */}
          <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-3 md:p-5">
            <EcosystemDiagram active={active} activeNode={activeNode} />
            <p className="mt-1 text-center text-[11.5px] leading-relaxed text-white/35">
              {ECOSYSTEM.caption}
            </p>
          </div>

          {/* 우 — 층별 설명 */}
          <div className="flex flex-col gap-3">
            {/* 층 선택 탭 */}
            <div className="flex flex-wrap gap-2">
              {layers.map((l, i) => {
                const on = i === active;
                return (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => {
                      setActive(i);
                      setActiveNode(null);
                    }}
                    className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition"
                    style={{
                      borderColor: on ? l.color : l.focus ? `${l.color}59` : "rgba(255,255,255,.12)",
                      background: on ? `${l.color}1f` : l.focus ? `${l.color}0d` : "transparent",
                      color: on ? l.color : l.focus ? `${l.color}cc` : "rgba(255,255,255,.38)",
                    }}
                  >
                    {l.name}
                    {/* 실행 가능한 층에만 배지 — 흐름(바깥 궤도)과 실행(안쪽 궤도)을 탭에서부터 구분한다 */}
                    {l.focus && (
                      <span
                        className="rounded-full px-1.5 py-px text-[9.5px] font-bold"
                        style={{ background: `${l.color}26`, color: l.color }}
                      >
                        {l.focusLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 선택된 층 카드 */}
            <div
              className="rounded-[20px] border p-5 md:p-6"
              style={{ borderColor: `${layer.color}33`, background: `${layer.color}0a` }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider" style={{ color: layer.color }}>
                  {layer.ring}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-bold"
                  style={{ background: `${layer.color}1f`, color: layer.color }}
                >
                  {layer.mode}
                </span>
              </div>
              <p className="mt-1 text-[18px] leading-snug font-bold text-white">{layer.tagline}</p>

              <ul className="mt-4 flex flex-col gap-1">
                {layer.nodes.map((n, ni) => (
                  <li key={n.label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveNode(ni)}
                      onFocus={() => setActiveNode(ni)}
                      onMouseLeave={() => setActiveNode(null)}
                      onBlur={() => setActiveNode(null)}
                      className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition"
                      style={{ background: activeNode === ni ? `${layer.color}14` : "transparent" }}
                    >
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px]"
                        style={{ background: `${layer.color}1f`, border: `1px solid ${layer.color}3d` }}
                      >
                        {n.emoji}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-bold text-white/90">{n.label}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-relaxed text-white/45">
                          {n.desc}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-center text-[11.5px] text-white/30 lg:text-left">{ECOSYSTEM.hint}</p>
          </div>
        </div>
      </Reveal>

      {/* 하단 — 왜 읽어야 하는가 + 어디까지 발전시켜야 하는가 */}
      <WhyReadBlock />
    </Section>
  );
}
