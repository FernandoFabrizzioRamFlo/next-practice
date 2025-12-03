import { NextResponse, NextRequest } from 'next/server'
export const config = {
    matcher: ['/', '/home/:path*', '/inspections/:path*', '/clients/:path*', '/sitemap/:path*']
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.cookies.get('session')?.value;
    console.log(token)
    if (pathname.startsWith('/home') || pathname.startsWith('/inspections') || pathname.startsWith('/clients') || pathname.startsWith('/sitemap') || pathname === '/') {
        if (!token) {
            console.log("Middleware impidió el acceso a /home/:path (token ausente)")
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
            console.log("Middleware impidió el acceso a /home/:path (token inválido)")
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}