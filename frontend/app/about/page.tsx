"use client";

import StarField from "@/components/StarField";
import { Button, Badge } from "@/components/ui";
import { HOW_IT_WORKS } from "@/lib/landing";

// ── 6개 명제 ───────────────────────────────
const THESES = [
  {
    n: "01",
    color: "#8b5cf6",
    emoji: "🧩",
    title: "커뮤니티는 모임이 아니라 프로토콜이다",
    desc: "무엇을 하는지 정해지지 않은 모임은 3회차에 죽습니다. ReadingClue는 분위기가 아니라 절차를 제공합니다.",
  },
  {
    n: "02",
    color: "#ec4899",
    emoji: "🔀",
    title: "온라인은 준비와 기록을, 오프라인은 충돌과 결심을 맡는다",
    desc: "읽고 쓰는 일은 각자의 시간에, 서로 부딪히고 결정하는 일은 모여서. 둘의 역할을 섞지 않습니다.",
  },
  {
    n: "03",
    color: "#fbbf24",
    emoji: "⚔️",
    title: "문제 제기는 개인이 하고, 문제 정의는 집단이 한다",
    desc: "혼자 정의한 문제는 확신이고, 반박당한 문제만 문제입니다. 반증을 통과하지 못한 정의서는 승급하지 못합니다.",
  },
  {
    n: "04",
    color: "#22c55e",
    emoji: "🌱",
    title: "프로젝트는 목표가 아니라 부산물이다",
    desc: "프로젝트를 강제하면 사람이 빠지고, 문제를 깊게 하면 프로젝트가 생깁니다. 그래서 3막은 선택입니다.",
  },
  {
    n: "05",
    color: "#3b82f6",
    emoji: "🏛️",
    title: "도서관의 자산은 장서가 아니라 이 지역이 던진 질문의 목록이다",
    desc: "10년 뒤 남는 것은 대출 통계가 아닙니다. 누가 무엇을 문제라고 불렀는지의 기록입니다.",
  },
  {
    n: "06",
    color: "#06b6d4",
    emoji: "🧬",
    title: "확장은 지점이 아니라 프로토콜의 복제로 한다",
    desc: "새 지역에 건물을 세우는 대신 절차를 복제합니다. 초대 코드 하나면 어디서든 같은 구조가 돌아갑니다.",
  },
];

// ── 누구를 위한 것인가 ──────────────────────
const AUDIENCES = [
  {
    emoji: "👩‍🏫",
    color: "#6c5ce7",
    title: "독서 지도자",
    lead: "커리큘럼을 짤 시간이 없는 분",
    points: [
      "그룹 생성 5분, 매주 운영 10분",
      "4주 로드맵과 미션이 이미 준비됨",
      "미제출자·진행률이 자동 집계됨",
    ],
    cta: { label: "지도자 가이드 →", href: "/guide" },
  },
  {
    emoji: "🧑‍🎓",
    color: "#06b6d4",
    title: "학생",
    lead: "독후감이 지겨웠던 사람",
    points: [
      "내 관심사에서 출발하는 책 선택",
      "내 질문이 친구에게 반박당하는 경험",
      "살아남은 질문을 실제 프로젝트로",
    ],
    cta: { label: "관심사 진단 →", href: "/quiz" },
  },
  {
    emoji: "🏫",
    color: "#22c55e",
    title: "학교 · 도서관",
    lead: "독서 교육의 성과가 안 보이는 곳",
    points: [
      "대출 통계 대신 질문 아카이브가 남음",
      "SMILE 수업에 그대로 얹을 수 있음",
      "프로토콜 복제로 학년·지역 확장",
    ],
    cta: { label: "문제 아카이브 →", href: "/explore" },
  },
];

