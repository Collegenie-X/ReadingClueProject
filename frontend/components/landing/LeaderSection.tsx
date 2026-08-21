"use client";

import Reveal from "@/components/Reveal";
import { Section } from "./Section";
import LeaderFlow from "./diagrams/LeaderFlow";
import { Button } from "@/components/ui";
import { LEADER } from "@/lib/landing";

/** 독서 지도자용 CTA */
export default function LeaderSection() {
  return (
    <Section>
      <Reveal>
        <div
          className="rounded-[24px] border p-8 md:p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,92,231,.18) 0%, rgba(168,85,247,.10) 55%, rgba(99,102,241,.08) 100%)",
            borderColor: "rgba(139,92,246,.3)",
          }}
        >
          <div className="max-w-2xl">
            <p className="eyebrow">{LEADER.eyebrow}</p>
            <h2 className="mt-2 text-[28px] leading-tight font-bold text-white md:text-[34px]">
              {LEADER.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60">
              {LEADER.desc}
            </p>
          </div>

          <div className="mt-8">
            <LeaderFlow steps={LEADER.steps} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={LEADER.primaryCta.href} variant="primary">
              {LEADER.primaryCta.label}
            </Button>
            <Button href={LEADER.ghostCta.href} variant="ghost">
              {LEADER.ghostCta.label}
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
