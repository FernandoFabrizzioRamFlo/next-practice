'use client'
//ozcabaudit\src\contexts\users\userContext.tsx
import { createContext, useContext,useState, ReactNode} from 'react';
import {IUser} from "@/lib/types";

type UserContextType = {
    user: IUser|null;
    setUser: (user: IUser | null) => void;
}

export const UserContext = createContext<UserContextType|undefined>(undefined);

export const UserProvider = ({children,value}: {children : ReactNode, value:UserContextType}) =>{
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
export const useUser = () =>{
    const context = useContext(UserContext);
    if(!context){
        throw new Error('useUser debe usasrse dentro de un provider');
    }
    return context;
};

