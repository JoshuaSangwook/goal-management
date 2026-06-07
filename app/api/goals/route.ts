import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all goal items with area info
    const goalItems = await prisma.goalItem.findMany({
      where: { active: true },
      include: {
        areaInfo: true,
      },
      orderBy: { order: 'asc' },
    })

    // Get all area infos
    const areaInfos = await prisma.goalAreaInfo.findMany({
      orderBy: [{ area: 'asc' }],
    })

    return NextResponse.json({
      goalItems,
      areaInfos,
    })
  } catch (error) {
    console.error('Goals API error:', error)
    return NextResponse.json(
      { error: '목표를 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}
