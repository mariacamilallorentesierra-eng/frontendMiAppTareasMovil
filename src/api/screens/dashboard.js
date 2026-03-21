import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 

const PhotoScreen = ({ onNavigate, currentImageURI, onImageUpdate }) => {
    
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert(
                'Permiso denegado',
                'Necesitamos permiso para acceder a tus fotos para cambiar la foto de perfil.'
            );
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, 
            allowsEditing: true, 
            aspect: [1, 1], 
            quality: 0.7, 
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            onImageUpdate(result.assets[0].uri);
            Alert.alert('Éxito', 'Foto de perfil actualizada visualmente.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => onNavigate('home')} style={styles.backButton}>
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.navTime}>3:20</Text>
                <View style={styles.rightIcons}><Text>🛜🔋</Text></View>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>📸 Cambiar Foto de Perfil</Text>
                <View style={styles.imageContainer}>
                    {currentImageURI ? (
                        <Image source={{ uri: currentImageURI }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.placeholderCicle}>
                            <Text style={styles.placeholderText}>No has seleccionado imagen</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
                    <Text style={styles.pickButtonText}>Elegir de la galería</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    navBar: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 15, height: 60, backgroundColor: '#FDFDFD', borderBottomWidth: 1, borderBottomColor: '#eee' 
    },
    backButton: { padding: 5 },
    backText: { fontSize: 32, color: '#333' },
    navTime: { fontSize: 16, fontWeight: '600' },
    rightIcons: { opacity: 0.5 },
    content: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
    title: { fontSize: 22, fontWeight: '700', marginTop: 30, marginBottom: 50, color: '#222' },
    imageContainer: { marginBottom: 50 },
    avatarImage: { width: 180, height: 180, borderRadius: 90 },
    placeholderCicle: { 
        width: 180, height: 180, borderRadius: 90, 
        backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', padding: 20 
    },
    placeholderText: { textAlign: 'center', color: '#888', fontSize: 14, lineHeight: 20 },
    pickButton: { 
        width: '100%', borderWidth: 2, borderColor: '#39A900', 
        borderRadius: 8, paddingVertical: 12, alignItems: 'center', backgroundColor: '#fff'
    },
    pickButtonText: { color: '#39A900', fontWeight: 'bold', fontSize: 15 }
});

export default PhotoScreen;