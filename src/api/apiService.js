import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = "http://192.168.20.28:8000/api";
export const loginService = async (email, password) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error al iniciar sesión");
        }

        return data; 
    } catch (error) {
        console.error("Error en loginService:", error);
        throw error;
    }
};


export const taskApiService = {
    
    getAll: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/tareas/`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        }
    },
    create: async (token, data) => {
        try {
            const response = await fetch(`${BASE_URL}/tareas/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),  
            });
            return await response.json();
        } catch (error) {
            console.error("Error en create:", error);
            throw error;
        }
    },
    update: async (token, id, data) => {
        try {
            const response = await fetch(`${BASE_URL}/tareas/${id}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),  
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.Error || "Error al actualizar");
            return result;
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    },
    delete: async (token, id) => {
        try {
            const response = await fetch(`${BASE_URL}/tareas/${id}/`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.Error || "No se pudo eliminar");
            }

            return result; 
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
};