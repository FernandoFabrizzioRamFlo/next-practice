'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/users/userContext';
import type { IUser } from '@/lib/types';
import { useRouter } from "next/navigation";

interface IRoute{
    name:string;
    path:string;
}
interface ICategory{
    name:string;
    routes:IRoute[];
}

const Category: React.FC<ICategory>= ({name,routes}) => {
    const router = useRouter();
    return (
        <div className='flex flex-col w-full px-10 py-5'>
            <div><span className='font-bold text-xl'>{name}</span></div>
            {routes.map( route =>(
                <div key={route.path}>
                    <button  onClick={() => router.push(route.path)}><span className='text-base hover:text-blue-800 hover:text-lg' >{route.name}</span></button>
                </div>
            ))}
        </div>
        
        
    )
};

export default Category;