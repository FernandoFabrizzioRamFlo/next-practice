import { NextResponse, NextRequest } from 'next/server'
export const config = {
    matcher: ['/', '/home', '/home/:path*']
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.cookies.get('session')?.value;
    console.log(token)
    if (pathname.startsWith('/home') || pathname === '/') {
        if (!token) {
            console.log("midddleware prevented access to /home/:path (token missing)")
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        try {
            const verifyUrl = new URL('/api/auth/verifySession', req.nextUrl.origin);

            const ac = new AbortController();
            const id = setTimeout(() => ac.abort(), 5000);
            const verified = await fetch(verifyUrl, {
                method: 'GET',
                headers: { cookie: req.headers.get('cookie') ?? '' },
                cache: 'no-store',
                signal:ac.signal,
            });
            clearTimeout(id)

            if (!verified.ok) throw new Error();

            if (pathname === '/') {
                const url = req.nextUrl.clone()
                url.pathname = '/home'
                return NextResponse.redirect(url)
            }
            return NextResponse.next();
        } catch {
            console.log("midddleware prevented access to /home/:path (invalid token)")
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}