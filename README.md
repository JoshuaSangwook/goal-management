# 말씀 실천 목표 달성 시스템

![Mission Verse](https://img.shields.io/badge/Verse-야고보서%201:22-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)
![React](https://img.shields.io/badge/React-19.2.6-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

> "너희는 도를 행할 자가 되고 듣기만 하여 자신을 속이는 자가 되지 말라"

## 개요

이 프로젝트는 말씀 실천 목표 달성 시스템의 Mock UI 개발 결과물입니다. 실제 데이터베이스나 인증 시스템 없이 모든 화면을 mock 데이터로 구현하여 UI/UX를 확인하고 시스템의 전체적인 흐름을 이해하는 것을 목표로 합니다.

## 주요 기능

### 1. 랜딩 페이지 (/)
- 미션 카드 (야고보서 1:22)
- 비전 카드 (난민학교 10회 강의)
- 핵심가치 6개 그리드 (말씀, 기도, 찬양, 교제, 섬김, 성장)
- 데일리 체크 현황 배너

### 2. 목표 개요 (/goals)
- 4개 영역별 목표 아이템 카드
  - 지적 (INTELLECTUAL) - 파란색
  - 영적 (SPIRITUAL) - 보라색
  - 신체 (PHYSICAL) - 초록색
  - 사회 (SOCIAL) - 주황색

### 3. 데일리 체크인 (/check) ⭐
- 날짜 선택 기능
- 11개 목표 아이템 체크리스트
- 실시간 체크 현황 (달성률, 완료 개수)
- "모두 완료!" 축하 메시지
- 마지막 업데이트 시간

### 4. 달성 현황 (/progress)
- 월간 진행률 카드
- 누적 달성률 프로그레스바 (실제 vs 예상)
- 연간 트렌드 차트 (12개월)
- 색상 코딩 (초록/노랑/빨강)

### 5. 목표 설정 (/targets)
- 월/연도 선택
- 월간 목표 입력 테이블
- 연간 합계 자동 계산
- 기본값: (월별 일수 - 4)

### 6. 관리자 - 아이템 관리 (/admin/items)
- 미션/비전 편집기
- 핵심가치 CRUD
- 목표 아이템 CRUD
- 활성/비활성 토글

### 7. 관리자 - 사용자 관리 (/admin/users)
- 사용자 리스트 테이블
- 검색 기능
- 활성/비활성 버튼
- 관리자 권한 부여
- 사용자 달성 현황 요약

### 8. 인증
- 로그인 (/login)
- 회원가입 (/signup)

## 기술 스택

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript 6
- **Styling**: TailwindCSS 4.3
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Utilities**: date-fns

## 설치 및 실행

### 사전 요구사항
- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 앱을 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
goal-achievement-system/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 랜딩 페이지
│   ├── goals/                    # 목표 개요
│   ├── check/                    # 데일리 체크인
│   ├── progress/                 # 달성 현황
│   ├── targets/                  # 목표 설정
│   ├── admin/                    # 관리자 페이지
│   │   ├── items/                # 아이템 관리
│   │   └── users/                # 사용자 관리
│   ├── login/                    # 로그인
│   ├── signup/                   # 회원가입
│   ├── layout.tsx                # 루트 레이아웃
│   └── globals.css               # 전역 스타일
├── components/
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   ├── mission/                  # 미션 관련
│   ├── vision/                   # 비전 관련
│   ├── values/                   # 핵심가치 관련
│   ├── landing/                  # 랜딩 페이지
│   ├── goal/                     # 목표 관련
│   ├── check/                    # 체크인 관련
│   ├── progress/                 # 현황 관련
│   ├── targets/                  # 목표 설정 관련
│   ├── admin/                    # 관리자 관련
│   └── auth/                     # 인증 관련
├── lib/
│   ├── utils.ts                  # 유틸리티 함수
│   └── mock-data.ts              # Mock 데이터
└── public/                       # 정적 파일
```

## Mock 데이터

모든 페이지는 `lib/mock-data.ts`에 정의된 mock 데이터를 사용합니다:

- `mockMission`: 미션 정보
- `mockVision`: 비전 정보
- `mockCoreValues`: 핵심가치 6개
- `mockGoalItems`: 13개 목표 아이템
- `mockCheckRecords`: 체크 기록
- `mockUsers`: 사용자 목록
- `mockProgress`: 진행률 데이터
- `mockTargets`: 목표 설정 데이터

## 반응형 디자인

- 모바일 우선 설계
- 데스크톱, 태블릿, 모바일 지원
- 터치 타겟 44px 이상 (모바일)
- 반응형 네비게이션 (햄버거 메뉴)

## 다음 단계

Mock UI 개발 완료 후:
1. **데이터베이스 설계 및 구현** (Prisma + PostgreSQL)
2. **인증 시스템 구현** (NextAuth.js)
3. **API 라우트 구현**
4. **Mock → 실제 데이터 연결**
5. **PWA 설정**
6. **배포** (Vercel)

## 라이선스

© 2026 목표 달성 시스템

---

**야고보서 1:22** - "너희는 도를 행할 자가 되고 듣기만 하여 자신을 속이는 자가 되지 말라"
