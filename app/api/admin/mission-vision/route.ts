import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { MvType } from '@prisma/client'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const missionVisions = await prisma.missionVision.findMany({
      orderBy: [{ type: 'asc' }],
    })

    return NextResponse.json({ missionVisions })
  } catch (error) {
    console.error('Mission/Vision API error:', error)
    return NextResponse.json(
      { error: '미션/비전을 가져오는데 실패했습니다' },
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
    const { id, type, content, subtitle } = body

    if (!id || !type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updated = await prisma.missionVision.update({
      where: { id },
      data: { content, subtitle },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Mission/Vision PUT error:', error)
    return NextResponse.json(
      { error: '미션/비전을 수정하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
