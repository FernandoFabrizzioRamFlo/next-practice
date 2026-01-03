import { CreateInspectionForm } from '../_components/CreateInspectionForm';
import { getClients } from '@/app/(protected)/clients/data/clients.data'; // Import the data fetching function from its new location
import { IClient } from '@/app/(protected)/clients/types/clients.types'; // Import IClient type

export default async function CreateInspectionPage() { // Make it an async function
    let clients: IClient[] = [];
    try {
        clients = await getClients();
    } catch (error) {
        console.error("Failed to fetch clients:", error);
        // Handle error, maybe show an error message on the page
    }

    return (
        <div>
            <h1 className="text-3xl font-bold px-10 py-5">Generar Inspección</h1>
            <CreateInspectionForm clients={clients} /> {/* Pass clients as a prop */}
        </div>
    );
}