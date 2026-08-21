"use client";

import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import HowItWorksDiagram from "./diagrams/HowItWorksDiagram";
import { HOW_IT_WORKS } from "@/lib/landing";

/** 3단계 동작 흐름: 진단→실행→성장 */
export default function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <SectionHead
        eyebrow={HOW_IT_WORKS.eyebrow}
        titleA={HOW_IT_WORKS.titleA}
        titleHi={HOW_IT_WORKS.titleHi}
        desc={HOW_IT_WORKS.desc}
      />

      <Reveal delay={100} className="mt-10">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-8">
          <HowItWorksDiagram />
        </div>
      </Reveal>
    </Section>
  );
}
