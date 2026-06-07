import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const coreValues = await prisma.coreValue.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ coreValues })
  } catch (error) {
    console.error('Public Core Values API error:', error)
    return NextResponse.json(
      { error: '핵심가치를 가져오는데 실패했습니다' },
      { status: 500 }
    )
  }
}
