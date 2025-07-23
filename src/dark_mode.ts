export default function darkMode() {
    let isButtonClickable = true;

    type Theme = "light" | "dark";

    const initializeDarkMode = () => {
        try {
            const existingButton = document.getElementById("dark-mode-toggle");
            if (existingButton) {
                existingButton.remove();
            }
            createToggleButton();
            applyInitialTheme();
        } catch (e) {
            console.error("[ダークモード] 初期化処理中にエラーが発生しました:", e);
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeDarkMode);
    } else {
        initializeDarkMode();
    }

    function applyInitialTheme() {
        const savedTheme = localStorage.getItem("theme");
        const theme: Theme = savedTheme === "dark" ? "dark" : "light";
        updatePageTheme(theme);
        updateButtonText(theme);
    }

    function updatePageTheme(theme: Theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }

    function updateButtonText(theme: Theme) {
        const buttonText = document.getElementById("dark-mode-toggle-text");
        if (!buttonText) return;

        if (theme === "dark") {
            buttonText.textContent = "ライトモードに切替";
        } else {
            buttonText.textContent = "ダークモードに切替";
        }
    }

    function createToggleButton() {
        const target = document.body;
        if (!target) return;

        const button = document.createElement("button");
        button.id = "dark-mode-toggle";
        button.className = "dmt-btn";

        const spanLg = document.createElement("span");
        spanLg.className = "dmt-btn-lg";

        const spanSl = document.createElement("span");
        spanSl.className = "dmt-btn-sl";

        const spanText = document.createElement("span");
        spanText.id = "dark-mode-toggle-text";
        spanText.className = "dmt-btn-text";

        spanLg.appendChild(spanSl);
        spanLg.appendChild(spanText);
        button.appendChild(spanLg);
        target.appendChild(button);

        button.addEventListener("click", () => {
            if (!isButtonClickable) return;

            isButtonClickable = false;
            button.style.cursor = "not-allowed";

            const isDarkMode = document.body.classList.contains("dark-mode");
            const newTheme = isDarkMode ? "light" : "dark";

            // 1. 即座にテーマを切り替え
            updatePageTheme(newTheme);
            localStorage.setItem("theme", newTheme);

            // 2. ボタンの文字を「切り替え完了」に変更
            const buttonText = document.getElementById("dark-mode-toggle-text");
            if (buttonText) {
                buttonText.textContent = "切り替え完了";
            }

            // 3. 1秒後に文字を元に戻し、ボタンを有効化
            setTimeout(() => {
                updateButtonText(newTheme);
                isButtonClickable = true;
                button.style.cursor = "pointer";
            }, 300); // 1秒 = 1000ミリ秒
        });
    }
}

darkMode();
