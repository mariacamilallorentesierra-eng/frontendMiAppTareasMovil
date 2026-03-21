// import React, {createContext, useState, useEffect} from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//     const [userToken, setUserToken] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const login = async (token) => {
//         setUserToken(token);
//         await AsyncStorage.setItem("userToken", token); 
//     };

//     const logout = async () => {
//         setUserToken(null);
//         await AsyncStorage.removeItem('userToken');
//     };

//     const IsLoggedIn = async () => {
//         try{
//             const token = await AsyncStorage.getItem('userToken')
//             setUserToken(token);
//             setIsLoading(false);
//         } catch (e){
//             console.log('Error en persistencia: ', e);
//         }
//     };

//     useEffect(()=> { 
//         IsLoggedIn();
//     },[])

//     return (
//         <AuthContext.Provider value={{login, logout, userToken, isLoading}}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// original 

import React, {createContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [userToken, setUserToken] = useState(null);
    const [userData, setUserData] = useState(null); // Nuevo estado para el rol y nombre
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token, user) => { // Ahora recibe el objeto user
        setUserToken(token);
        setUserData(user); // Guardamos el rol y nombre en el estado
        await AsyncStorage.setItem("userToken", token); 
        await AsyncStorage.setItem("userData", JSON.stringify(user)); // Lo persistimos
    };

    const logout = async () => {
        setUserToken(null);
        setUserData(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
    };

    const IsLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const savedUserData = await AsyncStorage.getItem('userData');
            
            setUserToken(token);
            if (savedUserData) {
                setUserData(JSON.parse(savedUserData));
            }
            setIsLoading(false);
        } catch (e) {
            console.log('Error en persistencia: ', e);
        }
    };

    useEffect(() => { 
        IsLoggedIn();
    }, []);

    // Pasamos userData en el Provider
    return (
        <AuthContext.Provider value={{login, logout, userToken, userData, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}