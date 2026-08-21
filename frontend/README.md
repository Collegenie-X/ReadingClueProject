# 리딩클루 — Phase 1 웹 MVP

읽는 것에서 끝내지 않는 독서. 책에서 시작해 나만의 문제를 발견하고, 반증을 거쳐 프로젝트까지 밀고 가는 **독서 지도자용 4주 온라인 실행 플랫폼**.

> **기준 문서: [11단계 — 최종 기획안 · 유저 시나리오 (웹 실행 확정판)](../아이디어/11단계-리딩클루_최종_기획안_유저시나리오.md)**
> 배경 문서: [9단계 온라인 실행 설계서](../아이디어/9단계-리딩클루_독서지도자_온라인실행_설계서.md) · [10단계 웹 화면설계서](../아이디어/10단계-리딩클루_웹화면설계서_페이지별_유저시나리오.md)

---

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000 (기본 포트)

---

## 이 MVP의 성격

- **백엔드 없음.** 모든 상태는 `localStorage`에 저장됩니다 (`readingclue:v3` 키).
- **더미 데이터는 JSON.** `data/` 폴더의 JSON이 초기 시드입니다.
- **UI 검증이 목적.** 실제 서비스 전에 화면·흐름을 확인하기 위한 단계입니다.
- 시드 데이터를 바꾸면 `lib/store.ts`의 `KEY` 버전을 올려야 기존 localStorage가 무효화됩니다.

### 데모 데이터 초기화
우측 상단 프로필 → **🔄 데모 데이터 초기화**

---

## 데모 계정 (`/login` 하단)

| 계정 | 역할 | 볼 수 있는 것 |
|---|---|---|
| 👩‍🏫 이지현 | 독서 지도자 | 대시보드 · 미제출자 독려 · 크루별 현황 · 시즌 리포트 |
| 🧑 김민준 | 학생 (활발) | 이번 주 미션 · 크루 · 하이라이트된 내 카드 |
| 👦 박서준 | 학생 (미제출) | 미제출 상태의 학생 화면 |

**초대 코드**: `READ-HB2-26` (한빛중 2학년 독서반) · `READ-SCI-01` (과학 독서반)

---

## 화면 (20개 라우트)

### 진입
| URL | 화면 |
|---|---|
| `/` | 랜딩 — 히어로 · SMILE+P · 전국 질문 · 지도자 CTA |
| `/login` | 소셜 로그인 → 역할 선택 → 데모 계정 |
| `/guide` | 독서 지도자 가이드 (3단계 · 주 10분 · FAQ) |
| `/about` | 소개 — 6개 명제 · SMILE+P |

### 진단 · 탐색
| URL | 화면 |
|---|---|
| `/quiz` | 관심사 진단 30문항 (자동 저장 · 비로그인 게이트) |
| `/quiz/result` | Top3 관심사 · 영역 분포 · 크루 배정 · 추천 도서 |
| `/books/explore` | 책·주제 탐색 (관심사별 필터) |
| `/explore` | 전국 문제 아카이브 (비로그인 접근 가능) |

### 독서 스페이스
| URL | 화면 |
|---|---|
| `/readmate` | 탭 컨테이너 — 피드 / 커뮤니티 / 내 기록 / 포트폴리오 / 자료실 |
| `/groups/new` | 그룹 만들기 → 초대 코드 발급 |
| `/groups/join` | 초대 코드 입력 → 그룹 미리보기 → 참여 |
| `/groups/[id]` | 그룹 홈 — **학생 뷰 / 지도자 뷰 분기** |
| `/groups/[id]/feed` | 피드 (카드 · 반응 · 미션) |
| `/groups/[id]/roadmap` | 4주 로드맵 (3막 구조 · 미션 상세) |
| `/groups/[id]/crews` | 크루 목록 · 멤버 · 셀 배정 |
| `/groups/[id]/report` | 시즌 리포트 (지도자 전용) |

### 실행
| URL | 화면 |
|---|---|
| `/cards/new` | 문제 카드 작성 (5칸 양식 · 자동 저장) |
| `/cards/[id]` | 문제 카드 상세 · 반응 · 정의서 승급 |
| `/my` | 내 기록 (카드 · 반응 · 미션 이력) |

