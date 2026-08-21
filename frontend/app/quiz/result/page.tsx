"use client";

/** P06 — 관심사 진단 결과 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  EmptyState,
  Modal,
  Panel,
  PanelHeader,
  ProgressBar,
  SectionBanner,
  Skeleton,
  cn,
  toast,
} from "@/components/ui";
import {
  AREAS,
  booksByInterest,
  getArea,
  getInterest,
  interestColor,
} from "@/lib/data";
import { clearQuizProgress, getCipResult, myGroups } from "@/lib/store";
import { useCurrentUser, useMounted, useStoreVersion } from "@/lib/useStore";
import { formatDate } from "@/lib/format";
import type { Book, Group } from "@/lib/types";

const RANK_LABEL = ["1위", "2위", "3위"];

export default function QuizResultPage() {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();
  useStoreVersion();

  const [retryOpen, setRetryOpen] = useState(false);

  // ── 하이드레이션 전 ───────────────────────
  if (!mounted) {
    return (
      <div className="shell py-8">
        <Skeleton className="h-[120px] w-full" />
        <div className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[110px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  const result = getCipResult();

  // ── 결과 없음 ─────────────────────────────
  if (!result) {
    return (
      <div className="shell py-10">
        <div className="panel mx-auto max-w-[560px]">
          <EmptyState
            icon="🧭"
            title="아직 진단 결과가 없어요"
            desc="30문항 관심사 진단을 마치면 나의 Top 3 관심사와 영역 분포를 볼 수 있어요. 5분이면 충분합니다."
            action={
              <>
                <Button href="/quiz" variant="pill">
                  진단 시작하기 →
                </Button>
                <Button href="/" variant="square">
                  홈으로
                </Button>
              </>
            }
          />
        </div>
      </div>
    );
  }

  const top3 = result.top3.slice(0, 3);
  const groups = myGroups();
  const books = booksByInterest(top3[0]).slice(0, 3);
  const topInterest = getInterest(top3[0]);

  const share = async () => {
    const label = top3
      .map((id) => {
        const it = getInterest(id);
        return it ? `#${it.id} ${it.name}` : `#${id}`;
      })
      .join(", ");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const text = `[ReadingClue] 나의 관심사 Top3 — ${label}\n나도 진단해보기 → ${origin}/quiz`;
    try {
      await navigator.clipboard.writeText(text);
      toast("결과를 클립보드에 복사했어요");
    } catch {
      toast("복사에 실패했어요. 브라우저 설정을 확인해 주세요.");
    }
  };

  return (
    <div className="shell py-6 sm:py-8">
      <div className="mx-auto max-w-[860px]">
        <SectionBanner
          icon="🧭"
          eyebrow="CIP RESULT"
          title="나의 관심사 진단 결과"
          desc={`${formatDate(result.completedAt)} 완료 · 30문항 응답을 바탕으로 계산했어요`}
          from="rgba(108,92,231,0.22)"
          to="rgba(168,85,247,0.08)"
          border="rgba(108,92,231,0.32)"
          right={
            <Badge color="#a29bfe">
              {user ? `${user.avatar} ${user.name}` : "🙂 게스트"}
            </Badge>
          }
        />

        {/* ═══ Top 3 관심사 ═══ */}
        <section>
          <h2 className="mb-3 text-[15px] font-extrabold text-white">
            🏆 나의 Top 3 관심사
          </h2>
          <div className="flex flex-col gap-3">
            {top3.map((id, i) => (
              <InterestCard
                key={id}
                id={id}
                rank={i}
                score={result.scores[id] ?? 0}
              />
            ))}
          </div>
        </section>

        {/* ═══ 영역 분포 ═══ */}
        <section className="mt-6">
          <Panel>
            <PanelHeader
              title="📊 영역 분포"
              desc="6개 관심 영역 중 어디에 마음이 기울어 있는지"
            />
            <div className="flex flex-col gap-3.5 px-4 py-4">
              {AREAS.map((area) => {
                const score = result.areaScores[area.code] ?? 0;
                return (
                  <div key={area.code}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2 text-[13px] font-bold text-white/80">
                        <span className="text-[15px]">{area.emoji}</span>
                        <span className="truncate">{area.name}</span>
                        <span className="shrink-0 text-[11px] font-semibold text-white/30">
                          {area.code}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-[13px] font-extrabold"
                        style={{ color: area.color }}
                      >
                        {score}%
                      </span>
                    </div>
                    <ProgressBar value={score} total={100} color={area.color} />
                  </div>
                );
              })}
            </div>
          </Panel>
        </section>

        {/* ═══ 다음 단계 ═══ */}
        <section className="mt-6">
          <NextStep groups={groups} isLeader={user?.role === "leader"} />
        </section>

        {/* ═══ 추천 도서 ═══ */}
        <section className="mt-6">
          <Panel>
            <PanelHeader
              title="📚 이 관심사로 시작하기 좋은 책"
              desc={
                topInterest
                  ? `#${topInterest.id} ${topInterest.name} 관련 추천`
                  : "관심사 기반 추천"
              }
              action={
                <Link
                  href="/books/explore"
                  className="shrink-0 text-[12px] font-bold text-[#a29bfe] hover:text-white"
                >
                  책 탐색 →
                </Link>
              }
            />
            {books.length === 0 ? (
              <EmptyState
                icon="📚"
                title="아직 등록된 추천 도서가 없어요"
                desc="책 탐색에서 다른 관심사의 책도 둘러볼 수 있어요."
                action={
                  <Button href="/books/explore" variant="square">
                    책 탐색 →
                  </Button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-3">
                {books.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            )}
          </Panel>
        </section>

        {/* ═══ 하단 액션 ═══ */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button variant="pillGhost" onClick={share} className="w-full sm:w-auto">
            🔗 결과 공유
          </Button>
          <Button
            variant="square"
            onClick={() => setRetryOpen(true)}
            className="w-full sm:w-auto"
          >
            🔄 다시 진단
          </Button>
        </div>

        <p className="mt-5 text-center text-[12px] leading-relaxed text-white/30">
          관심사는 계속 변합니다. 시즌이 바뀔 때마다 다시 진단해도 좋아요.
        </p>
      </div>

      {/* 다시 진단 확인 */}
      <Modal
        open={retryOpen}
        onClose={() => setRetryOpen(false)}
        title="다시 진단할까요?"
        footer={
          <>
            <Button variant="square" onClick={() => setRetryOpen(false)}>
              취소
            </Button>
            <Button
              variant="pill"
              onClick={() => {
                clearQuizProgress();
                setRetryOpen(false);
                router.push("/quiz");
              }}
            >
              다시 진단하기 →
            </Button>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-white/70">
          처음부터 30문항을 다시 풉니다. 새 결과를 저장하기 전까지는 지금 결과가
          그대로 유지돼요.
        </p>
      </Modal>
    </div>
  );
}

/** Top3 관심사 카드 — 1위는 그라디언트 테두리로 강조 */
function InterestCard({
  id,
  rank,
  score,
}: {
  id: number;
  rank: number;
  score: number;
}) {
  const interest = getInterest(id);
  const color = interestColor(id);
  const area = interest ? getArea(interest.area) : undefined;
  const first = rank === 0;

  const body = (
    <div
      className={cn("panel", first ? "px-5 py-5" : "px-4 py-4")}
      style={
        first
          ? { background: "rgba(108,92,231,0.08)", borderColor: "transparent" }
          : undefined
      }
    >
      <div className="flex items-start gap-3.5">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[20px]",
            first ? "h-14 w-14 text-3xl" : "h-11 w-11 text-xl",
          )}
          style={{
            background: `${color}1f`,
            border: `1px solid ${color}45`,
          }}
        >
          {interest?.emoji ?? "📖"}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge color={first ? "#fbbf24" : color}>
              {RANK_LABEL[rank] ?? `${rank + 1}위`}
            </Badge>
            {area && <Badge color={color}>{area.emoji} {area.name}</Badge>}
          </div>

          <h3
            className={cn(
              "mt-2 leading-tight font-extrabold text-white",
              first ? "text-[20px] sm:text-[24px]" : "text-[16px]",
            )}
          >
            <span style={{ color }}>#{id}</span> {interest?.name ?? "관심사"}
          </h3>

          <p
            className={cn(
              "mt-1.5 leading-relaxed text-white/50",
              first ? "text-[13px]" : "text-[12px]",
            )}
          >
            {interest?.description ?? ""}
          </p>

          <div className="mt-3 flex items-center gap-2.5">
            <ProgressBar value={score} total={100} color={color} className="flex-1" />
            <span
              className="shrink-0 text-[13px] font-extrabold"
              style={{ color }}
            >
              {score}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!first) return body;

  // 1위: 브랜드 그라디언트 테두리
  return (
    <div className="grad-brand p-[1.5px] shadow-[0_10px_40px_rgba(108,92,231,0.28)]">
      <div className="bg-black">{body}</div>
    </div>
  );
}

