'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/users/userContext';
import Category from "@/components/navRoutes/Category"
import {mockCategory} from"@/lib/mocks/mockCategories";
import {Divider} from "antd";

const Home: React.FC = () => {
    const [time, setTime] = useState(new Date());
    const { user, setUser } = useUser();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        setTime(new Date());
        const iv = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(iv);
    }, [])

    return (
        <div className='flex w-full justify-center flex-col'>
            <div className='flex flex-row w-full items-center  px-10 pt-5'>
                <div className='flex w-2/3 items-center'><span className='text-2xl'> Bienvenido {user?.name}</span></div>
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
            <Divider orientation="left" style={{ borderColor: '#808080'}}/>
            {/* Contenedor de Favoritos*/}
            <Divider orientation="left" style={{ borderColor: '#808080',fontSize:'24px' }}>Favoritos</Divider>
            <div>
                <Category name={mockCategory.name} routes={mockCategory.routes}/>
            </div>
        </div>
    )
};

export default Home;