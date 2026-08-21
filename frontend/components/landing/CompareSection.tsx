"use client";

import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "./Section";
import CoverageMatrix from "./diagrams/CoverageMatrix";
import { COMPARE, JOURNEY } from "@/lib/landing";

/** 왜 ReadingClue인가 — 6단계 커버리지 매트릭스 도식 */
export default function CompareSection() {
  return (
    <Section>
      <SectionHead
        eyebrow={COMPARE.eyebrow}
        titleA={COMPARE.title}
        desc={COMPARE.desc}
      />
      <Reveal delay={100} className="mt-10">
        <div className="rounded-[22px] border border-white/8 bg-white/[.02] p-4 md:p-6">
          <CoverageMatrix
            steps={JOURNEY.steps}
            headers={COMPARE.headers}
            rows={COMPARE.rows}
            selfLabel={COMPARE.selfLabel}
          />
        </div>
      </Reveal>

      {/* 항목별 비교 — 기존 독서 모임 vs 리딩클루 */}
      <Reveal delay={140} className="mt-12">
        <h3 className="text-center text-[19px] leading-snug font-bold text-white md:text-[23px]">
          {COMPARE.tableTitle}
        </h3>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-y-1.5 text-left">
            <thead>
              <tr>
                <th className="w-[22%] rounded-l-[10px] bg-white/[.04] px-4 py-3 text-[12.5px] font-bold text-[#a29bfe]">
                  {COMPARE.tableHeaders.item}
                </th>
                <th className="w-[36%] bg-white/[.02] px-4 py-3 text-center text-[12.5px] font-bold text-white/35">
                  {COMPARE.tableHeaders.old}
                </th>
                <th className="w-[42%] rounded-r-[10px] border border-[#6c5ce7]/30 bg-[#6c5ce7]/10 px-4 py-3 text-center text-[12.5px] font-bold text-white">
                  {COMPARE.tableHeaders.new}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.table.map((row) => (
                <tr key={row.item}>
                  <td className="rounded-l-[10px] bg-white/[.04] px-4 py-3 text-[12.5px] font-bold text-white/70">
                    {row.item}
                  </td>
                  <td className="bg-white/[.015] px-4 py-3 text-center text-[12.5px] text-white/35">
                    {row.old}
                  </td>
                  <td className="rounded-r-[10px] border border-[#6c5ce7]/25 bg-[#6c5ce7]/[.07] px-4 py-3 text-center text-[12.5px] font-semibold text-white/85">
                    <span className="mr-1.5 text-[#22c55e]">✓</span>
                    {row.new}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
