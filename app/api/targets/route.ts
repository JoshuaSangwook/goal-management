import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month')

    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear()
    const month = monthParam ? parseInt(monthParam) : new Date().getMonth() + 1

    // Get personal targets for the user
    const personalTargets = await prisma.personalTarget.findMany({
      where: {
        userId: session.user.id,
        year,
        month,
      },
      include: {
        goalItem: true,
      },
    })

    // If no personal targets exist, create default ones based on goal items
    if (personalTargets.length === 0) {
      const goalItems = await prisma.goalItem.findMany({
        where: { active: true },
      })

      const newTargets = []
      for (const item of goalItems) {
        // Calculate default target: (days in month - 4)
        const daysInMonth = new Date(year, month, 0).getDate()
        const defaultTarget = daysInMonth - 4

        const target = await prisma.personalTarget.create({
          data: {
            userId: session.user.id,
            goalItemId: item.id,
            year,
            month,
            target: defaultTarget,
          },
          include: {
            goalItem: true,
          },
        })
        newTargets.push(target)
      }

      return NextResponse.json({
        targets: newTargets,
        year,
        month,
        isFirstSet: true,
      })
    }

    return NextResponse.json({
      targets: personalTargets,
      year,
      month,
      isFirstSet: false,
    })
  } catch (error) {
    console.error('Targets API error:', error)
    return NextResponse.json(
      { error: '목표 설정을 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { targetId, newTarget } = body

    if (!targetId || newTarget === undefined) {
      return NextResponse.json(
        { error: 'targetId and newTarget are required' },
        { status: 400 }
      )
    }

    // Get existing target
    const existingTarget = await prisma.personalTarget.findUnique({
      where: { id: targetId },
      include: { goalItem: true },
    })

    if (!existingTarget) {
      return NextResponse.json(
        { error: 'Target not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (existingTarget.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Record history
    await prisma.targetHistory.create({
      data: {
        userId: existingTarget.userId,
        goalItemId: existingTarget.goalItemId,
        year: existingTarget.year,
        month: existingTarget.month,
        oldTarget: existingTarget.target,
        newTarget,
        changedBy: session.user.name,
      },
    })

    // Update target
    const updatedTarget = await prisma.personalTarget.update({
      where: { id: targetId },
      data: { target: newTarget },
      include: { goalItem: true },
    })

    return NextResponse.json(updatedTarget)
  } catch (error) {
    console.error('Target PUT API error:', error)
    return NextResponse.json(
      { error: '목표 설정을 수정하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
