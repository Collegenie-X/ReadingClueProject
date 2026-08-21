"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Button,
  Panel,
  PanelHeader,
  ProgressBar,
  Badge,
  Avatar,
  EmptyState,
  Stat,
  toast,
  cn,
} from "@/components/ui";
import { ProblemCardItem } from "@/components/ProblemCardView";
import {
  getGroup,
  groupCrews,
  groupMembers,
  crewProgress,
  crewCards,
  hasSubmitted,
  isLeaderOf,
  myCrew,
  getCrew,
} from "@/lib/store";
import { getInterest, interestColor } from "@/lib/data";
import { useMounted, useStoreVersion } from "@/lib/useStore";
import { pct } from "@/lib/format";
import type { Crew } from "@/lib/types";

export default function GroupCrewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  useStoreVersion();
  const [picked, setPicked] = useState<string | null>(null);

  if (!mounted) return null;
  const group = getGroup(id);
  if (!group) return null;

  const leader = isLeaderOf(id);
  const crews = groupCrews(id);
  const mine = myCrew(id);
  const week = group.currentWeek;

  // ── 크루 없음 ──────────────────────────
  if (crews.length === 0) {
    return (
      <div className="shell py-6 md:py-8">
        <Panel>
          <EmptyState
            icon="👥"
            title="아직 크루가 없어요"
            desc="학생이 관심사 진단을 마치면 크루가 자동으로 만들어집니다."
            action={
              leader ? (
                <Button variant="pill" onClick={() => toast("곧 지원할 예정입니다")}>
                  + 크루 추가
                </Button>
              ) : (
                <Link href="/quiz" className="btn btn-pill">
                  관심사 진단 받기 →
                </Link>
              )
            }
          />
        </Panel>
      </div>
    );
  }

  const selected =
    (picked ? getCrew(picked) : undefined) ?? mine ?? crews[0];

  return (
    <div className="shell py-6 md:py-8">
      {/* ══════════ 헤더 ══════════ */}
      <Panel className="mb-5">
        <PanelHeader
          title="크루"
          desc={`${crews.length}개 크루 · 주 ${week} 기준`}
          action={
            leader ? (
              <Button
                variant="square"
                onClick={() => toast("곧 지원할 예정입니다")}
              >
                + 크루 추가
              </Button>
            ) : undefined
          }
        />
      </Panel>

      {/* ══════════ 크루 목록 ══════════ */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        {crews.map((c) => (
          <CrewTile
            key={c.id}
            crew={c}
            groupId={id}
            week={week}
            isMine={mine?.id === c.id}
            active={selected?.id === c.id}
            onClick={() => setPicked(c.id)}
          />
        ))}
      </div>

      {/* ══════════ 크루 상세 ══════════ */}
      {selected && (
        <CrewDetail
          crew={selected}
          groupId={id}
          week={week}
          leader={leader}
          isMine={mine?.id === selected.id}
        />
      )}
    </div>
  );
}

// ══════════════ 크루 카드 ══════════════
function CrewTile({
  crew,
  groupId,
  week,
  isMine,
  active,
  onClick,
}: {
  crew: Crew;
  groupId: string;
  week: number;
  isMine: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const interest = getInterest(crew.interestId);
  const color = interestColor(crew.interestId);
  const prog = crewProgress(crew.id, week);
  const rate = pct(prog.done, prog.total);
  const low = rate < 60;
  const members = groupMembers(groupId);
  const cardCount = crewCards(crew.id).length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "panel p-4 text-left transition hover:border-white/25",
        active && "bg-white/6",
      )}
      style={active ? { borderColor: `${color}66` } : undefined}
    >
      <div className="flex items-center gap-2">
        <span className="text-[16px]">{interest?.emoji}</span>
        <span className="min-w-0 flex-1 truncate text-[14px] font-bold text-white">
          {crew.name}
        </span>
        {isMine && <Badge color="#6c5ce7">내 크루</Badge>}
      </div>

      {/* 멤버 아바타 스택 */}
      <div className="mt-3 flex items-center gap-2">
        <span className="flex -space-x-1.5">
          {crew.memberIds.slice(0, 6).map((mid) => {
            const m = members.find((x) => x.userId === mid);
            return (
              <Avatar key={mid} emoji={m?.user.avatar ?? "🙂"} size={24} ring />
            );
          })}
          {crew.memberIds.length > 6 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white/60 ring-2 ring-black">
              +{crew.memberIds.length - 6}
            </span>
          )}
        </span>
        <span className="ml-auto shrink-0 text-[12px] text-white/45">
          🔍 {cardCount}장
        </span>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-[12px] text-white/50">
          {crew.memberIds.length}명 · 이번 주 {prog.done}/{prog.total} 완료
        </span>
        <span
          className={cn(
            "shrink-0 text-[13px] font-extrabold",
            low ? "text-[#fbbf24]" : "text-white",
          )}
        >
          {rate}%{low && " ⚠️"}
        </span>
      </div>
      <ProgressBar
        value={prog.done}
        total={prog.total}
        color={color}
        className="mt-2"
      />
    </button>
  );
}

