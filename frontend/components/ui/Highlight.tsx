"use client";

import React from "react";

/**
 * 하이라이트 마크업 컴포넌트
 *
 * data/*.json 안의 문구에 `==강조할 문구==` 로 표시하면
 * 이 컴포넌트가 형광펜 스타일로 렌더링한다.
 *
 *   <Highlight text="대학이 보는 건 ==내가 만든 1차 데이터==다" color="#06b6d4" />
 *
 * 문구는 항상 JSON에서만 관리하고, 강조 표시도 JSON 안에서 끝낸다.
 */

const MARK = /==([^=]+)==/g;

export type HighlightPart = { text: string; hit: boolean };

/** `==...==` 를 기준으로 문자열을 조각낸다 (마크가 없으면 조각 1개) */
export function parseHighlight(text: string): HighlightPart[] {
  const parts: HighlightPart[] = [];
  let last = 0;
  for (const m of text.matchAll(MARK)) {
    const i = m.index ?? 0;
    if (i > last) parts.push({ text: text.slice(last, i), hit: false });
    parts.push({ text: m[1], hit: true });
    last = i + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), hit: false });
  return parts;
}

/** 마크를 제거한 순수 텍스트 (aria-label · key 용) */
export function stripHighlight(text: string): string {
  return text.replace(MARK, "$1");
}

export default function Highlight({
  text,
  color = "#38bdf8",
  className,
  tone = "mark",
}: {
  text: string;
  /** 강조 색 (단계 색상을 그대로 넘긴다) */
  color?: string;
  className?: string;
  /** mark: 형광펜 배경 / text: 글자만 강조 */
  tone?: "mark" | "text";
}) {
  const parts = parseHighlight(text);

  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="rounded-[4px] px-[3px] font-bold"
            style={
              tone === "text"
                ? { background: "transparent", color }
                : {
                    background: `${color}26`,
                    color: "rgba(255,255,255,.92)",
                    boxShadow: `inset 0 -0.55em 0 ${color}1f`,
                  }
            }
          >
            {p.text}
          </mark>
        ) : (
          <React.Fragment key={i}>{p.text}</React.Fragment>
        )
      )}
    </span>
  );
}
