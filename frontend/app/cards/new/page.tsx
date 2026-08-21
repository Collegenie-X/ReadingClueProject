"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Panel,
  Field,
  Modal,
  Badge,
  EmptyState,
  cn,
  toast,
} from "@/components/ui";
import {
  createCard,
  myGroups,
  myCrew,
  getCipResult,
  submitMission,
  mySelectedBookId,
  getGroup,
} from "@/lib/store";
import { INTERESTS, getInterest, interestColor, getBook, BOOKS } from "@/lib/data";
import { useRequireAuth, useStoreVersion } from "@/lib/useStore";
import type { CardVisibility } from "@/lib/types";

const DRAFT_KEY = "readingclue:card-draft";

function NewCardInner() {
  const { ready, user } = useRequireAuth();
  useStoreVersion();
  const router = useRouter();
  const params = useSearchParams();

  const [groupId, setGroupId] = useState("");
  const [interestId, setInterestId] = useState(43);
  const [title, setTitle] = useState("");
  const [moment, setMoment] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookQuestion, setBookQuestion] = useState("");
  const [opponent, setOpponent] = useState("");
  const [opponentLogic, setOpponentLogic] = useState("");
  const [why, setWhy] = useState("");
  const [visibility, setVisibility] = useState<CardVisibility>("crew");
  const [warnOpen, setWarnOpen] = useState(false);
  const [bookPicker, setBookPicker] = useState(false);
  const [saved, setSaved] = useState(false);

  const groups = ready ? myGroups() : [];

  // 초기값 세팅: 그룹 · 관심사 · 선택한 책
  useEffect(() => {
    if (!ready) return;
    const g = params.get("group") ?? myGroups()[0]?.id ?? "";
    setGroupId(g);

    const cip = getCipResult();
    if (cip) setInterestId(cip.top3[0]);

    const bookParam = params.get("book");
    const bid = bookParam ?? mySelectedBookId();
    if (bid) {
      const b = getBook(bid);
      if (b) {
        setBookTitle(b.title);
        setBookQuestion(b.questions[0] ?? "");
      }
    }

    // 임시 저장 복원
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.title) setTitle(d.title);
        if (d.moment) setMoment(d.moment);
        if (d.opponent) setOpponent(d.opponent);
        if (d.opponentLogic) setOpponentLogic(d.opponentLogic);
        if (d.why) setWhy(d.why);
        if (d.interestId) setInterestId(d.interestId);
        toast("작성 중이던 내용을 불러왔어요");
      }
    } catch {
      /* 무시 */
    }
  }, [ready, params]);

  // 자동 저장 (3초 디바운스)
  useEffect(() => {
    if (!ready) return;
    if (!title && !moment && !why) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title,
            moment,
            opponent,
            opponentLogic,
            why,
            interestId,
          }),
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch {
        /* 무시 */
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [ready, title, moment, opponent, opponentLogic, why, interestId]);

  if (!ready) return null;

  if (groups.length === 0) {
    return (
      <div className="shell max-w-lg py-16">
        <EmptyState
          icon="👥"
          title="먼저 그룹에 참여해 주세요"
          desc="문제 카드는 크루와 함께 나누는 것이라서, 그룹에 속해야 쓸 수 있어요."
          action={
            <>
              <Link href="/groups/join" className="btn btn-pill">
                초대 코드로 참여
              </Link>
              <Link href="/groups/new" className="btn btn-square">
                그룹 만들기
              </Link>
            </>
          }
        />
      </div>
    );
  }

  const canSubmit = title.trim().length >= 10 && why.trim().length >= 10;
  const hasOpponent = opponent.trim() && opponentLogic.trim();
  const color = interestColor(interestId);

  function doSubmit() {
    const crew = myCrew(groupId);
    const card = createCard({
      groupId,
      crewId: crew?.id ?? null,
      interestId,
      title: title.trim(),
      moment: moment.trim(),
      bookTitle: bookTitle.trim(),
      bookQuestion: bookQuestion.trim(),
      opponent: opponent.trim(),
      opponentLogic: opponentLogic.trim(),
      why: why.trim(),
      visibility,
      schoolLabel: user?.grade,
      region: getGroup(groupId)?.region,
    });
    submitMission(groupId, 3, "문제 카드 게시");
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* 무시 */
    }
    toast("문제 카드를 게시했어요");
    router.push(`/cards/${card.id}`);
  }

  return (
    <div className="shell max-w-2xl py-8 md:py-10">
      {/* 헤더 */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Problem Card</p>
          <h1 className="mt-1.5 text-[26px] leading-tight font-extrabold text-white sm:text-[30px]">
            🔍 문제 카드 작성
          </h1>
          <p className="mt-2 text-[14px] text-white/50">
            독후감이 아닙니다. <b className="text-white/75">내 질문</b>을 씁니다.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {saved && (
            <span className="animate-fade-up text-[11px] text-[#22c55e]">
              ✓ 임시 저장됨
            </span>
          )}
          <Link
            href={groupId ? `/groups/${groupId}` : "/readmate"}
            className="text-[20px] text-white/30 transition hover:text-white"
            aria-label="닫기"
          >
            ✕
          </Link>
        </div>
      </div>

      <Panel className="p-5 sm:p-6">
        {/* 그룹 · 관심사 */}
        <div className="grid gap-x-5 sm:grid-cols-2">
          {groups.length > 1 && (
            <Field label="그룹">
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="input-rc"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#0e0e1a]">
                    {g.icon} {g.name}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="관심사" required>
            <select
              value={interestId}
              onChange={(e) => setInterestId(Number(e.target.value))}
              className="input-rc"
              style={{ borderColor: `${color}66` }}
            >
              {INTERESTS.map((i) => (
                <option key={i.id} value={i.id} className="bg-[#0e0e1a]">
                  {i.emoji} #{i.id} {i.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* ① */}
        <Field
          label="① 이 문제를 한 문장으로"
          required
          counter={`${title.length}/100`}
          hint={
            <>
              💡 <b className="text-white/60">&ldquo;~는 무엇인가?&rdquo;</b>보다{" "}
              <b className="text-white/60">&ldquo;~는 왜 ~한가?&rdquo;</b>가 더 좋은
              문제입니다.
            </>
          }
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="예) AI가 교사를 대체할 수 있는가?"
            className="input-rc text-[15px] font-semibold"
          />
        </Field>

        {/* ② */}
        <Field
          label="② 이 문제를 느낀 순간"
          counter={`${moment.length}/300`}
          hint="💡 추상적인 생각보다 구체적인 장면을 쓰세요."
        >
          <textarea
            value={moment}
            onChange={(e) => setMoment(e.target.value.slice(0, 300))}
            rows={3}
            placeholder="예) 챗GPT로 숙제를 하는 친구를 보면서 선생님의 역할이 뭔지 의문이 들었다."
            className="input-rc resize-none"
          />
        </Field>

        {/* ③ */}
        <Field label="③ 관련된 책" hint="책 없이 쓴 카드도 괜찮지만, 근거가 약해집니다.">
          <div className="flex gap-2">
            <input
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              placeholder="책 제목"
              className="input-rc"
            />
            <button
              onClick={() => setBookPicker(true)}
              className="btn btn-square shrink-0"
            >
              🔍 찾기
            </button>
          </div>
          <input
            value={bookQuestion}
            onChange={(e) => setBookQuestion(e.target.value)}
            placeholder="이 책이 준 질문"
            className="input-rc mt-2"
          />
        </Field>

        {/* ④ */}
        <div
          className="mb-5 border-l-2 py-4 pl-4"
          style={{ borderColor: "#a29bfe", background: "rgba(108,92,231,0.06)" }}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <label className="text-[13px] font-bold text-white/85">
              ④ 반대편에서 보면
            </label>
            <Badge color="#a29bfe">가장 중요</Badge>
          </div>
          <input
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            placeholder='"이건 문제가 아니다"라고 말할 사람'
            className="input-rc"
          />
          <textarea
            value={opponentLogic}
            onChange={(e) => setOpponentLogic(e.target.value)}
            rows={2}
            placeholder="그 사람의 논리"
            className="input-rc mt-2 resize-none"
          />
          <p className="mt-2 text-[12px] leading-relaxed text-white/45">
            💡 이 칸이 가장 중요합니다.{" "}
            <b className="text-white/65">
              반대 입장을 쓸 수 없다면 아직 문제가 아닙니다.
            </b>
          </p>
        </div>

        {/* ⑤ */}
        <Field
          label="⑤ 이 문제가 중요한 이유 (한 문장)"
          required
          counter={`${why.length}/100`}
        >
          <input
            value={why}
            onChange={(e) => setWhy(e.target.value.slice(0, 100))}
            placeholder="예) 지금 결정하지 않으면 10년 뒤 교육이 어떻게 될지 아무도 모르기 때문이다."
            className="input-rc"
          />
        </Field>

        {/* 공개 범위 */}
        <div className="border-t border-white/8 pt-5">
          <p className="mb-2 text-[13px] font-bold text-white/85">공개 범위</p>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { v: "crew", l: "내 크루", d: "같은 관심사 친구들만" },
                { v: "group", l: "그룹 전체", d: "우리 반 모두" },
                { v: "public", l: "전국 공개", d: "문제 아카이브에 게시" },
              ] as { v: CardVisibility; l: string; d: string }[]
            ).map((o) => (
              <button
                key={o.v}
                onClick={() => setVisibility(o.v)}
                className={cn(
                  "border px-3 py-2 text-left transition",
                  visibility === o.v
                    ? "border-[#6c5ce7] bg-[#6c5ce7]/20"
                    : "border-white/10 bg-white/3 hover:bg-white/6",
                )}
              >
                <span className="block text-[13px] font-bold text-white">
                  {o.l}
                </span>
                <span className="block text-[11px] text-white/45">{o.d}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* 액션 */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-[12px] text-white/35">
          {canSubmit ? "게시할 준비가 됐어요" : "①과 ⑤는 10자 이상 필요해요"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="square"
            onClick={() => {
              localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify({ title, moment, opponent, opponentLogic, why, interestId }),
              );
              toast("임시 저장했어요");
            }}
          >
            임시 저장
          </Button>
          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={() => {
              if (!hasOpponent) setWarnOpen(true);
              else doSubmit();
            }}
          >
            게시하기 →
          </Button>
        </div>
      </div>

      {/* ④ 미입력 경고 */}
      <Modal
        open={warnOpen}
        onClose={() => setWarnOpen(false)}
        title="⚠️ 반대 관점이 비어 있어요"
        footer={
          <>
            <Button variant="square" onClick={() => setWarnOpen(false)}>
              돌아가서 채우기
            </Button>
            <Button
              variant="pillGhost"
              onClick={() => {
                setWarnOpen(false);
                doSubmit();
              }}
            >
              그냥 게시하기
            </Button>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-white/70">
          ④번 칸 <b className="text-white">&ldquo;반대편에서 보면&rdquo;</b>이
          비어 있습니다.
        </p>
        <p className="mt-3 border-l-2 border-[#fbbf24] bg-[#fbbf24]/8 py-2.5 pl-3 text-[13px] leading-relaxed text-white/60">
          반대 입장을 쓸 수 없다면 아직 문제가 아니라 <b>확신</b>일 수 있어요.
          <br />
          한 번만 더 생각해 볼까요?
        </p>
      </Modal>

      {/* 책 검색 */}
      <Modal
        open={bookPicker}
        onClose={() => setBookPicker(false)}
        title="📚 책 찾기"
        width={560}
      >
        <div className="max-h-[55vh] space-y-2 overflow-y-auto">
          {BOOKS.filter((b) => b.interests.includes(interestId)).length ===
            0 && (
            <p className="py-6 text-center text-[13px] text-white/40">
              이 관심사의 등록 도서가 없어요. 아래에서 다른 책을 골라도 됩니다.
            </p>
          )}
          {[
            ...BOOKS.filter((b) => b.interests.includes(interestId)),
            ...BOOKS.filter((b) => !b.interests.includes(interestId)),
          ].map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setBookTitle(b.title);
                setBookQuestion(b.questions[0] ?? "");
                setBookPicker(false);
                toast(`《${b.title}》을(를) 선택했어요`);
              }}
              className="flex w-full items-center gap-3 border border-white/8 bg-white/3 p-3 text-left transition hover:border-white/20 hover:bg-white/6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white/6 text-xl">
                {b.cover}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold text-white">
                  {b.title}
                </span>
                <span className="block truncate text-[12px] text-white/45">
                  {b.author} · {b.grade} · {b.level}
                </span>
              </span>
              {b.interests.includes(interestId) && (
                <Badge color={interestColor(interestId)}>
                  {getInterest(interestId)?.emoji} 추천
                </Badge>
              )}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

export default function NewCardPage() {
  return (
    <Suspense fallback={null}>
      <NewCardInner />
    </Suspense>
  );
}
