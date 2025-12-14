import { useAuthStore } from "../../action/store/AuthStore";
import type { SettingsState } from "../../action/store/SettingsStore";
import { sendMessage } from "../../utils/messaging";

export async function getSettings(): Promise<SettingsState> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("settingsStore", (result) => {
            resolve(JSON.parse(result.settingsStore).state);
        });
    });
}

export async function getSetting<K extends keyof SettingsState>(key: K): Promise<SettingsState[K]> {
    const settings = await getSettings();
    return settings[key];
}

export async function isUserAuthenticated(): Promise<boolean> {
    const { studentId, cuIdPass } = useAuthStore.getState();
    const firebaseAuthenticated = await sendMessage("checkFirebaseAuth");

    console.log(studentId, cuIdPass, firebaseAuthenticated);
    return studentId && cuIdPass && firebaseAuthenticated ? true : false;
}
