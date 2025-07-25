import { NextRequest, NextResponse } from 'next/server';
import { mockAdmin } from "@/lib/types";
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
            const token:string = await generateJWT(
                {id:mockAdmin.id , email:mockAdmin.email , username: mockAdmin.name , roles: mockAdmin.roles},
                secret,{expiresIn:'1h'}
            )
            const res: NextResponse = NextResponse.json({message:"success"},{status:200});
            res.cookies.set("session",token,{httpOnly:false,sameSite:'lax',path:"/",maxAge:60*60});
            return res;
        }
        return NextResponse.json({ message: "Error en la solicitud" }, {status: 401});
    }catch(err:unknown){
        console.error(err)
        return NextResponse.json({message:"Error procesando la solicitud de autenticación."},{status:500});
    };
}