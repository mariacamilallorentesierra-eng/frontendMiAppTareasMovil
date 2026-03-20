import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  TextInput 
} from 'react-native';
import { AuthContext } from '../../context/authContext';
import { taskApiService } from '../apiService'; // Importación del objeto

const TaskScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (userToken) {
            fetchTasks();
        }  
    }, [userToken]);

    const fetchTasks = async () => {
        try {
            const data = await taskApiService.getAll(userToken);
            if (data && data.datos) {
                setTasks(data.datos); 
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // --- FUNCIÓN PARA ELIMINAR ---
    const handleDelete = (id) => {
        Alert.alert(
            "Eliminar Tarea",
            "¿Estás seguro de que quieres borrar esta tarea?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await taskApiService.delete(userToken, id);
                            // Actualizamos la lista localmente para no tener que recargar todo
                            setTasks(tasks.filter(t => t.id !== id));
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la tarea");
                        }
                    } 
                }
            ]
        );
    };

    // --- FUNCIÓN PARA MODIFICAR TÍTULO ---
    const handleEditTitle = (task) => {
        let newTitle = task.titulo;
        Alert.prompt(
            "Editar Título",
            "Introduce el nuevo nombre para la tarea:",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Guardar",
                    onPress: async (text) => {
                        try {
                            const updatedData = { ...task, titulo: text };
                            await taskApiService.update(userToken, task.id, updatedData);
                            // Actualizamos el estado local
                            setTasks(tasks.map(t => t.id === task.id ? { ...t, titulo: text } : t));
                        } catch (error) {
                            Alert.alert("Error", "No se pudo actualizar");
                        }
                    }
                }
            ],
            "plain-text",
            task.titulo
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tus Tareas</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.taskTitle}>{item.titulo}</Text>
                            <Text style={styles.taskDescription}>{item.descripcion}</Text>
                        </View>
                        
                        <View style={styles.actions}>
                            <TouchableOpacity 
                                onPress={() => handleEditTitle(item)}
                                style={styles.editButton}
                            >
                                <Text style={{ color: 'blue' }}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => handleDelete(item.id)}
                                style={styles.deleteButton}
                            >
                                <Text style={{ color: 'red' }}>Borrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 40 },
    taskItem: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2 
    },
    taskTitle: { fontSize: 16, fontWeight: 'bold' },
    taskDescription: { fontSize: 14, color: '#666' },
    actions: { flexDirection: 'column', gap: 10, marginLeft: 10 },
    editButton: { padding: 5 },
    deleteButton: { padding: 5 }
});

export default TaskScreen;