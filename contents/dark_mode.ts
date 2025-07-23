import type { Theme } from "./types/common";
import { STORAGE_KEYS, UI } from "./utils/constants";

class DarkModeManager {
    private isButtonClickable = true;
    private static readonly TOGGLE_DELAY = 300;

    constructor() {
        this.initializeDarkMode();
    }

    private initializeDarkMode(): void {
        try {
            this.removeExistingButton();
            this.createToggleButton();
            this.applyInitialTheme();
        } catch (error) {
            console.error("[ダークモード] 初期化処理中にエラーが発生しました:", error);
        }
    }

    private removeExistingButton(): void {
        const existingButton = document.getElementById(UI.DARK_MODE_TOGGLE_ID);
        if (existingButton) {
            existingButton.remove();
        }
    }

    private applyInitialTheme(): void {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        const theme: Theme = savedTheme === "dark" ? "dark" : "light";
        this.updatePageTheme(theme);
        this.updateButtonText(theme);
    }

    private updatePageTheme(theme: Theme): void {
        const isDark = theme === "dark";
        document.body.classList.toggle("dark-mode", isDark);
    }

    private updateButtonText(theme: Theme): void {
        const buttonText = document.getElementById(UI.DARK_MODE_TEXT_ID);
        if (!buttonText) return;

        buttonText.textContent = theme === "dark" ? "ライトモードに切替" : "ダークモードに切替";
    }

    private createToggleButton(): void {
        const target = document.body;
        if (!target) return;

        const button = this.buildButtonElement();
        target.appendChild(button);

        button.addEventListener("click", () => this.handleToggleClick(button));
    }

    private buildButtonElement(): HTMLButtonElement {
        const button = document.createElement("button");
        button.id = UI.DARK_MODE_TOGGLE_ID;
        button.className = "dmt-btn";

        const spanLg = document.createElement("span");
        spanLg.className = "dmt-btn-lg";

        const spanSl = document.createElement("span");
        spanSl.className = "dmt-btn-sl";

        const spanText = document.createElement("span");
        spanText.id = UI.DARK_MODE_TEXT_ID;
        spanText.className = "dmt-btn-text";

        spanLg.appendChild(spanSl);
        spanLg.appendChild(spanText);
        button.appendChild(spanLg);

        return button;
    }

    private handleToggleClick(button: HTMLButtonElement): void {
        if (!this.isButtonClickable) return;

        this.setButtonClickable(false, button);

        const currentTheme = this.getCurrentTheme();
        const newTheme: Theme = currentTheme === "dark" ? "light" : "dark";

        this.switchTheme(newTheme);
        this.showTemporaryFeedback();

        setTimeout(() => {
            this.updateButtonText(newTheme);
            this.setButtonClickable(true, button);
        }, DarkModeManager.TOGGLE_DELAY);
    }

    private getCurrentTheme(): Theme {
        return document.body.classList.contains("dark-mode") ? "dark" : "light";
    }

    private switchTheme(theme: Theme): void {
        this.updatePageTheme(theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    private showTemporaryFeedback(): void {
        const buttonText = document.getElementById(UI.DARK_MODE_TEXT_ID);
        if (buttonText) {
            buttonText.textContent = "切り替え完了";
        }
    }

    private setButtonClickable(clickable: boolean, button: HTMLButtonElement): void {
        this.isButtonClickable = clickable;
        button.style.cursor = clickable ? "pointer" : "not-allowed";
    }

    public static initialize(): DarkModeManager {
        return new DarkModeManager();
    }
}

export default function darkMode(): void {
    const initializeDarkMode = () => {
        DarkModeManager.initialize();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDarkMode);
    } else {
        initializeDarkMode();
    }
}

// Initialize dark mode functionality
darkMode();
