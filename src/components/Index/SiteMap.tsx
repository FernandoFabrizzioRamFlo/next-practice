'use client'

import React from 'react';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/users/userContext';
import Category from "@/components/navRoutes/Category"
import {mockCategory} from"@/lib/mocks/mockCategories";
import {Divider} from "antd";

const SiteMap: React.FC = () => {

    return (
        <div className='flex w-full justify-center flex-col'>
            <div className='flex flex-row w-full items-center  px-10 pt-5'>
                <div className='flex w-2/3 items-center'><span className='text-2xl'> Mapa de Sitio</span></div>
            </div>
            <Divider orientation="left" style={{ borderColor: '#808080'}}/>
            {/* Contenedor de Favoritos*/}
            <Divider orientation="left" style={{ borderColor: '#808080',fontSize:'24px' }}>Rutas</Divider>
            <div>
                <Category name={mockCategory.name} routes={mockCategory.routes}/>
            </div>
        </div>
    )
};

export default SiteMap;