import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";

const firebaseConfig = {
    apiKey: "AIzaSyDEIMvdEP3dVb6ePmE4XZODAPnjcrwydeg",
    authDomain: "chukyo-passpal.firebaseapp.com",
    projectId: "chukyo-passpal",
    storageBucket: "chukyo-passpal.firebasestorage.app",
    messagingSenderId: "707651746611",
    appId: "1:707651746611:web:3978e68bf6ffce20055c46",
    measurementId: "G-08GCHLYMXG",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
