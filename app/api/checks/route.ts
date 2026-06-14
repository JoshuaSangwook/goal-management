import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { startOfDay, endOfDay } from 'date-fns'

// Force Node.js runtime for consistent performance
export const runtime = 'nodejs'

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date')
    const date = dateParam ? new Date(dateParam) : new Date()

    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    // Get check records for the user on the specified date
    const checkRecords = await prisma.checkRecord.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      include: {
        goalItem: {
          include: {
            areaInfo: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      checkRecords,
      date: dayStart.toISOString(),
    })
  } catch (error) {
    console.error('Checks API error:', error)
    return NextResponse.json(
      { error: '체크 기록을 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { goalItemId, checked, date } = body

    if (!goalItemId) {
      return NextResponse.json(
        { error: 'goalItemId is required' },
        { status: 400 }
      )
    }

    const checkDate = date ? startOfDay(new Date(date)) : startOfDay(new Date())

    // Optimized: Skip goalItem verification - FK constraint handles validation
    // Minimal response - only return what's needed
    const checkRecord = await prisma.checkRecord.upsert({
      where: {
        userId_goalItemId_date: {
          userId: session.user.id,
          goalItemId,
          date: checkDate,
        },
      },
      update: {
        checked,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        goalItemId,
        date: checkDate,
        checked,
      },
      select: {
        id: true,
        goalItemId: true,
        checked: true,
        date: true,
        createdAt: true,
      },
    })

    return NextResponse.json(checkRecord)
  } catch (error) {
    console.error('Check POST API error:', error)
    return NextResponse.json(
      { error: '체크 기록을 저장하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
