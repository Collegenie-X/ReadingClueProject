"use client";

/** P21 — 내 기록 */

import { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  Panel,
  PanelHeader,
  ProgressBar,
  SegmentTabs,
  Skeleton,
  Stat,
  cn,
} from "@/components/ui";
import { ProblemCardItem } from "@/components/ProblemCardView";
import {
  cardReactions,
  getCard,
  getCipResult,
  getState,
  hasSubmitted,
  myCards,
  myGroups,
  myProgress,
} from "@/lib/store";
import { getInterest, interestColor, interestLabel } from "@/lib/data";
import { useRequireAuth, useStoreVersion } from "@/lib/useStore";
import { formatDate, timeAgo, pct } from "@/lib/format";
import type { ReactionType } from "@/lib/types";

const TABS = [
  { key: "cards", label: "문제 카드", icon: "🔍" },
  { key: "reactions", label: "반응", icon: "💬" },
  { key: "missions", label: "미션 이력", icon: "🗓️" },
];

const REACTION_META: Record<
  ReactionType,
  { emoji: string; label: string; color: string }
> = {
  agree: { emoji: "🤝", label: "공감", color: "#22c55e" },
  symptom: { emoji: "🔍", label: "증상", color: "#fbbf24" },
  rebut: { emoji: "⚔️", label: "반론", color: "#ef4444" },
};

