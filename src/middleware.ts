import { NextResponse, NextRequest } from 'next/server'


export const config = {
    matcher: ['/']
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname === '/') {
        console.log('middleware running for "/"')
        const token = req.cookies.get('session')?.value
        const url = req.nextUrl.clone()
        url.pathname = token ? '/home' : '/login'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}