// front/src/app/sitemap/data/sitemapData.ts
import mapData from "../types/map.json";

export interface ISitemapRoute {
    id: string;
    name: string;
    path: string;
    permission: string;
}

export interface ISitemapCategory {
    name: string;
    routes: ISitemapRoute[];
}

export const sitemapData: ISitemapCategory[] = mapData.categories;

// Build a lookup map for quick route_id -> route info resolution
const routeMap = new Map<string, ISitemapRoute>();
for (const category of sitemapData) {
    for (const route of category.routes) {
        routeMap.set(route.id, route);
    }
}

// Get route info by route_id
export function getRouteById(routeId: string): ISitemapRoute | undefined {
    return routeMap.get(routeId);
}

// Get all routes as a flat array
export function getAllRoutes(): ISitemapRoute[] {
    return Array.from(routeMap.values());
}
