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

    // Calculate monthly progress for each item
    const monthlyProgress = []
    for (const item of goalItems) {
      const monthStart = startOfMonth(new Date(year, month - 1))
      const monthEnd = endOfMonth(new Date(year, month - 1))

      // Get monthly target for this item
      const monthlyTarget = item.defaultTarget

      // Calculate monthly target based on period
      const daysInMonth = new Date(year, month, 0).getDate()
      let monthlyTargetExpected = 0

      switch (item.period) {
        case 'DAILY':
          monthlyTargetExpected = monthlyTarget * daysInMonth
          break
        case 'WEEKLY':
          monthlyTargetExpected = monthlyTarget * 4 // Approx 4 weeks per month
          break
        case 'MONTHLY':
          monthlyTargetExpected = monthlyTarget
          break
        case 'YEARLY':
          // Skip YEARLY items for monthly progress
          continue
      }

      // Count check records for this month
      const checkRecords = await prisma.checkRecord.count({
        where: {
          userId: session.user.id,
          goalItemId: item.id,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
          checked: true,
        },
      })

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
    const yearStart = startOfDay(new Date(year, 0, 1))
    const yearEnd = startOfDay(now)

    let totalAchievement = 0
    let totalTargetExpected = 0

    // Calculate yearly targets (sum of all items' yearly targets)
    for (const item of goalItems) {
      // Count actual achievements for this year
      const checkCount = await prisma.checkRecord.count({
        where: {
          userId: session.user.id,
          goalItemId: item.id,
          date: {
            gte: yearStart,
            lte: yearEnd,
          },
          checked: true,
        },
      })

      totalAchievement += checkCount

      // Use yearly target for cumulative calculation
      totalTargetExpected += item.yearlyTarget || 0
    }

    const actualRate = totalTargetExpected > 0 ? (totalAchievement / totalTargetExpected) * 100 : 0

    // Calculate monthly trend data for all 12 months
    const monthlyTrend = []

    for (let m = 1; m <= 12; m++) {
      const monthStart = startOfMonth(new Date(year, m - 1))
      const monthEnd = endOfMonth(new Date(year, m - 1))

      let monthTotalAchievement = 0
      let monthTotalTarget = 0

      for (const item of goalItems) {
        // For YEARLY items, don't include in monthly calculation
        if (item.period === 'YEARLY') continue

        // Get monthly target for this item (use defaultTarget as monthly target)
        const monthlyTarget = item.defaultTarget

        // Calculate expected target for the month based on period
        const daysInMonth = new Date(year, m, 0).getDate()

        switch (item.period) {
          case 'DAILY':
            monthTotalTarget += monthlyTarget * daysInMonth
            break
          case 'WEEKLY':
            monthTotalTarget += monthlyTarget * 4 // Approx 4 weeks per month
            break
          case 'MONTHLY':
            monthTotalTarget += monthlyTarget
            break
        }

        // Count actual achievements for this month
        const checkCount = await prisma.checkRecord.count({
          where: {
            userId: session.user.id,
            goalItemId: item.id,
            date: {
              gte: monthStart,
              lte: monthEnd,
            },
            checked: true,
          },
        })

        monthTotalAchievement += checkCount
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
