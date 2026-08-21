"use client";

import { use } from "react";
import Link from "next/link";
import {
  Button,
  Panel,
  PanelHeader,
  ProgressBar,
  Badge,
  EmptyState,
  Stat,
  toast,
  cn,
} from "@/components/ui";
import InviteCodeBox from "@/components/InviteCodeBox";
import { ThisWeekMission } from "@/components/MissionCard";
import { ProblemCardItem } from "@/components/ProblemCardView";
import {
  getGroup,
  groupMembers,
  groupCrews,
  weekProgress,
  crewProgress,
  notSubmittedMembers,
  hasSubmitted,
  isLeaderOf,
  myCrew,
  myProgress,
  groupStats,
  groupFeed,
  highlightedCard,
  topCard,
  toggleHighlight,
  myCards,
  cardReactions,
} from "@/lib/store";
import { getMission, getInterest, interestColor } from "@/lib/data";
import { useMounted, useStoreVersion, useCurrentUser } from "@/lib/useStore";
import { pct, timeAgo } from "@/lib/format";

export default function GroupHomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  useStoreVersion();
  const user = useCurrentUser();

  if (!mounted) return null;
  const group = getGroup(id);
  if (!group) return null;

  const leader = isLeaderOf(id);
  const members = groupMembers(id);
  const mission = getMission(group.currentWeek);
  const stats = groupStats(id);

  // ── 멤버 0명 (방금 생성) ────────────────
  if (members.filter((m) => m.role !== "leader").length === 0) {
    return (
      <div className="shell max-w-2xl py-10">
        <EmptyState
          icon="👋"
          title="학생을 초대해 주세요"
          desc="초대 코드를 공유하면 학생이 바로 참여할 수 있어요. 4명이 모이면 크루가 자동으로 만들어집니다."
        />
        <div className="mt-2">
          <InviteCodeBox code={group.inviteCode} />
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-6 md:py-8">
      {leader ? (
        <LeaderView groupId={id} />
      ) : (
        <MemberView groupId={id} />
      )}
    </div>
  );

  // ══════════════ 학생 뷰 ══════════════
  function MemberView({ groupId }: { groupId: string }) {
    const crew = myCrew(groupId);
    const done = hasSubmitted(groupId, group!.currentWeek);
    const mine = myProgress(groupId);
    const myCardList = myCards().filter((c) => c.groupId === groupId);
    const myReactionCount = myCardList.reduce(
      (acc, c) => acc + cardReactions(c.id).length,
      0,
    );
    const feed = groupFeed(groupId).slice(0, 5);
    const crewProg = crew
      ? crewProgress(crew.id, group!.currentWeek)
      : { done: 0, total: 0 };

    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {mission && (
            <ThisWeekMission mission={mission} group={group!} done={done} />
          )}

          {/* 내 크루 */}
          {crew ? (
            <Panel>
              <PanelHeader
                title={
                  <span className="flex items-center gap-2">
                    <span>{getInterest(crew.interestId)?.emoji}</span>
                    내 크루 · {crew.name}
                  </span>
                }
                desc={`${crew.memberIds.length}명 · 이번 주 ${crewProg.done}/${crewProg.total} 완료`}
                action={
                  <Link
                    href={`/groups/${groupId}/crews`}
                    className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                  >
                    크루 보기 →
                  </Link>
                }
              />
              <div className="px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  {crew.memberIds.map((mid) => {
                    const m = members.find((x) => x.userId === mid);
                    if (!m) return null;
                    const ok = hasSubmitted(groupId, group!.currentWeek, mid);
                    return (
                      <span
                        key={mid}
                        className={cn(
                          "flex items-center gap-1.5 border px-2.5 py-1.5 text-[12px] font-semibold transition",
                          ok
                            ? "border-[#22c55e]/35 bg-[#22c55e]/10 text-white"
                            : "border-white/10 bg-white/3 text-white/50",
                        )}
                        title={ok ? "이번 주 완료" : "미제출"}
                      >
                        <span>{m.user.avatar}</span>
                        {m.user.name}
                        <span className="text-[10px]">{ok ? "✅" : "⬜"}</span>
                      </span>
                    );
                  })}
                </div>
                <ProgressBar
                  value={crewProg.done}
                  total={crewProg.total}
                  color={interestColor(crew.interestId)}
                  className="mt-4"
                />
              </div>
            </Panel>
          ) : (
            <Panel>
              <EmptyState
                icon="🎯"
                title="아직 크루가 없어요"
                desc="관심사 진단을 받으면 같은 관심사 친구들과 크루가 만들어집니다."
                action={
                  <Link href="/quiz" className="btn btn-pill">
                    관심사 진단 받기 →
                  </Link>
                }
              />
            </Panel>
          )}

          {/* 크루 최근 활동 */}
          <Panel>
            <PanelHeader
              title="크루 최근 활동"
              action={
                <Link
                  href={`/groups/${groupId}/feed`}
                  className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                >
                  피드 전체 →
                </Link>
              }
            />
            {feed.length === 0 ? (
              <EmptyState
                icon="📭"
                title="아직 활동이 없어요"
                desc="첫 문제 카드를 올려보세요."
                action={
                  <Link
                    href={`/cards/new?group=${groupId}`}
                    className="btn btn-pill"
                  >
                    문제 카드 작성
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-white/6">
                {feed.map((f) => (
                  <li key={f.id} className="flex gap-2.5 px-4 py-3">
                    <span className="text-[15px]">{f.userAvatar}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-white/75">
                        <span className="font-bold text-white">
                          {f.userName}
                        </span>
                        {f.kind === "card" && (
                          <>
                            님이 문제 카드를 올렸어요
                            <Link
                              href={`/cards/${f.card!.id}`}
                              className="mt-0.5 block truncate text-[13px] font-semibold text-[#a29bfe] hover:underline"
                            >
                              🔍 {f.card!.title}
                            </Link>
                          </>
                        )}
                        {f.kind === "reaction" && (
                          <>
                            님이{" "}
                            <span className="font-bold">
                              {f.reaction!.type === "agree"
                                ? "🤝"
                                : f.reaction!.type === "symptom"
                                  ? "🔍"
                                  : "⚔️"}
                            </span>{" "}
                            반응을 남겼어요
                            {f.targetCard && (
                              <Link
                                href={`/cards/${f.targetCard.id}`}
                                className="mt-0.5 block truncate text-[12px] text-white/45 hover:underline"
                              >
                                → {f.targetCard.title}
                              </Link>
                            )}
                          </>
                        )}
                        {f.kind === "mission" && (
                          <>
                            님이 <b>미션 {f.week}</b>을 완료했어요
                          </>
                        )}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-white/30">
                      {timeAgo(f.at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* 사이드 */}
        <div className="space-y-5">
          <Panel>
            <PanelHeader title="내 진행 상황" />
            <div className="px-4 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-white/45">전체 진행률</span>
                <span className="text-[13px] font-bold text-white">
                  {mine.done}/{mine.total}주
                </span>
              </div>
              <ProgressBar
                value={mine.done}
                total={mine.total}
                className="mt-2"
              />
              <div className="mt-4 grid grid-cols-3 divide-x divide-white/8 border-t border-white/8 pt-2">
                <Stat label="문제 카드" value={myCardList.length} suffix="장" />
                <Stat
                  label="받은 반응"
                  value={myReactionCount}
                  suffix="개"
                  color="#a29bfe"
                />
                <Stat label="정의서" value={0} suffix="건" />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="시즌 누적" desc={`시즌 ${group!.season}`} />
            <div className="grid grid-cols-2 gap-px bg-white/6">
              <div className="bg-[#0b0b16]">
                <Stat label="문제 카드" value={stats.cardCount} suffix="장" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat
                  label="반응"
                  value={stats.reactionCount}
                  suffix="개"
                  color="#a29bfe"
                />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="멤버" value={stats.memberCount} suffix="명" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="크루" value={stats.crewCount} suffix="개" />
              </div>
            </div>
            <div className="flex gap-2 border-t border-white/8 px-4 py-3 text-[12px] font-bold">
              <span className="text-[#22c55e]">🤝 {stats.agree}</span>
              <span className="text-[#fbbf24]">🔍 {stats.symptom}</span>
              <span className="text-[#ef4444]">⚔️ {stats.rebut}</span>
            </div>
          </Panel>

          <Link
            href={`/cards/new?group=${groupId}`}
            className="btn btn-primary w-full"
          >
            ✏️ 문제 카드 쓰기
          </Link>
        </div>
      </div>
    );
  }

  // ══════════════ 지도자 뷰 ══════════════
  function LeaderView({ groupId }: { groupId: string }) {
    const week = group!.currentWeek;
    const prog = weekProgress(groupId, week);
    const missing = notSubmittedMembers(groupId, week);
    const crews = groupCrews(groupId);
    const hl = highlightedCard(groupId);
    const candidate = hl ?? topCard(groupId);

    return (
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* 이번 주 현황 */}
          <Panel
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,.14) 0%, rgba(20,184,166,.09) 55%, rgba(59,130,246,.06) 100%)",
              borderColor: "rgba(45,212,191,.3)",
            }}
          >
            <div className="p-5">
              <p className="eyebrow">Leader Dashboard</p>
              <h2 className="mt-1.5 text-[20px] leading-tight font-extrabold text-white sm:text-[22px]">
                주 {week} · {mission?.title ?? "—"}
              </h2>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-[13px] text-white/60">이번 주 제출</span>
                <span className="text-[15px] font-extrabold text-white">
                  {prog.done}/{prog.total}{" "}
                  <span className="text-[13px] font-bold text-white/50">
                    ({pct(prog.done, prog.total)}%)
                  </span>
                </span>
              </div>
              <ProgressBar
                value={prog.done}
                total={prog.total}
                color="#22c55e"
                className="mt-2"
              />

              {missing.length > 0 && (
                <div className="mt-4 border-t border-white/10 pt-3.5">
                  <p className="text-[12px] font-bold text-white/50">
                    미제출 {missing.length}명
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {missing.map((m) => (
                      <span
                        key={m.userId}
                        className="flex items-center gap-1.5 border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-2 py-1 text-[12px] font-semibold text-white/80"
                      >
                        <span>{m.user.avatar}</span>
                        {m.user.name}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      toast(`${missing.length}명에게 독려 알림을 보냈습니다`)
                    }
                    className="btn btn-pill mt-3.5"
                  >
                    🔔 일괄 독려 알림 보내기
                  </button>
                </div>
              )}
            </div>
          </Panel>

          {/* 크루별 현황 */}
          <Panel>
            <PanelHeader
              title="크루별 현황"
              desc={`주 ${week} 기준`}
              action={
                <Link
                  href={`/groups/${groupId}/crews`}
                  className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                >
                  크루 관리 →
                </Link>
              }
            />
            {crews.length === 0 ? (
              <EmptyState
                icon="👥"
                title="아직 크루가 없어요"
                desc="학생이 관심사 진단을 마치면 크루가 자동으로 만들어집니다."
              />
            ) : (
              <ul className="divide-y divide-white/6">
                {crews.map((c) => {
                  const cp = crewProgress(c.id, week);
                  const rate = pct(cp.done, cp.total);
                  const low = rate < 60;
                  const color = interestColor(c.interestId);
                  return (
                    <li key={c.id} className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span>{getInterest(c.interestId)?.emoji}</span>
                        <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-white">
                          {c.name}
                        </span>
                        <span className="shrink-0 text-[12px] text-white/40">
                          {c.memberIds.length}명
                        </span>
                        <span
                          className={cn(
                            "w-12 shrink-0 text-right text-[13px] font-extrabold",
                            low ? "text-[#fbbf24]" : "text-white",
                          )}
                        >
                          {rate}%
                        </span>
                        {low && <span className="shrink-0">⚠️</span>}
                      </div>
                      <ProgressBar
                        value={cp.done}
                        total={cp.total}
                        color={color}
                        className="mt-2"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* 주목할 카드 */}
          <Panel>
            <PanelHeader
              title="이번 주 주목할 카드"
              desc={hl ? "하이라이트 지정됨" : "반응이 가장 많은 카드"}
            />
            {candidate ? (
              <div className="p-4">
                <ProblemCardItem card={candidate} showReactions />
                <button
                  onClick={() => {
                    toggleHighlight(candidate.id);
                    toast(
                      candidate.isHighlighted
                        ? "하이라이트를 해제했습니다"
                        : "하이라이트로 지정했습니다",
                    );
                  }}
                  className="btn btn-square mt-3 w-full"
                >
                  {candidate.isHighlighted
                    ? "⭐ 하이라이트 해제"
                    : "⭐ 하이라이트 지정"}
                </button>
              </div>
            ) : (
              <EmptyState
                icon="🔍"
                title="아직 문제 카드가 없어요"
                desc="주 3부터 학생들이 문제 카드를 올리기 시작합니다."
              />
            )}
          </Panel>
        </div>

        {/* 사이드 */}
        <div className="space-y-5">
          <InviteCodeBox code={group!.inviteCode} />

          <Panel>
            <PanelHeader title="시즌 누적" desc={`시즌 ${group!.season}`} />
            <div className="grid grid-cols-2 gap-px bg-white/6">
              <div className="bg-[#0b0b16]">
                <Stat label="문제 카드" value={stats.cardCount} suffix="장" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat
                  label="반응"
                  value={stats.reactionCount}
                  suffix="개"
                  color="#a29bfe"
                />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="정의서" value={0} suffix="건" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat label="프로젝트" value={0} suffix="건" />
              </div>
            </div>
            <div className="flex gap-2 border-t border-white/8 px-4 py-3 text-[12px] font-bold">
              <span className="text-[#22c55e]">🤝 {stats.agree}</span>
              <span className="text-[#fbbf24]">🔍 {stats.symptom}</span>
              <span className="text-[#ef4444]">⚔️ {stats.rebut}</span>
            </div>
            <div className="border-t border-white/8 p-3">
              <Link
                href={`/groups/${groupId}/report`}
                className="btn btn-square w-full"
              >
                📊 리포트 보기
              </Link>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="그룹 설정" />
            <div className="space-y-1.5 p-3">
              {[
                { label: "카테고리", value: group!.category },
                { label: "진행 방식", value: group!.mode },
                { label: "로드맵", value: group!.roadmapType },
                { label: "크루 배정", value: group!.crewAssignMode },
                {
                  label: "정원",
                  value: `${members.length}/${group!.maxMembers}명`,
                },
                {
                  label: "공개",
                  value: group!.isPublic ? "목록 공개" : "🔒 코드 전용",
                },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between px-1 py-1.5 text-[12px]"
                >
                  <span className="text-white/40">{r.label}</span>
                  <span className="font-semibold text-white/75">{r.value}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    );
  }
}
