# 구현 계획: 말씀 실천 목표 달성 시스템

**프로젝트:** 말씀 실천 목표 달성 시스템 (Goal Achievement System)
**작성일:** 2026-05-27
**기술 스택:** Next.js (React) + Node.js + PostgreSQL

---

## 1. 프로젝트 개요

### 1.1 배경

본 시스템은 교회 공동체 구성원들이 공유하는 사명·비전·핵심가치에 기반하여 일별 목표 달성 여부를 추적할 수 있도록 개발됩니다. 이 시스템을 통해 다음을 달성할 수 있습니다:

- **개인 성장 추적**: 4대 영역(지적, 영적, 신체, 사회)의 목표 달성 일별 체크인
- **공동체 정렬**: 모든 구성원이 동일한 사명·비전·핵심가치·목표 항목 공유
- **유연한 목표 설정**: 개인별 월별/연간 목표 수치 개별 설정 가능
- **투명한 진행 상황**: 누적 달성률 및 이력 추적
- **모바일 중심**: 빠른 일별 체크인을 위한 반응형 PWA

**핵심 원칙**: "말씀을 행하는 자가 되고, 듣기만 하여 자신을 속이는 자가 되지 말라" (야고보서 1:22)

---

## 2. 아키텍처 개요

### 2.1 기술 스택

**프론트엔드:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- TailwindCSS + shadcn/ui (컴포넌트 라이브러리)
- PWA 설정 (next-pwa)

**백엔드:**
- Next.js API Routes (서버리스 함수)
- PostgreSQL + Prisma ORM
- NextAuth.js (유연한 인증 아키텍처 - 소셜/이메일/비밀번호 준비 완료)

**인프라:**
- Vercel (권장) 또는 자체 호스팅 Node.js
- Supabase 또는 관리형 PostgreSQL (예: AWS RDS, Neon)

### 2.2 프로젝트 구조

```
goal-achievement-system/
├── prisma/
│   ├── schema.prisma          # 데이터베이스 스키마
│   └── seed.ts                # 초기 데이터 (사명, 비전, 핵심가치, 목표)
├── public/
│   ├── icons/                 # PWA 아이콘
│   └── manifest.json          # PWA 매니페스트
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # 인증 라우트 (로그인, 회원가입)
│   │   ├── (dashboard)/      # 메인 앱 라우트
│   │   │   ├── page.tsx      # 랜딩 페이지 (사명·비전·핵심가치)
│   │   │   ├── goals/        # 목표 개요 페이지
│   │   │   ├── check/        # 일별 체크인
│   │   │   ├── progress/     # 달성 현황
│   │   │   ├── targets/      # 월별/연간 목표 설정
│   │   │   └── admin/        # 관리자 패널
│   │   └── api/              # API 라우트
│   ├── components/           # React 컴포넌트
│   │   ├── ui/               # shadcn/ui 컴포넌트
│   │   ├── goal/             # 목표 관련 컴포넌트
│   │   ├── check/            # 체크인 컴포넌트
│   │   └── admin/            # 관리자 컴포넌트
│   ├── lib/
│   │   ├── prisma.ts         # Prisma 클라이언트
│   │   ├── auth.ts           # 인증 설정
│   │   └── utils.ts          # 유틸리티 함수
│   └── types/                # TypeScript 타입
├── tests/
└── docs/
```

---

## 3. 데이터베이스 설계

### 3.1 스키마 정의

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  role          Role      @default(USER)
  active        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // 관계
  personalTargets PersonalTarget[]
  checkRecords    CheckRecord[]
  auditLogs       AuditLog[]
}

model GoalItem {
  id              String    @id @default(cuid())
  area            Area      // INTELLECTUAL(지적), SPIRITUAL(영적), PHYSICAL(신체), SOCIAL(사회)
  title           String
  description     String?
  period          Period    // DAILY(매일), WEEKLY(매주), MONTHLY(매달), YEARLY(연간)
  defaultTarget   Int       // 주기별 기본 목표 수치
  active          Boolean   @default(true)
  sortOrder       Int       // UI 표시 순서
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // 관계
  personalTargets PersonalTarget[]
  checkRecords    CheckRecord[]
}

