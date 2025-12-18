import { useAuthStore } from "../../action/store/AuthStore";
import { useSettingsStore, type SettingsState } from "../../action/store/SettingsStore";
import { sendMessage } from "../../utils/messaging";

/**
 * Zustand ストアからすべての設定を取得します（同期的）
 */
export function getSettings(): SettingsState {
    return useSettingsStore.getState();
}

/**
 * Zustand ストアから特定の設定値を取得します（同期的）
 * @param key - 取得する設定のキー
 * @returns 設定値
 */
export function getSetting<K extends keyof SettingsState>(key: K): SettingsState[K] {
    return useSettingsStore.getState()[key];
}

/**
 * ユーザーが認証済みかどうかを確認します
 * @returns 認証済みの場合は true
 */
export async function isUserAuthenticated(): Promise<boolean> {
    const { studentId, cuIdPass } = useAuthStore.getState();
    const firebaseAuthenticated = await sendMessage("checkFirebaseAuth");

    console.log(studentId, cuIdPass, firebaseAuthenticated);
    return studentId && cuIdPass && firebaseAuthenticated ? true : false;
}
