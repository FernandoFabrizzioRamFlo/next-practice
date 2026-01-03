export interface IClient {
    id: number;
    name: string;
    contact_person: string;
    email: string;
    phone_number: string;
}

export interface IClientsResponse {
    clients: IClient[];
    total: number;
}
