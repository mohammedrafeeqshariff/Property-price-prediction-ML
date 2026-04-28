import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    doc,
    getDocs,
    setDoc,
    limit
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const chatService = {
    // Get all chats for a user
    getUserChats: (uid: string, callback: (chats: any[]) => void) => {
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', uid),
            orderBy('lastMessageAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(chats);
        });
    },

    // Get messages for a specific chat
    getMessages: (chatId: string, callback: (messages: any[]) => void) => {
        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    },

    // Send a message
    sendMessage: async (chatId: string, senderId: string, text: string, type = 'text', mediaUrl = '') => {
        const message = {
            senderId,
            text,
            type,
            mediaUrl,
            createdAt: serverTimestamp(),
            seen: false,
        };

        await addDoc(collection(db, 'chats', chatId, 'messages'), message);

        // Update last message in chat doc
        await updateDoc(doc(db, 'chats', chatId), {
            lastMessage: text,
            lastMessageAt: serverTimestamp(),
            lastSenderId: senderId,
        });
    },

    // Create or get 1-to-1 chat
    getOrCreateChat: async (uid1: string, uid2: string) => {
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', uid1),
            where('isGroup', '==', false)
        );

        const snapshot = await getDocs(q);
        const existingChat = snapshot.docs.find(doc => {
            const participants = doc.data().participants;
            return participants.includes(uid2);
        });

        if (existingChat) {
            return existingChat.id;
        }

        // Create new chat
        const newChatRef = await addDoc(collection(db, 'chats'), {
            participants: [uid1, uid2],
            isGroup: false,
            createdAt: serverTimestamp(),
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
        });

        return newChatRef.id;
    },

    // Create group chat
    createGroupChat: async (creatorId: string, name: string, members: string[], groupImage = '') => {
        const newChatRef = await addDoc(collection(db, 'chats'), {
            groupName: name,
            groupImage,
            participants: [...members, creatorId],
            admins: [creatorId],
            isGroup: true,
            createdAt: serverTimestamp(),
            lastMessage: '',
            lastMessageAt: serverTimestamp(),
        });

        return newChatRef.id;
    }
};
