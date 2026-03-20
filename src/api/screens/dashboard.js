import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../../../context/authContext';
import { userService } from '../apiService';

const DashboardScreen = ({ navigation }) => {

    const { userToken, Logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userToken) {
            fetchProfile();
        }
    }, [userToken]);

    const fetchProfile = async () => {
        try {
            const data = await userService.getProfile(userToken);
            console.log("PERFIL:", data);
            setUserData(data);
        } catch (error) {
            console.error("Error perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 SELECCIONAR IMAGEN
    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permiso requerido", "Debes permitir acceso a la galería");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    // 🔥 SUBIR IMAGEN
    const uploadImage = async (uri) => {
        try {
            setLoading(true);

            const res = await userService.uploadProfileImage(userToken, uri);

            console.log("IMAGEN SUBIDA:", res);

            fetchProfile(); // 🔥 refresca datos

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo subir la imagen");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#39A900" />
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <TouchableOpacity onPress={Logout}>
                    <Text style={styles.logout}>Salir</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>

                {/* FOTO */}
                <TouchableOpacity onPress={pickImage}>
                    {userData?.foto_url ? (
                        <Image
                            source={{ uri: userData.foto_url }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text>Subir Foto</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* EMAIL */}
                <Text style={styles.email}>
                    {userData?.email || "Sin correo"}
                </Text>

                <Text style={styles.welcome}>
                    Bienvenido 👋
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Tasks')}
                >
                    <Text style={styles.buttonText}>Ir a tareas</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 20
    },
    header: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    logout: {
        color: 'red'
    },
    content: {
        marginTop: 50,
        alignItems: 'center'
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    email: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10
    },
    welcome: {
        fontSize: 20,
        marginBottom: 20
    },
    button: {
        backgroundColor: '#39A900',
        padding: 12,
        borderRadius: 10
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DashboardScreen;