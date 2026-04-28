import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'auth';

        if (!user && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/auth/login');
        } else if (user && inAuthGroup) {
            // Redirect to main tabs if authenticated
            router.replace('/(tabs)/chat');
        }
    }, [user, loading, segments]);

    return (
        <Stack>
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
