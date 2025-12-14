import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { chromeStorage } from "./chromeStorage";

export interface AuthState {
    isAuthenticated: boolean;
    studentId: string;
    IdToken: string;
    password: string;
    name: string;
}

interface AuthActions {
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    setStudentId: (studentId: string) => void;
    setIdToken: (IdToken: string) => void;
    setPassword: (password: string) => void;
    setName: (name: string) => void;
    clearAuthInfo: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            studentId: "",
            IdToken: "",
            password: "",
            name: "",

            setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
            setStudentId: (studentId) => set({ studentId }),
            setIdToken: (IdToken) => set({ IdToken }),
            setPassword: (password) => set({ password }),
            setName: (name) => set({ name }),

            clearAuthInfo: () =>
                set({
                    isAuthenticated: false,
                    studentId: "",
                    IdToken: "",
                    password: "",
                    name: "",
                }),
        }),
        { name: "authStore", storage: createJSONStorage(() => chromeStorage) }
    )
);

useAuthStore.persist.onFinishHydration(({ studentId, IdToken, password, setIsAuthenticated }) => {
    setIsAuthenticated(studentId && IdToken && password ? true : false);
});
