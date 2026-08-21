"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Panel,
  PanelHeader,
  Badge,
  EmptyState,
  Modal,
  toast,
  cn,
} from "@/components/ui";
import { ProblemCardFull } from "@/components/ProblemCardView";
import ReactionBar, { REACTIONS } from "@/components/ReactionBar";
import {
  getCard,
  cardReactions,
  reactionCounts,
  deleteCard,
  toggleHighlight,
  isLeaderOf,
  getGroup,
  crewCards,
} from "@/lib/store";
import { useMounted, useStoreVersion, useCurrentUser } from "@/lib/useStore";
import { timeAgo } from "@/lib/format";
import { getInterest, interestColor } from "@/lib/data";

export default function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  useStoreVersion();
  const user = useCurrentUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  if (!mounted) return null;

  const card = getCard(id);
  if (!card) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="🔍"
          title="카드를 찾을 수 없어요"
          desc="삭제되었거나 잘못된 주소일 수 있습니다."
          action={
            <Link href="/explore" className="btn btn-pill">
              문제 아카이브로
            </Link>
          }
        />
      </div>
    );
  }

  const reactions = cardReactions(card.id);
  const counts = reactionCounts(card.id);
  const total = counts.agree + counts.symptom + counts.rebut;
  const isMine = user?.id === card.userId;
  const leader = isLeaderOf(card.groupId);
  const group = getGroup(card.groupId);
  const color = interestColor(card.interestId);

  // 같은 크루의 다른 카드
  const siblings = card.crewId
    ? crewCards(card.crewId).filter((c) => c.id !== card.id).slice(0, 3)
    : [];

  return (
    <div className="shell max-w-4xl py-6 md:py-8">
      {/* 상단 바 */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-white/45 transition hover:text-white"
        >
          ← 돌아가기
        </button>

        <div className="flex items-center gap-2">
          {total >= 3 && <Badge color="#fbbf24">🔥 반응 {total}개</Badge>}
          {(isMine || leader) && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center border border-white/10 text-white/50 transition hover:text-white"
                aria-label="더보기"
              >
                ⋯
              </button>
              {menuOpen && (
                <div className="panel-shell animate-pop absolute right-0 z-20 mt-1 w-44 overflow-hidden">
                  {leader && (
                    <button
                      onClick={() => {
                        toggleHighlight(card.id);
                        setMenuOpen(false);
                        toast(
                          card.isHighlighted
                            ? "하이라이트를 해제했습니다"
                            : "하이라이트로 지정했습니다",
                        );
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-white/75 transition hover:bg-white/5"
                    >
                      ⭐{" "}
                      {card.isHighlighted ? "하이라이트 해제" : "하이라이트 지정"}
                    </button>
                  )}
                  {isMine && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setDelOpen(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-[#ef4444] transition hover:bg-white/5"
                    >
                      🗑 삭제
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* 카드 전문 */}
          <Panel className="p-5 sm:p-6">
            {card.isHighlighted && (
              <div className="mb-4 -mx-5 -mt-5 border-b border-[#6c5ce7]/25 bg-[#6c5ce7]/10 px-5 py-2 text-[12px] font-bold text-[#a29bfe] sm:-mx-6 sm:-mt-6 sm:px-6">
                ⭐ 이번 주 하이라이트
              </div>
            )}
            <ProblemCardFull card={card} />
          </Panel>

          {/* 반응 남기기 */}
          <Panel className="p-5">
            <p className="mb-3 text-[13px] font-bold text-white/85">
              이 문제에 반응 남기기
            </p>
            <ReactionBar cardId={card.id} />
            <p className="mt-3 text-[12px] leading-relaxed text-white/40">
              🔍과 ⚔️는 <b className="text-white/60">20자 이상 코멘트</b>가 있어야
              등록됩니다.
            </p>
          </Panel>

          {/* 반응 목록 */}
          <Panel>
            <PanelHeader
              title={`반응 ${reactions.length}개`}
              desc={
                counts.rebut === 0
                  ? "아직 반론이 없습니다. 반론이 있어야 좋은 문제입니다."
                  : undefined
              }
            />
            {reactions.length === 0 ? (
              <EmptyState
                icon="💬"
                title="아직 반응이 없어요"
                desc="크루원에게 알려서 첫 반응을 받아보세요."
                action={
                  <button
                    onClick={() => toast("크루원에게 알림을 보냈습니다")}
                    className="btn btn-pill"
                  >
                    🔔 크루에 알리기
                  </button>
                }
              />
            ) : (
              <ul className="divide-y divide-white/6">
                {reactions.map((r) => {
                  const meta = REACTIONS.find((x) => x.type === r.type)!;
                  return (
                    <li key={r.id} className="px-4 py-4">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold"
                          style={{
                            color: meta.color,
                            background: `${meta.color}1f`,
                            border: `1px solid ${meta.color}40`,
                          }}
                        >
                          {meta.emoji} {meta.label}
                        </span>
                        <span className="text-[14px]">{r.userAvatar}</span>
                        <span className="text-[13px] font-bold text-white">
                          {r.userName}
                        </span>
                        <span className="ml-auto text-[11px] text-white/30">
                          {timeAgo(r.createdAt)}
                        </span>
                      </div>
                      {r.comment ? (
                        <p className="text-[14px] leading-relaxed text-white/75">
                          {r.comment}
                        </p>
                      ) : (
                        <p className="text-[13px] text-white/35">
                          코멘트 없이 공감을 남겼어요
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* 정의서 승급 CTA */}
          <Panel
            className="p-5"
            style={{
              background:
                total >= 3
                  ? "linear-gradient(135deg, rgba(34,197,94,.14) 0%, rgba(20,184,166,.08) 100%)"
                  : undefined,
              borderColor: total >= 3 ? "rgba(45,212,191,.3)" : undefined,
            }}
          >
            <p className="text-[14px] font-bold text-white">
              📄 이 카드로 정의서 쓰기
            </p>
            {total >= 3 ? (
              <>
                <p className="mt-1.5 text-[13px] text-white/60">
                  반응을 {total}개 받았습니다. 정의서로 발전시켜 보세요.
                </p>
                <Button
                  variant="pill"
                  className="mt-3.5"
                  onClick={() =>
                    toast("정의서 작성은 주 8에 열립니다 (Phase 2)")
                  }
                >
                  정의서 작성 →
                </Button>
              </>
            ) : (
              <p className="mt-1.5 text-[13px] text-white/45">
                반응을 <b className="text-white/70">3개 이상</b> 받으면 정의서로
                발전시킬 수 있어요. (현재 {total}개)
              </p>
            )}
          </Panel>
        </div>

        {/* 사이드 */}
        <div className="space-y-5">
          <Panel>
            <PanelHeader title="반응 분포" />
            <div className="space-y-3 p-4">
              {REACTIONS.map((r) => {
                const n = counts[r.type];
                const w = total > 0 ? (n / total) * 100 : 0;
                return (
                  <div key={r.type}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span style={{ color: r.color }} className="font-bold">
                        {r.emoji} {r.label}
                      </span>
                      <span className="font-bold text-white/60">{n}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden bg-white/8">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${w}%`, background: r.color }}
                      />
                    </div>
                  </div>
                );
              })}
              {counts.rebut > 0 && (
                <p className="border-t border-white/8 pt-3 text-[12px] leading-relaxed text-white/45">
                  ⚔️ 반박이 {counts.rebut}개 있습니다.
                  <br />
                  <b className="text-white/65">반박이 많은 문제가 좋은 문제입니다.</b>
                </p>
              )}
            </div>
          </Panel>

          {group && (
            <Panel>
              <PanelHeader title="출처" />
              <div className="space-y-2 p-4 text-[12px]">
                <Link
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-2 text-white/70 transition hover:text-white"
                >
                  <span>{group.icon}</span>
                  <span className="truncate">{group.name}</span>
                </Link>
                <p className="flex items-center gap-2 text-white/45">
                  <span>{getInterest(card.interestId)?.emoji}</span>
                  <span
                    className="truncate font-semibold"
                    style={{ color }}
                  >
                    #{card.interestId} {getInterest(card.interestId)?.name}
                  </span>
                </p>
                <p className="text-white/35">
                  {card.visibility === "public"
                    ? "🌐 전국 공개"
                    : card.visibility === "group"
                      ? "👥 그룹 전체"
                      : "🔒 내 크루"}
                </p>
              </div>
            </Panel>
          )}

          {siblings.length > 0 && (
            <Panel>
              <PanelHeader title="같은 크루의 다른 질문" />
              <ul className="divide-y divide-white/6">
                {siblings.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/cards/${s.id}`}
                      className="block px-4 py-3 transition hover:bg-white/4"
                    >
                      <p className="line-clamp-2 text-[13px] leading-snug font-semibold text-white/75">
                        🔍 {s.title}
                      </p>
                      <p className="mt-1 text-[11px] text-white/35">
                        {s.userAvatar} {s.userName}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>

      {/* 삭제 확인 */}
      <Modal
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title="카드를 삭제할까요?"
        footer={
          <>
            <Button variant="square" onClick={() => setDelOpen(false)}>
              취소
            </Button>
            <button
              onClick={() => {
                deleteCard(card.id);
                toast("카드를 삭제했습니다");
                router.push(`/groups/${card.groupId}/feed`);
              }}
              className={cn(
                "btn rounded-full px-4 py-2 text-[13px] font-bold text-white",
              )}
              style={{ background: "#ef4444" }}
            >
              삭제하기
            </button>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-white/70">
          받은 반응 {reactions.length}개도 함께 사라집니다. 이 작업은 되돌릴 수
          없어요.
        </p>
      </Modal>
    </div>
  );
}
