"use client";

import Reveal from "@/components/Reveal";
import { cn } from "@/components/ui";
import Highlight from "@/components/ui/Highlight";

/** 랜딩 공통 섹션 셸 */
export function Section({
  id,
  bordered,
  className,
  children,
}: {
  id?: string;
  bordered?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        bordered && "border-y border-white/5",
        className,
      )}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

/** 섹션 머리말 — eyebrow / 제목(하이라이트) / 설명 */
export function SectionHead({
  eyebrow,
  titleA,
  titleHi,
  titleTail,
  hiColor,
  desc,
  align = "center",
  className,
}: {
  eyebrow?: string;
  titleA?: string;
  titleHi?: string;
  titleTail?: string;
  /** 미지정 시 그라디언트 텍스트 */
  hiColor?: string;
  desc?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(align === "center" ? "text-center" : "text-left", className)}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-[28px] leading-tight font-bold text-white md:text-[36px]">
        {titleA}{" "}
        {titleHi && (
          <span className={hiColor ? undefined : "grad-text"} style={hiColor ? { color: hiColor } : undefined}>
            {titleHi}
          </span>
        )}
        {titleTail}
      </h2>
      {desc && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[16px] leading-relaxed text-white/50",
            align === "center" && "mx-auto",
          )}
        >
          <Highlight text={desc} color={hiColor ?? "#38bdf8"} />
        </p>
      )}
    </Reveal>
  );
}
