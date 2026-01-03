'use client'

import React, { useMemo, useState, useEffect, useTransition } from 'react';
import Category from "./Category";
import { sitemapData } from '../data/sitemapData';
import { useUser } from '@/contexts/users/userContext';
import { Separator } from "@/components/ui/separator";
import { toggleFavoriteRoute } from '@/app/(protected)/favorite-routes/actions/favorite-routes.actions';
import { getFavoriteRoutes } from '@/app/(protected)/favorite-routes/data/favorite-routes.data';

const SiteMap: React.FC = () => {
    const { user } = useUser();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    // Fetch favorites on mount
    useEffect(() => {
        if (user) {
            getFavoriteRoutes()
                .then(favs => setFavorites(favs.map(f => f.route_id)))
                .catch(err => console.error("Failed to load favorites:", err));
        }
    }, [user]);

    const handleToggleFavorite = (routeId: string) => {
        // Optimistic update
        setFavorites(prev =>
            prev.includes(routeId)
                ? prev.filter(id => id !== routeId)
                : [...prev, routeId]
        );

        startTransition(async () => {
            const result = await toggleFavoriteRoute(routeId);
            if (!result.success) {
                // Revert on error
                setFavorites(prev =>
                    prev.includes(routeId)
                        ? prev.filter(id => id !== routeId)
                        : [...prev, routeId]
                );
                console.error("Failed to toggle favorite:", result.error);
            }
        });
    };

    const filteredSitemap = useMemo(() => {
        if (!user || !user.permissions) {
            return [];
        }
        return sitemapData
            .map(category => ({
                ...category,
                routes: category.routes.filter(route =>
                    user.permissions.includes(route.permission)
                ),
            }))
            .filter(category => category.routes.length > 0);
    }, [user]);

    // Don't render until user is loaded (prevents hydration mismatch)
    if (!user) {
        return null;
    }

    return (
        <div className='flex w-full justify-center flex-col'>
            <div className='flex flex-row w-full items-center px-10 pt-5'>
                <div className='flex w-2/3 items-center'>
                    <span className='text-2xl'>Site Map</span>
                </div>
            </div>
            <Separator className="my-4" />
            <h2 className="text-2xl font-semibold tracking-tight px-10">Available Routes</h2>
            <Separator className="my-4" />
            <div className={isPending ? 'opacity-70 pointer-events-none' : ''}>
                {filteredSitemap.map(category => (
                    <Category
                        key={category.name}
                        name={category.name}
                        routes={category.routes}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                    />
                ))}
                {filteredSitemap.length === 0 && (
                    <p className="px-10 text-muted-foreground">
                        No tienes permisos para ver ninguna ruta.
                    </p>
                )}
            </div>
        </div>
    )
};

export default SiteMap;
