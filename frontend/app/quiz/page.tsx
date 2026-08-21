"use client";

/** P05 — 관심사 진단 (30문항 · 한 문항씩) */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Modal,
  Panel,
  ProgressBar,
  Skeleton,
  cn,
  toast,
} from "@/components/ui";
import { QUIZ_QUESTIONS } from "@/lib/data";
import { getQuizProgress, saveCipResult, saveQuizProgress } from "@/lib/store";
import { useCurrentUser, useMounted } from "@/lib/useStore";

const TOTAL = QUIZ_QUESTIONS.length;
/** 이 문항 번호(1-based)에 도달하면 로그인을 요구한다 */
const LOGIN_GATE_AT = 6;

export default function QuizPage() {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [idx, setIdx] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const gateShown = useRef(false);
  const restored = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const q = QUIZ_QUESTIONS[idx];
  const chosen = q ? answers[q.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const isLast = idx === TOTAL - 1;

  // ── 이어서 하기 복원 ──────────────────────
  useEffect(() => {
    if (!mounted || restored.current) return;
    restored.current = true;

    const saved = getQuizProgress();
    const count = Object.keys(saved).length;
    if (count === 0) return;

    setAnswers(saved);
    const nextIdx = QUIZ_QUESTIONS.findIndex(
      (question) => saved[question.id] === undefined,
    );
    setIdx(nextIdx === -1 ? TOTAL - 1 : nextIdx);
    toast(`이어서 하기 — ${count}개 응답을 불러왔어요`);
  }, [mounted]);

  // ── 비로그인 게이트 ───────────────────────
  useEffect(() => {
    if (!mounted || user) return;
    if (idx + 1 < LOGIN_GATE_AT) return;
    if (gateShown.current) return;
    gateShown.current = true;
    setGateOpen(true);
  }, [mounted, user, idx]);

  // 타이머 정리
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const goNext = useCallback(() => {
    setIdx((prev) => Math.min(prev + 1, TOTAL - 1));
  }, []);

  const goPrev = useCallback(() => {
    setIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  const pick = useCallback(
    (optionIdx: number) => {
      if (!q) return;
      const next = { ...answers, [q.id]: optionIdx };
      setAnswers(next);
      saveQuizProgress(next); // 매 응답마다 자동 저장

      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      if (isLast) return; // 마지막 문항은 자동 이동하지 않는다
      // 선택을 인지할 수 있도록 300ms 뒤 다음 문항으로
      advanceTimer.current = setTimeout(() => goNext(), 300);
    },
    [answers, q, isLast, goNext],
  );

  const saveAndExit = useCallback(() => {
    saveQuizProgress(answers);
    toast("진행 상황을 저장했어요. 언제든 이어서 할 수 있어요.");
    router.push("/");
  }, [answers, router]);

  const finish = useCallback(() => {
    if (!user) {
      setGateOpen(true);
      return;
    }
    setCalculating(true);
  }, [user]);

  // ── 계산 중 3초 → 결과 페이지 ──────────────
  useEffect(() => {
    if (!calculating) return;
    const t = setTimeout(() => {
      saveCipResult(answers);
      router.push("/quiz/result");
    }, 3000);
    return () => clearTimeout(t);
  }, [calculating, answers, router]);

  // ── 하이드레이션 전 스켈레톤 ───────────────
  if (!mounted) {
    return (
      <div className="shell py-8">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <div className="mt-6 flex flex-col gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[62px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (calculating) return <CalculatingView />;

  return (
    <div className="shell py-6 sm:py-8">
      <div className="mx-auto max-w-[760px]">
        {/* ── 상단: 진행률 ── */}
        <div className="panel px-4 py-3.5 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Badge color="#6c5ce7">🧭 관심사 진단</Badge>
              <span className="shrink-0 text-[13px] font-extrabold text-white">
                {idx + 1}
                <span className="text-white/35"> / {TOTAL}</span>
              </span>
            </div>
            <Button variant="square" onClick={saveAndExit} className="shrink-0">
              저장하고 나가기
            </Button>
          </div>

          <ProgressBar value={idx + 1} total={TOTAL} className="mt-3" />

          <p className="mt-2 text-[11px] text-white/35">
            응답 {answeredCount}개 · 남은 문항 {Math.max(TOTAL - answeredCount, 0)}개
            · 자동 저장됨
          </p>
        </div>

        {/* ── 문항 ── */}
        {q && (
          <div key={q.id} className="animate-fade-up mt-5">
            <p className="text-[13px] font-extrabold tracking-[1px] text-[#a29bfe]">
              Q{idx + 1}.
            </p>
            <h1 className="mt-2 text-[20px] leading-[1.35] font-extrabold tracking-[-0.5px] text-white sm:text-[24px]">
              {q.question}
            </h1>

            {/* ── 선택지 ── */}
            <div className="mt-5 flex flex-col gap-2.5">
              {q.options.map((opt, i) => {
                const on = chosen === i;
                return (
                  <button
                    key={`${q.id}-${i}`}
                    onClick={() => pick(i)}
                    className={cn(
                      "panel flex w-full items-center gap-3 px-4 py-4 text-left transition active:scale-[0.995]",
                      on
                        ? "text-white"
                        : "text-white/75 hover:border-white/25 hover:bg-white/6",
                    )}
                    style={
                      on
                        ? {
                            borderColor: "#6c5ce7",
                            background: "rgba(108,92,231,0.14)",
                            boxShadow: "0 6px 24px rgba(108,92,231,0.22)",
                          }
                        : undefined
                    }
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center border text-[12px] font-extrabold transition",
                        on
                          ? "border-transparent text-white"
                          : "border-white/12 bg-white/5 text-white/45",
                      )}
                      style={
                        on
                          ? {
                              backgroundImage:
                                "linear-gradient(135deg, #6c5ce7, #a855f7)",
                            }
                          : undefined
                      }
                    >
                      {on ? "✓" : i + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[14px] leading-relaxed font-semibold sm:text-[15px]">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 하단 네비 ── */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="pillGhost"
            onClick={goPrev}
            disabled={idx === 0}
            className="shrink-0"
          >
            ← 이전
          </Button>

          {isLast ? (
            <Button
              variant="pill"
              onClick={finish}
              disabled={chosen === undefined}
              className="shrink-0"
            >
              결과 보기 →
            </Button>
          ) : (
            <Button
              variant="pill"
              onClick={goNext}
              disabled={chosen === undefined}
              className="shrink-0"
            >
              다음 →
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-white/35">
          💡 정답은 없습니다. 지금 떠오르는 대로 고르세요.
        </p>
      </div>

      {/* ── 로그인 게이트 ── */}
      <Modal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title="🔒 잠깐, 로그인이 필요해요"
        footer={
          <>
            <Button variant="square" onClick={() => setGateOpen(false)}>
              나중에 하기
            </Button>
            <Button
              variant="pill"
              onClick={() => {
                saveQuizProgress(answers);
                router.push("/login");
              }}
            >
              로그인하러 가기 →
            </Button>
          </>
        }
      >
        <p className="text-[14px] leading-relaxed text-white/70">
          결과를 보려면 로그인이 필요해요. 지금까지의 응답은 저장돼 있으니,
          로그인 후 이어서 진행하면 됩니다.
        </p>
        <Panel className="mt-4 px-4 py-3">
          <p className="text-[12px] text-white/45">
            현재 응답 <span className="font-extrabold text-white">{answeredCount}개</span> ·{" "}
            {TOTAL}문항 중 {idx + 1}번째 문항
          </p>
        </Panel>
      </Modal>
    </div>
  );
}

/** 결과 계산 중 화면 */
function CalculatingView() {
  const [step, setStep] = useState(0);
  const steps = [
    "응답을 정리하고 있어요",
    "50개 관심사 점수를 매기고 있어요",
    "6개 영역 분포를 계산하고 있어요",
  ];

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % 3), 950);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="animate-float flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/12 bg-white/5 text-4xl">
        🧭
      </div>

      <h1 className="mt-7 text-[20px] font-extrabold tracking-[-0.5px] text-white sm:text-[24px]">
        관심사를 계산하고 있어요...
      </h1>
      <p className="mt-2 text-[13px] text-white/45">{steps[step]}</p>

      <div className="mt-7 flex w-full max-w-[320px] gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 transition-all duration-500",
              i <= step ? "grad-brand" : "bg-white/8",
            )}
          />
        ))}
      </div>

      <div className="mt-8 flex gap-2">
        {["🪞", "🤝", "🧠", "🌱", "🌍", "🚀"].map((e, i) => (
          <span
            key={e}
            className="animate-twinkle text-xl"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            {e}
          </span>
        ))}
      </div>

      <p className="mt-8 text-[12px] text-white/30">
        잠시만 기다려 주세요 · 곧 결과를 보여드릴게요
      </p>
    </div>
  );
}
