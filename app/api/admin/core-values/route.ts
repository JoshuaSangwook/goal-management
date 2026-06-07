import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const coreValues = await prisma.coreValue.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ coreValues })
  } catch (error) {
    console.error('Core Values API error:', error)
    return NextResponse.json(
      { error: '핵심가치를 가져오는데 실패했습니다' },
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
    const { title, description, icon, verse } = body

    if (!title || !description || !icon || !verse) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get max order
    const maxOrder = await prisma.coreValue.findFirst({
      orderBy: { order: 'desc' },
    })

    const newCoreValue = await prisma.coreValue.create({
      data: {
        title,
        description,
        icon,
        verse,
        order: (maxOrder?.order || 0) + 1,
      },
    })

    return NextResponse.json(newCoreValue, { status: 201 })
  } catch (error) {
    console.error('Core Values POST error:', error)
    return NextResponse.json(
      { error: '핵심가치를 생성하는데 실패했습니다' },
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

    await prisma.coreValue.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Core Values DELETE error:', error)
    return NextResponse.json(
      { error: '핵심가치를 삭제하는데 실패했습니다' },
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
    const { id, title, description, icon, verse } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const updated = await prisma.coreValue.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(verse !== undefined && { verse }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Core Values PUT error:', error)
    return NextResponse.json(
      { error: '핵심가치를 수정하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
