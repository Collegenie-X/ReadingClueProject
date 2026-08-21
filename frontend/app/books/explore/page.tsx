"use client";

/** P07 — 책·주제 탐색 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Modal,
  Panel,
  PanelHeader,
  cn,
  toast,
} from "@/components/ui";
import {
  BOOKS,
  INTERESTS,
  booksByInterest,
  getInterest,
  interestColor,
  interestLabel,
} from "@/lib/data";
import {
  getCipResult,
  myGroups,
  mySelectedBookId,
  selectBook,
  submitMission,
} from "@/lib/store";
import { useCurrentUser, useMounted, useStoreVersion } from "@/lib/useStore";
import type { Book } from "@/lib/types";

const GRADES = ["초등", "중등", "고등", "전체"];
const LEVELS = ["쉬움", "보통", "어려움"];

/** 질문별 더미 반응 수 — 문자열 해시로 결정 (하이드레이션 안전) */
function dummyStat(seed: string, i: number) {
  let h = 0;
  for (let k = 0; k < seed.length; k += 1) {
    h = (h * 31 + seed.charCodeAt(k)) % 997;
  }
  return { agree: 12 + ((h + i * 17) % 42), rebut: 3 + ((h + i * 29) % 19) };
}

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
        className="input-rc cursor-pointer sm:w-[170px]"
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

