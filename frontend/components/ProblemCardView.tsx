"use client";

import Link from "next/link";
import { Badge, cn } from "./ui";
import ReactionBar from "./ReactionBar";
import type { ProblemCard } from "@/lib/types";
import { getInterest, interestColor } from "@/lib/data";
import { cardReactions } from "@/lib/store";
import { timeAgo } from "@/lib/format";

/** 피드/목록용 카드 */
export function ProblemCardItem({
  card,
  showReactions = true,
  compact = false,
}: {
  card: ProblemCard;
  showReactions?: boolean;
  compact?: boolean;
}) {
  const interest = getInterest(card.interestId);
  const color = interestColor(card.interestId);
  const commentCount = cardReactions(card.id).length;

  return (
    <article
      className={cn(
        "panel transition hover:border-white/20",
        card.isHighlighted && "border-[#6c5ce7]/50 bg-[#6c5ce7]/6",
      )}
    >
      {card.isHighlighted && (
        <div className="flex items-center gap-1.5 border-b border-[#6c5ce7]/25 bg-[#6c5ce7]/10 px-4 py-1.5 text-[11px] font-bold text-[#a29bfe]">
          ⭐ 이번 주 하이라이트
        </div>
      )}

      <div className="p-4">
        {/* 헤더 */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[16px]">{card.userAvatar}</span>
          <span className="text-[13px] font-bold text-white">
            {card.userName}
          </span>
          <Badge color={color}>
            {interest?.emoji} #{card.interestId} {interest?.name}
          </Badge>
          <span className="ml-auto shrink-0 text-[11px] text-white/35">
            {timeAgo(card.createdAt)}
          </span>
        </div>

        {/* 제목 */}
        <Link href={`/cards/${card.id}`} className="group block">
          <h3 className="text-[16px] leading-snug font-bold text-white transition group-hover:text-[#a29bfe] sm:text-[17px]">
            🔍 {card.title}
          </h3>
        </Link>

        {!compact && (
          <>
            {card.moment && (
              <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-white/55">
                {card.moment}
              </p>
            )}
            {card.bookTitle && (
              <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-white/45">
                <span>📖</span>
                <span className="truncate">《{card.bookTitle}》</span>
              </p>
            )}
          </>
        )}

        {showReactions && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <ReactionBar cardId={card.id} size="sm" />
            <Link
              href={`/cards/${card.id}`}
              className="shrink-0 text-[12px] font-semibold text-white/40 transition hover:text-white"
            >
              💬 {commentCount}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}

/** 상세 페이지용 5칸 전문 */
export function ProblemCardFull({ card }: { card: ProblemCard }) {
  const interest = getInterest(card.interestId);
  const color = interestColor(card.interestId);

  const sections = [
    { n: "②", label: "이 문제를 느낀 순간", body: card.moment },
    {
      n: "③",
      label: "관련된 책",
      body: card.bookTitle
        ? `《${card.bookTitle}》\n이 책이 준 질문: ${card.bookQuestion}`
        : "",
    },
    {
      n: "④",
      label: "반대편에서 보면",
      body: card.opponent
        ? `${card.opponent} → "${card.opponentLogic}"`
        : "",
      accent: true,
    },
    { n: "⑤", label: "이 문제가 중요한 이유", body: card.why },
  ].filter((s) => s.body);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[18px]">{card.userAvatar}</span>
        <span className="text-[14px] font-bold text-white">{card.userName}</span>
        <Badge color={color}>
          {interest?.emoji} #{card.interestId} {interest?.name}
        </Badge>
        <span className="text-[12px] text-white/35">
          {timeAgo(card.createdAt)}
        </span>
      </div>

      <div
        className="mb-6 border-l-4 py-3 pl-4"
        style={{ borderColor: color, background: `${color}0d` }}
      >
        <p className="text-[11px] font-bold text-white/40">① 이 문제를 한 문장으로</p>
        <h1 className="mt-1 text-[20px] leading-snug font-extrabold text-white sm:text-[24px]">
          {card.title}
        </h1>
      </div>

      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.n}>
            <p
              className={cn(
                "mb-1.5 text-[12px] font-bold",
                s.accent ? "text-[#a29bfe]" : "text-white/40",
              )}
            >
              {s.n} {s.label}
              {s.accent && " ★"}
            </p>
            <p className="text-[14px] leading-relaxed whitespace-pre-line text-white/80">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
