export interface IService {
    id: number;
    name: string | null;
    start_date: string;
    end_date: string | null;
    client_id: number;
    client_name: string;
    client_email: string;
}

export interface IServicesResponse {
    services: IService[];
}

export interface CreateServiceData {
    client_id: number;
    start_date: string;
    end_date?: string;
    name?: string;
}

export interface UpdateServiceData {
    client_id?: number;
    start_date?: string;
    end_date?: string;
    name?: string;
}
