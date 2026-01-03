import { NextResponse, NextRequest } from 'next/server';
import { IUser } from './app/(protected)/users/types/users.types';

// Define which routes require which permissions
const routePermissions: Record<string, string> = {
    '/clients': 'clients.view',
    '/inspections': 'inspections.view',
    '/inspections/create': 'inspections.create',
    '/users': 'users.view',
};

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Match all routes except static assets and API routes
};

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const session = req.cookies.get('session')?.value;

    // Allow requests to public routes (login and forbidden page)
    if (pathname === '/login' || pathname === '/forbidden') {
        return NextResponse.next();
    }

    // If no session, redirect to login for any other route
    if (!session) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    try {
        // Fetch user data including permissions by calling the BFF route
        const userApiUrl = new URL('/api/auth/getCurrentUser', req.nextUrl.origin);
        const userRes = await fetch(userApiUrl, {
            headers: { cookie: `session=${session}` },
            cache: 'no-store',
        });

        if (!userRes.ok) {
            // If fetching user fails (e.g., expired session), redirect to login
            throw new Error('Failed to fetch user data, session might be invalid');
        }

        const user: IUser = await userRes.json();
        const userPermissions: string[] = user.permissions || [];

        // Check if the requested route requires a specific permission
        const requiredPermission = Object.keys(routePermissions).find(route => pathname.startsWith(route));
        
        if (requiredPermission && !userPermissions.includes(routePermissions[requiredPermission])) {
            const url = req.nextUrl.clone();
            url.pathname = '/forbidden';
            return NextResponse.rewrite(url); // Use rewrite to show forbidden page without changing URL
        }

        // Redirect from root to home for authenticated users
        if (pathname === '/') {
            const url = req.nextUrl.clone();
            url.pathname = '/home';
            return NextResponse.redirect(url);
        }

        return NextResponse.next();

    } catch (error) {
        console.error('Middleware error:', error);
        // On any error in the process, invalidate the session and redirect to login
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        const response = NextResponse.redirect(url);
        response.cookies.set('session', '', { maxAge: -1 }); // Clear the invalid session cookie
        return response;
    }
}