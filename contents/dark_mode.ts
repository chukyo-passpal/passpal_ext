/**
 * ダークモードを適用/解除する
 */
function applyDarkMode(enabled: boolean): void {
    if (enabled) {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
    } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
    }
}

/**
 * chrome.storageから直接ダークモード設定を取得
 */
async function getDarkModeEnabled(): Promise<boolean> {
    return new Promise((resolve) => {
        chrome.storage.sync.get("settingsStore", (result) => {
            try {
                if (!result.settingsStore) {
                    resolve(false);
                    return;
                }

                const parsed = JSON.parse(result.settingsStore);
                const enabled = parsed?.state?.darkModeEnabled ?? false;
                console.log("[PassPal] Dark mode enabled:", enabled);
                resolve(enabled);
            } catch (error) {
                console.error("[PassPal] Failed to get darkModeEnabled:", error);
                resolve(false);
            }
        });
    });
}

/**
 * ダークモード機能を初期化
 */
export default function darkMode(): void {
    const initializeDarkMode = async () => {
        // chrome.storageから直接読み込んで初期状態を適用
        const darkModeEnabled = await getDarkModeEnabled();
        applyDarkMode(darkModeEnabled);

        // chrome.storageの変更を監視（contentスクリプトとpopup間で同期）
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === "sync" && changes.settingsStore) {
                try {
                    const newValue = JSON.parse(changes.settingsStore.newValue);
                    if (newValue && newValue.state && typeof newValue.state.darkModeEnabled === "boolean") {
                        console.log("[PassPal] Dark mode changed to:", newValue.state.darkModeEnabled);
                        applyDarkMode(newValue.state.darkModeEnabled);
                    }
                } catch (error) {
                    console.error("[PassPal] Failed to parse settings change:", error);
                }
            }
        });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDarkMode);
    } else {
        initializeDarkMode();
    }
}

// Initialize dark mode functionality
darkMode();
