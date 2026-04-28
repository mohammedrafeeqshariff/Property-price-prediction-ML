import { Redirect } from 'expo-router';

export default function Index() {
    // This file is the entry point. Our root _layout.tsx handles 
    // the redirection logic based on auth state.
    return <Redirect href="/auth/login" />;
}
