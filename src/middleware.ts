import { NextResponse, NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

export const config = {
    matcher: ['/','/home','/home/:path*']
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const token = req.cookies.get('session')?.value;

    if (pathname.startsWith('/home') || pathname === '/') {
        if (!token) {
            console.log("midddleware prevented access to /home/:path (token missing)")
            const url = req.nextUrl.clone()
            url.pathname = token ? '/home' : '/login'
            return NextResponse.redirect(url)
        }
        
        try {
            const secret = new TextEncoder().encode(process.env.JWT_KEY);
            await jwtVerify(token,secret);
            console.log(token)
            if(pathname === '/'){
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