import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Ensure we get all custom token fields
  })

  const isLoggedIn = !!token
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
  const isOnAuth = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')

  // Debug: Log token info for admin routes (remove in production)
  if (isOnAdmin) {
    console.log('Admin access attempt:', {
      isLoggedIn,
      hasRole: !!token?.role,
      role: token?.role,
      email: token?.email,
    })
  }

  // Admin page protection
  if (isOnAdmin) {
    if (isLoggedIn && token?.role === 'ADMIN') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect logged in users away from auth pages
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
