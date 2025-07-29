'use client';

import { ReactNode, useState, useEffect } from 'react';
import { message } from 'antd';
import Header from '@/components/layout/Header';
import { UserProvider } from '@/contexts/users/userContext';
import type { IUser } from '@/lib/types';

export default function HomeWrapper({ children }: { children: ReactNode }) {

    const [user, setUser] = useState<IUser | null>(null);

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
                return;
            }
            const data: IUser = await res.json();
            setUser(data);
            console.log(data)

        }
        try {
            loadUser();
        } catch (err) {
            console.log(err)
        }
    }, [])

    return (

        <div>
            <UserProvider value={{ user, setUser }}>
                <Header />
                <div className="bg-[url('/herobanner.png')] h-[100px] w-full bg-cover bg-center"></div>
                {children}
            </UserProvider>
        </div>

    );

}