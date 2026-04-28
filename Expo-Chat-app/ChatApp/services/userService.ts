import { doc, updateDoc, serverTimestamp, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const userService = {
    updateProfile: async (uid: string, data: any) => {
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    setUserStatus: async (uid: string, isOnline: boolean) => {
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, {
            isOnline,
            lastSeen: serverTimestamp(),
        });
    },

    getAllUsers: async (excludeUid: string) => {
        const q = query(collection(db, 'users'), where('uid', '!=', excludeUid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data());
    },
};
