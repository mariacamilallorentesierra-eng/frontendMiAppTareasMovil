// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { AuthContext } from '../../../context/authContext';
// import { userService } from '../apiService';

// const DashboardScreen = ({ navigation }) => {
//     const { userToken, Logout } = useContext(AuthContext);
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const BASE_IP = "http://192.168.1.9:8000"; 

//     useEffect(() => {
//         if (userToken) fetchProfile();
//     }, [userToken]);

//     const fetchProfile = async () => {
//         try {
//             setLoading(true);
//             const data = await userService.getProfile(userToken);
//             setUserData(data);
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const pickImage = async () => {
//         const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (!permission.granted) {
//             Alert.alert("Permiso", "Se requiere acceso a la galería");
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ['images'],
//             quality: 0.1, // Calidad baja para evitar errores de tamaño
//         });

//         if (!result.canceled) {
//             uploadImage(result.assets[0].uri);
//         }
//     };

//     const uploadImage = async (uri) => {
//         try {
//             setLoading(true);
//             await userService.uploadProfileImage(userToken, uri);
//             fetchProfile(); 
//         } catch (error) {
//             Alert.alert("Error", "No se pudo subir la foto");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return (
//         <View style={styles.center}><ActivityIndicator size="large" color="#39A900" /></View>
//     );

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.title}>Dashboard</Text>
//                 <TouchableOpacity onPress={Logout}><Text style={styles.logout}>Cerrar Sesión</Text></TouchableOpacity>
//             </View>

//             <View style={styles.content}>
//                 <TouchableOpacity onPress={pickImage}>
//                     {userData?.foto_url ? (
//                         <Image
//                             source={{ uri: userData.foto_url.startsWith('http') ? userData.foto_url : `${BASE_IP}${userData.foto_url}` }}
//                             style={styles.avatar}
//                         />
//                     ) : (
//                         <View style={styles.avatarPlaceholder}><Text>Subir Foto</Text></View>
//                     )}
//                 </TouchableOpacity>
//                 <Text style={styles.email}>{userData?.email || "Usuario"}</Text>
//                 <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Tasks')}>
//                     <Text style={styles.buttonText}>Ver mis Tareas</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#f0f2f5', padding: 20 },
//     header: { marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' },
//     title: { fontSize: 22, fontWeight: 'bold' },
//     logout: { color: 'red', fontWeight: 'bold' },
//     content: { marginTop: 50, alignItems: 'center' },
//     avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
//     avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
//     email: { fontSize: 18, color: '#333', marginBottom: 20 },
//     button: { backgroundColor: '#39A900', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
//     buttonText: { color: '#fff', fontWeight: 'bold' },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
// });

// export default DashboardScreen;