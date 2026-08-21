"use client";

import Reveal from "@/components/Reveal";
import { Button } from "@/components/ui";
import { FINAL_CTA } from "@/lib/landing";

/** 마지막 전환 CTA */
export default function FinalCtaSection() {
  return (
    <section className="border-t border-white/5 py-20 md:py-24">
      <div className="shell text-center">
        <Reveal>
          <h2 className="text-[30px] leading-tight font-bold text-white md:text-[40px]">
            {FINAL_CTA.titleA} <span className="grad-text">{FINAL_CTA.titleHi}</span>
            {FINAL_CTA.titleTail}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/50">
            {FINAL_CTA.desc}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={FINAL_CTA.primaryCta.href} variant="primary">
              {FINAL_CTA.primaryCta.label}
            </Button>
            <Button href={FINAL_CTA.ghostCta.href} variant="ghost">
              {FINAL_CTA.ghostCta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
