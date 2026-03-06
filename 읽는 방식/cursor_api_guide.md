# Cursor AI 모델 완전 가이드
> 기획 · 코딩 작업별 최적 모델 선택 전략 | 2026.03 기준

---

## 1. 제공사별 모델 개요

| 제공사 | 주요 모델 | 핵심 강점 | 컨텍스트 |
|--------|-----------|-----------|----------|
| **Anthropic** | Claude 4.6 Opus / Sonnet, 4.5 Opus / Sonnet / Haiku, 4 Sonnet | 긴 문서 이해, 논리적 글쓰기, 코드 설명·리뷰 | 200k → 1M |
| **OpenAI** | GPT-5.4, GPT-5.3 Codex, GPT-5.2, GPT-5, GPT-5.1 Codex Mini | 코딩 특화, 에이전트, 캐시 90% 할인 | 272k → 1M |
| **Google** | Gemini 3.1 Pro, 3 Pro, 3 Flash, 2.5 Flash | 멀티모달(이미지 분석), 빠른 응답 | 200k → 1M |
| **Cursor** | Composer 1.5, Composer 1 | IDE 통합 최적화, 기본 노출 모델 | 200k |
| **xAI / Moonshot** | Grok Code, Kimi K2.5 | 최저가, 단순 반복 작업 | 256k / 262k |

---

## 2. 주요 모델 상세 비교표

| 모델명 | 제공사 | 컨텍스트 | 입력 가격 | 출력 가격 | 기능 | 특징 |
|--------|--------|----------|-----------|-----------|------|------|
| **Claude 4.6 Opus** ★ | Anthropic | 200k → 1M | $5 | $25 | Agent · Think · Image | 최고 지능. 복잡한 기획·아키텍처 설계 |
| **Claude 4.6 Sonnet** ★ | Anthropic | 200k → 1M | $3 | $15 | Agent · Think · Image | 성능·비용 균형 최고. **일상 기본 모델** |
| Claude 4.5 Haiku | Anthropic | 200k | $1 | $5 | Think · Image | 빠르고 저렴. 간단한 질문·수정 |
| **GPT-5.4** ★ | OpenAI | 272k → 1M | $2.5 | $15 | Agent · Think · Image | 캐시 90% 할인. 반복 코드 작업 효율 |
| **GPT-5.3 Codex** ★ | OpenAI | 272k | $1.75 | $14 | Agent · Think · Image | 코드 생성 특화. 에이전트 작업 최적 |
| GPT-5.1 Codex Mini | OpenAI | 272k | $0.25 | $2 | Agent · Think · Image | 4x 속도 제한. 대량 반복 작업 |
| **Gemini 3.1 Pro** ★ | Google | 200k → 1M | $2 | $12 | Agent · Think · Image | 멀티모달 강점. UI/UX 이미지 분석 |
| Gemini 3 Flash | Google | 200k → 1M | $0.5 | $3 | Agent · Think · Image | 빠른 응답. 초안 작성·간단 코드 |
| **Composer 1.5** ★ | Cursor | 200k | $3.5 | $17.5 | Agent · Think · Image | Cursor IDE 최적화. 기본 노출 모델 |
| Grok Code | xAI | 256k | $0.2 | $1.5 | Agent · Think | 최저가. 간단한 코드 수정·탐색 |

> 가격 단위: USD / 1M tokens  
> ★ = 기획·코딩 작업 추천 모델

---

## 3. 기획 · 코딩 작업별 추천 플로우

### 📋 기획 작업 플로우

```
01 복잡한 요구사항 분석 / 아키텍처 설계
   → Claude 4.6 Opus (Thinking 모드)
   긴 문서를 한번에 처리. 복잡한 트레이드오프 분석.

02 PRD / 유저 스토리 / 기능 명세서 작성
   → Claude 4.6 Sonnet  ★ 가장 추천
   200k 컨텍스트로 전체 기획서 한번에 처리.

03 UI 목업 이미지 분석 / 와이어프레임 검토
   → Gemini 3.1 Pro
   이미지 첨부 기획에 멀티모달 강점 활용.

빠른 아이디어 브레인스토밍 / 간단한 초안
   → Gemini 3 Flash
   빠른 응답 속도 + 저렴한 비용.
```

### 💻 코딩 작업 플로우

```
01 신규 기능 개발 / 멀티파일 리팩토링
   → GPT-5.3 Codex (Agent 모드)
   코드 생성 특화. 여러 파일 동시 수정, 테스트 자동 생성.

02 코드 리뷰 / 버그 분석 / 문서화
   → Claude 4.6 Sonnet (Agent 모드)  ★ 가장 추천
   코드 설명과 이해에 탁월. 긴 스택 트레이스 정확 분석.

03 대형 코드베이스 전체 분석 / 레거시 마이그레이션
   → GPT-5.4 Max Mode
   1M 컨텍스트 + 캐시 90% 할인으로 대형 프로젝트 효율적.

절약 간단한 함수 수정 / 포맷팅 / 변수명 변경
   → Grok Code / GPT-5.1 Codex Mini
   단순 반복 작업에 비용 최소화.
```

