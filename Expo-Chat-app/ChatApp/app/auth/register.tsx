import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';


export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();


    const handleSignup = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.replace('/(tabs)/chat');
        } catch (err: any) {
            alert(err.message);
        }
    };


    useEffect(() => {
        router.replace('/auth/login');
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#075E54" />
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
    button: { backgroundColor: '#22C55E', padding: 14, borderRadius: 8 },
    googleButton: { backgroundColor: '#DB4437', padding: 14, borderRadius: 8, marginTop: 12 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});