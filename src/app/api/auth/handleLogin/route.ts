import { NextRequest, NextResponse } from 'next/server';
import { mockAdmin, IUser } from "@/lib/types";
import jwt from 'jsonwebtoken';


export async function POST(req: NextRequest) {
    const secret:string = process.env.JWT_KEY ?? "dev";

    const generateJWT = async (payload: object, secret: string, options: jwt.SignOptions): Promise<string> => {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, secret, options, (err, token) => {
                if (err || !token) return reject(err)
                resolve(token);
            })
        })
    }

    try {
        const { email, password } = await req.json();
        if (!email || !password) return NextResponse.json({ message: "Error en la solicitud" }, { status: 400 });
        //aquí se haría fetch a api para solicitar autenticación.
        //const res = await fetch(apiUrl,...);

        //mockauth
        const auth: boolean = (email == mockAdmin.email) && (password == mockAdmin.password);
        if (auth) {
            const user :IUser ={
                id:mockAdmin.id ,
                email:mockAdmin.email ,
                name: mockAdmin.name ,
                roles: mockAdmin.roles,
                password:null
            }
            const token:string = await generateJWT(
                user,
                secret,{expiresIn:'1h'}
            )
            const url = new URL('/home', req.url);
            const res = NextResponse.redirect(url, 303);
            res.cookies.set("session",token,{httpOnly:true,sameSite:'lax',path:"/",maxAge:60*60});
            return res;
        }
        return NextResponse.json({ message: "Error en la solicitud" }, {status: 401});
    }catch(err:unknown){
        console.error(err)
        return NextResponse.json({message:"Error procesando la solicitud de autenticación."},{status:500});
    };
}