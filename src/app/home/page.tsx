'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/users/userContext';
import Loader from "@/components/common/Loader";
import Category from '../sitemap/_components/Category'; // Updated import path
import { mockCategory } from '../sitemap/data/mockData'; // Updated import path
import { Separator } from "@/components/ui/separator"; // New import

export default function HomePage() {
    const [time, setTime] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        const iv = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(iv);
    }, [])

    useEffect(() => {
        const loadApp = async () => {
            if (!user || !user.ID) { // Changed to user.ID
                return;
            }
            try {
                // Future data loading logic here
            } catch (e) {

            }
        }
        if (user) {
            loadApp();
        }
    }, [user])

    if (loading) {
        return <Loader message="Obteniendo datos de usuario..." />;
    }
    return (
        <div className='flex w-full justify-center flex-col'>
            <div className='flex flex-row w-full items-center  px-10 pt-5'>
                <div className='flex w-2/3 items-center'><span className='text-2xl'> Bienvenido {user?.NAME}</span></div>
                <div className='flex w-1/3 '>
                    {hasMounted && time ? (
                        <span className="text-2xl font-mono font-thin text-[#005B94] ">
                            {time.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            })}
                        </span>
                    ) : (
                        <span className="text-2xl font-mono">--:--:--</span>
                    )}
                </div>
            </div>
            <Separator className="my-4" />
            <h2 className="text-2xl font-semibold tracking-tight px-10">Favoritos</h2>
            <Separator className="my-4" />
            <div>
                <Category name={mockCategory.name} routes={mockCategory.routes} />
            </div>
        </div>
    )
};
