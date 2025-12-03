import {IUser} from '@/app/users/types/users.types';
import jwt from 'jsonwebtoken';

const getMockUser = ():IUser => {
    const user:IUser = {
        id: "001", // Changed from uid to id
        email: "admin@admin.com",
        name: "fernando",        // opcional si no lo capturas siempre
        roles: ["admin"]  
    }
    return user;
};

export {getMockUser};
