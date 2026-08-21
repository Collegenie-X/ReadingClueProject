"use client";

import Link from "next/link";
import { Badge, ProgressBar, cn } from "./ui";
import type { Group } from "@/lib/types";
import { groupMembers, weekProgress, hasSubmitted, isLeaderOf } from "@/lib/store";
import { getMission } from "@/lib/data";
import { timeAgo, pct } from "@/lib/format";

/** 내 그룹 카드 — 이번 주 미션 상태 포함 */
export function MyGroupCard({ group }: { group: Group }) {
  const members = groupMembers(group.id);
  const leader = isLeaderOf(group.id);
  const mission = getMission(group.currentWeek);
  const prog = weekProgress(group.id, group.currentWeek);
  const done = hasSubmitted(group.id, group.currentWeek);

  return (
    <Link
      href={`/groups/${group.id}`}
      className="panel block p-4 transition hover:border-white/25 active:scale-[0.99]"
      style={{
        background: "rgba(108,92,231,0.024)",
        borderColor: "rgba(108,92,231,0.2)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] text-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,92,231,.16), rgba(108,92,231,.06))",
            border: "1px solid rgba(108,92,231,.19)",
          }}
        >
          {group.icon}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[14px] font-bold text-white">
              {group.name}
            </h3>
            <Badge color={leader ? "#fbbf24" : "#6c5ce7"}>
              {leader ? "관리" : "멤버"}
            </Badge>
          </div>

          <p className="mt-0.5 line-clamp-1 text-[13px] text-white/45">
            {group.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-white/40">
            <span>👥 {members.length}명</span>
            <span>·</span>
            <span>📋 {group.currentWeek}주차</span>
            <span>·</span>
            <span>시즌 {group.season}</span>
            {group.tags.slice(0, 1).map((t) => (
              <span key={t} className="text-white/30">
                #{t}
              </span>
            ))}
          </div>

          {mission && (
            <div className="mt-3 border-t border-white/8 pt-2.5">
              {leader ? (
                <>
                  <div className="mb-1.5 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-white/70">
                      주 {group.currentWeek} · {mission.title}
                    </span>
                    <span className="font-bold text-white/50">
                      {prog.done}/{prog.total} ({pct(prog.done, prog.total)}%)
                    </span>
                  </div>
                  <ProgressBar value={prog.done} total={prog.total} />
                </>
              ) : (
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="truncate text-white/70">
                    이번 주 미션: {mission.title}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-bold",
                      done ? "text-[#22c55e]" : "text-[#fbbf24]",
                    )}
                  >
                    {done ? "✅ 완료" : "⬜ 미제출"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <span className="shrink-0 self-center text-white/25">›</span>
      </div>
    </Link>
  );
}

/** 공개 그룹 탐색 카드 */
export function PublicGroupCard({
  group,
  onJoin,
}: {
  group: Group;
  onJoin?: (g: Group) => void;
}) {
  const members = groupMembers(group.id);
  const full = members.length >= group.maxMembers;

  return (
    <div className="panel flex flex-col p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[20px] text-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,92,231,.16), rgba(108,92,231,.06))",
            border: "1px solid rgba(108,92,231,.19)",
          }}
        >
          {group.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-bold text-white">
            {group.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-white/45">
            {group.description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge color="#6c5ce7">{group.category}</Badge>
        <Badge color="#3b82f6">{group.mode}</Badge>
        {group.region && <Badge color="#a8a8c0">{group.region}</Badge>}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[12px] text-white/40">
        <span>👥 {members.length}/{group.maxMembers}명</span>
        <span>·</span>
        <span>{group.currentWeek}주차</span>
        <span>·</span>
        <span className="truncate">{group.leaderName} 지도</span>
      </div>

      <button
        onClick={() => onJoin?.(group)}
        disabled={full}
        className="btn btn-square mt-3.5 w-full"
      >
        {full ? "정원이 찼습니다" : "참여 요청"}
      </button>
    </div>
  );
}

/** 랜딩용 요약 카드 */
export function GroupSummaryChip({ group }: { group: Group }) {
  const members = groupMembers(group.id);
  return (
    <div className="card-soft p-4">
      <div className="flex items-center gap-2.5">
        <span className="text-xl">{group.icon}</span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-white">
            {group.name}
          </p>
          <p className="text-[11px] text-white/45">
            {members.length}명 · {group.currentWeek}주차 · {timeAgo(group.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
