"use client";

import { useState } from "react";
import StarField from "@/components/StarField";
import { Button, Badge, Panel, cn } from "@/components/ui";
import { MISSIONS } from "@/lib/data";

// ── 섹션 1 : 3단계 ─────────────────────────
const START_STEPS = [
  {
    n: "①",
    title: "그룹 만들기",
    min: "2분",
    desc: "그룹 이름·인원만 정하면 끝납니다. 로드맵은 4주 집중이 기본이고, 크루 배정은 관심사 진단 자동으로 두면 됩니다.",
    detail: "필요한 입력값 5개 · 커리큘럼 설계 불필요",
    color: "#6c5ce7",
  },
  {
    n: "②",
    title: "초대 코드 공유",
    min: "1분",
    desc: "READ-XXX-00 형태의 코드가 자동 생성됩니다. 학급 단톡방이나 학교 알림장에 그대로 붙여넣으세요.",
    detail: "학생은 코드 입력 한 번으로 합류",
    color: "#a855f7",
  },
  {
    n: "③",
    title: "대시보드 확인",
    min: "2분",
    desc: "학생들이 진단을 마치면 관심사 크루가 자동으로 묶입니다. 지도자는 진행률만 보면 됩니다.",
    detail: "누가 어디까지 왔는지 한 화면에",
    color: "#06b6d4",
  },
];

// ── 섹션 2 : 주간 10분 ─────────────────────
const WEEKLY_TASKS = [
  {
    icon: "📊",
    title: "진행률 확인",
    min: "2분",
    desc: "이번 주 미션을 몇 명이 끝냈는지 대시보드 상단에서 확인합니다.",
  },
  {
    icon: "🔔",
    title: "미제출자 독려 알림",
    min: "3분",
    desc: "미제출 명단이 자동으로 뜹니다. 버튼 한 번으로 독려 알림을 보냅니다.",
  },
  {
    icon: "⭐",
    title: "우수 카드 하이라이트",
    min: "2분",
    desc: "이번 주 반응이 많은 문제 카드 하나를 골라 그룹 상단에 고정합니다.",
  },
  {
    icon: "📋",
    title: "다음 주 미션 확인",
    min: "1분",
    desc: "로드맵이 다음 주에 무엇을 요구하는지 미리 훑어봅니다.",
  },
  {
    icon: "🛟",
    title: "질문·신고 처리",
    min: "2분",
    desc: "학생 질문과 부적절한 반응 신고를 확인하고 처리합니다.",
  },
];

// ── 섹션 3 : 3막 ───────────────────────────
const ACTS = [
  {
    act: 1,
    label: "1막",
    title: "문제 제기",
    range: "1~3주",
    color: "#fbbf24",
    desc: "관심사에서 출발해 내 문제 카드 한 장을 만드는 구간입니다.",
    note: null as string | null,
  },
  {
    act: 2,
    label: "2막",
    title: "심화 · 검증",
    range: "2~3주",
    color: "#22c55e",
    desc: "질문을 놓고 제대로 붙어 보고, 반론을 받아쳐 살아남은 것만 정의서로 만듭니다.",
    note: "← 여기까지만 해도 완주",
  },
  {
    act: 3,
    label: "3막",
    title: "프로젝트",
    range: "4주",
    color: "#06b6d4",
    desc: "정의서를 기획안으로 옮깁니다. 유저 시나리오까지 적고 발표해 팀원을 모읍니다.",
    note: "선택",
  },
];

// ── 섹션 4 : FAQ ───────────────────────────
const FAQS = [
  {
    q: "SMILE 수업을 이미 하고 있는데 이중 부담 아닌가요?",
    a: "추가가 아니라 확장입니다. 기존 SMILE 수업의 I·L·E 단계에 세션을 씌우면 됩니다.",
  },
  {
    q: "프로젝트까지 안 가면 실패인가요?",
    a: "아닙니다. 8주 정의 트랙까지만 해도 SMILE 완주 + 반증 경험이라는 성과가 있습니다. 프로젝트는 선택입니다.",
  },
  {
    q: "학생들이 반증을 받아들일 수 있나요?",
    a: "반증 규칙 5가지가 보호장치입니다. '인격이 아니라 논증을 반박한다', 발표자는 '기록만 하면 된다'는 규칙이 안전망이 됩니다.",
  },
  {
    q: "혼자 운영할 수 있나요?",
    a: "가능합니다. 시스템이 로드맵을 진행합니다. 학생 15명 이상이면 크루장을 지정하면 더 원활합니다.",
  },
  {
    q: "독서지도사 자격증이 필요한가요?",
    a: "별도 자격은 필요 없습니다. 기존 독서 교육 경험이 있으면 바로 시작할 수 있습니다.",
  },
];

