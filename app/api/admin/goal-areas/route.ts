import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const goalAreaInfos = await prisma.goalAreaInfo.findMany({
      include: {
        goalItems: {
          where: { active: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [{ area: 'asc' }],
    })

    return NextResponse.json({ goalAreaInfos })
  } catch (error) {
    console.error('Goal Areas API error:', error)
    return NextResponse.json(
      { error: '목표 영역 정보를 가져오는데 실패했습니다' },
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
    const { area, goal } = body

    if (!area) {
      return NextResponse.json(
        { error: 'area is required' },
        { status: 400 }
      )
    }

    const updated = await prisma.goalAreaInfo.update({
      where: { area },
      data: { goal },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Goal Areas PUT error:', error)
    return NextResponse.json(
      { error: '목표 영역 정보를 수정하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
