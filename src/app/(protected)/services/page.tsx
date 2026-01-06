import { getServices } from "@/app/(protected)/services/data/services.data";
import { getClients } from "@/app/(protected)/clients/data/clients.data";
import ServicesTable from "@/app/(protected)/services/_components/ServicesTable";

export default async function ServicesPage() {
  const [services, clients] = await Promise.all([
    getServices(),
    getClients(),
  ]);

  return <ServicesTable services={services} clients={clients} />;
}
