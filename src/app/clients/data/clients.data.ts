import { IClient } from "@/app/clients/types/clients.types";

export async function getClients(): Promise<IClient[]> {
    const EXPRESS_BASE_URL = process.env.EXPRESS_BASE_URL;
    if (!EXPRESS_BASE_URL) {
        throw new Error("EXPRESS_BASE_URL is not defined");
    }

    const res = await fetch(`${EXPRESS_BASE_URL}/clients`, {
        method: 'GET',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch clients');
    }

    const data = await res.json();
    return data.data;
}
