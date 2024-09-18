import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkCredentials = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const role = await AsyncStorage.getItem('userRole');
                if (token && role) {
                    setIsLoggedIn(true);
                    setUserRole(role);
                }
            } catch (e) {
                console.error('Failed to fetch the user credentials.', e);
            } finally {
                setLoading(false);
            }
        };

        checkCredentials();
    }, []);

    const login = async (token, role) => {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', role);
        setIsLoggedIn(true);
        setUserRole(role);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userRole');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
