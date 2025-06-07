import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get current path
  const path = request.nextUrl.pathname

  // Public paths that don't require auth
  const publicPaths = ['/login', '/register']
  
  // Check if path is public
  const isPublicPath = publicPaths.includes(path)

  // Get auth token from cookie
  const token = request.cookies.get('sessionId')?.value

  // Redirect logic
  if (!token && !isPublicPath) {
    // Redirect to login if no token and accessing protected route
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublicPath) {
    // Redirect to home if has token and accessing public route
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    '/home',
    '/profile/:path*',
    '/login',
    '/register'
  ]
}