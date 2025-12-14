import type { User } from "firebase/auth";
import { GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth/web-extension";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { auth } from "../../firebase/firebase";
import { chromeStorage } from "./chromeStorage";

export interface AuthState {
    studentId: string | null;
    cuIdPass: string | null;
    firebaseUser: User | null;
}

interface AuthActions {
    signIn: (oauthAccessToken: string) => Promise<void>;
    signOut: () => Promise<void>;
    setStudentId: (studentId: string | null) => void;
    setCuIdPass: (cuIdPass: string | null) => void;
    setFirebaseUser: (fUser: User | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        immer((set) => ({
            studentId: null,
            cuIdPass: null,
            firebaseUser: null,

            signIn: async (oauthAccessToken) => {
                try {
                    const credential = GoogleAuthProvider.credential(null, oauthAccessToken);
                    signInWithCredential(auth, credential);
                } catch (error) {
                    console.error("SignIn Error", error);
                    throw error;
                }
            },

            signOut: async () => {
                try {
                    set({ studentId: null, cuIdPass: null, firebaseUser: null });
                    await signOut(auth);
                } catch (error) {
                    console.error("SignOut Error", error);
                }
            },
            setStudentId: (studentId) => set({ studentId }),
            setCuIdPass: (cuIdPass) => set({ cuIdPass }),
            setFirebaseUser: (fUser) => set({ firebaseUser: fUser }),
        })),
        {
            name: "authStore",
            storage: createJSONStorage(() => chromeStorage),
            partialize: (state) => ({ studentId: state.studentId, cuIdPass: state.cuIdPass }),
        }
    )
);
