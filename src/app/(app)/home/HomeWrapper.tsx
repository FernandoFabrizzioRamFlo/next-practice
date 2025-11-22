'use client';
//ozcabaudit\src\app\(app)\home\HomeWrapper.tsx
import { ReactNode, useState, useEffect } from 'react';
import { message } from 'antd';
import Header from '@/components/layout/Header';
import { UserProvider } from '@/contexts/users/userContext';
import {useRouter} from  "next/navigation"
import type { IUser } from '@/lib/types';

export default function HomeWrapper({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const res = await fetch("/api/auth/getCurrentUser",
                {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                }
            )
            if (!res.ok) {
                message.error("No se pudo autenticar al usuario.")
                router.push("/login");
                return;
            }
            const data: IUser = await res.json();
            setUser(data);
            console.log(data)

        }
        try {
            loadUser();
        } catch (err) {
            console.error(err)
            router.push("/login");
        }
    }, [])

    return (

        <div>
            <UserProvider value={{ user, setUser }}>
                <Header/>
                <div className="bg-[url('/herobanner.png')] h-[100px] w-full bg-cover bg-center"></div>
                {children}
            </UserProvider>
        </div>

    );

}