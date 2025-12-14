import type { AuthState } from "../../action/store/AuthStore";
import type { SettingsState } from "../../action/store/SettingsStore";

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

export async function getAuthState(): Promise<AuthState> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("authStore", (result) => {
            resolve(JSON.parse(result.authStore).state);
        });
    });
}

export async function isUserAuthenticated(): Promise<boolean> {
    const authState = await getAuthState();
    return authState.studentId && authState.password && authState.IdToken ? true : false;
}
