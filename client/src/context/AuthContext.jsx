import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const  AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if(token){
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
        if(storedUser) setUser(JSON.parse(storedUser));
    },[]);

    const login = ({user:userData, token} = {}) => {
        if(userData){
            setUser(userData);
            localStorage.setItem('user',JSON.stringify(userData));
        }
        if(token){
            localStorage.setItem('token', token);
            api.defaults.headers.common.Authorization = `Bearer ${token}`;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
    };

    return (
        <AuthContext.Provider value = {{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};