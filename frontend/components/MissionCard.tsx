"use client";

import Link from "next/link";
import { Badge, Button, ProgressBar, cn } from "./ui";
import type { Group, Mission, MissionStatus } from "@/lib/types";
import { weekDeadline, deadlineLabel } from "@/lib/format";

export const SMILE_COLOR: Record<string, string> = {
  S: "#3b82f6",
  M: "#a855f7",
  I: "#fbbf24",
  L: "#22c55e",
  E: "#ef4444",
  P: "#06b6d4",
};

export const ACT_LABEL: Record<number, string> = {
  1: "1막 문제 제기",
  2: "2막 심화·검증",
  3: "3막 프로젝트",
};

export const ACT_COLOR: Record<number, string> = {
  1: "#fbbf24",
  2: "#22c55e",
  3: "#06b6d4",
};

/** 미션 액션 → 이동 경로 */
export function missionHref(mission: Mission, group: Group): string {
  switch (mission.action) {
    case "quiz":
      return "/quiz";
    case "book":
      return "/books/explore";
    case "card":
      return `/cards/new?group=${group.id}`;
    default:
      return `/groups/${group.id}/roadmap?week=${mission.week}`;
  }
}

export function SmileChips({ stages }: { stages: string[] }) {
  return (
    <span className="flex gap-1">
      {stages.map((s) => (
        <span
          key={s}
          className="flex h-5 w-5 items-center justify-center text-[10px] font-extrabold"
          style={{
            color: SMILE_COLOR[s],
            background: `${SMILE_COLOR[s]}1f`,
            border: `1px solid ${SMILE_COLOR[s]}40`,
          }}
        >
          {s}
        </span>
      ))}
    </span>
  );
}

/** 그룹 홈 상단 — 이번 주 미션 (학생 뷰) */
export function ThisWeekMission({
  mission,
  group,
  done,
}: {
  mission: Mission;
  group: Group;
  done: boolean;
}) {
  const dl = deadlineLabel(weekDeadline(group.currentWeek, mission.week));

  return (
    <div
      className="panel p-5"
      style={{
        background:
          "linear-gradient(135deg, rgba(108,92,231,.18) 0%, rgba(168,85,247,.10) 100%)",
        borderColor: "rgba(139,92,246,.35)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="eyebrow">🔔 이번 주 미션</span>
        <SmileChips stages={mission.smile} />
      </div>

      <h2 className="mt-2 text-[20px] leading-tight font-extrabold text-white sm:text-[22px]">
        주 {mission.week} · {mission.title}
      </h2>
      <p className="mt-2 text-[13px] leading-relaxed text-white/60">
        {mission.summary}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px]">
        <span className="text-white/50">
          📅 마감 {dl.text}{" "}
          <span
            className={cn(
              "font-bold",
              dl.dday <= 2 ? "text-[#ef4444]" : "text-[#fbbf24]",
            )}
          >
            · D{dl.dday >= 0 ? `-${dl.dday}` : `+${-dl.dday}`}
          </span>
        </span>
        <span className="text-white/50">⏱ 약 {mission.estimatedMin}분</span>
        <span
          className={cn(
            "font-bold",
            done ? "text-[#22c55e]" : "text-[#fbbf24]",
          )}
        >
          {done ? "✅ 제출 완료" : "⬜ 미제출"}
        </span>
      </div>

      <div className="mt-4">
        <Button
          variant={done ? "pillGhost" : "pill"}
          href={
            done
              ? `/groups/${group.id}/roadmap`
              : missionHref(mission, group)
          }
        >
          {done ? "로드맵 보기 →" : "미션 시작하기 →"}
        </Button>
      </div>
    </div>
  );
}

/** 로드맵 목록의 한 줄 */
export function MissionRow({
  mission,
  status,
  progress,
  onClick,
  active,
}: {
  mission: Mission;
  status: MissionStatus;
  progress?: { done: number; total: number };
  onClick?: () => void;
  active?: boolean;
}) {
  const icon =
    status === "done" ? "✅" : status === "doing" ? "🔵" : "⬜";

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-b border-white/6 px-4 py-3 text-left transition last:border-b-0",
        active ? "bg-white/6" : "hover:bg-white/4",
        status === "locked" && "opacity-45",
      )}
    >
      <span className="shrink-0 text-[14px]">{icon}</span>

      <span className="w-11 shrink-0 text-[12px] font-bold text-white/45">
        주 {mission.week}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-[14px] font-bold",
              status === "doing" ? "text-white" : "text-white/75",
            )}
          >
            {mission.title}
          </span>
          {mission.week === 7 && (
            <span className="shrink-0 text-[11px] font-bold text-[#ef4444]">
              ★
            </span>
          )}
          {status === "doing" && (
            <span className="shrink-0 text-[11px] font-bold text-[#a29bfe]">
              ← 지금
            </span>
          )}
        </span>
        {progress && progress.total > 0 && (
          <span className="mt-1 flex items-center gap-2">
            <ProgressBar
              value={progress.done}
              total={progress.total}
              color={ACT_COLOR[mission.act]}
              className="max-w-[120px]"
            />
            <span className="text-[11px] text-white/35">
              {progress.done}/{progress.total}
            </span>
          </span>
        )}
      </span>

      <SmileChips stages={mission.smile} />
    </button>
  );
}

/** 미션 상세 패널 */
export function MissionDetail({
  mission,
  group,
  done,
  onSubmit,
}: {
  mission: Mission;
  group: Group;
  done: boolean;
  onSubmit?: () => void;
}) {
  const dl = deadlineLabel(weekDeadline(group.currentWeek, mission.week));

  return (
    <div className="p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge color={ACT_COLOR[mission.act]}>{ACT_LABEL[mission.act]}</Badge>
        <SmileChips stages={mission.smile} />
        {done && <Badge color="#22c55e">✅ 완료</Badge>}
      </div>

      <h2 className="text-[20px] leading-tight font-extrabold text-white">
        주 {mission.week} · {mission.title}
      </h2>

      <div className="mt-4">
        <p className="text-[12px] font-bold text-white/40">📌 무엇을 하나요</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/75">
          {mission.summary}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-[12px] font-bold text-white/40">✅ 해야 할 일</p>
        <ol className="mt-2 space-y-2">
          {mission.todos.map((t, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-[13px] leading-relaxed text-white/75"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-white/8 text-[11px] font-bold text-white/60">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </div>

      {mission.ai && (
        <div className="mt-5 border border-[#22d3ee]/25 bg-[#22d3ee]/[.06] p-3.5">
          <p className="text-[12px] font-bold text-[#22d3ee]">🤖 AI는 여기까지</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">
            {mission.ai}
          </p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/8 pt-4 text-[12px] text-white/45">
        <span>⏱ 예상 소요 {mission.estimatedMin}분</span>
        <span>
          📅 마감 {dl.text} · D{dl.dday >= 0 ? `-${dl.dday}` : `+${-dl.dday}`}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {!done && (
          <>
            <Button variant="pill" href={missionHref(mission, group)}>
              미션 시작하기 →
            </Button>
            {onSubmit && (
              <Button variant="square" onClick={onSubmit}>
                완료로 표시
              </Button>
            )}
          </>
        )}
        {done && (
          <Link
            href={`/groups/${group.id}/feed`}
            className="btn btn-pill-ghost"
          >
            피드에서 확인 →
          </Link>
        )}
      </div>
    </div>
  );
}
