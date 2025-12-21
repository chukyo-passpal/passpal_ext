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
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    signIn: (oauthAccessToken: string) => Promise<void>;
    signOut: () => Promise<void>;
    setStudentId: (studentId: string | null) => void;
    setCuIdPass: (cuIdPass: string | null) => void;
    setFirebaseUser: (fUser: User | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        immer((set) => ({
            studentId: null,
            cuIdPass: null,
            firebaseUser: null,
            isLoading: false,
            error: null,

            signIn: async (oauthAccessToken) => {
                set((state) => {
                    state.isLoading = true;
                    state.error = null;
                });

                try {
                    const credential = GoogleAuthProvider.credential(null, oauthAccessToken);
                    const result = await signInWithCredential(auth, credential);

                    set((state) => {
                        state.firebaseUser = result.user;
                        state.isLoading = false;
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "認証エラーが発生しました";
                    set((state) => {
                        state.error = errorMessage;
                        state.isLoading = false;
                    });
                    console.error("SignIn Error", error);
                    throw error;
                }
            },

            signOut: async () => {
                set((state) => {
                    state.isLoading = true;
                    state.error = null;
                });

                try {
                    await signOut(auth);
                    set((state) => {
                        state.studentId = null;
                        state.cuIdPass = null;
                        state.firebaseUser = null;
                        state.isLoading = false;
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "ログアウトエラーが発生しました";
                    set((state) => {
                        state.error = errorMessage;
                        state.isLoading = false;
                    });
                    console.error("SignOut Error", error);
                }
            },

            setStudentId: (studentId) => set({ studentId }),
            setCuIdPass: (cuIdPass) => set({ cuIdPass }),
            setFirebaseUser: (fUser) => set({ firebaseUser: fUser }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        })),
        {
            name: "authStore",
            storage: createJSONStorage(() => chromeStorage),
            partialize: (state) => ({ studentId: state.studentId, cuIdPass: state.cuIdPass }),
        }
    )
);