// ── 실제 사용 단계 (학생 기준) ───────────────
// 각 단계는 "어느 화면에서 · 무엇을 눌러 · 무엇이 남는가"까지 정의한다.
const USE_STEPS = [
  {
    no: "00",
    color: "#94a3b8",
    emoji: "🔑",
    title: "가입하고 초대 코드 넣기",
    who: "혼자 · 3분",
    where: { label: "/login", href: "/login" },
    actions: [
      "이름·학교로 로그인 (비밀번호 없음)",
      "지도자에게 받은 6자리 초대 코드 입력",
      "코드가 없으면 건너뛰고 진단부터 시작",
    ],
    output: "내 계정 · 소속 그룹",
  },
  {
    no: "01",
    color: "#3b82f6",
    emoji: "🧭",
    title: "관심사 진단 30문항",
    who: "혼자 · 15분 · 1주차",
    where: { label: "/quiz", href: "/quiz" },
    actions: [
      "30문항에 4점 척도로 답하기 (중간 저장됨)",
      "50개 관심사 중 내 Top3 확인",
      "결과 화면에서 관심사별 연관 도서 목록 열기",
    ],
    output: "관심사 리포트 (Top3)",
  },
  {
    no: "02",
    color: "#6366f1",
    emoji: "📚",
    title: "관심사에 걸린 책에서 1권 고르기",
    who: "혼자 · 10분 · 1주차",
    where: { label: "/books/explore", href: "/books/explore" },
    actions: [
      "Top3 관심사로 필터링된 도서만 훑기",
      "책 상세에서 ‘이 책으로 시작’ 선택",
      "같은 관심사를 고른 크루가 자동 배정됨",
    ],
    output: "첫 책 + 크루 배정",
  },
  {
    no: "03",
    color: "#a855f7",
    emoji: "🗺️",
    title: "책 구조 노트 쓰기",
    who: "혼자 · 1주차",
    where: { label: "/readmate", href: "/readmate" },
    actions: [
      "핵심 주장 3줄로 압축",
      "저자가 깔고 있는 전제 찾아 적기",
      "동의하지 못하는 지점 표시하고 크루 피드에 공유",
    ],
    output: "책 구조 노트",
  },
  {
    no: "04",
    color: "#fbbf24",
    emoji: "🔍",
    title: "문제 카드 5칸 작성",
    who: "혼자 · 2주차",
    where: { label: "/cards/new", href: "/cards/new" },
    actions: [
      "질문 · 관련 책 · 관찰 · 숨은 전제 · 반대편 5칸 채우기",
      "저장하면 크루 피드에 카드가 공개됨",
      "크루원 카드 2장 이상에 반응 남기기",
    ],
    output: "문제 카드",
  },
  {
    no: "05",
    color: "#22c55e",
    emoji: "🔗",
    title: "병렬 독서 · 3렌즈 교차",
    who: "크루 · 2주차",
    where: { label: "그룹 보드", href: "/groups/join" },
    actions: [
      "같은 주제 다른 책 2권을 크루가 나눠 읽기",
      "세 책이 충돌하는 지점을 그룹 보드에 기록",
      "철학 · 사회학 · 심리학 렌즈로 교차 코멘트",
    ],
    output: "병렬 독서 노트 + 교차 분석",
  },
  {
    no: "06",
    color: "#ef4444",
    emoji: "⚔️",
    title: "반증 라운드 · 문제 정의서",
    who: "크루 · 3주차 · 오프라인 권장",
    where: { label: "/explore", href: "/explore" },
    actions: [
      "크루가 서로의 카드에 반론 달기",
      "받은 반론에 재반박하거나 가설 폐기 기록 남기기",
      "반론을 통과한 질문만 문제 정의서로 승급",
    ],
    output: "문제 정의서 (기획안 ①장)",
  },
  {
    no: "07",
    color: "#06b6d4",
    emoji: "🚀",
    title: "기획안 작성 · 발표",
    who: "크루 · 4주차",
    where: { label: "/groups/new", href: "/groups/new" },
    actions: [
      "트랙 정하기 (논문 · 웹 · 피지컬 AI · 캠페인)",
      "1차 데이터 직접 수집 (설문 · 인터뷰 · 관찰)",
      "유저 시나리오 · 실행 계획까지 담아 갤러리 발표",
    ],
    output: "프로젝트 기획안 + 1차 데이터",
  },
  {
    no: "08",
    color: "#8b5cf6",
    emoji: "🏆",
    title: "아카이브 · 다음 사이클",
    who: "혼자 · 상시",
    where: { label: "/my", href: "/my" },
    actions: [
      "독서 역량 리포트와 활동 기록 확인",
      "내 질문이 문제 아카이브에 남았는지 보기",
      "남은 관심사로 다음 4주 사이클 시작",
    ],
    output: "역량 리포트 · 문제 아카이브",
  },
];

