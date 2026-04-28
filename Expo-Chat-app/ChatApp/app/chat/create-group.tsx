import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';
import { storageService } from '../../services/storageService';
import { useRouter } from 'expo-router';
import { Camera } from 'lucide-react-native';

export default function CreateGroupScreen() {
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

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

    const handleCreate = async () => {
        if (!name.trim() || !user) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }

        setLoading(true);
        try {
            let groupImageUrl = '';
            if (image) {
                const path = `groups/${Date.now()}`;
                groupImageUrl = await storageService.uploadMedia(image, path);
            }

            // In a real app, you would select members here. For now, we'll create with just the creator.
            const chatId = await chatService.createGroupChat(user.uid, name, [], groupImageUrl);

            Alert.alert('Success', 'Group created!');
            router.replace(`/(tabs)/chat`);
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.groupImage} />
                ) : (
                    <View style={[styles.groupImage, styles.placeholder]}>
                        <Camera color="#fff" size={40} />
                    </View>
                )}
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Group Name"
                value={name}
                onChangeText={setName}
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCreate}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Group'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, backgroundColor: '#fff', alignItems: 'center' },
    imageContainer: { marginVertical: 30 },
    groupImage: { width: 120, height: 120, borderRadius: 60 },
    placeholder: { backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
    input: {
        width: '100%',
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
        width: '100%',
        alignItems: 'center',
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
