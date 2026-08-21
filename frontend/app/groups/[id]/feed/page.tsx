"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Panel,
  PanelHeader,
  Badge,
  EmptyState,
  Stat,
  SegmentTabs,
} from "@/components/ui";
import { ProblemCardItem } from "@/components/ProblemCardView";
import { REACTIONS } from "@/components/ReactionBar";
import {
  getGroup,
  groupCrews,
  groupCards,
  groupFeed,
  groupStats,
  highlightedCard,
  reactionCounts,
  type FeedEntry,
} from "@/lib/store";
import { getInterest } from "@/lib/data";
import { useMounted, useStoreVersion } from "@/lib/useStore";
import { timeAgo } from "@/lib/format";

type KindFilter = "all" | "card" | "reaction" | "mission";
type SortKey = "recent" | "hot";

const KIND_TABS: { key: KindFilter; label: string; icon: string }[] = [
  { key: "all", label: "전체", icon: "✨" },
  { key: "card", label: "문제 카드", icon: "🔍" },
  { key: "reaction", label: "반응", icon: "💬" },
  { key: "mission", label: "미션", icon: "✅" },
];

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function GroupFeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  useStoreVersion();

  const [crewFilter, setCrewFilter] = useState("all");
  const [kind, setKind] = useState<KindFilter>("all");
  const [sort, setSort] = useState<SortKey>("recent");

  if (!mounted) return null;
  const group = getGroup(id);
  if (!group) return null;

  const crews = groupCrews(id);
  const stats = groupStats(id);
  const highlight = highlightedCard(id);
  const all = groupFeed(id);

  /** 엔트리에 연결된 카드의 총 반응 수 (정렬용) */
  function heat(f: FeedEntry) {
    const cardId = f.card?.id ?? f.targetCard?.id;
    if (!cardId) return 0;
    const c = reactionCounts(cardId);
    return c.agree + c.symptom + c.rebut;
  }

  const feed = all
    .filter((f) => (crewFilter === "all" ? true : f.crewId === crewFilter))
    .filter((f) => (kind === "all" ? true : f.kind === kind))
    .sort((a, b) =>
      sort === "hot" ? heat(b) - heat(a) : b.at.localeCompare(a.at),
    );

  // ── 이번 주 활동 ────────────────────────
  const since = Date.now() - WEEK_MS;
  const recent = all.filter((f) => new Date(f.at).getTime() >= since);
  const weekCards = recent.filter((f) => f.kind === "card").length;
  const weekReactions = recent.filter((f) => f.kind === "reaction").length;

  // ── 가장 많이 반박받은 카드 TOP 3 ─────────
  const mostRebutted = groupCards(id)
    .map((c) => ({ card: c, rebut: reactionCounts(c.id).rebut }))
    .filter((x) => x.rebut > 0)
    .sort((a, b) => b.rebut - a.rebut)
    .slice(0, 3);

  const selectCls =
    "input-rc w-auto min-w-[124px] cursor-pointer py-2 text-[13px] [&>option]:bg-[#0e0e1a]";

  return (
    <div className="shell py-6 md:py-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* ══════════ 메인 ══════════ */}
        <div className="space-y-5 lg:col-span-2">
          {/* 필터 바 */}
          <Panel>
            <PanelHeader
              title="그룹 피드"
              desc={`${feed.length}개의 활동`}
              action={
                <Link
                  href={`/cards/new?group=${id}`}
                  className="btn btn-pill shrink-0"
                >
                  ✏️ 문제 카드 쓰기
                </Link>
              }
            />
            <div className="space-y-3 px-4 py-3.5">
              <SegmentTabs
                tabs={KIND_TABS.map((t) => ({
                  key: t.key,
                  label: t.label,
                  icon: t.icon,
                }))}
                active={kind}
                onChange={(k) => setKind(k as KindFilter)}
              />
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={crewFilter}
                  onChange={(e) => setCrewFilter(e.target.value)}
                  className={selectCls}
                  aria-label="크루 필터"
                >
                  <option value="all">👥 전체 크루</option>
                  {crews.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getInterest(c.interestId)?.emoji} {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className={selectCls}
                  aria-label="정렬"
                >
                  <option value="recent">🕒 최신순</option>
                  <option value="hot">🔥 반응 많은 순</option>
                </select>
              </div>
            </div>
          </Panel>

          {/* 하이라이트 */}
          {highlight && (
            <section
              className="p-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(108,92,231,.16) 0%, rgba(168,85,247,.07) 100%)",
                border: "1px solid rgba(139,92,246,.35)",
              }}
            >
              <ProblemCardItem card={highlight} />
              <p className="mt-2.5 px-1 text-[12px] leading-relaxed text-white/50">
                지도자가 이번 주 그룹이 함께 볼 문제로 지정했어요. 반응을 남겨
                문제를 더 단단하게 만들어 주세요.
              </p>
            </section>
          )}

          {/* 피드 목록 */}
          {feed.length === 0 ? (
            <Panel>
              <EmptyState
                icon="📭"
                title="아직 활동이 없어요"
                desc="첫 문제 카드를 올리면 크루 친구들이 반응을 남겨줍니다."
                action={
                  <Link href={`/cards/new?group=${id}`} className="btn btn-pill">
                    ✏️ 문제 카드 작성
                  </Link>
                }
              />
            </Panel>
          ) : (
            <div className="space-y-3">
              {feed.map((f) => (
                <FeedRow key={f.id} entry={f} />
              ))}
            </div>
          )}
        </div>

        {/* ══════════ 사이드 ══════════ */}
        <div className="space-y-5">
          <Link href={`/cards/new?group=${id}`} className="btn btn-primary w-full">
            ✏️ 문제 카드 쓰기
          </Link>

          <Panel>
            <PanelHeader title="이번 주 활동" desc="최근 7일 기준" />
            <div className="grid grid-cols-2 gap-px bg-white/6">
              <div className="bg-[#0b0b16]">
                <Stat label="문제 카드" value={weekCards} suffix="장" />
              </div>
              <div className="bg-[#0b0b16]">
                <Stat
                  label="반응"
                  value={weekReactions}
                  suffix="개"
                  color="#a29bfe"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-white/8 px-4 py-3 text-[12px] text-white/40">
              <span>
                누적 카드{" "}
                <b className="font-bold text-white/70">{stats.cardCount}</b>장
              </span>
              <span>
                누적 반응{" "}
                <b className="font-bold text-white/70">{stats.reactionCount}</b>개
              </span>
            </div>
            <div className="flex gap-2 border-t border-white/8 px-4 py-3 text-[12px] font-bold">
              <span className="text-[#22c55e]">🤝 {stats.agree}</span>
              <span className="text-[#fbbf24]">🔍 {stats.symptom}</span>
              <span className="text-[#ef4444]">⚔️ {stats.rebut}</span>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="가장 많이 반박받은 카드"
              desc="⚔️ 반론 TOP 3"
            />
            {mostRebutted.length === 0 ? (
              <EmptyState
                icon="⚔️"
                title="아직 반론이 없어요"
                desc="반대편 논리를 찾아 반론을 남겨보세요."
              />
            ) : (
              <ol className="divide-y divide-white/6">
                {mostRebutted.map((x, i) => (
                  <li key={x.card.id} className="flex gap-2.5 px-4 py-3">
                    <span className="w-4 shrink-0 text-[13px] font-extrabold text-white/30">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/cards/${x.card.id}`}
                        className="block truncate text-[13px] leading-snug font-bold text-white transition hover:text-[#a29bfe]"
                      >
                        🔍 {x.card.title}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-white/35">
                        {x.card.userAvatar} {x.card.userName}
                      </p>
                    </div>
                    <span className="shrink-0 text-[12px] font-extrabold text-[#ef4444]">
                      ⚔️ {x.rebut}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            <p className="border-t border-white/8 px-4 py-3 text-[12px] leading-relaxed text-white/45">
              💡 반박이 많은 문제가 좋은 문제입니다. 반론은 공격이 아니라 문제를
              더 단단하게 만드는 과정이에요.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ══════════════ 피드 한 줄 ══════════════
function FeedRow({ entry }: { entry: FeedEntry }) {
  if (entry.kind === "card" && entry.card) {
    return <ProblemCardItem card={entry.card} />;
  }

  if (entry.kind === "reaction" && entry.reaction) {
    const meta = REACTIONS.find((r) => r.type === entry.reaction!.type);
    const color = meta?.color ?? "#a29bfe";
    return (
      <Panel
        className="transition hover:border-white/20"
        style={{ background: `${color}0a`, borderColor: `${color}33` }}
      >
        <div className="p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[16px]">{entry.userAvatar}</span>
            <span className="text-[13px] font-bold text-white">
              {entry.userName}
            </span>
            <Badge color={color}>
              {meta?.emoji} {meta?.label}
            </Badge>
            <span className="ml-auto shrink-0 text-[11px] text-white/35">
              {timeAgo(entry.at)}
            </span>
          </div>

          {entry.reaction.comment && (
            <p
              className="border-l-2 pl-3 text-[13px] leading-relaxed whitespace-pre-line text-white/80"
              style={{ borderColor: color }}
            >
              {entry.reaction.comment}
            </p>
          )}

          {entry.targetCard && (
            <Link
              href={`/cards/${entry.targetCard.id}`}
              className="mt-3 flex items-center gap-1.5 text-[12px] text-white/40 transition hover:text-white"
            >
              <span className="shrink-0">→</span>
              <span className="truncate">🔍 {entry.targetCard.title}</span>
            </Link>
          )}
        </div>
      </Panel>
    );
  }

  if (entry.kind === "mission") {
    return (
      <div className="flex items-center gap-2.5 border border-white/8 bg-white/2 px-4 py-2.5">
        <span className="shrink-0 text-[13px]">✅</span>
        <p className="min-w-0 flex-1 truncate text-[13px] text-white/60">
          <span className="font-bold text-white/85">{entry.userName}</span>
          <span className="mx-1">·</span>
          미션 {entry.week} 완료
          {entry.text && (
            <>
              <span className="mx-1 text-white/25">—</span>
              {entry.text}
            </>
          )}
        </p>
        <span className="shrink-0 text-[11px] text-white/30">
          {timeAgo(entry.at)}
        </span>
      </div>
    );
  }

  return null;
}
