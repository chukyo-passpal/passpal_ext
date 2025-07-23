import type { AttendanceButton } from '../../types/common';
import { buildButton } from '../../utils/ui-builder';

export class AttendanceCaller {
    private container: HTMLDivElement | null = null;
    private button: HTMLButtonElement | null = null;
    private buttonText: HTMLSpanElement | null = null;
    private isProcessing = false;

    private readonly buttonConfig: AttendanceButton = {
        defaultText: "出席ウィンドウの強制取得",
        loadedText: "取得が完了しました！",
        resetDelay: 3000
    };

    constructor() {
        this.init();
    }

    private init(): void {
        this.createContainer();
        this.createButton();
        this.attachEventListeners();
    }

    private createContainer(): void {
        const body = document.querySelector("body");
        if (!body) {
            console.error('[PassPal] Body element not found');
            return;
        }

        this.container = body.appendChild(document.createElement("div"));
        this.container.id = "psc-display";
        
        // コンテナのスタイル設定
        Object.assign(this.container.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none"
        });
    }

    private createButton(): void {
        if (!this.container) return;

        const buttonHTML = buildButton({
            className: "psc-btn",
            text: this.buttonConfig.defaultText
        });

        this.container.innerHTML = buttonHTML;
        this.button = this.container.querySelector(".psc-btn") as HTMLButtonElement;
        this.buttonText = this.button?.querySelector(".psc-btn-text") as HTMLSpanElement;
    }

    private attachEventListeners(): void {
        if (!this.button) return;

        this.button.onclick = (e) => {
            e.preventDefault();
            this.handleButtonClick();
        };
    }

    private handleButtonClick(): void {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.updateButtonText(this.buttonConfig.loadedText);
        
        this.injectNotificationScript();
        
        setTimeout(() => {
            this.resetButton();
        }, this.buttonConfig.resetDelay);
    }

    private injectNotificationScript(): void {
        const scriptPath = chrome.runtime.getURL("notify_coller.js");
        this.injectScript(scriptPath, "body");
    }

    private injectScript(filePath: string, tag: string): void {
        const targetElement = document.getElementsByTagName(tag)[0] || document.documentElement;
        const script = document.createElement("script");
        
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", filePath);

        script.onload = () => {
            script.remove();
        };
        
        script.onerror = () => {
            console.error(`[PassPal] Failed to load script: ${filePath}`);
            script.remove();
        };

        targetElement.appendChild(script);
    }

    private updateButtonText(text: string): void {
        if (this.buttonText) {
            this.buttonText.innerHTML = text;
        }
    }

    private resetButton(): void {
        this.isProcessing = false;
        this.updateButtonText(this.buttonConfig.defaultText);
    }

    public destroy(): void {
        if (this.container) {
            this.container.remove();
            this.container = null;
            this.button = null;
            this.buttonText = null;
        }
    }
}

export default function powerfulSyussekiCaller(): void {
    new AttendanceCaller();
}