// ── 지도자 운영 단계 ─────────────────────────
const LEADER_STEPS = [
  {
    no: "01",
    title: "그룹 만들기",
    time: "5분 · 시작 전",
    detail: "/guide 에서 4주 로드맵 확인 → 그룹 생성 → 초대 코드 발급",
  },
  {
    no: "02",
    title: "학생 초대 · 진단 확인",
    time: "10분 · 1주차",
    detail: "초대 코드 배포 후, 진단 완료율과 배정된 크루 구성 점검",
  },
  {
    no: "03",
    title: "주간 미션 열기",
    time: "주 10분 · 1–3주차",
    detail: "주차별 미션 오픈 → 미제출자 자동 집계 확인 → 리마인드",
  },
  {
    no: "04",
    title: "반증 라운드 진행",
    time: "60–90분 · 3주차",
    detail: "오프라인 모임에서 반박 라운드 사회 · 승급 기준 안내",
  },
  {
    no: "05",
    title: "발표 · 아카이브 정리",
    time: "90분 · 4주차",
    detail: "기획안 발표 · 우수 질문을 문제 아카이브로 공개 전환",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-black">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <StarField />
        <div className="shell relative z-10 text-center">
          <p className="eyebrow">About ReadingClue</p>
          <h1 className="mt-3 text-[32px] leading-[1.18] font-extrabold tracking-[-1px] text-white sm:text-[42px] md:text-[50px]">
            <span className="block">책을 읽는 곳에서</span>
            <span className="grad-text block">문제가 태어나는 곳으로</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/55 md:text-[17px]">
            ReadingClue는 독서 모임이 아닙니다. 학생이 자기 관심사에서 문제를 던지고,
            친구에게 반박당하고, 살아남은 질문을 프로젝트로 밀고 가는{" "}
            <strong className="text-white">4주짜리 프로토콜</strong>입니다.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/quiz" variant="primary">
              관심사 진단 시작 →
            </Button>
            <Button href="/guide" variant="ghost">
              지도자 가이드
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════ 큰 흐름 3단계 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">{HOW_IT_WORKS.eyebrow}</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              큰 흐름은 <span className="grad-text">3단계</span>입니다
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/50">
              {HOW_IT_WORKS.desc}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.stages.map((s) => (
              <div
                key={s.no}
                className="rounded-[16px] border p-6"
                style={{ background: `${s.color}12`, borderColor: `${s.color}3d` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[24px] leading-none">{s.emoji}</span>
                  <span
                    className="text-[13px] font-extrabold tracking-wider"
                    style={{ color: s.color }}
                  >
                    {s.no}
                  </span>
                </div>
                <p className="mt-4 text-[19px] font-bold text-white">
                  {s.title}
                  <span className="ml-2 text-[13px] font-semibold text-white/40">
                    {s.subtitle}
                  </span>
                </p>
                <p className="mt-1 text-[12px] font-semibold" style={{ color: s.color }}>
                  {s.desc}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 text-[13px] leading-relaxed text-white/55"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: s.color }}
                      />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 실제 사용 단계 (학생) ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">Step by step</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              실제로는 <span className="grad-text">이렇게 씁니다</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/50">
              가입부터 기획안 발표까지 4주. 각 단계마다 어느 화면에서 · 무엇을
              하고 · 무엇이 남는지가 정해져 있습니다.
            </p>
          </div>

          <ol className="mx-auto mt-10 flex max-w-[880px] flex-col gap-4">
            {USE_STEPS.map((s) => (
              <li
                key={s.no}
                className="rounded-[16px] border p-5 md:p-6"
                style={{ background: `${s.color}0f`, borderColor: `${s.color}33` }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  {/* 좌: 단계 번호 */}
                  <div className="flex items-center gap-3 md:w-[210px] md:shrink-0 md:flex-col md:items-start md:gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold"
                      style={{ background: `${s.color}26`, color: s.color }}
                    >
                      {s.no}
                    </span>
                    <div>
                      <p className="text-[16px] leading-snug font-bold text-white">
                        <span className="mr-1.5">{s.emoji}</span>
                        {s.title}
                      </p>
                      <p className="mt-1 text-[12px] text-white/40">{s.who}</p>
                    </div>
                  </div>

                  {/* 우: 하는 일 */}
                  <div className="flex-1">
                    <ul className="flex flex-col gap-2">
                      {s.actions.map((a) => (
                        <li
                          key={a}
                          className="flex items-start gap-2 text-[13.5px] leading-relaxed text-white/60"
                        >
                          <span
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: s.color }}
                          />
                          {a}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                      <Badge color={s.color}>화면 {s.where.label}</Badge>
                      <Badge color="#94a3b8">남는 것 · {s.output}</Badge>
                      <Button
                        href={s.where.href}
                        variant="pillGhost"
                        className="ml-auto"
                      >
                        바로 가기 →
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════ 지도자 운영 단계 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">For leaders</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              지도자는 <span className="grad-text">5단계</span>만 하면 됩니다
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/50">
              커리큘럼을 짜지 않습니다. 열고 · 확인하고 · 진행합니다.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[880px] grid-cols-1 gap-3">
            {LEADER_STEPS.map((s) => (
              <div
                key={s.no}
                className="flex flex-col gap-2 rounded-[14px] border border-white/8 bg-white/[.02] p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-[12px] font-extrabold text-white/70">
                  {s.no}
                </span>
                <div className="sm:w-[170px] sm:shrink-0">
                  <p className="text-[15px] font-bold text-white">{s.title}</p>
                  <p className="mt-0.5 text-[11.5px] text-white/35">{s.time}</p>
                </div>
                <p className="flex-1 text-[13px] leading-relaxed text-white/55">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button href="/guide" variant="ghost">
              지도자 가이드 자세히 보기 →
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════ 6개 명제 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">Six theses</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              ReadingClue가 서 있는 <span className="grad-text">6개의 명제</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/50">
              기능을 먼저 만들지 않았습니다. 이 여섯 문장이 먼저 있었고, 화면은
              그것을 강제하기 위해 만들어졌습니다.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {THESES.map((t) => (
              <div
                key={t.n}
                className="flex flex-col rounded-[16px] border p-6 transition duration-300 hover:-translate-y-1.5"
                style={{
                  background: `${t.color}12`,
                  borderColor: `${t.color}3d`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[24px] leading-none">{t.emoji}</span>
                  <span
                    className="text-[13px] font-extrabold tracking-wider"
                    style={{ color: t.color }}
                  >
                    {t.n}
                  </span>
                </div>
                <p className="mt-4 text-[17px] leading-snug font-bold text-white">
                  {t.title}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-white/55">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 누구를 위한 것인가 ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div className="text-center">
            <p className="eyebrow">Who it&apos;s for</p>
            <h2 className="mt-2 text-[26px] leading-tight font-bold text-white md:text-[34px]">
              누구를 위한 것인가
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div
                key={a.title}
                className="flex flex-col rounded-[16px] border p-6"
                style={{
                  background: `${a.color}12`,
                  borderColor: `${a.color}3d`,
                }}
              >
                <span className="text-[30px] leading-none">{a.emoji}</span>
                <p className="mt-3 text-[19px] font-bold text-white">{a.title}</p>
                <p className="mt-1 text-[13px] font-semibold" style={{ color: a.color }}>
                  {a.lead}
                </p>

                <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                  {a.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-[13px] leading-relaxed text-white/55"
                    >
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: a.color }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border-t border-white/10 pt-4">
                  <Button
                    href={a.cta.href}
                    variant="pillGhost"
                    className="w-full"
                  >
                    {a.cta.label}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 하단 CTA ═══════════ */}
      <section className="border-t border-white/5 py-16 md:py-24">
        <div className="shell">
          <div
            className="rounded-[24px] border p-8 text-center md:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(108,92,231,.18) 0%, rgba(168,85,247,.10) 55%, rgba(99,102,241,.08) 100%)",
              borderColor: "rgba(139,92,246,.3)",
            }}
          >
            <h2 className="text-[26px] leading-tight font-bold text-white md:text-[32px]">
              어디서부터 시작할까요?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/55">
              학생이라면 관심사 진단부터, 지도자라면 가이드부터 보세요. 둘 다
              5분이면 충분합니다.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/quiz" variant="primary">
                관심사 진단 시작
              </Button>
              <Button href="/guide" variant="ghost">
                지도자 가이드
              </Button>
            </div>
            <p className="mt-8 text-[12px] leading-relaxed text-white/25">
              &ldquo;10년 뒤 남는 것은 대출 통계가 아니라 그 지역이 던진 질문의
              목록이다&rdquo;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