model PersonalTarget {
  id           String   @id @default(cuid())
  userId       String
  goalItemId   String
  year         Int
  month        Int      // 연간 목표의 경우 null
  target       Int      // 사용자/기간별 맞춤 목표 수치
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user     User     @relation(fields: [userId], references: [id])
  goalItem GoalItem @relation(fields: [goalItemId], references: [id])

  @@unique([userId, goalItemId, year, month])
  @@index([userId, year, month])
}

model CheckRecord {
  id         String   @id @default(cuid())
  userId     String
  goalItemId String
  date       DateTime @db.Date // 체크인 날짜
  checked    Boolean  @default(true)
  checkedAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user     User     @relation(fields: [userId], references: [id])
  goalItem GoalItem @relation(fields: [goalItemId], references: [id])

  @@unique([userId, goalItemId, date]) // 중복 체크 방지
  @@index([userId, date])
  @@index([goalItemId, date])
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String   // CREATE, UPDATE, DELETE
  entity     String   // User, GoalItem, PersonalTarget, CheckRecord
  entityId   String
  oldValues  Json?
  newValues  Json?
  reason     String?
  createdAt  DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])

  @@index([entity, entityId])
  @@index([userId])
}

enum Role {
  ADMIN
  USER
}

enum Area {
  INTELLECTUAL  // 지적
  SPIRITUAL     // 영적
  PHYSICAL      // 신체
  SOCIAL        // 사회
}

