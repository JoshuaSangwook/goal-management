import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcryptjs'
import { z } from 'zod'

// Force Node.js runtime for bcryptjs compatibility
export const runtime = 'nodejs'

const signupSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6글자 이상이어야 합니다'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: '회원가입에 실패했습니다' },
      { status: 500 }
    )
  }
}
