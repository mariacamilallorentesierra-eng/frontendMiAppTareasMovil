import AsyncStorage from "@react-native-async-storage/async-storage";

// Tip: Asegúrate de que esta IP sea la de tu máquina actual (ipconfig en consola)
const BASE_URL = "http://192.168.20.28:8000/api";

// --- SERVICIO DE AUTENTICACIÓN ---
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
            throw new Error(data.error || "Error al iniciar la sesión");
        }

        return data; // Retorna tokens de Firebase/Django
    } catch (error) {
        console.error("Error en loginService:", error);
        throw error;
    }
};

// --- SERVICIO DE TAREAS (CRUD) ---
export const taskApiService = {
    
    // 1. Listar tareas (GET)
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

    // 2. Crear tarea (POST)
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

    // 3. Actualizar tarea (PUT)
    // CRÍTICO: Se añade la barra "/" al final de la URL para que Django no falle
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

    // 4. Eliminar tarea (DELETE)
    // CRÍTICO: Se añade la barra "/" al final y manejamos la respuesta de tu views.py
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
                // Esto capturará el "No tienes permiso" de tu views.py
                throw new Error(result.Error || "No se pudo eliminar");
            }

            return result; 
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
};