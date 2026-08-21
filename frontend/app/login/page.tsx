"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Panel, toast, cn } from "@/components/ui";
import { login, loginAsSeed } from "@/lib/store";
import { useCurrentUser, useMounted } from "@/lib/useStore";
import type { UserRole } from "@/lib/types";

type Provider = "kakao" | "google";
type Step = "provider" | "role";

const PROVIDER_LABEL: Record<Provider, string> = {
  kakao: "카카오",
  google: "구글",
};

const ROLE_CARDS: {
  role: UserRole;
  emoji: string;
  title: string;
  desc: string;
  next: string;
  color: string;
  defaultName: string;
}[] = [
  {
    role: "leader",
    emoji: "👩‍🏫",
    title: "독서 지도자",
    desc: "학교 독서반·동아리를 운영합니다",
    next: "/groups/new",
    color: "#6c5ce7",
    defaultName: "새 지도자",
  },
  {
    role: "member",
    emoji: "🙂",
    title: "학생 · 멤버",
    desc: "초대 코드를 받았어요",
    next: "/groups/join",
    color: "#06b6d4",
    defaultName: "새 멤버",
  },
];

const DEMO_ACCOUNTS = [
  {
    id: "u-leader",
    emoji: "👩‍🏫",
    name: "이지현",
    role: "지도자",
    note: "대시보드·미제출 관리",
  },
  {
    id: "u-01",
    emoji: "🧑",
    name: "김민준",
    role: "학생",
    note: "카드 작성·반증 참여",
  },
  {
    id: "u-02",
    emoji: "👦",
    name: "박서준",
    role: "미제출 학생",
    note: "독려 알림 받는 쪽",
  },
];

