import { cookies } from "next/headers";
import { IService } from "@/app/(protected)/services/types/services.types";

const EXPRESS_BASE_URL = process.env.EXPRESS_BASE_URL;

export async function getServices(): Promise<IService[]> {
    if (!EXPRESS_BASE_URL) {
        console.error("EXPRESS_BASE_URL is not defined");
        return [];
    }

    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;

        if (!session) {
            console.error("No session cookie");
            return [];
        }

        const res = await fetch(`${EXPRESS_BASE_URL}/services`, {
            method: 'GET',
            headers: {
                'Cookie': `session=${session}`,
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error("Failed to fetch services:", res.status);
            return [];
        }

        const json = await res.json();
        return json.data || [];
    } catch (err) {
        console.error("Error fetching services:", err);
        return [];
    }
}
