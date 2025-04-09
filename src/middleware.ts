import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const isAuthPage = pathname === '/login' || pathname === '/register';

    if (!token && !isAuthPage) {
        // Redirect to login if the user is not authenticated and trying to access a protected page
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        // Redirect to home if the user is authenticated and trying to access login or register
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Add matcher to specify which routes the middleware should apply to
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)', // Apply to all pages except API routes, static files, etc.
    ],
};