---

## 핵심 설계 규칙

### 🔍과 ⚔️는 코멘트 없이 누를 수 없다
```
🤝 공감  — 코멘트 선택
🔍 증상  — 20자 이상 필수
⚔️ 반론  — 20자 이상 필수
```
"좋아요만 누르는 문화"를 UI 구조로 차단합니다. `components/ReactionBar.tsx`

### 문제 카드 ④번 칸이 가장 중요하다
"반대편에서 보면"이 비어 있으면 게시 전 경고 모달이 뜹니다.
> 반대 입장을 쓸 수 없다면 아직 문제가 아니라 **확신**입니다.

### 3주차 정의서까지만 해도 완주다
기획안(4주차)은 선택입니다. 로드맵의 2막과 3막 사이에 분기점을 명시합니다.

---

## 디자인 시스템

aicareerpath.co.kr의 구조를 이식했습니다.

| 항목 | 값 |
|---|---|
| 테마 | 다크 (`bg-black`) |
| 브랜드 | `#6c5ce7` → `#a29bfe` (135° 그라디언트) |
| 앱 탭 | `#6c5ce7` → `#a855f7` |
| 폰트 | Pretendard Variable |
| 컨테이너 | `shell` 유틸 (max 1300px) |
| **랜딩 톤** | 둥근 모서리 (`rounded-[16px]`) + 우주 테마 |
| **앱 톤** | 각진 대시보드 (`border-radius: 0`) |
| depth | 그림자가 아닌 흰색 알파 계층 (0.02 → 0.03 → 0.06 → 0.1) |

주요 유틸리티는 `app/globals.css`에 정의되어 있습니다:
`shell` · `panel` · `panel-shell` · `card-soft` · `grad-brand` · `grad-tab` · `grad-text` · `btn-primary` · `btn-pill` · `btn-square` · `input-rc` · `eyebrow`

---

## 구조

```
frontend/
├── app/
│   ├── layout.tsx           GNB · 모바일 탭바 · 토스트
│   ├── globals.css          디자인 시스템 전체
│   ├── page.tsx             랜딩
│   ├── quiz/ · books/ · explore/ · my/ · readmate/
│   ├── groups/[id]/         layout(GroupNav) + 홈·피드·로드맵·크루·리포트
│   └── cards/
├── components/
│   ├── ui/index.tsx         Button · Panel · Badge · Modal · Toast · Stat …
│   ├── Gnb.tsx · MobileTabBar.tsx · GroupNav.tsx
│   ├── ProblemCardView.tsx  카드 목록형 / 전문형
│   ├── ReactionBar.tsx      🤝🔍⚔️ + 20자 게이트
│   ├── MissionCard.tsx      이번주 미션 · 로드맵 행 · 미션 상세
│   ├── GroupCard.tsx · InviteCodeBox.tsx · StarField.tsx
├── lib/
│   ├── types.ts             전역 타입
│   ├── data.ts              JSON 접근 계층
│   ├── store.ts             localStorage 상태 + 도메인 로직
│   ├── useStore.ts          구독 훅 (useSyncExternalStore)
│   └── format.ts            시간 · 마감일 · 퍼센트
└── data/
    ├── interests.json       관심사 50 (6영역)
    ├── quiz.json            진단 30문항
    ├── books.json           도서 20권
    ├── roadmap.json         4주 미션
    └── seed.json            그룹 · 멤버 · 크루 · 카드 · 반응
```

---

## Phase 2 (다음 단계)

- [ ] 반증 세션 (P17) — 비동기 텍스트 반증 · 72시간 · 질문 3개 + 대안 1개
- [ ] 문제 정의서 (P18) — 반증 1건 이상 없이는 승급 불가
- [ ] 정의서 갤러리 (P19) — 문제 시장 · 합류 투표 · 팀 결성
- [ ] 프로젝트 (P20) — 4트랙 · 주간 체크인 · 실패 기록
- [ ] 그룹 간 교차 반증
- [ ] PWA → Expo 앱

---

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
