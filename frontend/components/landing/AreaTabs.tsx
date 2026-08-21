"use client";

import { useState } from "react";
import { AREA_ART } from "./diagrams/AreaArt";
import interestsJson from "@/data/interests.json";

const AREAS = interestsJson.areas;
const INTERESTS = interestsJson.interests;

/**
 * 관심사 6개 영역 — 탭 하나에 한 영역씩.
 * 50개를 한꺼번에 늘어놓지 않고, 선택한 영역만 커스텀 SVG 그림 + 관심사 목록으로 보여준다.
 */
export default function AreaTabs() {
  const [active, setActive] = useState(0);
  const a = AREAS[active];
  const Art = AREA_ART[a.code] ?? AREA_ART.A;
  const list = INTERESTS.filter((i) => i.area === a.code);

  return (
    <div>
      {/* 영역 탭 */}
      <div
        role="tablist"
        aria-label="관심사 6개 영역"
        className="no-scrollbar flex gap-1 overflow-x-auto rounded-[16px] border border-white/8 bg-white/[.02] p-1.5"
      >
        {AREAS.map((t, i) => {
          const on = i === active;
          const n = INTERESTS.filter((x) => x.area === t.code).length;
          return (
            <button
              key={t.code}
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[12px] px-2.5 py-2 whitespace-nowrap transition-colors"
              style={{
                background: on ? `${t.color}1f` : "transparent",
                border: `1px solid ${on ? `${t.color}59` : "transparent"}`,
              }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: on ? t.color : "rgba(255,255,255,.2)" }}
              />
              <span
                className="truncate text-[12px] font-black md:text-[13px]"
                style={{ color: on ? "#fff" : "rgba(255,255,255,.45)" }}
              >
                {t.name}
              </span>
              <span
                className="shrink-0 text-[10px] font-bold"
                style={{ color: on ? t.color : "rgba(255,255,255,.25)" }}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* 패널 — 그림 + 그 영역의 관심사 */}
      <div
        role="tabpanel"
        className="mt-3 grid gap-5 rounded-[20px] border p-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:p-6"
        style={{ borderColor: `${a.color}33`, background: `${a.color}0a` }}
      >
        <div className="mx-auto w-full max-w-[340px] self-center">
          <Art color={a.color} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-[19px] leading-tight font-black text-white md:text-[22px]">
              {a.name}
            </h4>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-black"
              style={{ background: `${a.color}26`, color: a.color }}
            >
              관심사 {list.length}개
            </span>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">{a.desc}</p>

          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {list.map((i) => (
              <li
                key={i.id}
                className="rounded-[12px] border px-3 py-2"
                style={{ borderColor: `${a.color}26`, background: `${a.color}0a` }}
              >
                <p className="text-[12.5px] font-bold text-white/85">{i.name}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/35">{i.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
