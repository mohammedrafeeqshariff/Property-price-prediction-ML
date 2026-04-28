import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { storage, auth } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Camera } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, profile } = useAuth();
    const [displayName, setDisplayName] = useState(profile?.displayName || '');
    const [about, setAbout] = useState(profile?.about || '');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(profile?.photoURL || null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            let photoURL = profile?.photoURL;

            if (image && image !== profile?.photoURL) {
                // Upload new image
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `profiles/${user.uid}`);
                await uploadBytes(storageRef, blob);
                photoURL = await getDownloadURL(storageRef);
            }

            await userService.updateProfile(user.uid, {
                displayName,
                about,
                photoURL,
            });
            Alert.alert('Success', 'Profile updated!');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.profileImage} />
                    ) : (
                        <View style={[styles.profileImage, styles.placeholder]}>
                            <Camera color="#fff" size={40} />
                        </View>
                    )}
                    <View style={styles.cameraIcon}>
                        <Camera color="#fff" size={20} />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Enter your name"
                />

                <Text style={styles.label}>About</Text>
                <TextInput
                    style={styles.input}
                    value={about}
                    onChangeText={setAbout}
                    placeholder="Hey! I am using Chatly"
                    multiline
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => auth.signOut()}
                >
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: '#fff', padding: 20 },
    header: { alignItems: 'center', marginVertical: 30 },
    imageContainer: { position: 'relative' },
    profileImage: { width: 120, height: 120, borderRadius: 60 },
    placeholder: { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#075E54',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#fff',
    },
    form: { marginTop: 20 },
    label: { fontSize: 14, color: '#666', marginBottom: 8 },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        fontSize: 18,
        paddingVertical: 8,
        marginBottom: 24,
    },
    button: {
        backgroundColor: '#075E54',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    logoutButton: {
        marginTop: 20,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d32f2f',
        alignItems: 'center',
    },
    logoutText: { color: '#d32f2f', fontSize: 16, fontWeight: 'bold' },
});
