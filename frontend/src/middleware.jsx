// src/middleware.ts
import { NextResponse,  NextRequest } from 'next/server'

export async function middleware(req) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  console.log('Middleware: Verifying token:', token);
  

  const backendURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : 'http://backend:8080'

  try {
    const res = await fetch(`${backendURL}/api/verify-token`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      console.log('Middleware: Token verification failed:', res.status, res.statusText);
      
      return NextResponse.redirect(new URL('/login', req.url))
    }
    console.log('Middleware: Token verified successfully');
    

    return NextResponse.next()
  } catch (err) {
    console.error('verify-token failed:', err)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/friends/:path*', '/profile/:path*', '/groups/:path*', '/notifications/:path*'],
}
