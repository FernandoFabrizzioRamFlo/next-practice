// app/api/auth/getCurrentUser/route.ts
import { NextRequest,NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import { IUser } from '@/lib/types';
export const runtime = 'nodejs';

const EXPRESS_BASE_URL = process.env.EXPRESS_BASE_URL;

const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string)
        ),
        projectId: process.env.FIREBASE_PROJECT_ID || undefined,
    });


export async function GET(req:NextRequest) {
    const session = req.cookies.get('session')?.value
    if (!session) return NextResponse.json({ message: 'No session' }, { status: 401 })
    try {
        const decoded = await admin.auth().verifySessionCookie(session, true)
        const firebase_uid = decoded.uid
    
        const expressResp = await fetch(EXPRESS_BASE_URL + "user/user-details", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,cookie: `session=${session}`},
            credentials: 'include',
            // no-store para evitar caches accidentales
            cache: 'no-store',
            body: JSON.stringify({id_firebase:firebase_uid}),
        }); 
        console.log(expressResp)
        if(!expressResp.ok) throw new Error();
        const {success,value} = await expressResp.json();
        if(!success) throw new Error();

        const user:IUser ={
                id: value.ID_USUARIO ?? "",
                email: value.EMAIL ?? "",
                name: value.NOMBRE ?? "", 
                roles:value.ROL ?? [] 
        }

        return NextResponse.json(user, { status: 200 });
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
