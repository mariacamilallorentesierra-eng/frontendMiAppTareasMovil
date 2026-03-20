import React, {createContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token) => {
        setUserToken(token);
        await AsyncStorage.setItem("userToken", token); // espera hasta eue el token llegue
    };

    const logout = async () => {
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
    };

    const IsLoggedIn = async () => {
        try{
            const token = await AsyncStorage.getItem('userToken')
            setUserToken(token);
            setIsLoading(false);
        } catch (e){
            console.log('Error en persistencia: ', e);
        }
    };

    useEffect(()=> { 
        IsLoggedIn();
    },[])

    return (
        <AuthContext.Provider value={{login, logout, userToken, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}