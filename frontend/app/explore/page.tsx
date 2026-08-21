"use client";

/** P23 — 공개 문제 아카이브 (비로그인 접근 가능 · SEO 유입 채널) */

import { useMemo, useState } from "react";
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
  toast,
} from "@/components/ui";
import {
  INTERESTS,
  LEGACY_QUESTIONS,
  PUBLIC_CARDS,
  REGIONS,
  getInterest,
  interestColor,
  interestLabel,
} from "@/lib/data";
import type { PublicCardSummary } from "@/lib/data";
import { globalStats } from "@/lib/store";
import { useCurrentUser, useMounted, useStoreVersion } from "@/lib/useStore";
import { comma } from "@/lib/format";

const SCHOOL_LEVELS = ["중1", "중2", "중3", "고1", "고2", "고3"];

const SORTS = [
  { key: "popular", label: "인기순" },
  { key: "recent", label: "최신순" },
  { key: "rebut", label: "반박 많은 순" },
] as const;

type SortKey = (typeof SORTS)[number]["key"];

const RANK_EMOJI = ["🥇", "🥈", "🥉"];

function total(c: PublicCardSummary) {
  return c.agree + c.symptom + c.rebut;
}

/** 필터 셀렉트 (globals.css의 input-rc 재사용) */
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="min-w-0 flex-1 sm:flex-none">
      <span className="mb-1 block text-[11px] font-bold text-white/40">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-rc cursor-pointer sm:w-[150px]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0e0e1a]">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ExploreArchivePage() {
  const mounted = useMounted();
  useStoreVersion();
  const user = useCurrentUser();
  const router = useRouter();

  const [interest, setInterest] = useState("all");
  const [region, setRegion] = useState("all");
  const [school, setSchool] = useState("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [reacted, setReacted] = useState<string[]>([]);

  const cardCount = mounted ? globalStats().cards : 12391;

  const ranked = useMemo(
    () =>
      [...PUBLIC_CARDS]
        .sort((a, b) => b.agree + b.rebut - (a.agree + a.rebut))
        .slice(0, 3),
    [],
  );

  const list = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    const filtered = PUBLIC_CARDS.filter((c) => {
      if (interest !== "all" && c.interestId !== Number(interest)) return false;
      if (region !== "all" && c.region !== region) return false;
      if (school !== "all" && c.schoolLabel !== school) return false;
      if (
        keyword &&
        !c.title.toLowerCase().includes(keyword) &&
        !c.bookTitle.toLowerCase().includes(keyword)
      )
        return false;
      return true;
    });
    return filtered.sort((a, b) => {
      if (sort === "rebut") return b.rebut - a.rebut;
      if (sort === "recent") return b.id.localeCompare(a.id);
      return total(b) - total(a);
    });
  }, [interest, region, school, sort, q]);

  const opened = PUBLIC_CARDS.find((c) => c.id === openId) ?? null;

  function resetFilters() {
    setInterest("all");
    setRegion("all");
    setSchool("all");
    setQ("");
  }

  function handleReact(card: PublicCardSummary) {
    if (!user) {
      toast("로그인하면 반응을 남길 수 있어요");
      router.push("/login");
      return;
    }
    if (reacted.includes(card.id)) {
      toast("이미 이 문제에 공감했어요");
      return;
    }
    setReacted((prev) => [...prev, card.id]);
    toast("🤝 나도 이 문제를 느낀다 — 공감을 남겼어요");
  }

  return (
    <div className="bg-black">
      {/* ═══════════ 히어로 ═══════════ */}
      <section className="border-b border-white/8 bg-[linear-gradient(135deg,rgba(108,92,231,.16)_0%,rgba(168,85,247,.08)_55%,rgba(0,0,0,0)_100%)]">
        <div className="shell py-12 md:py-16">
          <p className="eyebrow">Public Archive</p>
          <h1 className="mt-2 text-[30px] leading-[1.15] font-extrabold tracking-[-1px] text-white sm:text-[40px]">
            🌐 전국 문제 아카이브
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55">
            전국의 학생들이 던진{" "}
            <span className="font-extrabold text-white">
              {comma(cardCount)}개의 질문
            </span>
            . 좋아요만 눌리는 글이 아니라, 반박을 견디고 살아남은 문제들입니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[12px] font-bold">
            <span className="rounded-[16px] border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1.5 text-[#22c55e]">
              🤝 공감
            </span>
            <span className="rounded-[16px] border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-3 py-1.5 text-[#fbbf24]">
              🔍 증상
            </span>
            <span className="rounded-[16px] border border-[#ef4444]/30 bg-[#ef4444]/10 px-3 py-1.5 text-[#ef4444]">
              ⚔️ 반론
            </span>
          </div>
        </div>
      </section>

      <div className="shell space-y-8 py-8 md:py-10">
        {/* ═══════════ 필터 바 ═══════════ */}
        <div className="rounded-[16px] border border-white/10 bg-white/3 p-4">
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="관심사"
              value={interest}
              onChange={setInterest}
              options={[
                { value: "all", label: "관심사 전체" },
                ...INTERESTS.map((i) => ({
                  value: String(i.id),
                  label: `${i.emoji} #${i.id} ${i.name}`,
                })),
              ]}
            />
            <FilterSelect
              label="지역"
              value={region}
              onChange={setRegion}
              options={[
                { value: "all", label: "전국" },
                ...REGIONS.map((r) => ({ value: r, label: r })),
              ]}
            />
            <FilterSelect
              label="학교급"
              value={school}
              onChange={setSchool}
              options={[
                { value: "all", label: "전체" },
                ...SCHOOL_LEVELS.map((s) => ({ value: s, label: s })),
              ]}
            />
            <FilterSelect
              label="정렬"
              value={sort}
              onChange={(v) => setSort(v as SortKey)}
              options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
            />
            <label className="min-w-[180px] flex-1">
              <span className="mb-1 block text-[11px] font-bold text-white/40">
                검색
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="질문·책 제목으로 검색"
                className="input-rc"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/8 pt-3">
            <p className="text-[12px] text-white/45">
              총{" "}
              <span className="font-bold text-white">{list.length}</span>개의
              질문
            </p>
            <button
              onClick={resetFilters}
              className="text-[12px] font-semibold text-white/40 transition hover:text-white"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* ═══════════ 이번 시즌 TOP 질문 ═══════════ */}
        <Panel>
          <PanelHeader
            title="🔥 이번 시즌 TOP 질문"
            desc="공감(🤝)과 반론(⚔️)을 가장 많이 부른 질문"
          />
          <ul className="divide-y divide-white/6">
            {ranked.map((c, i) => {
              const color = interestColor(c.interestId);
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setOpenId(c.id)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-white/4"
                  >
                    <span className="text-[20px]">{RANK_EMOJI[i]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-white">
                        {c.title}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/40">
                        {c.region} · {c.schoolLabel} ·{" "}
                        <span style={{ color }}>
                          {interestLabel(c.interestId)}
                        </span>
                      </p>
                    </div>
                    <span className="shrink-0 text-[12px] font-bold text-[#22c55e]">
                      🤝 {c.agree}
                    </span>
                    <span className="shrink-0 text-[12px] font-bold text-[#ef4444]">
                      ⚔️ {c.rebut}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* ═══════════ 카드 그리드 ═══════════ */}
        {list.length === 0 ? (
          <div className="rounded-[16px] border border-white/10 bg-white/3">
            <EmptyState
              icon="🔍"
              title="조건에 맞는 질문이 없어요"
              desc="필터를 넓히거나, 아래 인기 질문부터 살펴보세요."
              action={
                <Button variant="pillGhost" onClick={resetFilters}>
                  필터 초기화
                </Button>
              }
            />
            <div className="border-t border-white/8 px-4 py-4">
              <p className="mb-2.5 text-[12px] font-bold text-white/40">
                이런 질문은 어때요?
              </p>
              <div className="flex flex-wrap gap-2">
                {ranked.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setOpenId(c.id)}
                    className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    🔍 {c.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => {
              const color = interestColor(c.interestId);
              const interest = getInterest(c.interestId);
              const extra = reacted.includes(c.id) ? 1 : 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setOpenId(c.id)}
                  className="flex flex-col rounded-[16px] border p-4 text-left transition duration-300 hover:-translate-y-1.5"
                  style={{
                    background: `${color}14`,
                    borderColor: `${color}2e`,
                  }}
                >
                  <Badge color={color} className="self-start">
                    {interest?.emoji} #{c.interestId} {interest?.name}
                  </Badge>

                  <h3 className="mt-3 text-[16px] leading-snug font-bold text-white sm:text-[17px]">
                    {c.title}
                  </h3>

                  <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-white/45">
                    <span>📖</span>
                    <span className="truncate">《{c.bookTitle}》</span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] font-bold">
                    <span className="text-[#22c55e]">🤝 {c.agree + extra}</span>
                    <span className="text-[#fbbf24]">🔍 {c.symptom}</span>
                    <span className="text-[#ef4444]">⚔️ {c.rebut}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-3">
                    <span className="text-[11px] text-white/40">
                      {c.region} · {c.schoolLabel}
                    </span>
                    <span className="ml-auto flex gap-1.5">
                      {c.hasDefinition && (
                        <Badge color="#3b82f6">📄 정의서</Badge>
                      )}
                      {c.hasProject && <Badge color="#06b6d4">📊 프로젝트</Badge>}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ═══════════ 남은 질문 인계 ═══════════ */}
        <Panel>
          <PanelHeader
            title="🕯️ 남은 질문 인계"
            desc="이전 시즌이 다 풀지 못한 질문들입니다. 다음 시즌에 이어받을 수 있어요."
          />
          <ul className="divide-y divide-white/6">
            {LEGACY_QUESTIONS.map((lq) => {
              const color = interestColor(lq.interestId);
              return (
                <li
                  key={lq.id}
                  className="flex flex-col gap-2.5 px-4 py-3.5 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-snug font-bold text-white">
                      {lq.text}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-white/40">
                      <span>{lq.from}</span>
                      <span style={{ color }}>
                        {interestLabel(lq.interestId)}
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="pillGhost"
                    className="shrink-0 self-start sm:self-auto"
                    onClick={() =>
                      toast("다음 시즌 인계 목록에 담았어요")
                    }
                  >
                    이어받기
                  </Button>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* ═══════════ 하단 CTA ═══════════ */}
        <div
          className="flex flex-col items-center gap-4 rounded-[16px] border px-5 py-10 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(108,92,231,.16) 0%, rgba(168,85,247,.08) 100%)",
            borderColor: "rgba(108,92,231,.3)",
          }}
        >
          <h2 className="text-[22px] leading-tight font-extrabold text-white sm:text-[26px]">
            💡 나도 질문을 던지고 싶다면
          </h2>
          <p className="max-w-lg text-[14px] leading-relaxed text-white/55">
            내 관심사를 먼저 찾으면, 어떤 책에서 어떤 문제를 꺼낼지가 보입니다.
          </p>
          <Button href="/quiz" variant="primary">
            관심사 진단 시작 →
          </Button>
        </div>
      </div>

      {/* ═══════════ 상세 모달 ═══════════ */}
      <Modal
        open={!!opened}
        onClose={() => setOpenId(null)}
        title="문제 카드"
        width={540}
        footer={
          opened ? (
            <>
              <Button variant="square" onClick={() => setOpenId(null)}>
                닫기
              </Button>
              <Button variant="pill" onClick={() => handleReact(opened)}>
                🤝 나도 이 문제를 느낀다
              </Button>
            </>
          ) : undefined
        }
      >
        {opened && <ArchiveDetail card={opened} bonus={reacted.includes(opened.id) ? 1 : 0} />}
      </Modal>
    </div>
  );
}

// ══════════════ 상세 본문 ══════════════
function ArchiveDetail({
  card,
  bonus,
}: {
  card: PublicCardSummary;
  bonus: number;
}) {
  const color = interestColor(card.interestId);
  const interest = getInterest(card.interestId);
  const agree = card.agree + bonus;
  const sum = agree + card.symptom + card.rebut;

  const rows = [
    { emoji: "🤝", label: "공감", value: agree, color: "#22c55e" },
    { emoji: "🔍", label: "증상", value: card.symptom, color: "#fbbf24" },
    { emoji: "⚔️", label: "반론", value: card.rebut, color: "#ef4444" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[18px]">{card.userAvatar}</span>
        <span className="text-[14px] font-bold text-white">
          {card.userName}
        </span>
        <Badge color={color}>
          {interest?.emoji} #{card.interestId} {interest?.name}
        </Badge>
        <span className="text-[12px] text-white/35">
          {card.region} · {card.schoolLabel}
        </span>
      </div>

      <div
        className="mb-5 border-l-4 py-3 pl-4"
        style={{ borderColor: color, background: `${color}0d` }}
      >
        <p className="text-[11px] font-bold text-white/40">
          ① 이 문제를 한 문장으로
        </p>
        <h3 className="mt-1 text-[19px] leading-snug font-extrabold text-white sm:text-[21px]">
          {card.title}
        </h3>
      </div>

      <p className="mb-1.5 text-[12px] font-bold text-white/40">③ 관련된 책</p>
      <p className="mb-5 text-[14px] text-white/80">《{card.bookTitle}》</p>

      <p className="mb-2.5 text-[12px] font-bold text-white/40">반응 통계</p>
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-baseline justify-between text-[12px]">
              <span className="font-semibold" style={{ color: r.color }}>
                {r.emoji} {r.label}
              </span>
              <span className="font-bold text-white">{r.value}</span>
            </div>
            <ProgressBar
              value={r.value}
              total={sum}
              color={r.color}
              className="mt-1.5"
            />
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {card.hasDefinition && <Badge color="#3b82f6">📄 정의서 작성됨</Badge>}
        {card.hasProject && <Badge color="#06b6d4">📊 프로젝트 진행됨</Badge>}
      </div>

      <p className="mt-5 border-l-2 border-white/15 pl-3 text-[12px] leading-relaxed text-white/40">
        공개 아카이브에는 질문 요약본만 실립니다. 전문(느낀 순간 · 반대편 논리 ·
        중요한 이유)은 그룹 안에서 볼 수 있어요.{" "}
        <Link href="/groups/join" className="font-semibold text-[#a29bfe] hover:underline">
          초대 코드로 참여하기 →
        </Link>
      </p>
    </div>
  );
}
