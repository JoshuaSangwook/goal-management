import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const goalItems = await prisma.goalItem.findMany({
      include: { areaInfo: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ goalItems })
  } catch (error) {
    console.error('Goal Items API error:', error)
    return NextResponse.json(
      { error: '목표 아이템을 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { area, title, description, period, defaultTarget, targetUnit, monthlyTarget, yearlyTarget } = body

    if (!area || !title || !period) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Auto-generate code if not provided (use timestamp)
    const code = `GOAL-${Date.now()}`

    // Get area info
    const areaInfo = await prisma.goalAreaInfo.findUnique({
      where: { area },
    })

    if (!areaInfo) {
      return NextResponse.json(
        { error: 'Area not found' },
        { status: 404 }
      )
    }

    // Get max order
    const maxOrder = await prisma.goalItem.findFirst({
      orderBy: { order: 'desc' },
    })

    const newGoalItem = await prisma.goalItem.create({
      data: {
        code,
        area,
        title,
        description: description || null,
        period,
        defaultTarget,
        targetUnit,
        monthlyTarget: monthlyTarget || 0,
        yearlyTarget: yearlyTarget || 0,
        areaId: areaInfo.id,
        order: (maxOrder?.order || 0) + 1,
        active: true,
      },
    })

    return NextResponse.json(newGoalItem, { status: 201 })
  } catch (error) {
    console.error('Goal Items POST error:', error)
    return NextResponse.json(
      { error: '목표 아이템을 생성하는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { id, area, title, period, defaultTarget, targetUnit, monthlyTarget, yearlyTarget, active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Build update data dynamically based on what's provided
    const updateData: any = {}

    if (area !== undefined) updateData.area = area
    if (title !== undefined) updateData.title = title
    if (period !== undefined) updateData.period = period
    if (defaultTarget !== undefined) updateData.defaultTarget = defaultTarget
    if (targetUnit !== undefined) updateData.targetUnit = targetUnit
    if (monthlyTarget !== undefined) updateData.monthlyTarget = monthlyTarget
    if (yearlyTarget !== undefined) updateData.yearlyTarget = yearlyTarget
    if (active !== undefined) updateData.active = active

    // If area is being updated, update the areaId as well
    if (area !== undefined) {
      const areaInfo = await prisma.goalAreaInfo.findUnique({
        where: { area },
      })
      if (areaInfo) {
        updateData.areaId = areaInfo.id
      }
    }

    const updated = await prisma.goalItem.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Goal Items PUT error:', error)
    return NextResponse.json(
      { error: '목표 아이템을 수정하는데 실패했습니다' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    // Soft delete
    await prisma.goalItem.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Goal Items DELETE error:', error)
    return NextResponse.json(
      { error: '목표 아이템을 삭제하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