export default function GuidePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-black">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <StarField />
        <div className="shell relative z-10 text-center">
          <p className="eyebrow">For Reading Leaders</p>
          <h1 className="mt-3 text-[34px] leading-[1.15] font-extrabold tracking-[-1px] text-white sm:text-[44px] md:text-[52px]">
            준비물은 <span className="grad-text">초대 코드 하나</span>입니다
          </h1>
          <p className="mt-5 text-[16px] leading-relaxed text-white/55 md:text-[18px]">
            전문 지식도, 8시간 연수도 필요 없습니다.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-white/40">
            5분이면 학교 독서 그룹이 만들어지고, 그다음부터는 시스템이 4주
            로드맵을 진행합니다. 지도자가 매주 쓰는 시간은 10분입니다.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/groups/new" variant="primary">
              5분 만에 그룹 만들기 →
            </Button>
            <Button href="/about" variant="ghost">
              ReadingClue가 뭔가요?
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════ 1. 시작 3단계 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">Getting started</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              5분 안에 시작하는 <span className="grad-text">3단계</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] text-white/50">
              커리큘럼을 짜지 않습니다. 그룹을 만들고 코드를 뿌리면 됩니다.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {START_STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-[16px] border p-6 transition duration-300 hover:-translate-y-1.5"
                style={{
                  background: `${s.color}14`,
                  borderColor: `${s.color}40`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-[26px] leading-none font-extrabold"
                    style={{ color: s.color }}
                  >
                    {s.n}
                  </span>
                  <Badge color={s.color}>⏱ {s.min}</Badge>
                </div>
                <p className="mt-4 text-[19px] font-bold text-white">{s.title}</p>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/55">
                  {s.desc}
                </p>
                <p className="mt-4 border-t border-white/10 pt-3.5 text-[12px] font-bold text-white/40">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 2. 주간 10분 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="eyebrow">Weekly routine</p>
              <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
                매주 지도자가 할 일:{" "}
                <span className="grad-text">10분</span>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-white/50">
                수업 준비도, 채점도 아닙니다. 학생들이 어디까지 왔는지 보고, 멈춘
                사람을 한 번 두드려주는 것이 전부입니다.
              </p>

              <div className="mt-6 rounded-[16px] border border-white/10 bg-white/4 px-5 py-4">
                <p className="text-[12px] font-bold tracking-wide text-white/40">
                  주간 합계
                </p>
                <p className="mt-1 text-[30px] leading-none font-extrabold text-white">
                  10
                  <span className="ml-1 text-[14px] font-semibold text-white/50">
                    분 / 주
                  </span>
                </p>
                <p className="mt-2 text-[12px] text-white/35">
                  한 시즌(4주) 총 40분이면 됩니다
                </p>
              </div>
            </div>

            <Panel className="overflow-hidden">
              {WEEKLY_TASKS.map((t, i) => (
                <div
                  key={t.title}
                  className={cn(
                    "flex items-start gap-4 px-5 py-4",
                    i !== 0 && "border-t border-white/8",
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/5 text-[16px]">
                    {t.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-white">{t.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/50">
                      {t.desc}
                    </p>
                  </div>
                  <Badge color="#6c5ce7" className="mt-0.5">
                    {t.min}
                  </Badge>
                </div>
              ))}
            </Panel>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. 4주 로드맵 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">Roadmap preview</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              4주 로드맵 미리보기
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/50">
              책 1권으로 4주. 질문을 던지고(1막), 토론과 반론으로 단단해지고(2막),
              기획안으로 옮깁니다(3막).
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {ACTS.map((a) => {
              const missions = MISSIONS.filter((m) => m.act === a.act);
              return (
                <div
                  key={a.act}
                  className="flex flex-col rounded-[16px] border p-5"
                  style={{
                    background: `${a.color}0f`,
                    borderColor: `${a.color}3d`,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-[15px] font-extrabold"
                      style={{ color: a.color }}
                    >
                      {a.label}
                    </span>
                    <span className="text-[17px] font-bold text-white">
                      {a.title}
                    </span>
                    <Badge color={a.color}>{a.range}</Badge>
                    {a.note && (
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: a.color }}
                      >
                        {a.note}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-white/50">
                    {a.desc}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2.5">
                    {missions.map((m) => (
                      <li
                        key={m.week}
                        className="flex items-start gap-3 border border-white/8 bg-white/4 px-3.5 py-2.5"
                      >
                        <span
                          className="mt-0.5 shrink-0 text-[11px] font-extrabold"
                          style={{ color: a.color }}
                        >
                          {m.week}주
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-bold text-white">
                            {m.title}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-white/40">
                            {m.smile.join("·")} · 약 {m.estimatedMin}분
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] leading-relaxed text-white/40">
            3주차 문제 정의서까지만 해도 완주로 인정합니다. 4주차 기획안은 더 해
            보고 싶은 크루를 위한 구간이고, 다음 시즌으로 넘겨도 됩니다.
          </p>
        </div>
      </section>

      {/* ═══════════ 4. FAQ ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell max-w-3xl">
          <div className="text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              자주 묻는 질문
            </h2>
          </div>

          <div className="mt-9 flex flex-col gap-2.5">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={f.q}
                  className={cn(
                    "rounded-[16px] border transition",
                    open
                      ? "border-[#6c5ce7]/50 bg-[#6c5ce7]/10"
                      : "border-white/10 bg-white/3",
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-[13px] font-extrabold text-[#a29bfe]">
                      Q{i + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[15px] leading-snug font-bold text-white">
                      {f.q}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-[12px] text-white/40 transition-transform duration-200",
                        open && "rotate-180",
                      )}
                    >
                      ▼
                    </span>
                  </button>
                  {open && (
                    <p className="animate-fade-up border-t border-white/10 px-5 py-4 text-[14px] leading-relaxed text-white/60">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ STICKY CTA ═══════════ */}
      <div className="sticky bottom-0 z-30 border-t border-white/10 bg-black/92 backdrop-blur-xl">
        <div className="shell flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-[15px] font-bold text-white">
              준비물은 초대 코드 하나입니다
            </p>
            <p className="mt-0.5 text-[12px] text-white/40">
              그룹 생성 2분 · 코드 공유 1분 · 나머지는 시스템이
            </p>
          </div>
          <Button
            href="/groups/new"
            variant="primary"
            className="w-full sm:w-auto"
          >
            지금 그룹 만들기 →
          </Button>
        </div>
        {/* 모바일 하단 탭바와 겹치지 않게 */}
        <div className="h-16 md:hidden" />
      </div>
    </div>
  );
}
