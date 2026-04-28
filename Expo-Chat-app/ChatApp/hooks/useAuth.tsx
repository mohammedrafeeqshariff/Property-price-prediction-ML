import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

interface AuthContextType {
    user: User | null;
    profile: any | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch or create user profile
                const userDocRef = doc(db, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setProfile(userDoc.data());
                } else {
                    // Create basic profile if it doesn't exist
                    const newProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        phoneNumber: firebaseUser.phoneNumber || '',
                        displayName: firebaseUser.displayName || firebaseUser.phoneNumber || 'Anonymous',
                        photoURL: firebaseUser.photoURL || '',
                        about: 'Hey there! I am using ChatApp.',
                        createdAt: serverTimestamp(),
                        lastSeen: serverTimestamp(),
                        isOnline: true,
                    };
                    await setDoc(userDocRef, newProfile);
                    setProfile(newProfile);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