---

## 4. 상황별 모델 선택 매트릭스

| 상황 | 추천 모델 | 이유 |
|------|-----------|------|
| 📐 아키텍처 설계 | Claude 4.6 Opus | Thinking 모드. 복잡한 트레이드오프 분석, 시스템 설계 결정 |
| 📝 PRD / 기획서 작성 | Claude 4.6 Sonnet | 긴 문서 작성·논리적 구조화. 200k 컨텍스트로 전체 기획서 처리 |
| 🖼️ UI/UX 이미지 검토 | Gemini 3.1 Pro | 스크린샷·목업·와이어프레임 분석에 멀티모달 강점 |
| ⚡ 빠른 초안 작성 | Gemini 3 Flash | 빠른 응답 속도 + 저렴한 비용. 아이디어 검증·간단한 질문 |
| 🔨 신규 기능 개발 | GPT-5.3 Codex | Agent 모드로 여러 파일 동시 수정, 테스트 코드 자동 생성 |
| 🐛 디버깅 · 분석 | Claude 4.6 Sonnet | 에러 원인 파악, 코드 흐름 설명에 탁월 |
| 🏗️ 대형 코드베이스 | GPT-5.4 Max Mode | 1M 컨텍스트 + 캐시 90% 할인. 전체 프로젝트 파악 |
| 💰 비용 절감 | Grok Code | $0.2/1M 입력 최저가. 간단한 코드 수정·포맷팅 |

---

## 5. 비용 티어별 추천 모델

### 💚 Budget — 절약형 ($0.2 ~ $1 / 1M tokens)
- Grok Code — $0.2 (입력)
- GPT-5.1 Codex Mini — $0.25
- Gemini 3 Flash — $0.5
- Claude 4.5 Haiku — $1
- GPT-5 Mini — $0.25

> 간단한 수정, 빠른 질문, 반복 작업에 적합

### 🟡 Balanced — 균형형 ($2 ~ $5 / 1M tokens) ★ 가장 추천
- **Claude 4.6 Sonnet** — $3 (입력)
- **GPT-5.3 Codex** — $1.75
- Gemini 3.1 Pro — $2
- Composer 1.5 — $3.5
- GPT-5.4 — $2.5

> 일상적인 기획·코딩 작업에 최적의 가성비

### 🔴 Premium — 고성능 ($5 ~ $30 / 1M tokens)
- **Claude 4.6 Opus** — $5 (입력)
- Claude 4.5 Opus — $5
- Claude 4.6 Opus Fast — $30 (리서치 프리뷰)
- GPT-5 Fast — $2.5

> 복잡한 아키텍처, 중요한 의사결정, 고품질 결과물 필요 시

---

## 6. 기획·코딩 작업자를 위한 핵심 팁

### Thinking 모드 활용
Claude Opus / Sonnet의 Thinking 모드는 복잡한 기획 결정이나 아키텍처 설계 시 활성화.  
단, **요청당 2배 비용** 소모되므로 꼭 필요할 때만 사용.

### Max Mode 전략
GPT-5.4 Max Mode는 **캐시 90% 할인 + 1M 컨텍스트**.  
대형 프로젝트 전체 분석 시 오히려 경제적일 수 있음.

### Agent 모드 활용
복잡한 코딩 작업은 `Agent` 기능이 있는 모델 선택.  
여러 파일 동시 수정, 터미널 명령 실행까지 자동화 가능.

### 기획 → 코딩 전환 워크플로우
기획서 작성은 **Claude Sonnet**, 구현은 **GPT Codex**로 전환하는 워크플로우가 효율적.

### 이미지 첨부 기획
UI 스크린샷, 와이어프레임 분석은 **Gemini 3.1 Pro** 또는 **Claude Sonnet** (Image 지원 모델) 사용.

### Auto 라우터 활용
Cursor의 **Auto 모드**는 작업 유형에 따라 비용·성능을 자동 최적화.  
처음 사용 시 Auto로 시작하고, 익숙해지면 수동 선택 권장.

---

## 7. 모델 기능 범례

| 기능 | 설명 |
|------|------|
| **Agent** | 멀티파일 수정, 터미널 명령 실행 등 자율 에이전트 작업 가능 |
| **Think** | 단계적 추론(Chain of Thought) 모드 지원. 복잡한 문제에 유리 |
| **Image** | 이미지 첨부 및 분석 지원 |
| **Max Mode** | 컨텍스트를 최대(1M)까지 확장. 토큰 기반 과금 + 20% 추가 |

---

> 출처: [cursor.sh/docs/models](https://cursor.sh/docs/models)  
> ★ = 기획·코딩 작업 추천 모델 | 가격은 변동될 수 있음
