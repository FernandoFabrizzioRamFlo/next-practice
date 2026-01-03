export interface IRouteData {
    id: string;
    name: string;
    path: string;
    permission: string;
}

export interface ICategoryData {
    name: string;
    routes: IRouteData[];
}
