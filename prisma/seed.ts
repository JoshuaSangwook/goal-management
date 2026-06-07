import { PrismaClient, UserRole, GoalArea, Period, MvType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성 시작...')

  // 1. 관리자 사용자 생성
  const hashedPassword = await bcrypt.hash('admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '관리자',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  })
  console.log('✅ 관리자 생성:', admin.email)

  // 2. 일반 사용자 생성
  const userPassword = await bcrypt.hash('user123!', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '홍길동',
      password: userPassword,
      role: UserRole.USER,
    },
  })
  console.log('✅ 일반 사용자 생성:', user.email)

  // 3. 미션 & 비전 생성
  const mission = await prisma.missionVision.upsert({
    where: { id: 'mission-1' },
    update: {
      title: '나눔 코칭',
      subtitle: '말씀을 듣기만 하여 자신을 속이는 자가 되지 않고 말씀을 행하는 삶을 살아낸다',
      content: '(약1:22) 너희는 말씀을 행하는 자가 되고 듣기만하여 자신을 속이는 자가 되지말라',
    },
    create: {
      id: 'mission-1',
      type: MvType.MISSION,
      title: '나눔 코칭',
      content: '(약1:22) 너희는 말씀을 행하는 자가 되고 듣기만하여 자신을 속이는 자가 되지말라',
      subtitle: '말씀을 듣기만 하여 자신을 속이는 자가 되지 않고 말씀을 행하는 삶을 살아낸다',
    },
  })

  const vision = await prisma.missionVision.upsert({
    where: { id: 'vision-1' },
    update: {},
    create: {
      id: 'vision-1',
      type: MvType.VISION,
      title: '비전',
      content: '1년에 10회 이상 난민학교에서 \'어성경\' 강의로 청소년들이 말씀을 읽을 수 있도록 돕는다',
      subtitle: '영어로 된 강의안을 잘 만들고 외워서 강의하는 \'어성경\' 전문강사가 된다',
    },
  })
  console.log('✅ 미션 & 비전 생성')

  // 4. 핵심가치 생성
  const coreValues = [
    { title: '정직', description: '거짓을 버리고 각각 그 이웃으로 더불어 참된 것을 말하기', icon: 'Shield', verse: '엡 4:25', order: 1 },
    { title: '충성', description: '빠짐없는 일별 체크와 연속 달성', icon: 'HeartHandshake', verse: '고전 4:2', order: 2 },
    { title: '온유함', description: '미달성 시 비난 없는 중립적 피드백', icon: 'Feather', verse: '빌 4:5', order: 3 },
    { title: '기록', description: '달려가면서도 읽을 수 있게 — 모바일 친화적 체크 UI', icon: 'BookOpen', verse: '합 2:2', order: 4 },
    { title: '변화', description: '이전 달 대비 변화량 시각화', icon: 'TrendingUp', verse: '사 43:19', order: 5 },
    { title: '성장', description: '누적 달성률 트렌드 그래프', icon: 'LineChart', verse: '골 2:7', order: 6 },
  ]

  for (const cv of coreValues) {
    await prisma.coreValue.upsert({
      where: { id: `cv-${cv.order}` },
      update: {},
      create: {
        id: `cv-${cv.order}`,
        ...cv,
      },
    })
  }
  console.log('✅ 핵심가치 6개 생성')

  // 5. 목표 영역 정보 생성
  const areaInfos = [
    {
      area: GoalArea.INTELLECTUAL,
      goal: '배우고 행하고 가르치기',
      target: '난민학교 (MIKS PUDU, MIKS AMPANG, TOUCH)',
      strategy: '눅 2:52 — 예수는 지혜가 자라가며...',
    },
    {
      area: GoalArea.SPIRITUAL,
      goal: '하나님과 친밀해지는 시간, 성령님의 음성 듣기',
      target: '개인의 영적 생활',
      strategy: '눅 2:52 — 하나님과 사람에게 더욱 사랑스러워 가시더라',
    },
    {
      area: GoalArea.PHYSICAL,
      goal: '몸도 마음도 영도 짱인 삶',
      target: '건강 관리',
      strategy: '눅 2:52 — 키가 자라가며...',
    },
    {
      area: GoalArea.SOCIAL,
      goal: '교회 공동체 (목장, 청소년부)',
      target: '목장, 청소년부',
      strategy: '눅 2:52 — 사람에게 더욱 사랑스러워 가시더라',
    },
  ]

  for (const ai of areaInfos) {
    await prisma.goalAreaInfo.upsert({
      where: { area: ai.area },
      update: {},
      create: ai,
    })
  }
  console.log('✅ 목표 영역 정보 4개 생성')

  // 6. 목표 아이템 생성
  const goalItems = [
    // 지적 (INTELLECTUAL)
    { code: '4.1.1', area: GoalArea.INTELLECTUAL, title: '유튜브 채널 듣기 + 추천 책 읽고 독후감 작성', period: Period.DAILY, defaultTarget: 1, targetUnit: '회/일', monthlyTarget: 30, yearlyTarget: 365, order: 1 },
    { code: '4.1.2', area: GoalArea.INTELLECTUAL, title: '\'어성경\' 강의안 한국어·영어 정리 및 업데이트', period: Period.WEEKLY, defaultTarget: 1, targetUnit: '회/주', monthlyTarget: 4, yearlyTarget: 52, order: 2 },

    // 영적 (SPIRITUAL)
    { code: '4.2.1', area: GoalArea.SPIRITUAL, title: '아침 큐티(말씀묵상) 후 가족·목장 단체톡 공유', period: Period.DAILY, defaultTarget: 1, targetUnit: '회/일 (월 30회, 연 365회)', monthlyTarget: 30, yearlyTarget: 365, order: 3 },
    { code: '4.2.2', area: GoalArea.SPIRITUAL, title: '찬양 듣기', period: Period.DAILY, defaultTarget: 1, targetUnit: '곡/일 (월 30곡, 연 365곡)', monthlyTarget: 30, yearlyTarget: 365, order: 4 },
    { code: '4.2.3', area: GoalArea.SPIRITUAL, title: '성경 듣기', period: Period.DAILY, defaultTarget: 5, targetUnit: '장/일 (월 140장, 연 1680장)', monthlyTarget: 140, yearlyTarget: 1680, order: 5 },
    { code: '4.2.4', area: GoalArea.SPIRITUAL, title: '중보기도문 읽고 기도하기', period: Period.DAILY, defaultTarget: 1, targetUnit: '회/일 (월 30회, 연 365회)', monthlyTarget: 30, yearlyTarget: 365, order: 6 },

    // 신체 (PHYSICAL)
    { code: '4.3.1', area: GoalArea.PHYSICAL, title: '코어 힘주기 + 바른 자세 유지 (앉기/서기)', period: Period.DAILY, defaultTarget: 1, targetUnit: '회/일 (의식적 체크)', monthlyTarget: 30, yearlyTarget: 365, order: 7 },
    { code: '4.3.2', area: GoalArea.PHYSICAL, title: '12km 완주', period: Period.MONTHLY, defaultTarget: 1, targetUnit: '회/월', monthlyTarget: 1, yearlyTarget: 12, order: 8 },
    { code: '4.3.3', area: GoalArea.PHYSICAL, title: '골프 라운딩 (유산소)', period: Period.WEEKLY, defaultTarget: 3, targetUnit: '회 이상/주', monthlyTarget: 12, yearlyTarget: 144, order: 9 },

    // 사회 (SOCIAL)
    { code: '4.4.1', area: GoalArea.SOCIAL, title: '목장예배 + 목원과 말씀 나눔 + 식사', period: Period.MONTHLY, defaultTarget: 2, targetUnit: '회 이상/월', monthlyTarget: 2, yearlyTarget: 24, order: 10 },
    { code: '4.4.2', area: GoalArea.SOCIAL, title: '청소년부 선생님·학생과 교제 및 중보기도', period: Period.WEEKLY, defaultTarget: 1, targetUnit: '회/주', monthlyTarget: 4, yearlyTarget: 52, order: 11 },
    { code: '4.4.3', area: GoalArea.SOCIAL, title: '난민학교 강의 (MIKS 8회, TOUCH 2회)', period: Period.YEARLY, defaultTarget: 10, targetUnit: '회 이상/년', monthlyTarget: 0, yearlyTarget: 10, order: 12 },
    { code: '4.4.4', area: GoalArea.SOCIAL, title: '남편과 미·고·사·축 말하기', period: Period.WEEKLY, defaultTarget: 1, targetUnit: '회 이상/주', monthlyTarget: 4, yearlyTarget: 52, order: 13 },
  ]

  for (const item of goalItems) {
    const areaInfo = await prisma.goalAreaInfo.findUnique({
      where: { area: item.area },
    })

    await prisma.goalItem.upsert({
      where: { code: item.code },
      update: {
        active: true,
        monthlyTarget: item.monthlyTarget,
        yearlyTarget: item.yearlyTarget,
      },
      create: {
        ...item,
        active: true,
        areaId: areaInfo!.id,
      },
    })
  }
  console.log('✅ 목표 아이템 13개 생성')

  // 7. 샘플 체크 기록 생성 (최근 7일)
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    // 일일 목표 몇 개 체크
    const dailyItems = await prisma.goalItem.findMany({
      where: { period: Period.DAILY },
    })

    for (const item of dailyItems.slice(0, Math.floor(Math.random() * 4) + 2)) {
      await prisma.checkRecord.upsert({
        where: {
          userId_goalItemId_date: {
            userId: user.id,
            goalItemId: item.id,
            date,
          },
        },
        update: {},
        create: {
          userId: user.id,
          goalItemId: item.id,
          date,
          checked: true,
        },
      })
    }
  }
  console.log('✅ 샘플 체크 기록 생성')

  console.log('🎉 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
