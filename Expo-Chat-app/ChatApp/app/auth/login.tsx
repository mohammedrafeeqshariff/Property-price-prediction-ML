import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const recaptchaVerifier = useRef(null);
    const router = useRouter();

    const sendVerification = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const id = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current!
            );
            setVerificationId(id);
            Alert.alert('Success', 'Verification code has been sent.');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const confirmCode = async () => {
        if (!code) return;
        setLoading(true);
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId!,
                code
            );
            await signInWithCredential(auth, credential);
            router.replace('/(tabs)/chat');
        } catch (err: any) {
            Alert.alert('Error', 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={auth.app.options}
                attemptInvisibleVerification={true}
            />
            <Text style={styles.title}>Welcome to ChatApp</Text>
            <Text style={styles.subtitle}>Enter your phone number to continue</Text>

            {!verificationId ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="+1 123 456 7890"
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        onChangeText={setPhoneNumber}
                        value={phoneNumber}
                    />
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={sendVerification}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Next</Text>}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="number-pad"
                        onChangeText={setCode}
                        value={code}
                    />
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={confirmCode}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setVerificationId(null)} style={{ marginTop: 20 }}>
                        <Text style={styles.link}>Change Phone Number</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 32, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 8, marginBottom: 16, fontSize: 18 },
    button: { backgroundColor: '#075E54', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    link: { color: '#075E54', textAlign: 'center', fontSize: 16 },
});
