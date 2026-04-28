import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { storageService } from '../../services/storageService';
import * as ImagePicker from 'expo-image-picker';
import { Send, Image as ImageIcon } from 'lucide-react-native';
import { Image } from 'react-native';

export default function ChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const [chatTitle, setChatTitle] = useState('Chat');

    useEffect(() => {
        if (!id || !user) return;

        // Fetch chat participant details to set header title
        const fetchChatDetails = async () => {
            const chatRef = doc(db, 'chats', id);
            const chatSnap = await getDoc(chatRef);
            if (chatSnap.exists()) {
                const data = chatSnap.data();
                if (data.isGroup) {
                    setChatTitle(data.groupName);
                } else {
                    // For 1-to-1, find the other participant's profile
                    const otherUid = data.participants.find((p: string) => p !== user.uid);
                    if (otherUid) {
                        const userRef = doc(db, 'users', otherUid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            setChatTitle(userSnap.data().displayName || userSnap.data().phoneNumber);
                        }
                    }
                }
            }
        };

        fetchChatDetails();

        const unsubscribe = chatService.getMessages(id, (data) => {
            setMessages(data);
        });
        return unsubscribe;
    }, [id, user]);

    const handleSend = async (type = 'text', mediaUrl = '') => {
        if ((type === 'text' && !inputText.trim()) || !user || !id) return;
        const text = type === 'text' ? inputText : '';
        if (type === 'text') setInputText('');
        await chatService.sendMessage(id, user.uid, text, type, mediaUrl);
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && id && user) {
            const asset = result.assets[0];
            const type = asset.type === 'video' ? 'video' : 'image';
            const path = `chats/${id}/${Date.now()}_${user.uid}`;
            try {
                const url = await storageService.uploadMedia(asset.uri, path);
                await handleSend(type, url);
            } catch (err: any) {
                console.error('Media upload failed', err);
            }
        }
    };

    const renderMessage = ({ item }: { item: any }) => {
        const isMe = item.senderId === user?.uid;
        return (
            <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
                {item.type === 'image' && (
                    <Image source={{ uri: item.mediaUrl }} style={styles.messageImage} />
                )}
                {item.text ? (
                    <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                        {item.text}
                    </Text>
                ) : null}
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <Stack.Screen options={{ title: chatTitle }} />
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    inverted
                    contentContainerStyle={styles.messageList}
                />

                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                        <ImageIcon color="#075E54" size={24} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
                        <Send color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5DDD5' },
    messageList: { padding: 10 },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 8,
        marginVertical: 4,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        borderBottomRightRadius: 0,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 0,
    },
    messageText: { fontSize: 16 },
    messageImage: { width: 220, height: 220, borderRadius: 8, marginBottom: 4 },
    myMessageText: { color: '#000' },
    theirMessageText: { color: '#000' },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    mediaButton: { padding: 5 },
    sendButton: {
        backgroundColor: '#075E54',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
