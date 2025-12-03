'use client'

import React from 'react';
import Category from "./Category"; // Updated import path
import { mockCategory } from '../data/mockData'; // Updated import path
import { Separator } from "@/components/ui/separator"; // New import

const SiteMap: React.FC = () => {

    return (
        <div className='flex w-full justify-center flex-col'>
            <div className='flex flex-row w-full items-center  px-10 pt-5'>
                <div className='flex w-2/3 items-center'><span className='text-2xl'> Mapa de Sitio</span></div>
            </div>
            <Separator className="my-4" />
            {/* Contenedor de Favoritos*/}
            <h2 className="text-2xl font-semibold tracking-tight px-10">Rutas</h2>
            <Separator className="my-4" />
            <div>
                <Category name={mockCategory.name} routes={mockCategory.routes} />
            </div>
        </div>
    )
};

export default SiteMap;
