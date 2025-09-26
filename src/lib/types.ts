export interface IUser {
    id: string;
    email: string;
    name?: string;   
    roles: IRole[];  
}
export interface IRoute{
    id: string;
    nombre: string;
    descripcion:string;
    path:string;
    categoria: string;
}
export interface IRole{
    id: string;
    nombre: string;
    descripcion: string;
}
export interface ICategoria{
    id: string;
    nombre: string;
    descripcion:string;
}

export interface ICliente{
    id:string;
    nombre:string;
    contacto:string;
    correo:string;
}
