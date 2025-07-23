import { STORAGE_KEYS, UI } from "./utils/constants";
import { getSetting } from "./utils/settings";

type Theme = "light" | "dark";

class DarkModeManager {
    constructor() {
        this.initializeDarkMode();
    }

    private initializeDarkMode(): void {
        try {
            this.applyInitialTheme();
        } catch (error) {
            console.error("[ダークモード] 初期化処理中にエラーが発生しました:", error);
        }
    }

    private applyInitialTheme(): void {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        const theme: Theme = savedTheme === "dark" ? "dark" : "light";
        this.updatePageTheme(theme);
    }

    private updatePageTheme(theme: Theme): void {
        const isDark = theme === "dark";
        document.body.classList.toggle("dark-mode", isDark);
    }

    public static initialize(): DarkModeManager {
        return new DarkModeManager();
    }
}

export default async function darkMode(): Promise<void> {
    const darkModeEnabled = await getSetting('darkModeEnabled');
    
    if (!darkModeEnabled) {
        return;
    }

    const initializeDarkMode = () => {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        const theme: Theme = darkModeEnabled && savedTheme !== "light" ? "dark" : "light";
        document.body.classList.toggle("dark-mode", theme === "dark");
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDarkMode);
    } else {
        initializeDarkMode();
    }
}

// Initialize dark mode functionality
darkMode();
