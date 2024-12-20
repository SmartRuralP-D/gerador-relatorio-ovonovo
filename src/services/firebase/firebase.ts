'use client'

import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
}

async function register(email: string | Promise<string>, password: string | Promise<string>) {
    const auth = getAuth(getApps()[0]);
    const resolvedEmail = await Promise.resolve(email);
    const resolvedPassword = await Promise.resolve(password);
    return createUserWithEmailAndPassword(auth, resolvedEmail, resolvedPassword);
}

async function login(email: string | Promise<string>, password: string | Promise<string>) {
    const auth = getAuth(getApps()[0]);
    try {
        const resolvedEmail = await Promise.resolve(email);
        const resolvedPassword = await Promise.resolve(password);
        return await signInWithEmailAndPassword(auth, resolvedEmail, resolvedPassword);
    } catch (error: any) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            throw new Error('Email ou senha incorretos.');
        } else if (error.code === 'auth/network-request-failed') {
            throw new Error('Erro de rede, tente novamente mais tarde.');
        } else if (error.code === 'auth/invalid-api-key') {
            throw new Error('Erro interno, tente novamente mais tarde.');
        } else {
            throw new Error('Ocorreu um erro inesperado, tente novamente mais tarde.');
        }
    }
}

export { register, login };
