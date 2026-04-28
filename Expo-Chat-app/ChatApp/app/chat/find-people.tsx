import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { userService } from '../../services/userService';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';
import { useRouter, Stack } from 'expo-router';
import { Search, UserPlus } from 'lucide-react-native';

export default function FindPeopleScreen() {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        const fetchUsers = async () => {
            const allUsers = await userService.getAllUsers(user.uid);
            setUsers(allUsers);
        };
        fetchUsers();
    }, [user]);

    const startChat = async (otherUser: any) => {
        if (!user) return;
        try {
            const chatId = await chatService.getOrCreateChat(user.uid, otherUser.uid);
            router.push(`/chat/${chatId}`);
        } catch (err) {
            console.error('Failed to start chat', err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        u.phoneNumber?.includes(search)
    );

    const renderUser = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
            <Image
                source={{ uri: item.photoURL || 'https://via.placeholder.com/50' }}
                style={styles.avatar}
            />
            <View style={styles.userInfo}>
                <Text style={styles.name}>{item.displayName || 'Anonymous'}</Text>
                <Text style={styles.about} numberOfLines={1}>{item.phoneNumber || 'No phone'}</Text>
            </View>
            <UserPlus size={20} color="#075E54" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Find People' }} />
            <View style={styles.searchBar}>
                <Search size={20} color="#666" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or phone"
                    value={search}
                    onChangeText={setSearch}
                    keyboardType="phone-pad"
                />
            </View>
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.uid}
                renderItem={renderUser}
                ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        margin: 15,
        borderRadius: 10
    },
    searchInput: { flex: 1, fontSize: 16 },
    userItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
        alignItems: 'center'
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    userInfo: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    about: { fontSize: 14, color: '#666' },
    empty: { padding: 50, textAlign: 'center', color: '#666' },
});
