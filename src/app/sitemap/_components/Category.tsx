'use client'

import React from 'react';
import { useRouter } from "next/navigation";
import { ICategoryData } from '../types/sitemap.types';

const Category: React.FC<ICategoryData> = ({ name, routes }) => {
    const router = useRouter();
    return (
        <div className='flex flex-col w-full px-10 py-5'>
            <div><span className='font-bold text-xl'>{name}</span></div>
            {routes.map(route => (
                <div key={route.path}>
                    <button onClick={() => router.push(route.path)}><span className='text-base hover:text-blue-800 hover:text-lg'>{route.name}</span></button>
                </div>
            ))}
        </div>
    )
};

export default Category;
