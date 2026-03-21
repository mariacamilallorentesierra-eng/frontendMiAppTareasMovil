import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { AuthContext } from '../../../context/authContext'; 

const HomeScreen = ({ onNavigate, currentImageURI }) => {
    const { logout, userData } = useContext(AuthContext);
    
    const defaultImage = 'https://i.pinimg.com/originals/71/71/3b/71713b6360492c10b64d08119853965d.jpg';

    const nombreUsuario = userData?.nombre || "Usuario ADSO";
    const rolUsuario = userData?.rol || "APRENDIZ";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerBar}>
                <Text style={styles.headerTitle}>Inicio - ADSO</Text>
            </View>

            <View style={styles.profileCard}>
                <Image 
                    source={{ uri: currentImageURI || defaultImage }} 
                    style={styles.avatar} 
                />
                <View style={styles.textContainer}>
                    <Text style={styles.userName}>{nombreUsuario}</Text>
                    <Text style={[
                        styles.userRole, 
                        { color: rolUsuario === 'INSTRUCTOR' ? '#39A900' : '#007bff' }
                    ]}>
                        {rolUsuario}
                    </Text>
                </View>
            </View>

            <View style={styles.menuGrid}>
                <TouchableOpacity style={styles.card} onPress={() => onNavigate('tasks')}>
                    <Text style={styles.cardIcon}>📋</Text>
                    <Text style={styles.cardText}>Mis Tareas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card} onPress={() => onNavigate('photo')}>
                    <Text style={styles.cardIcon}>📸</Text>
                    <Text style={styles.cardText}>Cambiar Foto</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutContainer} onPress={logout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    headerBar: { backgroundColor: '#39A900', padding: 20, paddingTop: 50 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    profileCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        margin: 20, padding: 20, borderRadius: 15, elevation: 4,
    },
    avatar: { width: 70, height: 70, borderRadius: 10, marginRight: 15 },
    textContainer: { flex: 1 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    userRole: { fontSize: 13, fontWeight: 'bold', marginTop: 4, textTransform: 'uppercase' },
    menuGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    card: { 
        backgroundColor: '#fff', width: '47%', padding: 25, 
        borderRadius: 15, alignItems: 'center', elevation: 3 
    },
    cardIcon: { fontSize: 35, marginBottom: 10 },
    cardText: { fontWeight: '600', color: '#555', fontSize: 14 },
    logoutContainer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
    logoutText: { color: '#FF4D4D', fontWeight: 'bold', fontSize: 16 }
});

export default HomeScreen;