export default function MyRecordPage() {
  useStoreVersion();
  const { ready, user } = useRequireAuth();
  const [tab, setTab] = useState("cards");

  if (!ready || !user) {
    return (
      <div className="shell py-8">
        <Skeleton className="h-[110px] w-full" />
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-[180px] w-full lg:col-span-2" />
          <Skeleton className="h-[180px] w-full" />
        </div>
      </div>
    );
  }

  // ── 집계 ──────────────────────────────────
  const cip = getCipResult();
  const cards = myCards();
  const received = cards.reduce((acc, c) => acc + cardReactions(c.id).length, 0);
  const given = getState()
    .reactions.filter((r) => r.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const receivedBreakdown = cards.reduce(
    (acc, c) => {
      cardReactions(c.id).forEach((r) => {
        acc[r.type] += 1;
      });
      return acc;
    },
    { agree: 0, symptom: 0, rebut: 0 } as Record<ReactionType, number>,
  );

  const groups = myGroups();

  return (
    <div className="shell space-y-5 py-6 md:py-8">
      {/* ═══════════ 프로필 ═══════════ */}
      <Panel
        style={{
          background:
            "linear-gradient(135deg, rgba(108,92,231,.16) 0%, rgba(168,85,247,.07) 100%)",
          borderColor: "rgba(108,92,231,.3)",
        }}
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <Avatar emoji={user.avatar} size={56} />
          <div className="min-w-0 flex-1">
            <p className="eyebrow">My Record</p>
            <h1 className="mt-1 text-[22px] leading-tight font-extrabold text-white sm:text-[26px]">
              {user.name}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-white/50">
              <span className="font-semibold text-white/70">
                {user.role === "leader" ? "👩‍🏫 독서 지도자" : "🙂 멤버"}
              </span>
              {user.school && <span>· {user.school}</span>}
              {user.grade && <span>· {user.grade}</span>}
              <span>· 가입 {formatDate(user.createdAt)}</span>
            </p>
          </div>
          <Link href="/quiz" className="btn btn-pill-ghost shrink-0 self-start">
            🎯 다시 진단
          </Link>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* ══════════ 좌측 ══════════ */}
        <div className="space-y-5 lg:col-span-2">
          {/* 탭 */}
          <SegmentTabs tabs={TABS} active={tab} onChange={setTab} />

          {/* ── 문제 카드 탭 ── */}
          {tab === "cards" && (
            <Panel>
              <PanelHeader
                title="내가 쓴 문제 카드"
                desc={`총 ${cards.length}장`}
                action={
                  <Link
                    href="/cards/new"
                    className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                  >
                    카드 쓰기 →
                  </Link>
                }
              />
              {cards.length === 0 ? (
                <EmptyState
                  icon="🔍"
                  title="아직 문제 카드가 없어요"
                  desc="책에서 느낀 문제를 한 문장으로 적는 것에서 시작합니다."
                  action={
                    <Link href="/cards/new" className="btn btn-pill">
                      ✏️ 카드 쓰기
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-3 p-4">
                  {cards.map((c) => (
                    <div key={c.id}>
                      <ProblemCardItem card={c} />
                      <p className="mt-1.5 px-1 text-[11px] text-white/35">
                        받은 반응 {cardReactions(c.id).length}개
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {/* ── 반응 탭 ── */}
          {tab === "reactions" && (
            <Panel>
              <PanelHeader
                title="내가 남긴 반응"
                desc={`총 ${given.length}개 · 🔍와 ⚔️는 코멘트가 있어야 남길 수 있어요`}
              />
              {given.length === 0 ? (
                <EmptyState
                  icon="💬"
                  title="아직 남긴 반응이 없어요"
                  desc="친구의 문제 카드에 공감하거나 반론을 남겨보세요."
                  action={
                    <Link href="/explore" className="btn btn-pill">
                      🌐 문제 아카이브 보기
                    </Link>
                  }
                />
              ) : (
                <ul className="divide-y divide-white/6">
                  {given.map((r) => {
                    const meta = REACTION_META[r.type];
                    const target = getCard(r.cardId);
                    return (
                      <li key={r.id} className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-bold"
                            style={{
                              color: meta.color,
                              background: `${meta.color}1f`,
                              borderColor: `${meta.color}40`,
                            }}
                          >
                            {meta.emoji} {meta.label}
                          </span>
                          <span className="ml-auto shrink-0 text-[11px] text-white/30">
                            {timeAgo(r.createdAt)}
                          </span>
                        </div>

                        {r.comment && (
                          <p
                            className="mt-2 border-l-2 pl-3 text-[13px] leading-relaxed text-white/75"
                            style={{ borderColor: `${meta.color}66` }}
                          >
                            {r.comment}
                          </p>
                        )}

                        {target ? (
                          <Link
                            href={`/cards/${target.id}`}
                            className="mt-2 block truncate text-[12px] font-semibold text-[#a29bfe] hover:underline"
                          >
                            → 🔍 {target.title}
                          </Link>
                        ) : (
                          <p className="mt-2 text-[12px] text-white/30">
                            → 삭제된 카드
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          )}

          {/* ── 미션 이력 탭 ── */}
          {tab === "missions" && (
            <div className="space-y-5">
              {groups.length === 0 ? (
                <Panel>
                  <EmptyState
                    icon="🗓️"
                    title="아직 소속 그룹이 없어요"
                    desc="그룹에 참여하면 주차별 미션 이력이 여기에 쌓입니다."
                    action={
                      <Link href="/groups/join" className="btn btn-pill">
                        초대 코드로 참여
                      </Link>
                    }
                  />
                </Panel>
              ) : (
                groups.map((g) => {
                  const prog = myProgress(g.id);
                  const weeks = Array.from(
                    { length: prog.total },
                    (_, i) => i + 1,
                  );
                  return (
                    <Panel key={g.id}>
                      <PanelHeader
                        title={
                          <span className="flex items-center gap-2">
                            <span>{g.icon}</span>
                            {g.name}
                          </span>
                        }
                        desc={`시즌 ${g.season} · 현재 주 ${g.currentWeek} · ${g.roadmapType}`}
                        action={
                          <Link
                            href={`/groups/${g.id}`}
                            className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                          >
                            그룹 홈 →
                          </Link>
                        }
                      />
                      <div className="px-4 py-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[12px] text-white/45">
                            내 진행률
                          </span>
                          <span className="text-[13px] font-bold text-white">
                            {prog.done}/{prog.total}주{" "}
                            <span className="text-[12px] font-semibold text-white/45">
                              ({pct(prog.done, prog.total)}%)
                            </span>
                          </span>
                        </div>
                        <ProgressBar
                          value={prog.done}
                          total={prog.total}
                          className="mt-2"
                        />

                        <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-12">
                          {weeks.map((w) => {
                            const done = hasSubmitted(g.id, w);
                            const current = w === g.currentWeek;
                            return (
                              <div
                                key={w}
                                title={`주 ${w} ${done ? "완료" : "미제출"}`}
                                className={cn(
                                  "flex flex-col items-center gap-0.5 border py-1.5 text-[10px] font-bold transition",
                                  done
                                    ? "border-[#22c55e]/35 bg-[#22c55e]/12 text-white"
                                    : "border-white/10 bg-white/3 text-white/40",
                                  current && "ring-1 ring-[#6c5ce7]",
                                )}
                              >
                                <span>{done ? "✅" : "⬜"}</span>
                                <span>{w}주</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Panel>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ══════════ 우측 사이드 ══════════ */}
        <div className="space-y-5">
          {/* 내 관심사 */}
          <Panel>
            <PanelHeader
              title="🎯 내 관심사"
              desc={cip ? `진단일 ${formatDate(cip.completedAt)}` : undefined}
              action={
                cip ? (
                  <Link
                    href="/quiz"
                    className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                  >
                    다시 진단 →
                  </Link>
                ) : undefined
              }
            />
            {cip ? (
              <div className="space-y-2 p-4">
                {cip.top3.map((iid, i) => {
                  const color = interestColor(iid);
                  const interest = getInterest(iid);
                  return (
                    <div
                      key={iid}
                      className="flex items-center gap-2 border px-3 py-2.5"
                      style={{
                        background: `${color}14`,
                        borderColor: `${color}2e`,
                      }}
                    >
                      <span className="text-[11px] font-bold text-white/40">
                        {i + 1}위
                      </span>
                      <Badge color={color}>
                        {interest?.emoji} {interestLabel(iid)}
                      </Badge>
                      <span className="ml-auto shrink-0 text-[12px] font-extrabold text-white">
                        {cip.scores[iid] ?? 0}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon="🎯"
                title="아직 진단을 받지 않았어요"
                desc="10분이면 내 관심사 3개를 찾을 수 있어요."
                action={
                  <Link href="/quiz" className="btn btn-pill">
                    진단 시작
                  </Link>
                }
              />
            )}
          </Panel>

          {/* 활동 요약 */}
          <Panel>
            <PanelHeader title="📊 활동 요약" />
            <div className="grid grid-cols-2 gap-px bg-white/6">
              <div className="bg-[#0b0b16]">
                <Stat label="문제 카드" value={cards.length} suffix="장" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat
                  label="받은 반응"
                  value={received}
                  suffix="개"
                  color="#a29bfe"
                />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="남긴 반응" value={given.length} suffix="개" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="소속 그룹" value={groups.length} suffix="개" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="정의서" value={0} suffix="건" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="프로젝트" value={0} suffix="건" />
              </div>
            </div>
            <div className="flex gap-2 border-t border-white/8 px-4 py-3 text-[12px] font-bold">
              <span className="text-[#22c55e]">
                🤝 {receivedBreakdown.agree}
              </span>
              <span className="text-[#fbbf24]">
                🔍 {receivedBreakdown.symptom}
              </span>
              <span className="text-[#ef4444]">
                ⚔️ {receivedBreakdown.rebut}
              </span>
              <span className="ml-auto text-white/30">받은 반응 기준</span>
            </div>
          </Panel>

          {/* 내 그룹 */}
          <Panel>
            <PanelHeader title="👥 내 그룹" desc={`${groups.length}개`} />
            {groups.length === 0 ? (
              <EmptyState
                icon="👋"
                title="소속 그룹이 없어요"
                desc="초대 코드를 받았다면 바로 참여할 수 있어요."
                action={
                  <Link href="/groups/join" className="btn btn-pill">
                    참여하기
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-white/6">
                {groups.map((g) => {
                  const prog = myProgress(g.id);
                  return (
                    <li key={g.id}>
                      <Link
                        href={`/groups/${g.id}`}
                        className="flex items-center gap-2.5 px-4 py-3 transition hover:bg-white/4"
                      >
                        <span className="text-[16px]">{g.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold text-white">
                            {g.name}
                          </p>
                          <p className="text-[11px] text-white/40">
                            주 {g.currentWeek} · {prog.done}/{prog.total}주 완료
                          </p>
                        </div>
                        <span className="shrink-0 text-[12px] text-white/30">
                          →
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Button href="/cards/new" variant="primary" className="w-full">
            ✏️ 문제 카드 쓰기
          </Button>
        </div>
      </div>
    </div>
  );
}
