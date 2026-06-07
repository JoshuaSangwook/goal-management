import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const missionVisions = await prisma.missionVision.findMany({
      orderBy: [{ type: 'asc' }],
    })

    return NextResponse.json({ missionVisions })
  } catch (error) {
    console.error('Public Mission/Vision API error:', error)
    return NextResponse.json(
      { error: '미션/비전을 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}
