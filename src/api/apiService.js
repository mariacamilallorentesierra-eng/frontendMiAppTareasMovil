import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.20.28:8000/api";

export const loginService= async (email, password) => {
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
        throw error;
    }
};


export const taskApiService={
    //Listar (get)
    getAll: (token) => fetch(`${BASE_URL}/tareas/`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }).then(res => res.json()),

    //Crear (post)
    create: (token, data) => fetch(`${BASE_URL}/tareas/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),  
    }).then(res => res.json()),

    //Actualizar (put)
    update: (token, id, data) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),  
    }).then(res => res.json()),

    //Eliminar (delete)
    delete: (token, id) => fetch(`${BASE_URL}/tareas/${id}/`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    
}