export interface IUser {
    id: string;
    email: string;
    name?: string;        // opcional si no lo capturas siempre
    roles: string[]; 
    password: string;     // p.ej. ['admin','editor']
}

export const mockAdmin:IUser ={
    id:"001",
    email:"admin@admin.com",
    name:"fernando",
    roles:["admin"],
    password:"admin"
}