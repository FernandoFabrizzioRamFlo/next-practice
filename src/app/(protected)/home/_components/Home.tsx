'use client'

import React from 'react';
import { useState, useEffect, useMemo, useTransition } from 'react';
import { useUser } from '@/contexts/users/userContext';
import Category from '@/app/(protected)/sitemap/_components/Category';
import { Separator } from "@/components/ui/separator";
import { getFavoriteRoutes } from '@/app/(protected)/favorite-routes/data/favorite-routes.data';
import { sitemapData } from '@/app/(protected)/sitemap/data/sitemapData';
import { toggleFavoriteRoute } from '@/app/(protected)/favorite-routes/actions/favorite-routes.actions';
import { ICategoryData } from '@/app/(protected)/sitemap/types/sitemap.types';

export default function Home() {
    const [time, setTime] = useState<Date | null>(null);
    const { user } = useUser();
    const [hasMounted, setHasMounted] = useState(false);
    const [favoriteRouteIds, setFavoriteRouteIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setHasMounted(true);
        setTime(new Date());
        const iv = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        if (user) {
            getFavoriteRoutes()
                .then(favs => setFavoriteRouteIds(favs.map(f => f.route_id)))
                .catch(err => console.error("Failed to load favorite routes:", err));
        }
    }, [user]);

    const handleRemoveFavorite = (routeId: string) => {
        // Optimistic update - remove from list
        setFavoriteRouteIds(prev => prev.filter(id => id !== routeId));

        startTransition(async () => {
            const result = await toggleFavoriteRoute(routeId);
            if (!result.success) {
                // Revert on error - add back
                setFavoriteRouteIds(prev => [...prev, routeId]);
                console.error("Failed to remove favorite:", result.error);
            }
        });
    };

    // Group favorites by category from sitemapData
    const favoritesByCategory = useMemo(() => {
        if (!user?.permissions) return [];

        const categories: ICategoryData[] = [];

        sitemapData.forEach(category => {
            const favoritedRoutes = category.routes.filter(route =>
                favoriteRouteIds.includes(route.id) &&
                user.permissions.includes(route.permission)
            );

            if (favoritedRoutes.length > 0) {
                categories.push({
                    name: category.name,
                    routes: favoritedRoutes
                });
            }
        });

        return categories;
    }, [favoriteRouteIds, user?.permissions]);

    if (!user) {
        return null;
    }

    return (
        <div className='flex w-full justify-center flex-col'>
            <div className='flex flex-row w-full items-center px-10 pt-5'>
                <div className='flex w-2/3 items-center'>
                    <span className='text-2xl'>Welcome {user?.name}</span>
                </div>
                <div className='flex w-1/3'>
                    {hasMounted && time ? (
                        <span className="text-2xl font-mono font-thin text-[#005B94]">
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
            <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
                {favoritesByCategory.length > 0 ? (
                    favoritesByCategory.map(category => (
                        <Category
                            key={category.name}
                            name={category.name}
                            routes={category.routes}
                            favorites={favoriteRouteIds}
                            onToggleFavorite={handleRemoveFavorite}
                            showStars={true}
                        />
                    ))
                ) : (
                    <p className="px-10 text-muted-foreground">
                        No tienes rutas favoritas. Ve al sitemap para agregar algunas.
                    </p>
                )}
            </div>
        </div>
    )
};