/** 사용자 상태에 따른 다음 단계 안내 */
function NextStep({
  groups,
  isLeader,
}: {
  groups: Group[];
  isLeader?: boolean;
}) {
  if (groups.length > 0) {
    const g = groups[0];
    return (
      <Panel className="px-5 py-5">
        <p className="text-[13px] font-extrabold text-[#22c55e]">
          ✅ 크루 배정 완료
        </p>
        <h3 className="mt-2 text-[17px] leading-tight font-extrabold text-white">
          {g.icon} {g.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
          관심사에 맞는 크루에 배정됐어요. 같은 질문을 품은 친구들과 이번 주
          미션을 시작해 보세요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={`/groups/${g.id}/crews`} variant="pill">
            크루 보러 가기 →
          </Button>
          <Button href={`/groups/${g.id}`} variant="square">
            그룹 홈
          </Button>
        </div>
      </Panel>
    );
  }

  if (isLeader) {
    return (
      <Panel className="px-5 py-5">
        <p className="eyebrow">NEXT STEP</p>
        <h3 className="mt-2 text-[17px] leading-tight font-extrabold text-white">
          👩‍🏫 학생들에게도 진단을 받게 하세요
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
          그룹을 만들면 초대 코드가 생성됩니다. 학생들이 진단을 마치면 관심사별
          크루로 자동 배정돼요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/groups/new" variant="pill">
            그룹 만들기 →
          </Button>
          <Button href="/readmate?tab=community" variant="square">
            공개 그룹 둘러보기
          </Button>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="px-5 py-5">
      <p className="eyebrow">NEXT STEP</p>
      <h3 className="mt-2 text-[17px] leading-tight font-extrabold text-white">
        🔍 이 관심사의 공개 그룹을 찾아보세요
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-white/50">
        아직 소속된 그룹이 없어요. 공개 그룹에 참여하거나, 초대 코드를 입력하면
        관심사 크루에 배정됩니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href="/readmate?tab=community" variant="pill">
          그룹 둘러보기 →
        </Button>
        <Button href="/groups/join" variant="square">
          초대 코드 입력
        </Button>
      </div>
    </Panel>
  );
}

/** 추천 도서 카드 */
function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href="/books/explore"
      className="panel flex flex-col p-3.5 transition hover:border-white/25 active:scale-[0.99]"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-[16px] text-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(108,92,231,.16), rgba(108,92,231,.06))",
          border: "1px solid rgba(108,92,231,.19)",
        }}
      >
        {book.cover}
      </span>
      <h4 className="mt-2.5 line-clamp-2 text-[14px] leading-snug font-bold text-white">
        {book.title}
      </h4>
      <p className="mt-1 text-[12px] text-white/45">
        {book.author} · {book.publisher}
      </p>
      <p className="mt-2 text-[11px] text-white/35">
        👥 {book.readerCount}명이 읽었어요 · {book.level}
      </p>
    </Link>
  );
}
