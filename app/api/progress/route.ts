import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { startOfMonth, endOfMonth, startOfDay } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    const now = new Date()
    const year = yearParam ? parseInt(yearParam) : now.getFullYear()
    const month = monthParam ? parseInt(monthParam) : now.getMonth() + 1

    // Get all active goal items
    const goalItems = await prisma.goalItem.findMany({
      where: { active: true },
    })

    // Fetch ALL check records for the entire year at once
    const yearStart = startOfDay(new Date(year, 0, 1))
    const yearEnd = startOfDay(new Date(year, 11, 31))

    const allCheckRecords = await prisma.checkRecord.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: yearStart,
          lte: yearEnd,
        },
        checked: true,
      },
      select: {
        goalItemId: true,
        date: true,
      },
    })

    // Group check records by goalItemId and month for efficient lookup
    const checksByGoalAndMonth = new Map<string, Map<number, number>>()

    for (const record of allCheckRecords) {
      const recordMonth = record.date.getMonth() + 1 // 1-12

      if (!checksByGoalAndMonth.has(record.goalItemId)) {
        checksByGoalAndMonth.set(record.goalItemId, new Map())
      }

      const monthMap = checksByGoalAndMonth.get(record.goalItemId)!
      monthMap.set(recordMonth, (monthMap.get(recordMonth) || 0) + 1)
    }

    // Calculate monthly progress for each item
    const monthStart = startOfMonth(new Date(year, month - 1))
    const monthEnd = endOfMonth(new Date(year, month - 1))

    const monthlyProgress = []

    for (const item of goalItems) {
      const monthlyTarget = item.defaultTarget
      const daysInMonth = new Date(year, month, 0).getDate()
      let monthlyTargetExpected = 0

      switch (item.period) {
        case 'DAILY':
          monthlyTargetExpected = monthlyTarget * daysInMonth
          break
        case 'WEEKLY':
          monthlyTargetExpected = monthlyTarget * 4
          break
        case 'MONTHLY':
          monthlyTargetExpected = monthlyTarget
          break
        case 'YEARLY':
          continue
      }

      // Get count from pre-fetched data
      const monthMap = checksByGoalAndMonth.get(item.id)
      const checkRecords = monthMap?.get(month) || 0

      monthlyProgress.push({
        goalItemId: item.id,
        code: item.code,
        title: item.title,
        achievement: checkRecords,
        target: monthlyTargetExpected,
        rate: monthlyTargetExpected > 0 ? (checkRecords / monthlyTargetExpected) * 100 : 0,
      })
    }

    // Calculate cumulative progress (year to date)
    let totalAchievement = 0
    let totalTargetExpected = 0

    for (const item of goalItems) {
      const monthMap = checksByGoalAndMonth.get(item.id)

      // Sum all months for this goal item
      let itemYearlyTotal = 0
      if (monthMap) {
        for (const count of monthMap.values()) {
          itemYearlyTotal += count
        }
      }

      totalAchievement += itemYearlyTotal
      totalTargetExpected += item.yearlyTarget || 0
    }

    const actualRate = totalTargetExpected > 0 ? (totalAchievement / totalTargetExpected) * 100 : 0

    // Calculate monthly trend data for all 12 months
    const monthlyTrend = []

    for (let m = 1; m <= 12; m++) {
      const daysInMonth = new Date(year, m, 0).getDate()
      let monthTotalAchievement = 0
      let monthTotalTarget = 0

      for (const item of goalItems) {
        if (item.period === 'YEARLY') continue

        const monthlyTarget = item.defaultTarget

        switch (item.period) {
          case 'DAILY':
            monthTotalTarget += monthlyTarget * daysInMonth
            break
          case 'WEEKLY':
            monthTotalTarget += monthlyTarget * 4
            break
          case 'MONTHLY':
            monthTotalTarget += monthlyTarget
            break
        }

        const monthMap = checksByGoalAndMonth.get(item.id)
        monthTotalAchievement += monthMap?.get(m) || 0
      }

      monthlyTrend.push({
        month: `${m}월`,
        planned: monthTotalTarget,
        actual: monthTotalAchievement,
        rate: monthTotalTarget > 0 ? (monthTotalAchievement / monthTotalTarget) * 100 : 0,
      })
    }

    return NextResponse.json({
      monthly: monthlyProgress,
      cumulative: {
        actual: actualRate.toFixed(1),
        totalAchievement,
        totalTargetExpected,
      },
      monthlyTrend,
      year,
      month,
    })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json(
      { error: '진행률을 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}