export default function BookExplorePage() {
  const mounted = useMounted();
  useStoreVersion();
  const user = useCurrentUser();
  const router = useRouter();

  const [interest, setInterest] = useState("all");
  const [grade, setGrade] = useState("all");
  const [level, setLevel] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [cipApplied, setCipApplied] = useState(false);

  // 진단 결과가 있으면 1순위 관심사를 기본 필터로
  useEffect(() => {
    if (!mounted || cipApplied) return;
    setCipApplied(true);
    const top = getCipResult()?.top3?.[0];
    if (top) setInterest(String(top));
  }, [mounted, cipApplied]);

  const selectedBookId = mounted ? mySelectedBookId() : null;
  const interestId = interest === "all" ? null : Number(interest);

  const list = useMemo(() => {
    const base = interestId === null ? BOOKS : booksByInterest(interestId);
    return base.filter((b) => {
      if (grade !== "all" && b.grade !== grade) return false;
      if (level !== "all" && b.level !== level) return false;
      return true;
    });
  }, [interestId, grade, level]);

  const interestBookCount = interestId === null ? 0 : booksByInterest(interestId).length;
  const opened = BOOKS.find((b) => b.id === openId) ?? null;

  function handleSelect(book: Book) {
    if (!user) {
      toast("로그인하면 책을 고를 수 있어요");
      router.push("/login");
      return;
    }
    selectBook(book.id);
    toast(`《${book.title}》을(를) 선택했어요`);
    const gs = myGroups();
    if (gs.length > 0) {
      submitMission(gs[0].id, 2, "책 선택 완료");
    }
    setOpenId(null);
  }

  return (
    <div className="bg-black">
      {/* ═══════════ 히어로 ═══════════ */}
      <section className="border-b border-white/8 bg-[linear-gradient(135deg,rgba(59,130,246,.14)_0%,rgba(108,92,231,.09)_55%,rgba(0,0,0,0)_100%)]">
        <div className="shell py-12 md:py-14">
          <p className="eyebrow">Book Explorer</p>
          <h1 className="mt-2 text-[30px] leading-[1.15] font-extrabold tracking-[-1px] text-white sm:text-[38px]">
            📚 책·주제 탐색
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/55">
            내 관심사에서 시작하는 책 고르기. 줄거리보다 먼저{" "}
            <span className="font-bold text-white">
              이 책이 던지는 질문
            </span>
            을 보고 고르세요.
          </p>
        </div>
      </section>

      <div className="shell space-y-8 py-8 md:py-10">
        {/* ═══════════ 필터 ═══════════ */}
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
              label="학교급"
              value={grade}
              onChange={setGrade}
              options={[
                { value: "all", label: "전체" },
                ...GRADES.map((g) => ({ value: g, label: g })),
              ]}
            />
            <FilterSelect
              label="난이도"
              value={level}
              onChange={setLevel}
              options={[
                { value: "all", label: "전체" },
                ...LEVELS.map((l) => ({ value: l, label: l })),
              ]}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3">
            {interestId !== null ? (
              <p className="text-[13px] font-bold text-white">
                <span style={{ color: interestColor(interestId) }}>
                  {getInterest(interestId)?.emoji} {interestLabel(interestId)}
                </span>{" "}
                — 추천 도서 {interestBookCount}권
              </p>
            ) : (
              <p className="text-[13px] font-bold text-white">
                전체 도서 {list.length}권
              </p>
            )}
            <button
              onClick={() => {
                setInterest("all");
                setGrade("all");
                setLevel("all");
              }}
              className="text-[12px] font-semibold text-white/40 transition hover:text-white"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* ═══════════ 책 그리드 ═══════════ */}
        {list.length === 0 ? (
          <div className="rounded-[16px] border border-white/10 bg-white/3">
            <EmptyState
              icon="📭"
              title="이 관심사에 등록된 책이 아직 없어요"
              desc="아직 아무도 이 주제의 책을 올리지 않았어요. 직접 등록해 보세요."
              action={
                <>
                  <Button variant="pill" onClick={() => setAddOpen(true)}>
                    📕 책 직접 등록
                  </Button>
                  <Button
                    variant="pillGhost"
                    onClick={() => {
                      setInterest("all");
                      setGrade("all");
                      setLevel("all");
                    }}
                  >
                    필터 초기화
                  </Button>
                </>
              }
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => {
              const mine = selectedBookId === b.id;
              const color = interestColor(b.interests[0] ?? 0);
              return (
                <div
                  key={b.id}
                  className={cn(
                    "flex flex-col rounded-[16px] border p-4 transition duration-300 hover:-translate-y-1.5",
                    mine
                      ? "border-[#22c55e]/55 bg-[#22c55e]/8"
                      : "border-white/10 bg-white/3 hover:border-white/20",
                  )}
                >
                  <button
                    onClick={() => setOpenId(b.id)}
                    className="flex flex-1 flex-col text-left"
                  >
                    <div
                      className="flex h-[110px] w-full items-center justify-center rounded-[16px] border border-white/10 text-[48px]"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${color}33 0%, ${color}0d 100%)`,
                      }}
                    >
                      {b.cover}
                    </div>

                    {mine && (
                      <span className="mt-3 inline-flex self-start border border-[#22c55e]/45 bg-[#22c55e]/15 px-2 py-0.5 text-[11px] font-bold text-[#22c55e]">
                        ✅ 내가 고른 책
                      </span>
                    )}

                    <h3 className="mt-3 text-[16px] leading-snug font-bold text-white">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-white/45">
                      {b.author} · {b.publisher}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge color="#3b82f6">{b.grade}</Badge>
                      <Badge color="#fbbf24">{b.level}</Badge>
                      {b.interests[0] !== undefined && (
                        <Badge color={color}>
                          {getInterest(b.interests[0])?.emoji}{" "}
                          {interestLabel(b.interests[0])}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-3 text-[12px] text-white/40">
                      👥 읽은 사람 {b.readerCount}명
                    </p>
                  </button>

                  <Button
                    variant={mine ? "square" : "pill"}
                    className="mt-4 w-full"
                    onClick={() => handleSelect(b)}
                  >
                    {mine ? "✅ 선택됨" : "이 책 선택"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════ 도서관 연동 안내 ═══════════ */}
        <Panel>
          <PanelHeader
            title="🏫 우리 학교 도서관에 있나요?"
            desc="학교·공공 도서관 소장 조회 연동을 준비하고 있어요."
          />
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-white/55">
              연동이 켜지면 고른 책이 학교 도서관에 있는지, 대출 중인지 바로
              확인할 수 있습니다. 없으면 희망도서로 신청하는 흐름까지 이어집니다.
            </p>
            <Button
              variant="pillGhost"
              className="shrink-0 self-start sm:self-auto"
              onClick={() => toast("도서관 연동은 준비 중입니다")}
            >
              소장 여부 확인
            </Button>
          </div>
        </Panel>

        {/* ═══════════ 직접 등록 유도 ═══════════ */}
        <div className="flex flex-col items-center gap-3 rounded-[16px] border border-white/10 bg-white/3 px-5 py-8 text-center">
          <p className="text-[15px] font-bold text-white">
            찾는 책이 목록에 없나요?
          </p>
          <p className="max-w-md text-[13px] leading-relaxed text-white/45">
            직접 등록하면 같은 관심사 친구들에게도 추천 목록으로 보입니다.
          </p>
          <Button variant="pillGhost" onClick={() => setAddOpen(true)}>
            📕 책 직접 등록
          </Button>
        </div>
      </div>

      {/* ═══════════ 책 상세 모달 ═══════════ */}
      <Modal
        open={!!opened}
        onClose={() => setOpenId(null)}
        title={opened ? `${opened.cover} ${opened.title}` : ""}
        width={560}
        footer={
          opened ? (
            <>
              <Button
                variant="square"
                onClick={() => router.push(`/cards/new?book=${opened.id}`)}
              >
                ✏️ 이 질문으로 카드 쓰기
              </Button>
              <Button variant="pill" onClick={() => handleSelect(opened)}>
                {selectedBookId === opened.id ? "✅ 선택됨" : "이 책 선택"}
              </Button>
            </>
          ) : undefined
        }
      >
        {opened && (
          <div>
            <p className="text-[13px] text-white/45">
              {opened.author} · {opened.publisher}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <Badge color="#3b82f6">{opened.grade}</Badge>
              <Badge color="#fbbf24">{opened.level}</Badge>
              {opened.interests.map((iid) => (
                <Badge key={iid} color={interestColor(iid)}>
                  {getInterest(iid)?.emoji} {interestLabel(iid)}
                </Badge>
              ))}
            </div>

            <p className="mt-4 text-[14px] leading-relaxed text-white/80">
              {opened.summary}
            </p>
            <p className="mt-3 text-[12px] text-white/40">
              👥 읽은 사람 {opened.readerCount}명
            </p>

            <p className="mt-5 mb-2 text-[13px] font-bold text-white">
              💬 이 책에서 나온 질문들
            </p>
            <ul className="divide-y divide-white/6 border border-white/8">
              {opened.questions.map((q, i) => {
                const st = dummyStat(opened.id + q, i);
                return (
                  <li
                    key={q}
                    className="flex items-center gap-3 bg-white/2 px-3 py-2.5"
                  >
                    <span className="min-w-0 flex-1 text-[13px] leading-snug text-white/80">
                      🔍 {q}
                    </span>
                    <span className="shrink-0 text-[12px] font-bold text-[#22c55e]">
                      🤝 {st.agree}
                    </span>
                    <span className="shrink-0 text-[12px] font-bold text-[#ef4444]">
                      ⚔️ {st.rebut}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 border-l-2 border-white/15 pl-3 text-[12px] leading-relaxed text-white/40">
              책을 고르면 주 2 미션(책 선택)이 자동으로 완료됩니다.
            </p>
          </div>
        )}
      </Modal>

      {/* ═══════════ 책 직접 등록 모달 ═══════════ */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="📕 책 직접 등록"
        footer={
          <>
            <Button variant="square" onClick={() => setAddOpen(false)}>
              취소
            </Button>
            <Button
              variant="pill"
              disabled={!newTitle.trim()}
              onClick={() => {
                toast(`《${newTitle.trim()}》 등록 요청을 보냈어요`);
                setAddOpen(false);
                setNewTitle("");
                setNewAuthor("");
              }}
            >
              등록 요청
            </Button>
          </>
        }
      >
        <Field label="책 제목" required>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="예) 공정하다는 착각의 뒷면"
            className="input-rc"
          />
        </Field>
        <Field label="저자">
          <input
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="예) 정하윤"
            className="input-rc"
          />
        </Field>
        <p className="text-[12px] leading-relaxed text-white/40">
          등록 요청한 책은 검토 후 추천 목록에 반영됩니다.
        </p>
      </Modal>
    </div>
  );
}
