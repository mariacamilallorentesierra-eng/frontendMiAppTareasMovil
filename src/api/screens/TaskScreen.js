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

// RUTAS CORREGIDAS SEGÚN TU EXPLORADOR DE ARCHIVOS
import { AuthContext } from '../../../context/authContext'; 
import { taskApiService } from '../apiService'; 

const TaskScreen = () => {
    const { userToken } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Estados para el Modal de Crear Tarea
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoTitulo, setNuevoTitulo] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState('');
    const [creando, setCreando] = useState(false);

    useEffect(() => { 
        if (userToken) fetchTasks(); 
    }, [userToken]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskApiService.getAll(userToken);
            // Ajuste según la respuesta de tu API Django
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

    const handleCrearTarea = async () => {
        if (!nuevoTitulo.trim() || !nuevaDescripcion.trim()) {
            Alert.alert("Aviso", "Por favor, completa el título y la descripción.");
            return;
        }

        setCreando(true);
        try {
            const payload = { 
                titulo: nuevoTitulo.trim(), 
                descripcion: nuevaDescripcion.trim() 
            };
            
            const res = await taskApiService.create(userToken, payload);
            
            // Creamos el objeto para la lista visual inmediatamente
            const nuevaTareaLocal = {
                id: res?.id || Math.random().toString(),
                titulo: nuevoTitulo.trim(),
                descripcion: nuevaDescripcion.trim()
            };

            setTasks(prev => [nuevaTareaLocal, ...prev]);
            cerrarModal();
            Alert.alert("Éxito", "Tarea creada correctamente");
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la tarea en el servidor");
        } finally {
            setCreando(false);
        }
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setNuevoTitulo('');
        setNuevaDescripcion('');
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
                        Alert.alert("Error", "No se pudo eliminar de la base de datos");
                    }
                } 
            }
        ]);
    };

    const editarTarea = (item) => {
        Alert.prompt(
            "Editar Tarea",
            "Nuevo título:",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Guardar",
                    onPress: async (nuevoTxt) => {
                        if (!nuevoTxt || nuevoTxt.trim() === "") return;
                        try {
                            await taskApiService.update(userToken, item.id, { 
                                titulo: nuevoTxt, 
                                descripcion: item.descripcion 
                            });
                            setTasks(prev => prev.map(t => t.id === item.id ? { ...t, titulo: nuevoTxt } : t));
                        } catch (e) {
                            Alert.alert("Error", "No se pudo actualizar");
                        }
                    }
                }
            ],
            "plain-text",
            item.titulo
        );
    };

    const renderTarea = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.textSide}>
                <Text style={styles.itemTitle}>{item.titulo}</Text>
                <Text style={styles.itemDesc}>{item.descripcion}</Text>
            </View>
            <View style={styles.buttonSide}>
                <TouchableOpacity onPress={() => editarTarea(item)} style={styles.actionBtn}>
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

            {/* BOTÓN FLOTANTE (FAB) */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            {/* MODAL PARA CREAR TAREA */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Nueva Tarea</Text>
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="Título de la tarea" 
                            value={nuevoTitulo} 
                            onChangeText={setNuevoTitulo} 
                        />
                        <TextInput 
                            style={[styles.input, { height: 80 }]} 
                            placeholder="Descripción" 
                            value={nuevaDescripcion} 
                            onChangeText={setNuevaDescripcion} 
                            multiline 
                        />

                        <View style={styles.modalBtns}>
                            <TouchableOpacity onPress={cerrarModal}>
                                <Text style={styles.cancelTxt}>Cancelar</Text>
                            </TouchableOpacity>
                            {creando ? (
                                <ActivityIndicator color="#007bff" />
                            ) : (
                                <TouchableOpacity style={styles.createBtn} onPress={handleCrearTarea}>
                                    <Text style={styles.createBtnText}>Crear</Text>
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