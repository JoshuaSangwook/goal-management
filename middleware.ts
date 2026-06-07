import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin')
  const isOnAuth = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')

  // Admin page protection
  if (isOnAdmin) {
    if (isLoggedIn && req.auth?.user?.role === 'ADMIN') {
      return
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect logged in users away from auth pages
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
