interface IRoute{
    name:string;
    path:string;
}
interface ICategory{
    name:string;
    routes:IRoute[];
}

export const mockCategory:ICategory ={
    name:"Inspecciones",
    routes:[{name:"Generar Inspección",path:"/home/inspecciones/generarInspeccion"}]
}