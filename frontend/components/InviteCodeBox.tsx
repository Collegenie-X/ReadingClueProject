"use client";

import { useState } from "react";
import { toast } from "./ui";

export default function InviteCodeBox({
  code,
  compact = false,
}: {
  code: string;
  compact?: boolean;
}) {
  const [showQr, setShowQr] = useState(false);

  function copy() {
    navigator.clipboard
      ?.writeText(code)
      .then(() => toast("초대 코드를 복사했습니다"))
      .catch(() => toast("복사에 실패했어요"));
  }

  function shareKakao() {
    const text = `[ReadingClue] 독서 그룹에 초대합니다.\n초대 코드: ${code}\n${typeof window !== "undefined" ? window.location.origin : ""}/groups/join?code=${code}`;
    navigator.clipboard
      ?.writeText(text)
      .then(() => toast("초대 메시지를 복사했습니다. 카톡에 붙여넣으세요"))
      .catch(() => toast("복사에 실패했어요"));
  }

  if (compact) {
    return (
      <button
        onClick={copy}
        className="flex items-center gap-2 border border-white/12 bg-white/4 px-3 py-1.5 text-[12px] font-bold text-white/80 transition hover:bg-white/8"
        title="클릭하면 복사됩니다"
      >
        <span className="text-white/40">초대 코드</span>
        <span className="tracking-wider text-[#a29bfe]">{code}</span>
        <span className="text-white/40">📋</span>
      </button>
    );
  }

  return (
    <div
      className="p-6 text-center"
      style={{
        background:
          "linear-gradient(135deg, rgba(108,92,231,.18) 0%, rgba(168,85,247,.10) 100%)",
        border: "1px solid rgba(139,92,246,.35)",
      }}
    >
      <p className="text-[12px] font-bold text-white/50">초대 코드</p>
      <p className="mt-2 font-mono text-[26px] leading-none font-extrabold tracking-[0.15em] text-white sm:text-[32px]">
        {code}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button onClick={copy} className="btn btn-pill-ghost">
          📋 코드 복사
        </button>
        <button onClick={shareKakao} className="btn btn-pill">
          💬 초대 메시지 복사
        </button>
        <button
          onClick={() => setShowQr((v) => !v)}
          className="btn btn-pill-ghost"
        >
          📱 QR
        </button>
      </div>

      {showQr && (
        <div className="animate-pop mt-5 inline-block bg-white p-3">
          <div className="grid h-32 w-32 grid-cols-8 gap-0.5">
            {Array.from({ length: 64 }, (_, i) => {
              // 코드 기반 결정론적 패턴 (데모용 의사 QR)
              const seed = code.charCodeAt(i % code.length) + i * 7;
              const on = seed % 3 !== 0;
              const corner =
                (i < 3 && i % 8 < 3) ||
                (i % 8 > 4 && i < 24) ||
                (i > 40 && i % 8 < 3);
              return (
                <span
                  key={i}
                  className={on || corner ? "bg-black" : "bg-white"}
                />
              );
            })}
          </div>
          <p className="mt-2 text-[10px] font-bold text-black">{code}</p>
        </div>
      )}

      <p className="mt-4 text-[12px] leading-relaxed text-white/45">
        학생에게 이 코드를 알려주세요.
        <br />
        코드를 입력하면 바로 참여됩니다.
      </p>
    </div>
  );
}
