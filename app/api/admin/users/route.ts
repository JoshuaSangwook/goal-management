import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import * as bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        _count: {
          select: {
            checkRecords: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate achievement rates
    const usersWithRates = await Promise.all(
      users.map(async (user) => {
        const totalChecks = await prisma.checkRecord.count({
          where: {
            userId: user.id,
            checked: true,
          },
        })

        // Simple calculation: checks / days since account created
        const daysSinceCreation = Math.max(
          1,
          Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        )

        return {
          ...user,
          achievementRate: daysSinceCreation > 0 ? (totalChecks / daysSinceCreation) * 100 : 0,
        }
      })
    )

    return NextResponse.json({ users: usersWithRates })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: '사용자 목록을 가져오는데 실패했습니다' },
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
    const { userId, action } = body

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId and action are required' },
        { status: 400 }
      )
    }

    let updatedUser

    if (action === 'toggleActive') {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { active: !(await prisma.user.findUnique({ where: { id: userId } }))?.active },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
        },
      })
    } else if (action === 'toggleRole') {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
        },
      })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Users PUT error:', error)
    return NextResponse.json(
      { error: '사용자 정보를 수정하는데 실패했습니다' },
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
    const { name, email, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json(
      { error: '사용자를 생성하는데 실패했습니다' },
      { status: 500 }
    )
  }
}
