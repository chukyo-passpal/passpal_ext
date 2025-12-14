import { onAuthStateChanged } from "firebase/auth/web-extension";

import { useAuthStore } from "../action/store/AuthStore";
import { auth } from "./firebase";

export async function initFirebaseUser() {
    return new Promise<void>((resolve) => {
        onAuthStateChanged(auth, (user) => {
            useAuthStore.getState().setFirebaseUser(user);
            resolve();
        });
    });
}
