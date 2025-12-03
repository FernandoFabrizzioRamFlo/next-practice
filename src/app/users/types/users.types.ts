export interface IUser {
    id: string; // Changed from ID to id
    email: string; // Changed from EMAIL to email
    name?: string; // Changed from NAME to name
    phone_number?: string; // Changed from PHONE_NUMBER to phone_number
    roles: string[]; // Changed from ROLE to roles
}