enum Period {
  DAILY     // 매일
  WEEKLY    // 매주
  MONTHLY   // 매달
  YEARLY    // 연간
}
```

### 3.2 초기 데이터 (Seed Data)

PRD의 내용을 기반으로 초기 데이터 생성:

**사명 (Mission):**
- 말씀을 행하는 자가 되고, 듣기만 하여 자신을 속이는 자가 되지 말라 (약 1:22)

**비전 (Vision):**
- 1년에 10회 이상 난민학교에서 '어성경' 강의로 청소년들이 말씀을 읽을 수 있도록 돕는다
- 영어로 된 강의안을 잘 만들고 외워서 강의하는 '어성경' 전문강사가 된다

**핵심 가치 (Core Values):**
1. 정직 (엡 4:25)
2. 충성 (고전 4:2)
3. 온유함 (빌 4:5)
4. 기록 (합 2:2)
5. 변화 (사 43:19)
6. 성장 (골 2:7)

**목표 항목 (Goal Items):** 총 11개 (지적 2개, 영적 4개, 신체 3개, 사회 4개)

---

## 4. 구현 단계

### 4.1 1단계: 기반 구축 (1-2주차)

#### 4.1.1 프로젝트 설정 및 데이터베이스

**작업 항목:**
1. TypeScript로 Next.js 프로젝트 초기화
2. 의존성 설치 및 설정:
   - Prisma (ORM)
   - NextAuth.js
   - TailwindCSS + shadcn/ui
   - next-pwa
3. 데이터베이스 스키마 설계
4. Prisma 스키마 생성 및 마이그레이션
5. 초기 데이터 시딩 (사명, 비전, 핵심가치, 목표 항목)

**검증:**
- `prisma migrate dev` 실행으로 데이터베이스 생성
- `prisma db seed` 실행으로 초기 데이터 입력
- 시드 데이터 확인: 사명 1개, 비전 1개, 핵심가치 6개, 목표 항목 11개

#### 4.1.2 인증 설정

**작업 항목:**
1. NextAuth.js로 유연한 인증 아키텍처 구성
2. 인증 제공자 설정 (이메일/비밀번호용 credentials, OAuth 준비)
3. 인증 페이지 생성: `/login`, `/signup`
4. 보호된 라우트용 미들웨어 구현
5. 역할 기반 접근 제어 (RBAC) 추가

**생성 파일:**
- `src/lib/auth.ts` - NextAuth 설정
- `src/middleware.ts` - 라우트 보호
- `src/app/(auth)/login/page.tsx` - 로그인 페이지
- `src/app/(auth)/signup/page.tsx` - 회원가입 페이지

**검증:**
- 사용자 가입 및 로그인 테스트
- 세션 지속성 확인
- 관리자/사용자 역할 접근 테스트
- 보호된 라우트의 인증되지 않은 사용자 리디렉션 확인

---

### 4.2 2단계: 핵심 기능 (3-5주차)

#### 4.2.1 랜딩 페이지 (S-01)

**작업 항목:**
1. 사명, 비전, 핵심가치 표시 반응형 레이아웃 생성
2. 목표 개요로의 네비게이션 추가
3. 로그인 후 개인화된 요약 표시 (오늘 미체크 항목 수)
4. 모바일 우선 반응형 디자인 구현

**컴포넌트:**
- `src/app/(dashboard)/page.tsx` - 랜딩 페이지
- `components/mission/MissionCard.tsx` - 사명 표시
- `components/vision/VisionCard.tsx` - 비전 표시
- `components/values/CoreValuesGrid.tsx` - 6개 핵심가치 그리드

**핵심 기능:**
- 사명(약 1:22) 돋보이게 표시
- 난민학교 강조 비전 문구
- 반응형 그리드의 핵심가치 (데스크톱 3x2, 모바일 6x1)
- 로그인 후: "오늘 미체크 항목 X개입니다" 배너

**검증:**
- 모든 화면 크기에서 사명/비전/가치 정확히 표시
- 로그인 후 요약의 미체크 수 정확함
- 목표 개요로 네비게이션 작동

#### 4.2.2 목표 개요 페이지 (S-02)

**작업 항목:**
1. 4개 목표 영역 표시 (지적, 영적, 신체, 사회)
2. 영역별 그룹화된 모든 목표 항목 표시
3. 각 항목의 주기와 기본 목표 수치 표시
4. 일별 체크인 페이지로 네비게이션 추가

**컴포넌트:**
- `src/app/(dashboard)/goals/page.tsx` - 목표 개요
- `components/goal/GoalAreaSection.tsx` - 영역별 섹션
- `components/goal/GoalItemCard.tsx` - 개별 목표 항목

**핵심 기능:**
- 영역별 아이콘/색상의 4개 구분 섹션
- 각 항목: 제목, 설명, 주기, 기본 목표 표시
- 영역별 필터링 (선택 사항)
- 검색 기능 (선택 사항)

**검증:**
- PRD의 모든 11개 목표 항목 표시
- 올바른 영역 할당
- 적절한 그룹화 및 순서

#### 4.2.3 일별 체크인 (S-03)

**작업 항목:**
1. 날짜 선택기 생성 (기본: 오늘)
2. 주기에 관계없이 모든 목표 항목 표시
3. 체크/언체크 기능 구현
4. 체크 상태 표시 (체크/언체크 수)
5. 마지막 업데이트 타임스탬프 추가
6. 모바일 최적화 빠른 체크 UI 구현

**컴포넌트:**
- `src/app/(dashboard)/check/page.tsx` - 체크인 페이지
- `components/check/DatePicker.tsx` - 날짜 선택
- `components/check/GoalCheckList.tsx` - 체크박스가 있는 목표 항목 목록
- `components/check/QuickCheckToggle.tsx` - 모바일 친화적 토글

**API 엔드포인트:**
- `GET /api/check?date=YYYY-MM-DD` - 날짜별 체크 기록 조회
- `POST /api/check` - 체크 기록 생성/업데이트
- `DELETE /api/check` - 체크 삭제 (관리자만)

**핵심 기능:**
- 목표 개요와 동일한 영역별 그룹화
- 시각적 피드백: 체크된 항목 강조/흐림
- 미래 날짜 비활성화 상태
- 완료 시 "오늘 모두 체크 완료!" 축하 메시지
- 중복 체크 방지 (DB 고유 제약조건으로 강제)
- 변경 사항 감사 로그

**모바일 최적화:**
- 큰 터치 타겟 (최소 44px)
- 빠른 체크를 위한 스와이프 제스처 (선택 사항)
- 엄지 접근성을 위한 바텀 시트
- PWA 동기화와 오프라인 큐잉

**검증:**
- 모든 항목 체크/언체크 가능
- 날짜 선택기 네비게이션 작동
- 페이지 새로고침 후 체크 지속
- 동일 항목 2회 체크 불가 (DB 제약조건)
- 과거 날짜 수정 시 감사 로그 생성
- 실제 기기에서 모바일 반응형 테스트

---

### 4.3 3단계: 진행 상황 및 목표 (6-7주차)

#### 4.3.1 달성 현황 페이지 (S-04)

**작업 항목:**
1. 월별 진행 상황 뷰 생성
2. 누적 달성률 계산 구현
3. 기대 진행률 지표 추가
4. 연간 트렌드 시각화 표시
5. 항목별 및 전체 통계 표시

**컴포넌트:**
- `src/app/(dashboard)/progress/page.tsx` - 진행 상황 대시보드
- `components/progress/MonthlyProgressCard.tsx` - 월별 뷰
- `components/progress/CumulativeProgressBar.tsx` - 기대 진행률이 있는 진행률 바
- `components/progress/YearlyTrendChart.tsx` - 12개월 트렌드 (Recharts 사용)

**API 엔드포인트:**
- `GET /api/progress/monthly?year=YYYY&month=MM` - 월별 진행 상황
- `GET /api/progress/cumulative?year=YYYY` - 누적 달성률
- `GET /api/progress/yearly?year=YYYY` - 12개월 트렌드 데이터

**계산 공식:**

월별 진행 상황:
```
달성_횟수 = COUNT(check_records WHERE user_id=X AND goal_item_id=Y AND year=YYYY AND month=MM)
월간_목표 = personalTarget.target (또는 goalItem.defaultTarget)
월간_달성률 = (달성_횟수 / 월간_목표) × 100
```

누적 달성률:
```
누적_달성 = SUM(1월 1일부터 오늘까지의 모든 check_records)
연간_목표_합계 = SUM(연간 모든 월간 목표 OR SUM(모든 연간 항목의 personalTarget.target))
누적_달성률 = (누적_달성 / 연간_목표_합계) × 100
```

기대 진행률:
```
년_중_날짜 = (오늘 - 연_시작).days
기대_진행률 = (년_중_날짜 / 365) × 100
```

**핵심 기능:**
- **월별 뷰**: 각 항목의 달성 횟수, 목표, 달성률 표
- **누적 달성률**: 실제 vs 기대 비교의 큰 진행률 바
- **트렌드 차트**: 12개월간 월간 달성률 선 차트
- **색상 코딩**:
  - 초록: 정상 또는 선행 (실제 >= 기대)
  - 노랑: 약간 지연 (기대 - 10% <= 실제 < 기대)
  - 빨강: 상당히 지연 (실제 < 기대 - 10%)

**검증:**
- 샘플 데이터로 수동 계산 검증
- 누적 달성률 공식 일치
- 기대 진행률이 연중 날짜 정확히 반영
- 차트가 모든 12개월 올바르게 표시

#### 4.3.2 목표 설정 페이지 (S-05)

**작업 항목:**
1. 월별 목표 입력 인터페이스 생성
2. 연간 목표 자동 계산 구현
3. 사용자별 개별 설정 추가
4. 목표 변경 감사 추적 생성
5. 다른 사용자 목표 설정을 위한 관리자 뷰

**컴포넌트:**
- `src/app/(dashboard)/targets/page.tsx` - 목표 설정
- `components/target/TargetMonthSelector.tsx` - 월/연 선택기
- `components/target/TargetInputTable.tsx` - 편집 가능한 목표 표
- `components/target/YearlySummaryCard.tsx` - 자동 계산된 연간 합계

**API 엔드포인트:**
- `GET /api/targets?userId=X&year=YYYY` - 사용자 목표 조회
- `POST /api/targets` - 개인 목표 생성/업데이트
- `GET /api/targets/history?goalItemId=X` - 목표 변경 이력

**핵심 기능:**
- **기본값**: 월간 목표의 `(해당_월_일수 - 4)`
- **자동 합계**: 각 항목의 모든 12개월 합계 표시
- **개별 재정의**: 사용자가 월별 다른 목표 설정 가능
- **변경 이력**: 타임스탬프와 함께 이전 값 표시
- **대량 업데이트**: 관리자가 여러 사용자의 목표를 한 번에 설정

**검증:**
- 기본 목표 계산 정확 (월_일수 - 4)
- 연간 합계가 모든 월을 정확히 더함
- 변경 사항이 감사 로그 항목 생성
- 관리자가 다른 사용자 목표 보기/편집

---

### 4.4 4단계: 관리자 패널 (8주차)

#### 4.4.1 항목 관리 (S-06)

**작업 항목:**
1. 사명, 비전, 핵심가치 CRUD 인터페이스 생성
2. 목표 항목 관리 구축 (추가/편집/삭제)
3. 이력이 있는 소프트 삭제 구현
4. 항목 재정렬 기능 추가
5. 모든 변경의 감사 추적 생성

**컴포넌트:**
- `src/app/(dashboard)/admin/items/page.tsx` - 항목 관리
- `components/admin/MissionVisionEditor.tsx` - 사명/비전 에디터
- `components/admin/CoreValuesManager.tsx` - 핵심가치 CRUD
- `components/admin/GoalItemManager.tsx` - 목표 항목 CRUD
- `components/admin/AuditLogViewer.tsx` - 변경 이력

**API 엔드포인트:**
- `GET /api/admin/items` - 모든 항목 목록
- `POST /api/admin/items` - 항목 생성
- `PATCH /api/admin/items/:id` - 항목 업데이트
- `DELETE /api/admin/items/:id` - 항목 소프트 삭제
- `GET /api/admin/audit-logs` - 변경 이력 조회

**핵심 기능:**
- 사명/비전용 리치 텍스트 에디터
- 핵심가치용 인라인 편집
- 목표 항목용 드래그앤드롭 재정렬
- 하드 삭제 대신 활성화/비활성화 토글
- 누가/언제/무엇을 변경했는지 전체 이력 뷰

**검증:**
- 모든 콘텐츠 유형 추가/편집/삭제 가능
- 소프트 삭제가 과거 체크 기록에 영향주지 않음
- 재정렬이 올바르게 지속
- 감사 로그가 모든 변경 캡처

#### 4.4.2 사용자 관리 (S-07)

**작업 항목:**
1. 검색 및 필터가 있는 사용자 목록 생성
2. 사용자 활성화/비활성화 구현
3. 역할 관리 추가 (관리자/사용자)
4. 사용자 달성 요약 보기
5. 대량 사용자 작업 (선택 사항)

**컴포넌트:**
- `src/app/(dashboard)/admin/users/page.tsx` - 사용자 관리
- `components/admin/UserTable.tsx` - 작업이 있는 사용자 목록
- `components/admin/UserDetailModal.tsx` - 사용자 상세/편집
- `components/admin/UserProgressSummary.tsx` - 빠른 통계 뷰

**API 엔드포인트:**
- `GET /api/admin/users` - 사용자 목록 (페이지네이션 포함)
- `PATCH /api/admin/users/:id` - 사용자 업데이트 (역할, 활성 상태)
- `GET /api/admin/users/:id/progress` - 사용자 진행 상황 요약

**핵심 기능:**
- 정렬 가능한 열의 표 뷰
- 이름/이메일로 검색
- 역할/활성 상태로 필터링
- 빠른 작업 버튼 (활성화/비활성화, 승진/강등)
- 개별 사용자 달성률 보기
- 사용자 목록 내보내기 (CSV/Excel)

**검증:**
- 사용자 비활성화 가능 (로그인 불가)
- 사용자를 관리자로 승급 가능
- 검색 및 필터 올바르게 작동
- 사용자 진행 상황 요약이 정확한 데이터 표시

---

### 4.5 5단계: 마무리 및 출시 (9주차)

#### 4.5.1 PWA 설정

**작업 항목:**
1. next-pwa 구성
2. 앱 매니페스트 생성
3. 앱 아이콘 생성 (다양한 크기)
4. 오프라인 기능 테스트
5. 설치 프롬프트 추가 (선택 사항)

**파일:**
- `public/manifest.json` - PWA 매니페스트
- `next.config.js` - PWA 설정
- `public/icons/`의 아이콘 (192x192, 512x512)

**검증:**
- iOS/Android에 앱으로 설치
- 오프라인 작동 (캐시된 체크인 페이지)
- 푸시 알림 준비 (향후 기능)

#### 4.5.2 테스팅 및 품질 보증

**작업 항목:**
1. 다양한 기기에서 수동 테스트 (데스크톱, 태블릿, 모바일)
2. 크로스 브라우저 테스트 (Chrome, Safari, Edge)
3. 접근성 감사 (WCAG 2.1 AA)
4. 성능 최적화 (Lighthouse 점수 > 90)
5. 보안 감사 (SQL 인젝션, XSS, CSRF)

**테스트 체크리스트:**
- [ ] 모든 화면이 모바일에서 접근 가능
- [ ] 오프라인 체크인 작동 (PWA)
- [ ] 데이터가 올바르게 지속
- [ ] 인증 흐름 작동 (로그인, 로그아웃, 세션)
- [ ] 관리자 기능 보호됨
- [ ] 사용자가 다른 사용자 데이터 볼 수 없음
- [ ] 감사 로그가 모든 변경 캡처
- [ ] 계산이 정확함
- [ ] 콘솔 오류 없음
- [ ] 모든 중단점에서 반응형 디자인 작동

#### 4.5.3 문서화 및 배포

**작업 항목:**
1. 사용자 가이드 생성 (체크인, 진행 상황 보는 방법)
2. 관리자 매뉴얼 작성
3. 스테이징 환경 설정
4. 프로덕션 데이터베이스 구성
5. 프로덕션에 배포 (Vercel)
6. 백업 및 모니터링 설정

**문서 파일:**
- `docs/USER_GUIDE.md` - 최종 사용자 문서
- `docs/ADMIN_MANUAL.md` - 관리자 문서
- `README.md` - 기술 문서

**배포 단계:**
1. 프로덕션 PostgreSQL 데이터베이스 설정
2. 환경 변수 구성 (DATABASE_URL, NEXTAUTH_SECRET)
3. 프로덕션 데이터베이스에 마이그레이션 실행
4. 초기 데이터 시드
5. Vercel에 배포
6. 커스텀 도메인 구성
7. 자동 백업 설정

---

## 5. 주요 파일 요약

### 설정 파일
- `prisma/schema.prisma` - 데이터베이스 스키마
- `next.config.js` - Next.js 및 PWA 설정
- `.env` - 환경 변수

### 핵심 애플리케이션 파일
- `src/lib/prisma.ts` - Prisma 클라이언트 초기화
- `src/lib/auth.ts` - NextAuth 설정
- `src/middleware.ts` - 라우트 보호

### API 라우트
- `src/app/api/auth/[...nextauth]/route.ts` - 인증 핸들러
- `src/app/api/check/route.ts` - 체크인 CRUD
- `src/app/api/targets/route.ts` - 목표 CRUD
- `src/app/api/progress/route.ts` - 진행 상황 계산
- `src/app/api/admin/[...]/route.ts` - 관리자 엔드포인트

### 주요 컴포넌트
- `src/app/(dashboard)/page.tsx` - 랜딩 페이지
- `src/app/(dashboard)/check/page.tsx` - 일별 체크인
- `src/app/(dashboard)/progress/page.tsx` - 달성 현황
- `src/app/(dashboard)/admin/items/page.tsx` - 항목 관리

---

## 6. 구현 순서 (우선순위)

1. **1-2주차**: 설정, 데이터베이스, 인증
2. **3주차**: 랜딩 페이지, 목표 개요
3. **4주차**: 일별 체크인 (핵심)
4. **5주차**: 달성 현황 및 목표 설정
5. **8주차**: 관리자 패널
6. **9주차**: PWA, 테스트, 배포

---

## 7. 검증 계획

### 종합 테스트 시나리오

**시나리오 1: 첫 번째 사용자**
1. 사용자 가입 → 랜딩 페이지로 리디렉션
2. 사명/비전/가치 확인
3. 목표 개요로 네비게이션 → 모든 11개 항목 확인
4. 체크인으로 이동 → 5개 항목 체크
5. 진행 상황 확인 → 오늘 5/11 확인
6. 로그아웃 → 재로그인 → 체크 지속

**시나리오 2: 일별 사용**
1. 사용자가 앱 열기 → "미체크 항목 3개" 배너 확인
2. 체크인으로 이동 → 모든 체크 완료
3. 축하 메시지 확인
4. 진행 상황 확인 → 누적 달성률 확인

**시나리오 3: 관리자 워크플로우**
1. 관리자 로그인 → 항목 관리로 네비게이션
2. 목표 항목 편집 → 감사 로그 확인
3. 사용자 관리로 이동 → 사용자 비활성화
4. 다른 사용자의 맞춤 목표 설정
5. 사용자 달성 요약 확인

**시나리오 4: 모바일 오프라인**
1. 사용자가 휴대폰에서 앱 열기 → 오프라인
2. 3개 항목 체크 (로컬에 큐됨)
3. 온라인 복귀 → 변경 동기화
4. 새로고침 → 체크 지속

---

## 8. 미결 사항 및 위험

### 알려진 위험
1. **시간대 처리**: 날짜 기반 체크의 일관된 시간대 처리 필요
   - **완화**: 모든 날짜를 UTC로 저장, 사용자 로컬 시간대로 표시

2. **PWA 오프라인 동기화 복잡성**: 여러 기기가 오프라인으로 편집 시 충돌 해결
   - **완화**: 타임스탬프와 함께 마지막-쓰기-승리, 또는 초기에는 오프라인 편집 비활성화

3. **계산 정확성**: 누적 달성률의 엣지 케이스 (윤년, 부분 월)
   - **완화**: 날짜 계산을 위한 포괄적 단위 테스트

### 향후 고려사항
- **인증**: 나중에 소셜 로그인 (카카오, 구글) 추가 가능
- **알림**: 일별 체크인 리마인더 푸시 알림
- **공동체 대시보드**: 집계 통계 (익명)
- **데이터 내보내기**: 모든 개인 데이터 내보내기 (GDPR 준수)
- **다크 모드**: 시스템 환경설정 감지

---

## 9. 성공 기준

시스템이 완료된 것으로 간주되면:
- [ ] 사용자가 가입, 로그인, 일별 체크인 가능
- [ ] PRD의 모든 11개 목표 항목 추적
- [ ] 월별 및 누적 달성률이 올바르게 계산
- [ ] 관리자가 항목 및 사용자 관리 가능
- [ ] 모바일 기기에 PWA 설치
- [ ] 체크인 기능을 위해 오프라인 작동
- [ ] 감사 로그가 모든 데이터 변경 캡처
- [ ] 모바일 UI가 터치 친화적이고 반응형
- [ ] 마이그레이션을 통해 모든 데이터가 올바르게 지속
- [ ] 모든 메트릭에서 Lighthouse 점수 > 90

---

**구현 계획 종료**
