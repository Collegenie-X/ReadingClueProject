"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Panel, Badge, cn, toast } from "@/components/ui";
import {
  findGroupByCode,
  groupMembers,
  joinGroup,
  getCipResult,
  myMembership,
} from "@/lib/store";
import { useRequireAuth, useStoreVersion } from "@/lib/useStore";
import type { Group } from "@/lib/types";

const LEN = 10; // READ + 3 + 2  (하이픈 제외 문자 수)

function JoinInner() {
  const { ready } = useRequireAuth();
  useStoreVersion();
  const router = useRouter();
  const params = useSearchParams();

  const [raw, setRaw] = useState("");
  const [found, setFound] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 딥링크 ?code=READ-HB2-26
  useEffect(() => {
    const c = params.get("code");
    if (c) setRaw(c.toUpperCase());
  }, [params]);

  if (!ready) return null;

  const normalized = raw.toUpperCase();

  function check() {
    setError(null);
    const g = findGroupByCode(normalized);
    if (!g) {
      setError(
        "이 코드를 찾을 수 없어요. 대소문자와 하이픈(-)을 확인해 주세요.",
      );
      setFound(null);
      return;
    }
    if (myMembership(g.id)) {
      toast("이미 참여 중인 그룹이에요");
      router.push(`/groups/${g.id}`);
      return;
    }
    const members = groupMembers(g.id);
    if (members.length >= g.maxMembers) {
      setError("이 그룹은 정원이 찼습니다. 선생님께 문의해 주세요.");
      setFound(null);
      return;
    }
    setFound(g);
  }

  function confirmJoin() {
    if (!found) return;
    joinGroup(found.id);
    toast(`${found.name}에 참여했어요`);
    const cip = getCipResult();
    if (cip) router.push(`/groups/${found.id}`);
    else router.push("/quiz");
  }

  // ── 미리보기 ───────────────────────────
  if (found) {
    const members = groupMembers(found.id);
    return (
      <div className="shell max-w-lg py-10 md:py-16">
        <Panel className="animate-pop overflow-hidden">
          <div
            className="px-6 py-7 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(108,92,231,.18) 0%, rgba(168,85,247,.10) 100%)",
            }}
          >
            <span className="text-[40px]">{found.icon}</span>
            <h1 className="mt-2 text-[22px] leading-tight font-extrabold text-white">
              {found.name}
            </h1>
            <p className="mt-1.5 text-[13px] text-white/55">
              {found.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] text-white/50">
              <span>👥 {members.length}/{found.maxMembers}명</span>
              <span>·</span>
              <span>📋 {found.currentWeek}주차</span>
              <span>·</span>
              <span>지도: {found.leaderName}</span>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              <Badge color="#6c5ce7">{found.category}</Badge>
              <Badge color="#3b82f6">{found.mode}</Badge>
              <Badge color="#22c55e">{found.roadmapType}</Badge>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-[14px] font-bold text-white">
              이 그룹에 참여할까요?
            </p>
            <ul className="mt-3 space-y-2">
              {[
                "관심사 진단(15분)을 받고",
                "같은 관심사 친구들과 크루가 되고",
                "매주 미션을 함께 진행합니다",
              ].map((t, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-[13px] leading-relaxed text-white/65"
                >
                  <span className="text-[#a29bfe]">·</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 border-t border-white/8 px-6 py-4">
            <Button
              variant="square"
              className="flex-1"
              onClick={() => {
                setFound(null);
                setRaw("");
              }}
            >
              취소
            </Button>
            <Button variant="pill" className="flex-1" onClick={confirmJoin}>
              참여하기
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  // ── 코드 입력 ──────────────────────────
  const chars = normalized.replace(/-/g, "").slice(0, LEN).split("");

  return (
    <div className="shell max-w-lg py-10 md:py-16">
      <div className="text-center">
        <span className="text-[36px]">🔑</span>
        <h1 className="mt-3 text-[26px] leading-tight font-extrabold text-white sm:text-[30px]">
          그룹 참여하기
        </h1>
        <p className="mt-2 text-[14px] text-white/50">
          선생님께 받은 초대 코드를 입력하세요
        </p>
      </div>

      <Panel className="mt-8 p-6">
        {/* 셀 표시 */}
        <button
          onClick={() => inputRef.current?.focus()}
          className="flex w-full flex-wrap items-center justify-center gap-1.5"
        >
          {Array.from({ length: LEN }, (_, i) => {
            const showDash = i === 4 || i === 7;
            return (
              <span key={i} className="flex items-center gap-1.5">
                {showDash && <span className="text-white/25">-</span>}
                <span
                  className={cn(
                    "flex h-11 w-8 items-center justify-center border text-[17px] font-extrabold transition sm:h-12 sm:w-9",
                    chars[i]
                      ? "border-[#6c5ce7] bg-[#6c5ce7]/15 text-white"
                      : "border-white/12 bg-white/3 text-white/20",
                  )}
                >
                  {chars[i] ?? "·"}
                </span>
              </span>
            );
          })}
        </button>

        {/* 실제 입력 */}
        <input
          ref={inputRef}
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value.toUpperCase());
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="READ-HB2-26"
          className="input-rc mt-5 text-center tracking-[0.2em]"
          autoFocus
        />

        {error && (
          <p className="animate-fade-up mt-3 border-l-2 border-[#ef4444] bg-[#ef4444]/8 py-2 pl-3 text-[12px] leading-relaxed text-[#ef4444]">
            {error}
          </p>
        )}

        <Button
          variant="primary"
          className="mt-5 w-full"
          onClick={check}
          disabled={normalized.replace(/-/g, "").length < 6}
        >
          참여하기
        </Button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/8" />
          <span className="text-[12px] text-white/30">또는</span>
          <span className="h-px flex-1 bg-white/8" />
        </div>

        <p className="text-center text-[13px] text-white/50">코드가 없나요?</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Link href="/readmate?tab=community" className="btn btn-square flex-1">
            공개 그룹 둘러보기
          </Link>
          <Link href="/groups/new" className="btn btn-square flex-1">
            직접 그룹 만들기
          </Link>
        </div>
      </Panel>

      {/* 데모 힌트 */}
      <div className="mt-5 border border-dashed border-white/12 px-4 py-3 text-center">
        <p className="text-[12px] text-white/40">
          🎬 데모 코드:{" "}
          <button
            onClick={() => setRaw("READ-HB2-26")}
            className="font-mono font-bold text-[#a29bfe] underline underline-offset-2"
          >
            READ-HB2-26
          </button>
          <span className="mx-1.5 text-white/20">·</span>
          <button
            onClick={() => setRaw("READ-SCI-01")}
            className="font-mono font-bold text-[#a29bfe] underline underline-offset-2"
          >
            READ-SCI-01
          </button>
        </p>
      </div>
    </div>
  );
}

export default function JoinGroupPage() {
  return (
    <Suspense fallback={null}>
      <JoinInner />
    </Suspense>
  );
}
