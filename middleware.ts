import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value
  const isAuthPage = request.nextUrl.pathname === '/auth'
  const isProtectedRoute = request.nextUrl.pathname === '/profile'

  // If user is on auth page and logged in, redirect to home
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is trying to access protected route without being logged in
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ['/auth', '/profile']
}