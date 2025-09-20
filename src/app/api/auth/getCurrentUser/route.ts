// app/api/auth/getCurrentUser/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJWT } from "@/lib/auth/readToken"; // ajusta ruta si es necesario


export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        return NextResponse.json({ error: 'No token found' }, { status: 401 });
    }
    try {
        const user = await verifyJWT(token); // IUser
        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
