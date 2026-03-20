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
import { getTasks } from './src/api/apiService';

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
      const response = await getTasks(userToken);
      
      if (response && response.datos) {
        setTasks(response.datos);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff4c" />
        <Text>Iniciando...</Text>
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
          <ActivityIndicator size="small" color="#00ff4c" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.taskCard}>
             
                <Text style={styles.taskTitle}>{item.titulo || "Sin título"}</Text>
                
                <Text style={styles.taskDescription}>
                  {item.descripcion || "Sin descripción"}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyText}>No hay tareas para mostrar.</Text>
                <Button title="Actualizar" onPress={fetchUserTasks} />
              </View>
            }
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LoginScreen />
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
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 40
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyText: {
    color: '#999',
    marginBottom: 10,
    fontSize: 15
  }
});