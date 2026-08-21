"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Field, Panel, cn, toast } from "@/components/ui";
import InviteCodeBox from "@/components/InviteCodeBox";
import {
  GROUP_ICONS,
  GROUP_CATEGORIES,
  GROUP_MODES,
  ROADMAP_TYPES,
  CREW_ASSIGN_MODES,
  REGIONS,
  MISSIONS,
} from "@/lib/data";
import { createGroup } from "@/lib/store";
import { useRequireAuth } from "@/lib/useStore";
import type {
  Group,
  GroupCategory,
  GroupMode,
  RoadmapType,
  CrewAssignMode,
} from "@/lib/types";

export default function NewGroupPage() {
  const { ready } = useRequireAuth();
  const router = useRouter();

  const [icon, setIcon] = useState("📖");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GroupCategory>("독서반");
  const [mode, setMode] = useState<GroupMode>("온라인");
  const [roadmapType, setRoadmapType] = useState<RoadmapType>("4주 집중");
  const [maxMembers, setMaxMembers] = useState(30);
  const [crewAssignMode, setCrewAssignMode] =
    useState<CrewAssignMode>("관심사 진단 자동");
  const [region, setRegion] = useState("서울");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  const [created, setCreated] = useState<Group | null>(null);

  if (!ready) return null;

  function addTag() {
    const t = tagInput.trim().replace(/^#/, "");
    if (!t) return;
    if (tags.length >= 20) return toast("태그는 최대 20개까지 추가할 수 있어요");
    if (tags.includes(t)) return setTagInput("");
    setTags([...tags, t]);
    setTagInput("");
  }

  function submit() {
    if (!name.trim()) {
      toast("그룹 이름을 입력해 주세요");
      return;
    }
    const g = createGroup({
      name: name.trim(),
      description: description.trim() || "함께 읽고 각자의 문제를 발견합니다.",
      icon,
      category,
      mode,
      roadmapType,
      maxMembers,
      crewAssignMode,
      tags,
      isPublic,
      region,
    });
    setCreated(g);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── 완료 화면 ──────────────────────────
  if (created) {
    return (
      <div className="shell max-w-2xl py-10 md:py-16">
        <div className="animate-fade-up text-center">
          <p className="text-[40px]">🎉</p>
          <h1 className="mt-3 text-[24px] font-extrabold text-white sm:text-[28px]">
            그룹이 만들어졌습니다!
          </h1>
          <p className="mt-2 flex items-center justify-center gap-2 text-[15px] text-white/60">
            <span className="text-[20px]">{created.icon}</span>
            {created.name}
          </p>
        </div>

        <div className="mt-8">
          <InviteCodeBox code={created.inviteCode} />
        </div>

        <Panel className="mt-6">
          <div className="border-b border-white/8 px-5 py-3">
            <h3 className="text-[14px] font-bold text-white">다음에 할 일</h3>
          </div>
          <ol className="divide-y divide-white/6">
            {[
              { n: "①", t: "학급 단톡방에 코드 공유", d: "위 [초대 메시지 복사]를 눌러 붙여넣으세요" },
              { n: "②", t: "학생 4명 이상 합류 대기", d: "4명이 모이면 크루가 자동으로 만들어집니다" },
              { n: "③", t: "1주차 미션 자동 시작", d: `${MISSIONS[0].title} — 학생이 알아서 진행합니다` },
            ].map((s) => (
              <li key={s.n} className="flex gap-3.5 px-5 py-3.5">
                <span className="text-[16px] font-extrabold text-[#a29bfe]">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-white">{s.t}</p>
                  <p className="mt-0.5 text-[12px] text-white/45">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="primary" href={`/groups/${created.id}`}>
            그룹으로 이동 →
          </Button>
          <Button variant="ghost" href="/readmate?tab=community">
            독서 스페이스
          </Button>
        </div>
      </div>
    );
  }

  // ── 생성 폼 ────────────────────────────
  const roadmapDesc: Record<RoadmapType, string> = {
    "4주 집중": "책 1권 → 토론 → 반론 → 기획안까지 (SMILE + P)",
    자율: "미션을 직접 만들어 운영합니다",
  };

  return (
    <div className="shell max-w-2xl py-8 md:py-12">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">New Reading Space</p>
          <h1 className="mt-1.5 text-[26px] leading-tight font-extrabold text-white sm:text-[30px]">
            📖 새 독서 그룹 만들기
          </h1>
          <p className="mt-2 text-[14px] text-white/50">
            2분이면 끝납니다. 나머지는 시스템이 진행합니다.
          </p>
        </div>
        <Link
          href="/readmate?tab=community"
          className="shrink-0 text-[20px] text-white/30 transition hover:text-white"
          aria-label="닫기"
        >
          ✕
        </Link>
      </div>

      <Panel className="p-5 sm:p-6">
        {/* 아이콘 */}
        <Field label="그룹 아이콘">
          <div className="flex flex-wrap gap-2">
            {GROUP_ICONS.map((ic) => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-[16px] border text-xl transition",
                  icon === ic
                    ? "border-[#6c5ce7] bg-[#6c5ce7]/20 scale-105"
                    : "border-white/10 bg-white/3 hover:bg-white/8",
                )}
              >
                {ic}
              </button>
            ))}
          </div>
        </Field>

        {/* 이름 */}
        <Field label="그룹 이름" required counter={`${name.length}/40`}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            placeholder="예) 한빛중 2학년 독서반"
            className="input-rc"
          />
        </Field>

        {/* 설명 */}
        <Field
          label="설명"
          counter={`${description.length}/80`}
          hint="이 그룹이 무엇을 하는지 한 줄로"
        >
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 80))}
            placeholder="예) 함께 읽고 각자의 문제를 발견합니다"
            className="input-rc"
          />
        </Field>

        {/* 카테고리 · 진행 방식 */}
        <div className="grid gap-x-5 sm:grid-cols-2">
          <Field label="카테고리" required>
            <div className="flex flex-wrap gap-1.5">
              {GROUP_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "border px-3 py-2 text-[13px] font-bold transition",
                    category === c
                      ? "border-[#6c5ce7] bg-[#6c5ce7]/20 text-white"
                      : "border-white/10 bg-white/3 text-white/55 hover:text-white",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>

          <Field label="진행 방식" required>
            <div className="flex flex-wrap gap-1.5">
              {GROUP_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "border px-3 py-2 text-[13px] font-bold transition",
                    mode === m
                      ? "border-[#6c5ce7] bg-[#6c5ce7]/20 text-white"
                      : "border-white/10 bg-white/3 text-white/55 hover:text-white",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* 로드맵 */}
        <Field
          label="로드맵"
          required
          hint="선택하면 주차별 미션이 자동으로 만들어집니다"
        >
          <div className="space-y-2">
            {ROADMAP_TYPES.map((r) => (
              <button
                key={r}
                onClick={() => setRoadmapType(r)}
                className={cn(
                  "flex w-full items-center gap-3 border px-4 py-3 text-left transition",
                  roadmapType === r
                    ? "border-[#6c5ce7] bg-[#6c5ce7]/12"
                    : "border-white/10 bg-white/3 hover:bg-white/6",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                    roadmapType === r
                      ? "border-[#a29bfe] bg-[#6c5ce7]"
                      : "border-white/25",
                  )}
                >
                  {roadmapType === r && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-bold text-white">
                    {r}
                  </span>
                  <span className="block text-[12px] text-white/45">
                    {roadmapDesc[r]}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Field>

        {/* 최대 인원 */}
        <Field label="최대 인원" counter={`${maxMembers}명`}>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-white/35">4</span>
            <input
              type="range"
              min={4}
              max={40}
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#6c5ce7]"
            />
            <span className="text-[12px] text-white/35">40</span>
          </div>
        </Field>

        {/* 크루 배정 */}
        <Field
          label="크루 배정 방식"
          hint="같은 관심사 4~8명이 하나의 크루가 됩니다"
        >
          <div className="flex flex-wrap gap-1.5">
            {CREW_ASSIGN_MODES.map((c) => (
              <button
                key={c}
                onClick={() => setCrewAssignMode(c)}
                className={cn(
                  "border px-3 py-2 text-[13px] font-bold transition",
                  crewAssignMode === c
                    ? "border-[#6c5ce7] bg-[#6c5ce7]/20 text-white"
                    : "border-white/10 bg-white/3 text-white/55 hover:text-white",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        {/* 지역 */}
        <Field label="지역">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="input-rc"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r} className="bg-[#0e0e1a]">
                {r}
              </option>
            ))}
          </select>
        </Field>

        {/* 태그 */}
        <Field label="태그" counter={`${tags.length}/20`}>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="예) 중등"
              className="input-rc"
            />
            <button onClick={addTag} className="btn btn-square shrink-0">
              추가
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="flex items-center gap-1 border border-[#6c5ce7]/40 bg-[#6c5ce7]/15 px-2.5 py-1 text-[12px] font-semibold text-[#a29bfe] transition hover:bg-[#6c5ce7]/25"
                >
                  #{t} <span className="text-white/40">✕</span>
                </button>
              ))}
            </div>
          )}
        </Field>

        {/* 공개 여부 */}
        <div className="flex items-center justify-between gap-4 border-t border-white/8 pt-5">
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white/85">목록에 공개</p>
            <p className="mt-0.5 text-[12px] text-white/45">
              {isPublic
                ? "누구나 독서 스페이스에서 찾고 참여를 요청할 수 있어요"
                : "🔒 초대 코드를 아는 사람만 참여할 수 있어요"}
            </p>
          </div>
          <button
            onClick={() => setIsPublic((v) => !v)}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition",
              isPublic ? "bg-[#6c5ce7]" : "bg-white/12",
            )}
            role="switch"
            aria-checked={isPublic}
          >
            <span
              className={cn(
                "absolute top-1 h-5 w-5 rounded-full bg-white transition-all",
                isPublic ? "left-6" : "left-1",
              )}
            />
          </button>
        </div>
      </Panel>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="square" href="/readmate?tab=community">
          취소
        </Button>
        <Button variant="primary" onClick={submit} disabled={!name.trim()}>
          그룹 만들기
        </Button>
      </div>
    </div>
  );
}
