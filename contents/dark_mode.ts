import { STORAGE_KEYS } from "./utils/constants";
import { getSetting } from "./utils/settings";

type Theme = "light" | "dark";

export default async function darkMode(): Promise<void> {
    const darkModeEnabled = await getSetting("darkModeEnabled");

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
