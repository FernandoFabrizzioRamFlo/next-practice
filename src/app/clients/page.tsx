'use client';

import { getClients } from '@/app/clients/data/clients.data';
import { IClient } from '@/app/clients/types/clients.types';
import { ClientsList } from '@/app/clients/_components/ClientsList';
import React, { useEffect, useState } from 'react';

export default function ClientsPage() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const fetchedClients = await getClients();
        setClients(fetchedClients);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  if (loading) {
    return <div className="p-4">Loading clients...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <ClientsList clients={clients} />
    </div>
  );
}
