// Mock 데이터 예시 (실제 개발 전까지 사용)

export const mockMission = {
  title: "나눔 코칭",
  verse: "",
  verseText: "말씀을 행하는 자가 되고, 듣기만 하여 자신을 속이는 자가 되지 말라",
  description: "말씀을 듣기만 하여 자신을 속이는 자가 되지 않고 말씀을 행하는 삶을 살아낸다",
}

export const mockVision = {
  title: "비전",
  content: "1년에 10회 이상 난민학교에서 '어성경' 강의로 청소년들이 말씀을 읽을 수 있도록 돕는다",
  subtitle: "영어로 된 강의안을 잘 만들고 외워서 강의하는 '어성경' 전문강사가 된다",
}

export const mockCoreValues = [
  { id: 1, title: "정직", description: "거짓을 버리고 각각 그 이웃으로 더불어 참된 것을 말하기", icon: "Shield", verse: "엡 4:25" },
  { id: 2, title: "충성", description: "빠짐없는 일별 체크와 연속 달성", icon: "HeartHandshake", verse: "고전 4:2" },
  { id: 3, title: "온유함", description: "미달성 시 비난 없는 중립적 피드백", icon: "Feather", verse: "빌 4:5" },
  { id: 4, title: "기록", description: "달려가면서도 읽을 수 있게 — 모바일 친화적 체크 UI", icon: "BookOpen", verse: "합 2:2" },
  { id: 5, title: "변화", description: "이전 달 대비 변화량 시각화", icon: "TrendingUp", verse: "사 43:19" },
  { id: 6, title: "성장", description: "누적 달성률 트렌드 그래프", icon: "LineChart", verse: "골 2:7" },
]

export type GoalArea = "INTELLECTUAL" | "SPIRITUAL" | "PHYSICAL" | "SOCIAL"
export type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"

export interface GoalAreaInfo {
  area: GoalArea
  goal: string
}

export const mockGoalAreaInfos: GoalAreaInfo[] = [
  {
    area: "INTELLECTUAL",
    goal: "배우고 행하고 가르치기",
  },
  {
    area: "SPIRITUAL",
    goal: "하나님과 친밀해지는 시간, 성령님의 음성 듣기",
  },
  {
    area: "PHYSICAL",
    goal: "몸도 마음도 영도 짱인 삶",
  },
  {
    area: "SOCIAL",
    goal: "교회 공동체 (목장, 청소년부)",
  },
]

export interface GoalItem {
  id: string
  code: string
  area: GoalArea
  title: string
  description?: string
  period: Period
  defaultTarget: number
  targetUnit: string
  active?: boolean
}

export const mockGoalItems: GoalItem[] = [
  // 지적 (INTELLECTUAL) - 4.1
  { id: "4.1.1", code: "4.1.1", area: "INTELLECTUAL", title: "유튜브 채널 듣기 + 추천 책 읽고 독후감 작성", period: "DAILY", defaultTarget: 1, targetUnit: "회/일" },
  { id: "4.1.2", code: "4.1.2", area: "INTELLECTUAL", title: "'어성경' 강의안 한국어·영어 정리 및 업데이트", period: "WEEKLY", defaultTarget: 1, targetUnit: "회/주" },

  // 영적 (SPIRITUAL) - 4.2
  { id: "4.2.1", code: "4.2.1", area: "SPIRITUAL", title: "아침 큐티(말씀묵상) 후 가족·목장 단체톡 공유", period: "DAILY", defaultTarget: 1, targetUnit: "회/일 (월 30회, 연 365회)" },
  { id: "4.2.2", code: "4.2.2", area: "SPIRITUAL", title: "찬양 듣기", period: "DAILY", defaultTarget: 1, targetUnit: "곡/일 (월 30곡, 연 365곡)" },
  { id: "4.2.3", code: "4.2.3", area: "SPIRITUAL", title: "성경 듣기", period: "DAILY", defaultTarget: 5, targetUnit: "장/일 (월 140장, 연 1680장)" },
  { id: "4.2.4", code: "4.2.4", area: "SPIRITUAL", title: "중보기도문 읽고 기도하기", period: "DAILY", defaultTarget: 1, targetUnit: "회/일 (월 30회, 연 365회)" },

  // 신체 (PHYSICAL) - 4.3
  { id: "4.3.1", code: "4.3.1", area: "PHYSICAL", title: "코어 힘주기 + 바른 자세 유지 (앉기/서기)", period: "DAILY", defaultTarget: 1, targetUnit: "회/일 (의식적 체크)" },
  { id: "4.3.2", code: "4.3.2", area: "PHYSICAL", title: "12km 완주", period: "MONTHLY", defaultTarget: 1, targetUnit: "회/월" },
  { id: "4.3.3", code: "4.3.3", area: "PHYSICAL", title: "골프 라운딩 (유산소)", period: "WEEKLY", defaultTarget: 3, targetUnit: "회 이상/주" },

  // 사회 (SOCIAL) - 4.4
  { id: "4.4.1", code: "4.4.1", area: "SOCIAL", title: "목장예배 + 목원과 말씀 나눔 + 식사", period: "MONTHLY", defaultTarget: 2, targetUnit: "회 이상/월" },
  { id: "4.4.2", code: "4.4.2", area: "SOCIAL", title: "청소년부 선생님·학생과 교제 및 중보기도", period: "WEEKLY", defaultTarget: 1, targetUnit: "회/주" },
  { id: "4.4.3", code: "4.4.3", area: "SOCIAL", title: "난민학교 강의 (MIKS 8회, TOUCH 2회)", period: "YEARLY", defaultTarget: 10, targetUnit: "회 이상/년" },
  { id: "4.4.4", code: "4.4.4", area: "SOCIAL", title: "남편과 미·고·사·축 말하기", period: "WEEKLY", defaultTarget: 1, targetUnit: "회 이상/주" },
]

