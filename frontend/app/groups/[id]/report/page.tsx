"use client";

import { use } from "react";
import Link from "next/link";
import {
  Button,
  Panel,
  PanelHeader,
  Badge,
  EmptyState,
  Stat,
  ProgressBar,
  toast,
  cn,
} from "@/components/ui";
import {
  getGroup,
  groupStats,
  groupCards,
  groupCrews,
  groupMembers,
  weekProgress,
  crewCards,
  crewProgress,
  isLeaderOf,
  cardReactions,
  reactionCounts,
} from "@/lib/store";
import { getInterest, interestColor, MISSIONS, LEGACY_QUESTIONS } from "@/lib/data";
import { useMounted, useStoreVersion } from "@/lib/useStore";
import { pct } from "@/lib/format";

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  useStoreVersion();

  if (!mounted) return null;
  const group = getGroup(id);
  if (!group) return null;

  if (!isLeaderOf(id)) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="🔒"
          title="지도자만 볼 수 있어요"
          desc="시즌 리포트는 그룹을 만든 지도자에게만 공개됩니다."
          action={
            <Link href={`/groups/${id}`} className="btn btn-pill">
              그룹 홈으로
            </Link>
          }
        />
      </div>
    );
  }

  const stats = groupStats(id);
  const cards = groupCards(id);
  const crews = groupCrews(id);
  const members = groupMembers(id).filter((m) => m.role !== "leader");
  const totalWeeks = MISSIONS.length;

  // 주차별 제출률
  const weekly = Array.from({ length: totalWeeks }, (_, i) => {
    const w = i + 1;
    const p = weekProgress(id, w);
    return { week: w, ...p, rate: pct(p.done, p.total) };
  });

  const doneWeeks = weekly.filter((w) => w.week <= group.currentWeek);
  const avgRate =
    doneWeeks.length > 0
      ? Math.round(
          doneWeeks.reduce((a, w) => a + w.rate, 0) / doneWeeks.length,
        )
      : 0;

  // 베스트
  const bestQuestion = [...cards].sort(
    (a, b) =>
      cardReactions(b.id).length - cardReactions(a.id).length,
  )[0];
  const mostRebutted = [...cards].sort(
    (a, b) => reactionCounts(b.id).rebut - reactionCounts(a.id).rebut,
  )[0];

  const summary = `본교 ${group.name}은 ${group.season}시즌 동안 SMILE+P 독서 프로그램을 운영하였다. 참여 학생 ${members.length}명이 ${group.currentWeek}주차까지 진행하여 문제 카드 ${stats.cardCount}장과 반응 ${stats.reactionCount}건을 산출하였다. 특히 학생 간 반론(⚔️) 교환이 ${stats.rebut}건 발생하여, 자신의 전제를 검토하고 문제를 재정의하는 비판적 사고 역량의 성장이 관찰되었다. 주차별 평균 참여율은 ${avgRate}%이다.`;

  return (
    <div className="shell py-6 md:py-8">
      {/* 헤더 */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Season Report</p>
          <h1 className="mt-1.5 text-[24px] leading-tight font-extrabold text-white sm:text-[28px]">
            📊 시즌 리포트
          </h1>
          <p className="mt-1.5 text-[13px] text-white/50">
            {group.name} · 시즌 {group.season} · {group.currentWeek}/{totalWeeks}주
            진행
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast("PDF 내보내기는 준비 중입니다")}
            className="btn btn-square"
          >
            📄 PDF
          </button>
          <button
            onClick={() => toast("엑셀 내보내기는 준비 중입니다")}
            className="btn btn-square"
          >
            📊 엑셀
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(
                `${typeof window !== "undefined" ? window.location.href : ""}`,
              );
              toast("리포트 링크를 복사했습니다");
            }}
            className="btn btn-square"
          >
            🔗 공유
          </button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="mb-5 grid grid-cols-2 gap-px bg-white/6 sm:grid-cols-4 lg:grid-cols-7">
        {[
          { l: "참여 학생", v: members.length, s: "명" },
          { l: "평균 참여율", v: avgRate, s: "%", c: "#22c55e" },
          { l: "문제 카드", v: stats.cardCount, s: "장" },
          { l: "총 반응", v: stats.reactionCount, s: "개", c: "#a29bfe" },
          { l: "⚔️ 반론", v: stats.rebut, s: "건", c: "#ef4444" },
          { l: "정의서", v: 0, s: "건" },
          { l: "프로젝트", v: 0, s: "건" },
        ].map((s) => (
          <div key={s.l} className="bg-[#0b0b16]">
            <Stat label={s.l} value={s.v} suffix={s.s} color={s.c} />
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* 주차별 참여 추이 */}
          <Panel>
            <PanelHeader
              title="주차별 참여 추이"
              desc={`평균 ${avgRate}% · 현재 ${group.currentWeek}주차`}
            />
            <div className="p-4">
              <div className="flex h-44 items-stretch gap-1.5">
                {weekly.map((w) => {
                  const future = w.week > group.currentWeek;
                  const h = future ? 4 : Math.max(4, w.rate);
                  const mission = MISSIONS.find((m) => m.week === w.week);
                  return (
                    <div
                      key={w.week}
                      className="flex h-full flex-1 flex-col justify-end gap-1"
                      title={`주 ${w.week} ${mission?.title ?? ""} — ${w.done}/${w.total} (${w.rate}%)`}
                    >
                      <span
                        className={cn(
                          "text-center text-[10px] font-bold",
                          future ? "text-transparent" : "text-white/50",
                        )}
                      >
                        {future ? "·" : `${w.rate}%`}
                      </span>
                      <div
                        className="w-full transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          minHeight: 4,
                          background: future
                            ? "rgba(255,255,255,0.06)"
                            : w.week === group.currentWeek
                              ? "linear-gradient(180deg,#a29bfe,#6c5ce7)"
                              : w.rate >= 70
                                ? "#22c55e"
                                : w.rate >= 40
                                  ? "#fbbf24"
                                  : "#ef4444",
                        }}
                      />
                      <span
                        className={cn(
                          "text-center text-[10px]",
                          w.week === group.currentWeek
                            ? "font-bold text-[#a29bfe]"
                            : "text-white/30",
                        )}
                      >
                        {w.week}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-[11px] text-white/30">
                주차 (마우스를 올리면 미션 이름이 보입니다)
              </p>
            </div>
          </Panel>

          {/* 크루별 성과 */}
          <Panel>
            <PanelHeader title="크루별 성과" />
            {crews.length === 0 ? (
              <EmptyState icon="👥" title="아직 크루가 없어요" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-white/8 text-left text-[11px] text-white/40">
                      <th className="px-4 py-2.5 font-semibold">크루</th>
                      <th className="px-2 py-2.5 text-right font-semibold">
                        인원
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold">
                        카드
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold">
                        반응
                      </th>
                      <th className="px-4 py-2.5 text-right font-semibold">
                        참여율
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6">
                    {crews.map((c) => {
                      const cc = crewCards(c.id);
                      const rx = cc.reduce(
                        (a, x) => a + cardReactions(x.id).length,
                        0,
                      );
                      const cp = crewProgress(c.id, group.currentWeek);
                      const rate = pct(cp.done, cp.total);
                      return (
                        <tr key={c.id}>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-2">
                              <span>{getInterest(c.interestId)?.emoji}</span>
                              <span
                                className="truncate font-semibold"
                                style={{ color: interestColor(c.interestId) }}
                              >
                                #{c.interestId}{" "}
                                {getInterest(c.interestId)?.name}
                              </span>
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right text-white/60">
                            {c.memberIds.length}
                          </td>
                          <td className="px-2 py-3 text-right text-white/60">
                            {cc.length}
                          </td>
                          <td className="px-2 py-3 text-right text-white/60">
                            {rx}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-3 text-right font-bold",
                              rate >= 70
                                ? "text-[#22c55e]"
                                : rate >= 40
                                  ? "text-[#fbbf24]"
                                  : "text-[#ef4444]",
                            )}
                          >
                            {rate}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          {/* 학교 보고용 서술 */}
          <Panel>
            <PanelHeader
              title="학교 보고용 서술"
              desc="자동 생성 · 복사해서 그대로 쓰세요"
              action={
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(summary);
                    toast("보고 문구를 복사했습니다");
                  }}
                  className="btn btn-square shrink-0 px-3 py-1.5 text-[12px]"
                >
                  📋 복사
                </button>
              }
            />
            <p className="border-l-2 border-[#a29bfe] bg-white/3 p-4 text-[13px] leading-relaxed text-white/75">
              &ldquo;{summary}&rdquo;
            </p>
          </Panel>
        </div>

        {/* 사이드 */}
        <div className="space-y-5">
          {/* 시즌 베스트 */}
          <Panel>
            <PanelHeader title="시즌 베스트" />
            <div className="divide-y divide-white/6">
              {bestQuestion && (
                <div className="p-4">
                  <p className="text-[11px] font-bold text-[#fbbf24]">
                    🏆 최고 질문상
                  </p>
                  <Link
                    href={`/cards/${bestQuestion.id}`}
                    className="mt-1.5 block text-[13px] leading-snug font-semibold text-white transition hover:text-[#a29bfe]"
                  >
                    {bestQuestion.title}
                  </Link>
                  <p className="mt-1 text-[11px] text-white/40">
                    {bestQuestion.userAvatar} {bestQuestion.userName} · 반응{" "}
                    {cardReactions(bestQuestion.id).length}개
                  </p>
                </div>
              )}
              {mostRebutted && reactionCounts(mostRebutted.id).rebut > 0 && (
                <div className="p-4">
                  <p className="text-[11px] font-bold text-[#ef4444]">
                    ⚔️ 최다 반론상
                  </p>
                  <Link
                    href={`/cards/${mostRebutted.id}`}
                    className="mt-1.5 block text-[13px] leading-snug font-semibold text-white transition hover:text-[#a29bfe]"
                  >
                    {mostRebutted.title}
                  </Link>
                  <p className="mt-1 text-[11px] text-white/40">
                    반론 {reactionCounts(mostRebutted.id).rebut}건 ·{" "}
                    <span className="text-white/55">
                      반박이 많은 문제가 좋은 문제입니다
                    </span>
                  </p>
                </div>
              )}
              {!bestQuestion && (
                <EmptyState
                  icon="🏆"
                  title="아직 수상 후보가 없어요"
                  desc="주 3부터 문제 카드가 쌓이기 시작합니다."
                />
              )}
            </div>
          </Panel>

          {/* 반응 분포 */}
          <Panel>
            <PanelHeader title="반응 분포" />
            <div className="space-y-3 p-4">
              {[
                { e: "🤝", l: "공감", n: stats.agree, c: "#22c55e" },
                { e: "🔍", l: "증상", n: stats.symptom, c: "#fbbf24" },
                { e: "⚔️", l: "반론", n: stats.rebut, c: "#ef4444" },
              ].map((r) => (
                <div key={r.l}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span style={{ color: r.c }} className="font-bold">
                      {r.e} {r.l}
                    </span>
                    <span className="font-bold text-white/60">{r.n}</span>
                  </div>
                  <ProgressBar
                    value={r.n}
                    total={Math.max(1, stats.reactionCount)}
                    color={r.c}
                  />
                </div>
              ))}
            </div>
          </Panel>

          {/* 다음 시즌 씨앗 */}
          <Panel>
            <PanelHeader
              title="다음 시즌 씨앗"
              desc="아직 풀리지 않은 질문들"
            />
            <ul className="divide-y divide-white/6">
              {LEGACY_QUESTIONS.map((q) => (
                <li key={q.id} className="px-4 py-3">
                  <p className="text-[13px] leading-snug text-white/75">
                    {q.text}
                  </p>
                  <p className="mt-1 flex items-center justify-between text-[11px] text-white/35">
                    <span>{q.from}</span>
                    <Badge color={interestColor(q.interestId)}>
                      #{q.interestId}
                    </Badge>
                  </p>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/8 p-3">
              <button
                onClick={() => toast("전국 아카이브 인계는 준비 중입니다")}
                className="btn btn-square w-full"
              >
                전국 아카이브에 인계
              </button>
            </div>
          </Panel>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => toast("다음 시즌 시작은 Phase 2에서 열립니다")}
          >
            다음 시즌 시작하기 →
          </Button>
        </div>
      </div>
    </div>
  );
}
