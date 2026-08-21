"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Panel,
  PanelHeader,
  Badge,
  EmptyState,
  Modal,
  SectionBanner,
  Stat,
  cn,
  toast,
} from "@/components/ui";
import { MyGroupCard, PublicGroupCard } from "@/components/GroupCard";
import { ProblemCardItem } from "@/components/ProblemCardView";
import {
  myGroups,
  publicGroups,
  groupFeed,
  findGroupByCode,
  joinGroup,
  myCards,
  cardReactions,
  globalStats,
  getCipResult,
  myProgress,
  groupStats,
} from "@/lib/store";
import { useMounted, useStoreVersion, useCurrentUser } from "@/lib/useStore";
import { comma, timeAgo } from "@/lib/format";
import { getInterest, interestColor, MISSIONS } from "@/lib/data";
import type { Group } from "@/lib/types";

const TABS = [
  { key: "feed", label: "피드", icon: "📰" },
  { key: "community", label: "커뮤니티", icon: "👥" },
  { key: "records", label: "내 기록", icon: "📒" },
  { key: "portfolio", label: "포트폴리오", icon: "🏆" },
  { key: "resources", label: "자료실", icon: "📁" },
];

function ReadmateInner() {
  const mounted = useMounted();
  useStoreVersion();
  const user = useCurrentUser();
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab") ?? "feed";

  const [code, setCode] = useState("");
  const [joinTarget, setJoinTarget] = useState<Group | null>(null);

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="shell py-16">
        <EmptyState
          icon="🔐"
          title="로그인이 필요해요"
          desc="독서 실행은 그룹에 참여한 뒤 사용할 수 있습니다."
          action={
            <>
              <Link href="/login" className="btn btn-pill">
                로그인하기
              </Link>
              <Link href="/explore" className="btn btn-square">
                문제 아카이브 둘러보기
              </Link>
            </>
          }
        />
      </div>
    );
  }

  const mine = myGroups();

  function setTab(key: string) {
    router.push(`/readmate?tab=${key}`);
  }

  function tryCode() {
    const g = findGroupByCode(code);
    if (!g) return toast("코드를 찾을 수 없어요");
    joinGroup(g.id);
    toast(`${g.name}에 참여했어요`);
    router.push(`/groups/${g.id}`);
  }

  return (
    <div>
      {/* 탭 바 */}
      <div className="border-b border-white/8 bg-white/2">
        <div className="shell flex items-center justify-between gap-4 py-3.5">
          <h1 className="shrink-0 text-[17px] font-extrabold text-white">
            🚀 독서 실행
          </h1>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto bg-white/6 p-1">
            {TABS.map((t) => {
              const on = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-[13px] font-bold transition sm:px-6",
                    on
                      ? "grad-tab text-white shadow-[0_4px_16px_rgba(108,92,231,0.35)]"
                      : "border border-white/8 bg-white/4 text-white/65 hover:text-white",
                  )}
                >
                  <span>{t.icon}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="shell py-6">
        {tab === "feed" && <FeedTab />}
        {tab === "community" && <CommunityTab />}
        {tab === "records" && <RecordsTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "resources" && <ResourcesTab />}
      </div>

      {/* 공개 그룹 참여 요청 */}
      <Modal
        open={!!joinTarget}
        onClose={() => setJoinTarget(null)}
        title="참여 요청 보내기"
        footer={
          <>
            <Button variant="square" onClick={() => setJoinTarget(null)}>
              취소
            </Button>
            <Button
              variant="pill"
              onClick={() => {
                if (!joinTarget) return;
                joinGroup(joinTarget.id);
                toast(`${joinTarget.name}에 참여했어요`);
                const t = joinTarget;
                setJoinTarget(null);
                router.push(`/groups/${t.id}`);
              }}
            >
              참여하기
            </Button>
          </>
        }
      >
        {joinTarget && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[28px]">{joinTarget.icon}</span>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-white">
                  {joinTarget.name}
                </p>
                <p className="text-[12px] text-white/45">
                  {joinTarget.description}
                </p>
              </div>
            </div>
            <p className="text-[13px] leading-relaxed text-white/60">
              참여하면 관심사 진단 결과에 따라 크루가 배정되고, 매주 미션이
              시작됩니다.
            </p>
          </>
        )}
      </Modal>
    </div>
  );

  // ══════════ 피드 탭 ══════════
  function FeedTab() {
    if (mine.length === 0) {
      return (
        <>
          <SectionBanner
            icon="📰"
            eyebrow="Feed"
            title="아직 볼 활동이 없어요"
            desc="그룹에 참여하면 크루의 문제 카드와 반응이 여기에 모입니다."
            from="rgba(168,85,247,.28)"
            to="rgba(99,102,241,.12)"
            border="rgba(139,92,246,.35)"
          />
          <Panel>
            <EmptyState
              icon="👥"
              title="먼저 그룹에 참여해 주세요"
              desc="선생님께 받은 초대 코드를 입력하거나, 공개 그룹을 둘러보세요."
              action={
                <>
                  <Link href="/groups/join" className="btn btn-pill">
                    초대 코드 입력
                  </Link>
                  <button
                    onClick={() => setTab("community")}
                    className="btn btn-square"
                  >
                    공개 그룹 둘러보기
                  </button>
                </>
              }
            />
          </Panel>
        </>
      );
    }

    const entries = mine.flatMap((g) => groupFeed(g.id)).sort((a, b) =>
      b.at.localeCompare(a.at),
    );
    const cards = entries.filter((e) => e.kind === "card").slice(0, 12);

    return (
      <>
        <SectionBanner
          icon="📰"
          eyebrow="Feed"
          title={
            <>
              크루가 던진 <span className="text-[#c4b5fd]">질문들</span>
            </>
          }
          desc="같은 관심사 친구들이 무엇을 궁금해하는지 보고, 반응을 남겨보세요."
          from="rgba(168,85,247,.28)"
          to="rgba(99,102,241,.12)"
          border="rgba(139,92,246,.35)"
          right={
            <Link href="/cards/new" className="btn btn-pill">
              ✏️ 문제 카드 쓰기
            </Link>
          }
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cards.length === 0 ? (
              <Panel>
                <EmptyState
                  icon="🔍"
                  title="아직 문제 카드가 없어요"
                  desc="첫 카드를 올려서 크루의 대화를 시작해 보세요."
                  action={
                    <Link href="/cards/new" className="btn btn-pill">
                      문제 카드 작성
                    </Link>
                  }
                />
              </Panel>
            ) : (
              cards.map((e) => (
                <ProblemCardItem key={e.id} card={e.card!} />
              ))
            )}
          </div>

          <div className="space-y-5">
            {mine.map((g) => (
              <MyGroupCard key={g.id} group={g} />
            ))}
            <Panel>
              <PanelHeader title="최근 반응" />
              <ul className="divide-y divide-white/6">
                {entries
                  .filter((e) => e.kind === "reaction")
                  .slice(0, 5)
                  .map((e) => (
                    <li key={e.id} className="px-4 py-3">
                      <p className="text-[12px] text-white/60">
                        <span className="font-bold text-white">
                          {e.userAvatar} {e.userName}
                        </span>
                        {" · "}
                        <span
                          style={{
                            color:
                              e.reaction!.type === "agree"
                                ? "#22c55e"
                                : e.reaction!.type === "symptom"
                                  ? "#fbbf24"
                                  : "#ef4444",
                          }}
                        >
                          {e.reaction!.type === "agree"
                            ? "🤝"
                            : e.reaction!.type === "symptom"
                              ? "🔍"
                              : "⚔️"}
                        </span>
                        <span className="ml-1 text-white/30">
                          {timeAgo(e.at)}
                        </span>
                      </p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-white/45">
                        {e.reaction!.comment}
                      </p>
                    </li>
                  ))}
                {entries.filter((e) => e.kind === "reaction").length === 0 && (
                  <li className="px-4 py-6 text-center text-[12px] text-white/35">
                    아직 반응이 없어요
                  </li>
                )}
              </ul>
            </Panel>
          </div>
        </div>
      </>
    );
  }

  // ══════════ 커뮤니티 탭 (독서 스페이스) ══════════
  function CommunityTab() {
    const pub = publicGroups();
    const stats = globalStats();

    return (
      <>
        <SectionBanner
          icon="📚"
          eyebrow="Reading Space"
          title={
            <>
              함께 읽는 <span className="text-[#5eead4]">그룹 공간</span>
            </>
          }
          desc="학교 독서반·동아리를 만들고 4주 로드맵을 함께 진행하세요. 초대 코드로 멤버를 모으고 문제를 발견해요."
          from="rgba(34,197,94,.2)"
          to="rgba(59,130,246,.12)"
          border="rgba(45,212,191,.35)"
          right={
            <div className="flex flex-wrap gap-2">
              <Link href="/groups/new" className="btn btn-pill">
                + 새 그룹 만들기
              </Link>
              <Link href="/groups/join" className="btn btn-pill-ghost">
                초대 코드로 참여
              </Link>
            </div>
          }
        />

        {/* 통계 */}
        <div className="mb-5 grid grid-cols-3 gap-px bg-white/6">
          <div className="bg-[#0b0b16]">
            <Stat label="전체 그룹" value={comma(stats.groups)} suffix="개" />
          </div>
          <div className="bg-[#0b0b16]">
            <Stat
              label="참여중"
              value={mine.length}
              suffix="개"
              color="#a29bfe"
            />
          </div>
          <div className="bg-[#0b0b16]">
            <Stat label="공유 문제 카드" value={comma(stats.cards)} suffix="장" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* 좌: 내 그룹 + 코드 참여 */}
          <div className="space-y-4 lg:col-span-5">
            <Panel className="p-4">
              <p className="mb-2.5 text-[13px] font-bold text-white/85">
                🔑 코드로 참여하기
              </p>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && tryCode()}
                  placeholder="READ-HB2-26"
                  className="input-rc tracking-wider"
                />
                <button
                  onClick={tryCode}
                  disabled={code.length < 6}
                  className="btn btn-square shrink-0"
                >
                  참여
                </button>
              </div>
            </Panel>

            <div>
              <h2 className="mb-2.5 text-[14px] font-bold text-white">
                내 그룹 {mine.length > 0 && `(${mine.length})`}
              </h2>
              {mine.length === 0 ? (
                <Panel>
                  <EmptyState
                    icon="📖"
                    title="아직 참여한 그룹이 없어요"
                    desc="초대 코드가 있다면 위에 입력하고, 없다면 공개 그룹을 둘러보세요."
                    action={
                      <Link href="/groups/new" className="btn btn-pill">
                        그룹 만들기
                      </Link>
                    }
                  />
                </Panel>
              ) : (
                <div className="space-y-2">
                  {mine.map((g) => (
                    <MyGroupCard key={g.id} group={g} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 우: 공개 그룹 */}
          <div className="lg:col-span-7 lg:border-l lg:border-white/6 lg:pl-6">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-white">
                공개 그룹 둘러보기
              </h2>
              <span className="text-[12px] text-white/35">{pub.length}개</span>
            </div>
            {pub.length === 0 ? (
              <Panel>
                <EmptyState
                  icon="🔍"
                  title="공개된 그룹이 없어요"
                  desc="직접 그룹을 만들어 첫 시즌을 시작해 보세요."
                  action={
                    <Link href="/groups/new" className="btn btn-pill">
                      그룹 만들기
                    </Link>
                  }
                />
              </Panel>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {pub.map((g) => (
                  <PublicGroupCard
                    key={g.id}
                    group={g}
                    onJoin={(gg) => setJoinTarget(gg)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ══════════ 내 기록 탭 ══════════
  function RecordsTab() {
    const cards = myCards();
    const received = cards.reduce(
      (acc, c) => acc + cardReactions(c.id).length,
      0,
    );
    const cip = getCipResult();

    return (
      <>
        <SectionBanner
          icon="📒"
          eyebrow="My Records"
          title={
            <>
              내가 던진 <span className="text-[#fcd34d]">질문의 기록</span>
            </>
          }
          desc="지금까지 쓴 문제 카드와 받은 반응이 여기에 쌓입니다."
          from="rgba(251,191,36,.22)"
          to="rgba(239,68,68,.10)"
          border="rgba(251,191,36,.35)"
          right={
            <Link href="/my" className="btn btn-pill">
              전체 기록 보기 →
            </Link>
          }
        />

        <div className="mb-5 grid grid-cols-2 gap-px bg-white/6 sm:grid-cols-4">
          {[
            { l: "문제 카드", v: cards.length, s: "장" },
            { l: "받은 반응", v: received, s: "개", c: "#a29bfe" },
            { l: "관심사", v: cip ? cip.top3.length : 0, s: "개" },
            { l: "참여 그룹", v: mine.length, s: "개" },
          ].map((s) => (
            <div key={s.l} className="bg-[#0b0b16]">
              <Stat label={s.l} value={s.v} suffix={s.s} color={s.c} />
            </div>
          ))}
        </div>

        {cip && (
          <Panel className="mb-5">
            <PanelHeader
              title="내 관심사"
              action={
                <Link
                  href="/quiz"
                  className="shrink-0 text-[12px] font-semibold text-white/45 transition hover:text-white"
                >
                  다시 진단 →
                </Link>
              }
            />
            <div className="flex flex-wrap gap-2 p-4">
              {cip.top3.map((iid, i) => {
                const it = getInterest(iid);
                return (
                  <Badge key={iid} color={interestColor(iid)}>
                    {i + 1}위 {it?.emoji} #{iid} {it?.name}
                  </Badge>
                );
              })}
            </div>
          </Panel>
        )}

        {cards.length === 0 ? (
          <Panel>
            <EmptyState
              icon="✏️"
              title="아직 쓴 문제 카드가 없어요"
              desc="책에서 시작해 내 질문을 한 장으로 정리해 보세요."
              action={
                <Link href="/cards/new" className="btn btn-pill">
                  문제 카드 작성
                </Link>
              }
            />
          </Panel>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((c) => (
              <ProblemCardItem key={c.id} card={c} />
            ))}
          </div>
        )}
      </>
    );
  }

  // ══════════ 포트폴리오 탭 ══════════
  function PortfolioTab() {
    const cards = myCards();
    const received = cards.reduce(
      (acc, c) => acc + cardReactions(c.id).length,
      0,
    );
    const g = mine[0];
    const prog = g ? myProgress(g.id) : { done: 0, total: 12 };
    const best = [...cards].sort(
      (a, b) => cardReactions(b.id).length - cardReactions(a.id).length,
    )[0];

    const tags = [
      "#문제발견",
      "#비판적사고",
      "#전제분석",
      "#논증",
      "#반증수용",
      "#데이터리터러시",
      "#협업",
      "#공개발표",
    ];

    const summary = g
      ? `${user!.school ?? "학교"} 독서반 활동에서 ${
          best ? `《${best.bookTitle || "책"}》을 읽고 '${best.title}'라는 문제를 제기함. ` : ""
        }동료의 반응 ${received}개를 받으며 문제를 다듬었고, ${prog.done}주차까지 ${prog.total}주 과정을 진행함.`
      : "아직 활동 기록이 없습니다.";

    return (
      <>
        <SectionBanner
          icon="🏆"
          eyebrow="Portfolio"
          title={
            <>
              학생부에 <span className="text-[#5eead4]">바로 쓰는 기록</span>
            </>
          }
          desc="완주 인증과 대표 산출물을 정리했습니다. 요약 문구는 복사해서 그대로 쓸 수 있어요."
          from="rgba(34,197,94,.2)"
          to="rgba(6,182,212,.12)"
          border="rgba(45,212,191,.35)"
          right={
            <button
              onClick={() => toast("PDF 내보내기는 준비 중입니다")}
              className="btn btn-pill"
            >
              📄 PDF 내보내기
            </button>
          }
        />

        {!g ? (
          <Panel>
            <EmptyState
              icon="🏆"
              title="아직 완주 기록이 없어요"
              desc="그룹에 참여해 4주 로드맵을 진행하면 포트폴리오가 자동으로 만들어집니다."
              action={
                <button
                  onClick={() => setTab("community")}
                  className="btn btn-pill"
                >
                  그룹 참여하기
                </button>
              }
            />
          </Panel>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <Panel
                className="p-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(108,92,231,.16) 0%, rgba(168,85,247,.08) 100%)",
                  borderColor: "rgba(139,92,246,.3)",
                }}
              >
                <p className="text-[12px] font-bold text-white/50">완주 진행</p>
                <p className="mt-1.5 text-[18px] font-extrabold text-white">
                  🎖 SMILE+P {prog.done >= 8 ? "정의 트랙 완주" : "진행 중"}
                </p>
                <p className="mt-1.5 text-[13px] text-white/55">
                  {g.name} · 시즌 {g.season} · {prog.done}/{prog.total}주
                </p>
                <p className="mt-1 text-[12px] text-white/40">
                  지도: {g.leaderName}
                </p>
              </Panel>

              {best && (
                <Panel>
                  <PanelHeader title="대표 문제 카드" />
                  <div className="p-4">
                    <ProblemCardItem card={best} showReactions={false} />
                  </div>
                </Panel>
              )}

              <Panel>
                <PanelHeader
                  title="학생부 기재용 요약"
                  desc="복사해서 그대로 쓰세요"
                  action={
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(summary);
                        toast("요약 문구를 복사했습니다");
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

            <div className="space-y-5">
              <Panel>
                <PanelHeader title="역량 태그" />
                <div className="flex flex-wrap gap-1.5 p-4">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="border border-[#6c5ce7]/35 bg-[#6c5ce7]/12 px-2.5 py-1 text-[12px] font-semibold text-[#a29bfe]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Panel>

              <Panel>
                <PanelHeader title="산출물" />
                <ul className="divide-y divide-white/6 text-[13px]">
                  {[
                    { l: "문제 카드", v: `${cards.length}장`, ok: cards.length > 0 },
                    { l: "받은 반응", v: `${received}개`, ok: received > 0 },
                    { l: "문제 정의서", v: "주 8에 열림", ok: false },
                    { l: "프로젝트", v: "주 9에 열림", ok: false },
                  ].map((r) => (
                    <li
                      key={r.l}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <span className="text-white/60">{r.l}</span>
                      <span
                        className={cn(
                          "font-bold",
                          r.ok ? "text-white" : "text-white/30",
                        )}
                      >
                        {r.v}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        )}
      </>
    );
  }

  // ══════════ 자료실 탭 ══════════
  function ResourcesTab() {
    const forms = [
      { n: 1, t: "문제 카드 (빈칸)", size: "A5", use: "주 3" },
      { n: 2, t: "반응 스티커 시트", size: "A4", use: "매주" },
      { n: 3, t: "숨은 전제 카드", size: "A5", use: "주 4" },
      { n: 4, t: "근거 타당성 체크리스트", size: "A5", use: "주 4" },
      { n: 5, t: "3층 독서 노트", size: "A4", use: "주 5" },
      { n: 6, t: "\"그렇다면\" 카드", size: "A5", use: "주 6" },
      { n: 7, t: "반증 기록지", size: "A4", use: "주 7" },
      { n: 8, t: "문제 정의서 양식", size: "A4", use: "주 8" },
      { n: 9, t: "문제 시장 포스터", size: "A3", use: "주 9" },
      { n: 10, t: "주간 체크인 보고판", size: "A4", use: "주 10~11" },
      { n: 11, t: "그룹 모집 포스터", size: "A3", use: "시즌 전" },
      { n: 12, t: "시즌 리포트 템플릿", size: "A4", use: "시즌 후" },
    ];

    return (
      <>
        <SectionBanner
          icon="📁"
          eyebrow="Resources"
          title={
            <>
              인쇄해서 쓰는 <span className="text-[#93c5fd]">오프라인 양식</span>
            </>
          }
          desc="교실 병행 수업에서 쓸 수 있는 인쇄용 양식과 지도자 자료입니다."
          from="rgba(59,130,246,.22)"
          to="rgba(108,92,231,.12)"
          border="rgba(96,165,250,.35)"
        />

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Panel>
              <PanelHeader title="인쇄용 양식 12종" desc="클릭하면 다운로드" />
              <ul className="divide-y divide-white/6">
                {forms.map((f) => (
                  <li key={f.n}>
                    <button
                      onClick={() =>
                        toast(`${f.t} 다운로드는 준비 중입니다`)
                      }
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/4"
                    >
                      <span className="w-6 shrink-0 text-[12px] font-bold text-white/30">
                        {f.n}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-white/80">
                        {f.t}
                      </span>
                      <Badge color="#3b82f6">{f.size}</Badge>
                      <span className="w-16 shrink-0 text-right text-[12px] text-white/35">
                        {f.use}
                      </span>
                      <span className="shrink-0 text-white/25">↓</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel>
              <PanelHeader title="지도자 자료" />
              <div className="space-y-2 p-4">
                <Link href="/guide" className="btn btn-square w-full">
                  📘 독서 지도자 가이드
                </Link>
                <button
                  onClick={() => toast("온보딩 영상은 준비 중입니다")}
                  className="btn btn-square w-full"
                >
                  ▶ 온보딩 영상 (8분)
                </button>
                <Link href="/about" className="btn btn-square w-full">
                  ✨ ReadingClue 소개
                </Link>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="4주 로드맵 요약" />
              <ul className="divide-y divide-white/6 text-[13px]">
                {MISSIONS.slice(0, 12).map((m) => (
                  <li
                    key={m.week}
                    className="flex items-center gap-2.5 px-4 py-2.5"
                  >
                    <span className="w-8 shrink-0 text-[11px] font-bold text-white/35">
                      주{m.week}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-white/70">
                      {m.title}
                    </span>
                    <span className="shrink-0 text-[11px] text-white/25">
                      {m.estimatedMin}분
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </>
    );
  }
}

export default function ReadmatePage() {
  return (
    <Suspense fallback={null}>
      <ReadmateInner />
    </Suspense>
  );
}
