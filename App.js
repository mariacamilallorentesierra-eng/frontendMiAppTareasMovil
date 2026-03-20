import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
  ActivityIndicator, 
  FlatList,
  SafeAreaView 
} from 'react-native';

import LoginScreen from './src/api/screens/LoginScreen';
import { AuthProvider, AuthContext } from './context/authContext';
// 1. IMPORTANTE: Importamos el objeto exacto de tu archivo
import { taskApiService } from './src/api/apiService'; 

const NavigationWrapper = () => {
  const { userToken, isLoading, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    if (userToken) {
      fetchUserTasks();
    }
  }, [userToken]);

  const fetchUserTasks = async () => {
    setLoadingTasks(true);
    try {
      // 2. CORRECCIÓN: Usamos el método .getAll() de tu objeto
      const response = await taskApiService.getAll(userToken);
      
      // Como tu Django devuelve { "datos": [...] }, accedemos así:
      if (response && response.datos) {
        setTasks(response.datos);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff4c" />
      </View>
    );
  }

  if (userToken) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Mis Tareas</Text>
          <Button title="Salir" onPress={logout} color="#ff4c4c" />
        </View>

        {loadingTasks ? (
          <ActivityIndicator size="small" color="#00ff4c" />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
                <Text style={styles.taskTitle}>{item.titulo}</Text>
                <Text style={styles.taskDescription}>{item.descripcion}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay tareas.</Text>
            }
          />
        )}
      </SafeAreaView>
    );
  }

  return <LoginScreen />;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

// Estilos rápidos y limpios
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: '#fff', 
    marginTop: 40 
  },
  welcomeText: { fontSize: 20, fontWeight: 'bold' },
  listContent: { padding: 20 },
  taskCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10,
    elevation: 2 
  },
  taskTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  taskDescription: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});