import {IUser} from '@/lib/types';
import jwt from 'jsonwebtoken';

const getMockUser = ():IUser => {
    const user:IUser = {
        uid: "001",
        email: "admin@admin.com",
        name: "fernando",        // opcional si no lo capturas siempre
        roles: ["admin"]  
    }
    return user;
};

const 

export {getMockUser};
