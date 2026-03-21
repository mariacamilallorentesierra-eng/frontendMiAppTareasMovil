import React, { useContext, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator,
    Modal,
    TextInput 
} from 'react-native';

import { AuthContext } from '../../../context/authContext'; 
import { taskApiService } from '../apiService'; 

const TaskScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [taskEditingId, setTaskEditingId] = useState(null); 
    const [procesando, setProcesando] = useState(false);

    useEffect(() => { 
        if (userToken) fetchTasks(); 
    }, [userToken]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskApiService.getAll(userToken);
            if (data && data.datos) {
                setTasks(data.datos);
            } else if (Array.isArray(data)) {
                setTasks(data);
            }
        } catch (error) { 
            console.error("Error al cargar tareas:", error); 
        } finally { 
            setLoading(false); 
        }
    };
    const handleGuardarTarea = async () => {
        if (!titulo.trim() || !descripcion.trim()) {
            Alert.alert("Aviso", "Por favor, completa el título y la descripción.");
            return;
        }

        setProcesando(true);
        try {
            const payload = { 
                titulo: titulo.trim(), 
                descripcion: descripcion.trim() 
            };
            
            if (taskEditingId) {
                await taskApiService.update(userToken, taskEditingId, payload);
                setTasks(prev => prev.map(t => t.id === taskEditingId ? { ...t, ...payload } : t));
                Alert.alert("Éxito", "Tarea actualizada correctamente");
            } else {
                const res = await taskApiService.create(userToken, payload);
                const nuevaTareaLocal = {
                    id: res?.id || Math.random().toString(),
                    ...payload
                };
                setTasks(prev => [nuevaTareaLocal, ...prev]);
                Alert.alert("Éxito", "Tarea creada correctamente");
            }
            cerrarModal();
        } catch (error) {
            Alert.alert("Error", "No se pudo sincronizar con el servidor");
        } finally {
            setProcesando(false);
        }
    };

    const abrirEditar = (item) => {
        setTaskEditingId(item.id);
        setTitulo(item.titulo);
        setDescripcion(item.descripcion);
        setModalVisible(true);
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setTitulo('');
        setDescripcion('');
        setTaskEditingId(null);
    };

    const eliminarTarea = (id) => {
        Alert.alert("Eliminar", "¿Estás seguro de borrar esta tarea?", [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await taskApiService.delete(userToken, id);
                        setTasks(prev => prev.filter(t => t.id !== id));
                    } catch (e) {
                        Alert.alert("Error", "No se pudo eliminar");
                    }
                } 
            }
        ]);
    };

    const renderTarea = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.textSide}>
                <Text style={styles.itemTitle}>{item.titulo}</Text>
                <Text style={styles.itemDesc}>{item.descripcion}</Text>
            </View>
            <View style={styles.buttonSide}>
                <TouchableOpacity onPress={() => abrirEditar(item)} style={styles.actionBtn}>
                    <Text style={styles.iconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarTarea(item.id)} style={styles.actionBtn}>
                    <Text style={styles.iconText}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainHeader}>Mis Tareas</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTarea}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListEmptyComponent={<Text style={styles.emptyText}>No hay tareas pendientes.</Text>}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {taskEditingId ? "Editar Tarea" : "Nueva Tarea"}
                        </Text>
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="Título" 
                            value={titulo} 
                            onChangeText={setTitulo} 
                        />
                        <TextInput 
                            style={[styles.input, { height: 80 }]} 
                            placeholder="Descripción" 
                            value={descripcion} 
                            onChangeText={setDescripcion} 
                            multiline 
                        />

                        <View style={styles.modalBtns}>
                            <TouchableOpacity onPress={cerrarModal}>
                                <Text style={styles.cancelTxt}>Cancelar</Text>
                            </TouchableOpacity>
                            {procesando ? (
                                <ActivityIndicator color="#007bff" />
                            ) : (
                                <TouchableOpacity style={styles.createBtn} onPress={handleGuardarTarea}>
                                    <Text style={styles.createBtnText}>
                                        {taskEditingId ? "Guardar" : "Crear"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
    mainHeader: { fontSize: 26, fontWeight: 'bold', marginTop: 50, marginBottom: 20, color: '#333' },
    card: {
        flexDirection: 'row', backgroundColor: '#f9f9f9', padding: 15,
        marginBottom: 12, borderRadius: 12, alignItems: 'center',
        justifyContent: 'space-between', borderWidth: 1, borderColor: '#eee',
        elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3,
    },
    textSide: { flex: 1, paddingRight: 10 },
    itemTitle: { fontSize: 17, fontWeight: 'bold', color: '#222' },
    itemDesc: { fontSize: 14, color: '#666', marginTop: 4 },
    buttonSide: { flexDirection: 'row', alignItems: 'center' },
    actionBtn: { marginLeft: 12, padding: 5 },
    iconText: { fontSize: 22 },
    fab: {
        position: 'absolute', right: 25, bottom: 25,
        backgroundColor: '#007bff', width: 60, height: 60,
        borderRadius: 30, justifyContent: 'center', alignItems: 'center', 
        elevation: 5, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5
    },
    fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '85%', backgroundColor: '#fff', padding: 25, borderRadius: 15, elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
    modalBtns: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    cancelTxt: { color: 'red', fontWeight: 'bold', fontSize: 16 },
    createBtn: { backgroundColor: '#007bff', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
    createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#aaa', fontSize: 16 }
});

export default TaskScreen;