export default function LoginPage() {
  const mounted = useMounted();
  const user = useCurrentUser();
  const router = useRouter();

  const [step, setStep] = useState<Step>("provider");
  const [provider, setProvider] = useState<Provider>("kakao");
  const [selectedRole, setSelectedRole] = useState<UserRole>("leader");
  const [name, setName] = useState("");

  // 이미 로그인 상태면 홈으로
  useEffect(() => {
    if (mounted && user) router.replace("/");
  }, [mounted, user, router]);

  function pickProvider(p: Provider) {
    setProvider(p);
    setStep("role");
  }

  function submit(role: UserRole) {
    const card = ROLE_CARDS.find((c) => c.role === role)!;
    const finalName = name.trim() || card.defaultName;
    login(finalName, role, provider);
    toast(`${finalName}님, 환영합니다`);
    router.push(card.next);
  }

  function demoLogin(userId: string, label: string) {
    loginAsSeed(userId);
    toast(`${label} 계정으로 둘러보는 중`);
    router.push("/groups/g-hanbit");
  }

  const activeCard = ROLE_CARDS.find((c) => c.role === selectedRole)!;

  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-14">
      {/* 앰비언트 블롭 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(rgba(139,92,246,.16) 0%, rgba(99,102,241,.08) 45%, transparent 75%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-24 h-[380px] w-[380px] rounded-full blur-[130px]"
          style={{
            background: "radial-gradient(rgba(96,165,250,.10) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* 로고 */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grad-brand flex h-11 w-11 items-center justify-center rounded-[16px] text-[20px] shadow-[0_0_24px_rgba(108,92,231,0.55)]">
              📖
            </span>
            <span className="text-[24px] leading-none font-bold tracking-[-0.5px] text-white">
              ReadingClue
            </span>
          </Link>
          <p className="mt-4 text-[26px] leading-tight font-extrabold text-white">
            3초 만에 시작하세요
          </p>
          <p className="mt-2 text-[14px] text-white/45">
            가입 절차 없이 소셜 계정으로 바로 입장합니다
          </p>
        </div>

        {/* ── STEP 1 : 소셜 로그인 ── */}
        {step === "provider" && (
          <div className="animate-fade-up flex flex-col gap-3">
            <button
              onClick={() => pickProvider("kakao")}
              className="btn w-full rounded-[20px] px-6 py-4 text-[16px] font-bold transition hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "#FEE500", color: "#181600" }}
            >
              <span className="text-[18px]">💬</span> 카카오로 시작하기
            </button>
            <button
              onClick={() => pickProvider("google")}
              className="btn w-full rounded-[20px] border border-black/10 bg-white px-6 py-4 text-[16px] font-bold text-[#1f1f1f] transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-[18px] font-extrabold text-[#4285F4]">G</span>{" "}
              구글로 시작하기
            </button>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-white/35">
              가입 시 이용약관·개인정보처리방침에 동의하는 것으로 간주됩니다.
              <br />
              14세 미만은 보호자 동의가 필요합니다.
            </p>
          </div>
        )}

        {/* ── STEP 2 : 역할 선택 ── */}
        {step === "role" && (
          <div className="animate-fade-up">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow">Step 2 · {PROVIDER_LABEL[provider]} 계정</p>
                <h2 className="mt-1 text-[20px] font-extrabold text-white">
                  어떤 분이신가요?
                </h2>
              </div>
              <button
                onClick={() => setStep("provider")}
                className="shrink-0 text-[13px] font-semibold text-white/40 transition hover:text-white"
              >
                ← 뒤로
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {ROLE_CARDS.map((c) => {
                const on = c.role === selectedRole;
                return (
                  <button
                    key={c.role}
                    onClick={() => setSelectedRole(c.role)}
                    className={cn(
                      "flex items-center gap-4 rounded-[16px] border px-5 py-4 text-left transition",
                      on ? "scale-[1.01]" : "hover:bg-white/6",
                    )}
                    style={{
                      background: on ? `${c.color}1f` : "rgba(255,255,255,.03)",
                      borderColor: on ? `${c.color}80` : "rgba(255,255,255,.1)",
                    }}
                  >
                    <span className="text-[28px] leading-none">{c.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-bold text-white">
                        {c.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-white/50">
                        {c.desc}
                      </span>
                    </span>
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold"
                      style={{
                        borderColor: on ? c.color : "rgba(255,255,255,.2)",
                        background: on ? c.color : "transparent",
                        color: "#fff",
                      }}
                    >
                      {on ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 이름 입력 */}
            <div className="mt-5">
              <label
                htmlFor="login-name"
                className="mb-1.5 block text-[13px] font-bold text-white/85"
              >
                이름{" "}
                <span className="font-medium text-white/35">(선택)</span>
              </label>
              <input
                id="login-name"
                className="input-rc"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={activeCard.defaultName}
                maxLength={20}
              />
              <p className="mt-1.5 text-[12px] text-white/35">
                비워두면 &lsquo;{activeCard.defaultName}&rsquo;으로 시작합니다.
                나중에 바꿀 수 있어요.
              </p>
            </div>

            <Button
              variant="primary"
              className="mt-5 w-full"
              onClick={() => submit(selectedRole)}
            >
              {activeCard.emoji} {activeCard.title}(으)로 시작하기 →
            </Button>

            <p className="mt-4 text-center text-[12px] leading-relaxed text-white/35">
              가입 시 이용약관·개인정보처리방침에 동의하는 것으로 간주됩니다.
              <br />
              14세 미만은 보호자 동의가 필요합니다.
            </p>
          </div>
        )}

        {/* ── 데모 계정 ── */}
        <Panel className="mt-8 p-4">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <p className="text-[13px] font-bold text-white/85">
              🎬 데모로 둘러보기
            </p>
            <span className="text-[11px] text-white/30">가입 없이 즉시 입장</span>
          </div>

          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((d) => (
              <button
                key={d.id}
                onClick={() => demoLogin(d.id, d.name)}
                className="flex items-center gap-3 border border-white/8 bg-white/4 px-3.5 py-2.5 text-left transition hover:border-white/20 hover:bg-white/8"
              >
                <span className="text-[18px] leading-none">{d.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-white">
                    {d.name}{" "}
                    <span className="font-semibold text-white/45">
                      ({d.role})
                    </span>
                  </span>
                  <span className="block text-[11px] text-white/35">{d.note}</span>
                </span>
                <span className="shrink-0 text-[11px] text-white/25">→</span>
              </button>
            ))}
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-white/30">
            한빛중 2학년 독서반(7주차) 데이터로 바로 들어갑니다.
          </p>
        </Panel>

        <p className="mt-6 text-center text-[13px] text-white/35">
          ReadingClue가 처음이신가요?{" "}
          <Link
            href="/about"
            className="font-semibold text-[#a29bfe] transition hover:text-white"
          >
            소개 보기 →
          </Link>
        </p>
      </div>
    </div>
  );
}
