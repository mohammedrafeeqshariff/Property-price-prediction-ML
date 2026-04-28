import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { chatService } from '../../services/chatService';
import { useRouter, Stack } from 'expo-router';
import { format } from 'date-fns';
import { Users, UserPlus } from 'lucide-react-native';

export default function ChatsScreen() {
    const { user } = useAuth();
    const [chats, setChats] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        const unsubscribe = chatService.getUserChats(user.uid, (data) => {
            setChats(data);
        });
        return unsubscribe;
    }, [user]);

    const renderChatItem = ({ item }: { item: any }) => {
        // Determine the chat name and image (group vs 1-to-1)
        const chatName = item.isGroup ? item.groupName : 'User'; // In full version, fetch participant details
        const lastMessageDate = item.lastMessageAt?.toDate ? format(item.lastMessageAt.toDate(), 'HH:mm') : '';

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => router.push(`/chat/${item.id}`)}
            >
                <Image
                    source={{ uri: item.groupImage || 'https://via.placeholder.com/50' }}
                    style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.chatName}>{chatName}</Text>
                        <Text style={styles.chatTime}>{lastMessageDate}</Text>
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {item.lastMessage || 'No messages yet'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                headerRight: () => (
                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                        <TouchableOpacity onPress={() => router.push('/chat/find-people')} style={{ padding: 5 }}>
                            <UserPlus size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/chat/create-group')} style={{ padding: 5 }}>
                            <Users size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )
            }} />
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text>No chats yet. Start messaging!</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 0.5, borderColor: '#eee', alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    chatInfo: { flex: 1 },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    chatName: { fontSize: 16, fontWeight: 'bold' },
    chatTime: { fontSize: 12, color: '#666' },
    lastMessage: { fontSize: 14, color: '#666' },
    empty: { padding: 50, alignItems: 'center' },
});
