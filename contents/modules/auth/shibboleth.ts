/**
 * Shibboleth認証モジュール
 * 中京大学のShibboleth認証システムでの自動ログインを処理します。
 */

import { type AuthResult, type AuthCredentials, AuthError } from "../../types/common";

// ===== 定数定義 =====

/** Shibboleth認証で使用するセレクター */
const SELECTORS = {
    USERNAME_INPUT: "#username",
    PASSWORD_INPUT: "#password",
    LOGIN_BUTTON: "#login",
    ERROR_MESSAGE: ".c-message",
} as const;

// ===== インターフェース定義 =====

/** Shibboleth認証の設定オプション */
interface ShibbolethAuthOptions {
    readonly credentials?: AuthCredentials;
    readonly autoSubmit: boolean;
    readonly checkForErrors: boolean;
    readonly timeout: number;
}

/** Shibboleth認証のデフォルト設定 */
const DEFAULT_OPTIONS: ShibbolethAuthOptions = {
    autoSubmit: true,
    checkForErrors: true,
    timeout: 5000,
};

// ===== メインクラス =====

/**
 * Shibboleth認証を処理するクラス
 */
class ShibbolethAuth {
    private readonly options: ShibbolethAuthOptions;

    constructor(options: Partial<ShibbolethAuthOptions> = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    /**
     * 認証処理を実行します
     */
    public async authenticate(): Promise<AuthResult> {
        try {
            // エラーチェック
            if (this.options.checkForErrors && this.hasErrorMessage()) {
                return {
                    status: "error",
                    message: "ページにエラーメッセージが表示されています",
                };
            }

            // フォーム要素の取得
            const formElements = this.getFormElements();
            if (!formElements) {
                return {
                    status: "error",
                    message: "ログインフォームが見つかりません",
                };
            }

            // 認証情報が設定されていない場合は手動入力を待つ
            if (!this.options.credentials) {
                return {
                    status: "pending",
                    message: "認証情報が設定されていません。手動でログインしてください。",
                };
            }

            // 認証情報を入力
            await this.fillCredentials(formElements, this.options.credentials);

            // 自動送信が有効な場合はログインボタンをクリック
            if (this.options.autoSubmit) {
                formElements.loginButton.click();
                return {
                    status: "pending",
                    message: "ログイン処理を実行中です...",
                };
            }

            return {
                status: "authenticated",
                message: "認証情報を入力しました。ログインボタンをクリックしてください。",
            };
        } catch (error) {
            const authError = error instanceof AuthError ? error : new AuthError("認証処理中にエラーが発生しました", { originalError: error });
            return {
                status: "error",
                message: authError.message,
            };
        }
    }

    /**
     * エラーメッセージが表示されているかチェック
     */
    private hasErrorMessage(): boolean {
        const errorElement = document.querySelector(SELECTORS.ERROR_MESSAGE);
        return errorElement !== null;
    }

    /**
     * ログインフォームの要素を取得
     */
    private getFormElements(): { usernameInput: HTMLInputElement; passwordInput: HTMLInputElement; loginButton: HTMLButtonElement } | null {
        const usernameInput = document.querySelector<HTMLInputElement>(SELECTORS.USERNAME_INPUT);
        const passwordInput = document.querySelector<HTMLInputElement>(SELECTORS.PASSWORD_INPUT);
        const loginButton = document.querySelector<HTMLButtonElement>(SELECTORS.LOGIN_BUTTON);

        if (!usernameInput || !passwordInput || !loginButton) {
            return null;
        }

        return { usernameInput, passwordInput, loginButton };
    }

    /**
     * 認証情報をフォームに入力
     */
    private async fillCredentials(
        elements: { usernameInput: HTMLInputElement; passwordInput: HTMLInputElement; loginButton: HTMLButtonElement },
        credentials: AuthCredentials
    ): Promise<void> {
        try {
            // ユーザー名を入力
            elements.usernameInput.value = credentials.username;
            elements.usernameInput.dispatchEvent(new Event("input", { bubbles: true }));

            // パスワードを入力
            elements.passwordInput.value = credentials.password;
            elements.passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

            // わずかな遅延を入れてDOMの更新を待つ
            await this.sleep(100);
        } catch (error) {
            throw new AuthError("認証情報の入力に失敗しました", { error });
        }
    }

    /**
     * 指定されたミリ秒待機
     */
    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// ===== ユーティリティ関数 =====

/**
 * 従来のshib_login.tsとの互換性を保つためのラッパー関数
 * @deprecated 新しいコードではShibbolethAuthクラスを直接使用してください
 */
function legacyShibLogin(): void {
    console.warn("[PassPal] legacyShibLogin()は非推奨です。ShibbolethAuthクラスを使用してください。");

    // TODO: 実際の認証情報は環境変数や設定ファイルから取得するように変更する必要があります
    // 現在はセキュリティ上の理由でハードコードされた値を削除しています
    const auth = new ShibbolethAuth({
        autoSubmit: true,
        checkForErrors: true,
    });

    auth.authenticate()
        .then((result) => {
            console.log("[PassPal] Shibboleth認証結果:", result);
        })
        .catch((error) => {
            console.error("[PassPal] Shibboleth認証エラー:", error);
        });
}

// ===== エクスポートされるデフォルト関数 =====

/**
 * デフォルトエクスポート
 */
export default function shibLogin(): void {
    legacyShibLogin();
}

// 実行 - コンテンツスクリプトとして直接実行される場合
if (typeof window !== "undefined") {
    // ページ読み込み完了を待ってから実行
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", shibLogin);
    } else {
        shibLogin();
    }
}
