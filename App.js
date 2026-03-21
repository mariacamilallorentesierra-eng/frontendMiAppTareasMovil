import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import { AuthProvider, AuthContext } from './context/authContext';
import LoginScreen from './src/api/screens/LoginScreen';
import TaskScreen from './src/api/screens/TaskScreen';
import HomeScreen from './src/api/screens/HomeScreen';
import PhotoScreen from './src/api/screens/dashboard'; 

const NavigationWrapper = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('home');
  const [profileImageURI, setProfileImageURI] = useState(null);

  useEffect(() => {
    const loadPersistedImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('@user_profile_image');
        if (savedImage !== null) {
          setProfileImageURI(savedImage);
        }
      } catch (e) {
        console.error("Error al cargar la imagen guardada:", e);
      }
    };
    loadPersistedImage();
  }, []);

  const handleUpdateImage = async (uri) => {
    try {
      setProfileImageURI(uri);
      await AsyncStorage.setItem('@user_profile_image', uri); 
    } catch (e) {
      console.error("Error al guardar la imagen:", e);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#39A900" />
      </View>
    );
  }

  if (!userToken) {
    return <LoginScreen />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {currentView === 'home' && (
        <HomeScreen onNavigate={setCurrentView} currentImageURI={profileImageURI} />
      )}

      {currentView === 'tasks' && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setCurrentView('home')} style={styles.backBtn}>
            <Text style={styles.backText}>← Volver al Inicio</Text>
          </TouchableOpacity>
          <TaskScreen />
        </View>
      )}

      {currentView === 'photo' && (
        <PhotoScreen 
            onNavigate={setCurrentView} 
            currentImageURI={profileImageURI} 
            onImageUpdate={handleUpdateImage} 
        />
      )}
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginTop: 50, marginLeft: 20, marginBottom: 10, padding: 5, zIndex: 10 },
  backText: { color: '#39A900', fontWeight: 'bold', fontSize: 16 }
});