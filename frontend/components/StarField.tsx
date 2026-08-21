"use client";

import { useMemo } from "react";

/** 랜딩 히어로 배경 — 별 파티클 + 앰비언트 블롭 */
export default function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        // 결정론적 의사난수 — 하이드레이션 불일치 방지
        x: ((i * 37) % 100) + (i % 3) * 0.4,
        y: ((i * 61) % 100) + (i % 5) * 0.3,
        size: (i % 4) * 0.5 + 1,
        delay: (i % 7) * 0.5,
        dur: 2.5 + (i % 5) * 0.7,
      })),
    [],
  );

  const floaters = [
    { emoji: "📚", top: "12%", left: "6%", delay: "0s", size: "28px" },
    { emoji: "🔍", top: "22%", right: "9%", delay: "1.5s", size: "32px" },
    { emoji: "⚔️", bottom: "24%", left: "10%", delay: "2.5s", size: "24px" },
    { emoji: "💡", bottom: "16%", right: "14%", delay: "3.5s", size: "26px" },
    { emoji: "🌙", top: "58%", right: "5%", delay: "1s", size: "22px" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 앰비언트 블롭 */}
      <div
        className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(rgba(139,92,246,.14) 0%, rgba(99,102,241,.08) 45%, transparent 75%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[440px] w-[440px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(rgba(167,139,250,.11) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(rgba(96,165,250,.09) 0%, transparent 70%)",
        }}
      />

      {/* 별 */}
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x % 100}%`,
            top: `${s.y % 100}%`,
            width: s.size,
            height: s.size,
            opacity: 0.4,
            animation: `rc-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* 떠다니는 이모지 */}
      {floaters.map((f, i) => (
        <span
          key={i}
          className="absolute select-none"
          style={{
            top: f.top,
            left: f.left,
            right: f.right,
            bottom: f.bottom,
            fontSize: f.size,
            opacity: 0.55,
            animation: `rc-float 7s ease-in-out ${f.delay} infinite`,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
