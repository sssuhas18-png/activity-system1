import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware handles route protection on the server side
// Note: Full JWT validation happens client-side since we're using localStorage
// Server middleware provides basic route structure protection

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to the login page
  if (pathname === '/') {
    return NextResponse.next();
  }

  // For student and admin routes, we let the client handle auth
  // The actual auth check happens in the page components
  // This is because JWT is stored in localStorage (client-side only)
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/student/:path*', '/admin/:path*'],
};