// ══════════════ 크루 상세 ══════════════
function CrewDetail({
  crew,
  groupId,
  week,
  leader,
  isMine,
}: {
  crew: Crew;
  groupId: string;
  week: number;
  leader: boolean;
  isMine: boolean;
}) {
  const interest = getInterest(crew.interestId);
  const color = interestColor(crew.interestId);
  const members = groupMembers(groupId);
  const cards = crewCards(crew.id);
  const prog = crewProgress(crew.id, week);

  function nameOf(userId: string) {
    return members.find((m) => m.userId === userId)?.user.name ?? "멤버";
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {/* 멤버 · 셀 */}
      <div className="space-y-5 lg:col-span-2">
        <Panel>
          <PanelHeader
            title={
              <span className="flex flex-wrap items-center gap-2">
                <span>{interest?.emoji}</span>
                {crew.name}
                {isMine && <Badge color="#6c5ce7">내 크루</Badge>}
              </span>
            }
            desc={`${crew.memberIds.length}명 · 이번 주 ${prog.done}/${prog.total} 완료`}
            action={
              leader ? (
                <Button
                  variant="square"
                  onClick={() => toast("셀을 재배정했습니다")}
                >
                  🔀 셀 재배정
                </Button>
              ) : undefined
            }
          />

          {/* 멤버 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left">
              <thead>
                <tr className="border-b border-white/8 text-[11px] font-bold text-white/35">
                  <th className="px-4 py-2.5">멤버</th>
                  <th className="px-3 py-2.5">역할</th>
                  <th className="px-3 py-2.5 text-right">카드</th>
                  <th className="px-4 py-2.5 text-right">주 {week}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {crew.memberIds.map((mid) => {
                  const m = members.find((x) => x.userId === mid);
                  const isLead = crew.leadUserId === mid;
                  const ok = hasSubmitted(groupId, week, mid);
                  const myCardCount = cards.filter(
                    (c) => c.userId === mid,
                  ).length;
                  return (
                    <tr key={mid} className="transition hover:bg-white/3">
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-2">
                          <Avatar emoji={m?.user.avatar ?? "🙂"} size={24} />
                          <span className="truncate text-[13px] font-bold text-white">
                            {m?.user.name ?? "멤버"}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span
                          className={cn(
                            "text-[12px] font-semibold",
                            isLead ? "text-[#a29bfe]" : "text-white/40",
                          )}
                        >
                          {isLead ? "크루장" : "멤버"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-[12px] text-white/55">
                        {myCardCount}장
                      </td>
                      <td className="px-4 py-2.5 text-right text-[13px]">
                        {ok ? "✅" : "⬜"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 셀 배정 */}
          <div className="border-t border-white/8 px-4 py-3.5">
            <p className="text-[12px] font-bold text-white/40">🧩 셀 배정</p>
            <ul className="mt-2 space-y-1.5">
              {crew.cells.length === 0 ? (
                <li className="text-[13px] text-white/35">
                  아직 셀이 나뉘지 않았어요.
                </li>
              ) : (
                crew.cells.map((cell) => (
                  <li
                    key={cell.name}
                    className="flex gap-2 text-[13px] leading-relaxed text-white/70"
                  >
                    <span
                      className="shrink-0 font-bold"
                      style={{ color }}
                    >
                      {cell.name}:
                    </span>
                    <span className="min-w-0">
                      {cell.memberIds.length === 0
                        ? "—"
                        : cell.memberIds.map(nameOf).join(" · ")}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </Panel>

        {/* 크루 문제 카드 */}
        <Panel>
          <PanelHeader title="크루 문제 카드" desc={`${cards.length}장`} />
          {cards.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="아직 문제 카드가 없어요"
              desc="크루 친구들과 첫 문제를 올려보세요."
              action={
                <Link href={`/cards/new?group=${groupId}`} className="btn btn-pill">
                  ✏️ 문제 카드 작성
                </Link>
              }
            />
          ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {cards.map((c) => (
                <ProblemCardItem key={c.id} card={c} compact />
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* 사이드 요약 */}
      <div className="space-y-5">
        <Panel>
          <PanelHeader
            title="크루 요약"
            desc={interest ? `#${interest.id} ${interest.name}` : undefined}
          />
          <div className="grid grid-cols-2 gap-px bg-white/6">
            <div className="bg-[#0b0b16]">
              <Stat label="멤버" value={crew.memberIds.length} suffix="명" />
            </div>
            <div className="bg-[#0b0b16]">
              <Stat label="셀" value={crew.cells.length} suffix="개" />
            </div>
            <div className="bg-[#0b0b16]">
              <Stat label="문제 카드" value={cards.length} suffix="장" />
            </div>
            <div className="bg-[#0b0b16]">
              <Stat
                label={`주 ${week} 완료`}
                value={pct(prog.done, prog.total)}
                suffix="%"
                color={pct(prog.done, prog.total) < 60 ? "#fbbf24" : "#22c55e"}
              />
            </div>
          </div>
          <div className="px-4 py-3.5">
            <ProgressBar
              value={prog.done}
              total={prog.total}
              color={color}
            />
            <p className="mt-3 text-[12px] leading-relaxed text-white/45">
              같은 관심사를 가진 친구들과 문제를 겹쳐 볼 때 생각이 가장 빠르게
              자랍니다.
            </p>
          </div>
        </Panel>

        <Link href={`/cards/new?group=${groupId}`} className="btn btn-primary w-full">
          ✏️ 문제 카드 쓰기
        </Link>
      </div>
    </div>
  );
}
