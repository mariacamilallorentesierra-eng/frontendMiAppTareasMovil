import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from "../../../context/authContext";
import { loginService } from '../../api/apiService';

export const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert("Error", "Completa todos los campos");

        setLoading(true);
        try {
            const data = await loginService(email, password);
            login(data.token); 
        } catch (e) {
            Alert.alert("Error de login", e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <View style={styles.container}>
            <Text style={styles.tittle}>Iniciar Sesión</Text>
            
            <TextInput
                style={styles.input} 
                placeholder="Correo Electronico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input} 
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            
            {loading ? (
                <ActivityIndicator size="large" color="#00ff4c" />
            ) : (
                <Button title="Por favor, iniciar Sesión" onPress={handleLogin} color="#00ff4c" />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    tittle: { fontSize: 28, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#00ff4c" },
    input: { borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 20, padding: 10 },
});

export default LoginScreen;