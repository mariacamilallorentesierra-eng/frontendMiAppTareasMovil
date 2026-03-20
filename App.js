import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  TouchableOpacity, 
  Text 
} from 'react-native';

import { AuthProvider, AuthContext } from './context/authContext';
import LoginScreen from './src/api/screens/LoginScreen';
import TaskScreen from './src/api/screens/TaskScreen'; // Importamos tu pantalla de tareas

const NavigationWrapper = () => {
  const { userToken, isLoading, logout } = useContext(AuthContext);

  // Pantalla de carga inicial
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // Si hay token, mostramos las tareas. Si no, el login.
  return (
    <View style={styles.container}>
      {userToken ? (
        <>
          {/* Botón de Salir global (opcional, si quieres que aparezca arriba) */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={logout}>
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
          
          <TaskScreen />
        </>
      ) : (
        <LoginScreen />
      )}
    </View>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    marginTop: 50, // Margen para evitar la muesca (notch)
    paddingHorizontal: 20,
    alignItems: 'flex-end', // Alinea el botón a la derecha
  },
  logoutText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    fontSize: 14,
  }
});