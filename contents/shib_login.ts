//  Shibbolethログインページで自動的にログインします。

import { useAuthStore } from "../action/store/AuthStore";
import { sendMessage } from "../utils/messaging";
import { SELECTORS } from "./utils/constants";
import { getSetting, isUserAuthenticated } from "./utils/settings";

type Credentials = {
    username: string;
    password: string;
};

/**
 * テストモードの認証情報を取得
 */
async function getTestModeCredentials(): Promise<Credentials | null> {
    const testCredentials = await sendMessage("getShibbolethTestCredentials", undefined);
    if (testCredentials) {
        console.log("Test mode enabled, using credentials from session storage");
    }
    return testCredentials;
}

/**
 * 通常モードの認証情報を取得
 */
async function getNormalModeCredentials(): Promise<Credentials | null> {
    const shibLoginEnabled = getSetting("shibLoginEnabled");
    if (!shibLoginEnabled) {
        return null;
    }

    const authenticated = await isUserAuthenticated();
    if (!authenticated) {
        console.log("User not authenticated, skipping auto-login");
        return null;
    }

    const { studentId, cuIdPass } = useAuthStore.getState();
    if (!studentId || !cuIdPass) {
        console.log("No login credentials found, skipping auto-login");
        return null;
    }

    return { username: studentId, password: cuIdPass };
}

/**
 * 認証情報を取得（テストモード優先）
 */
async function getCredentials(): Promise<{ credentials: Credentials; isTestMode: boolean } | null> {
    const testCredentials = await getTestModeCredentials();
    if (testCredentials) {
        return { credentials: testCredentials, isTestMode: true };
    }

    const normalCredentials = await getNormalModeCredentials();
    if (normalCredentials) {
        return { credentials: normalCredentials, isTestMode: false };
    }

    return null;
}

window.addEventListener("load", async () => {
    const result = await getCredentials();
    if (!result) {
        return;
    }

    const { credentials, isTestMode } = result;

    const errorMessage = document.querySelector(SELECTORS.SHIBBOLETH.ERROR_MESSAGE);
    if (errorMessage) {
        handleAuthError(isTestMode);
        return;
    }

    const formElements = getFormElements();
    if (!formElements) {
        console.error("必要な要素が見つかりません。");
        return;
    }

    fillLoginForm(formElements, credentials);

    if (isTestMode) {
        observeAuthError();
    }

    formElements.loginButton.click();
});

/**
 * 認証エラーを処理
 */
function handleAuthError(isTestMode: boolean): void {
    if (isTestMode) {
        chrome.runtime.sendMessage({
            type: "SHIBBOLETH_AUTH_ERROR",
            error: "UNAUTHORIZED",
        });
    }
}

/**
 * フォーム要素を取得
 */
function getFormElements() {
    const usernameInput = document.querySelector(SELECTORS.SHIBBOLETH.USERNAME) as HTMLInputElement | null;
    const passwordInput = document.querySelector(SELECTORS.SHIBBOLETH.PASSWORD) as HTMLInputElement | null;
    const loginButton = document.querySelector(SELECTORS.SHIBBOLETH.LOGIN_BUTTON) as HTMLButtonElement | null;

    if (!usernameInput || !passwordInput || !loginButton) {
        return null;
    }

    return { usernameInput, passwordInput, loginButton };
}

/**
 * ログインフォームに認証情報を入力
 */
function fillLoginForm(
    formElements: { usernameInput: HTMLInputElement; passwordInput: HTMLInputElement; loginButton: HTMLButtonElement },
    credentials: Credentials
): void {
    formElements.usernameInput.value = credentials.username;
    formElements.passwordInput.value = credentials.password;
}

/**
 * 認証エラーを監視（テストモード用）
 */
function observeAuthError(): void {
    const ERROR_TIMEOUT_MS = 10000;

    const observer = new MutationObserver(() => {
        const error = document.querySelector(SELECTORS.SHIBBOLETH.ERROR_MESSAGE);
        if (error) {
            chrome.runtime.sendMessage({
                type: "SHIBBOLETH_AUTH_ERROR",
                error: "UNAUTHORIZED",
            });
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    setTimeout(() => {
        observer.disconnect();
    }, ERROR_TIMEOUT_MS);
}
