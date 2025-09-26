//ozcabaudit\src\app\api\auth\handleLogin\route.ts
//Firebase based authentication.
//JWT based authorization.

import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';


export const runtime = 'nodejs';
const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(
            JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string)
        ),
        projectId: process.env.FIREBASE_PROJECT_ID || undefined,
    });

//Configura duración de la sesión
const SESSION_MAX_AGE_MS = Number(process.env.FB_SESSION_MAX_AGE_MS ?? 1 * 60 * 60 * 1000); // 1h
// WHY: Vida moderada. Puedes subirla (p.ej. 5 días) si tu caso lo requiere.
const EXPRESS_BASE_URL = process.env.EXPRESS_BASE_URL;

export async function POST(req: NextRequest) {
    try {
        if (!EXPRESS_BASE_URL) {
            console.log("NO BASE URL")
            return NextResponse.json({ message: 'EXPRESS_AUTH_URL no configurada' }, { status: 500 });
        }
        const { email, password } = await req.json();
        console.log("EMAIL AND PASSWORD:", email, password)
        if (!email || !password) return NextResponse.json({ message: 'Email y password son requeridos' }, { status: 400 });

        const expressResp = await fetch(EXPRESS_BASE_URL + "user/submit-login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // no-store para evitar caches accidentales
            cache: 'no-store',
            body: JSON.stringify({ email, password }),
        });
        console.log("RESPONSE:", expressResp)
        if (!expressResp.ok) {
            // Propaga mensaje de Express si viene
            return NextResponse.json(
                { message: 'Credenciales inválidas o error de autenticación' },
                { status: expressResp.status || 401 }
            );
        }
        const payload = await expressResp.json();
        const firebaseAccess = payload?.firebaseAccess;
        const ok = firebaseAccess?.success === true;
        const idToken: string | undefined = firebaseAccess?.value?.idToken;
        console.log("PAYLOAD:", payload)
        if (!ok || !idToken) {
            return NextResponse.json(
                { message: 'Respuesta de Express inválida: falta idToken' },
                { status: 502 }
            );
        }

        const sessionCookie = await admin.auth().createSessionCookie(idToken, {
            expiresIn: SESSION_MAX_AGE_MS,
        });

        const url = new URL('/home', req.url);
        const res = NextResponse.redirect(url, { status: 303 });
        const isProd = process.env.NODE_ENV === 'production';
        res.cookies.set('session', sessionCookie, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax', // si harás cross-site a otros dominios, cambia a 'none' + secure
            path: '/',
            maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000),
        });
        console.log(res)
        return res
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { message: 'Error procesando autenticación' },
            { status: 500 }
        );
    }
}