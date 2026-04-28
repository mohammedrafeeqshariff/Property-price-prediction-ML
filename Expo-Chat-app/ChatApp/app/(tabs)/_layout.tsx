import React from 'react';
import { Tabs } from 'expo-router';
import { MessageSquare, User, Users } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#075E54',
            headerStyle: { backgroundColor: '#075E54' },
            headerTintColor: '#fff',
        }}>
            <Tabs.Screen
                name="chat"
                options={{
                    title: 'Chats',
                    tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