export interface CheckRecord {
  goalItemId: string
  date: string
  checked: boolean
  checkedAt?: string
}

export const mockCheckRecords: CheckRecord[] = [
  { goalItemId: "4.1.1", date: "2026-05-27", checked: true, checkedAt: "2026-05-27T07:00:00" },
  { goalItemId: "4.2.1", date: "2026-05-27", checked: true, checkedAt: "2026-05-27T07:30:00" },
  { goalItemId: "4.2.2", date: "2026-05-27", checked: true, checkedAt: "2026-05-27T07:35:00" },
]

export interface User {
  id: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  active?: boolean
  achievementRate?: number
}

export const mockUser: User = {
  id: "mock-user-1",
  name: "홍길동",
  email: "honggildong@example.com",
  role: "USER",
}

export const mockUsers: User[] = [
  { id: "1", name: "홍길동", email: "hong@example.com", role: "USER", active: true, achievementRate: 85.3 },
  { id: "2", name: "김철수", email: "kim@example.com", role: "ADMIN", active: true, achievementRate: 92.1 },
  { id: "3", name: "이영희", email: "lee@example.com", role: "USER", active: true, achievementRate: 78.5 },
  { id: "4", name: "박민수", email: "park@example.com", role: "USER", active: false, achievementRate: 65.2 },
]

export interface ProgressItem {
  goalItem: string
  achievement: number
  target: number
  rate: number
}

export const mockProgress = {
  monthly: [
    { goalItem: "아침 큐티", achievement: 25, target: 27, rate: 92.6 },
    { goalItem: "찬양 듣기", achievement: 27, target: 27, rate: 100 },
    { goalItem: "성경 듣기", achievement: 120, target: 135, rate: 88.9 },
    { goalItem: "중보기도", achievement: 26, target: 27, rate: 96.3 },
    { goalItem: "코어 힘주기", achievement: 27, target: 27, rate: 100 },
  ],
  cumulative: {
    actual: 42.3,
    expected: 40.3,
  },
  yearlyTrend: [
    { month: "1월", rate: 95.2 },
    { month: "2월", rate: 87.5 },
    { month: "3월", rate: 92.1 },
    { month: "4월", rate: 89.3 },
    { month: "5월", rate: 91.8 },
    { month: "6월", rate: 88.9 },
    { month: "7월", rate: 93.2 },
    { month: "8월", rate: 90.5 },
    { month: "9월", rate: 87.8 },
    { month: "10월", rate: 92.7 },
    { month: "11월", rate: 89.4 },
    { month: "12월", rate: 94.1 },
  ],
}

export interface TargetItem {
  goalItemId: string
  title: string
  monthlyTargets: number[]
  yearlySum: number
}

export const mockTargets: TargetItem[] = [
  {
    goalItemId: "4.2.1",
    title: "아침 큐티",
    monthlyTargets: [27, 24, 27, 26, 27, 26, 27, 27, 26, 27, 26, 27],
    yearlySum: 320,
  },
  {
    goalItemId: "4.2.2",
    title: "찬양 듣기",
    monthlyTargets: [27, 24, 27, 26, 27, 26, 27, 27, 26, 27, 26, 27],
    yearlySum: 320,
  },
]

// Goal area colors and icons
export const goalAreaConfig = {
  INTELLECTUAL: {
    label: "지적",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  SPIRITUAL: {
    label: "영적",
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  PHYSICAL: {
    label: "신체",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  SOCIAL: {
    label: "사회",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
}

export const periodLabels: Record<Period, string> = {
  DAILY: "매일",
  WEEKLY: "주간",
  MONTHLY: "월간",
  YEARLY: "연간",
}
