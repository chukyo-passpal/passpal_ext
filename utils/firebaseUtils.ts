import type { FirebaseError } from "firebase/app";

import { ERROR_MESSAGES } from "./errorMessages";

/**
 * Firebase Authのエラーコードを日本語メッセージに変換する
 * @param error キャッチしたエラーオブジェクト
 * @returns ユーザー向けの日本語エラーメッセージ
 */
export const getFirebaseErrorMessage = (error: FirebaseError): string => {
    // エラーオブジェクトでない、またはcodeプロパティがない場合は汎用エラーを返す
    if (!error || typeof error !== "object") {
        return ERROR_MESSAGES.AUTH.FIREBASE.UNEXPECTED;
    }

    console.log(error.code);

    const { FIREBASE } = ERROR_MESSAGES.AUTH;

    switch (error.code) {
        // --- iframe関連 ---
        case "auth/iframe-load-error":
            return FIREBASE.IFRAME_LOAD_ERROR;
        case "auth/iframe-load-timeout":
            return FIREBASE.IFRAME_LOAD_TIMEOUT;

        // --- ユーザー操作・ポップアップ関連（最頻出） ---
        case "auth/popup-closed-by-user":
            return FIREBASE.POPUP_CLOSED;
        case "auth/cancelled-popup-request":
            return FIREBASE.CANCELLED_POPUP;
        case "auth/popup-blocked":
            return FIREBASE.POPUP_BLOCKED;

        // --- ネットワーク・サーバー関連 ---
        case "auth/network-request-failed":
            return FIREBASE.NETWORK_ERROR;
        case "auth/too-many-requests":
            return FIREBASE.TOO_MANY_REQUESTS;
        case "auth/internal-error":
            return FIREBASE.INTERNAL_ERROR;

        // --- アカウント・認証情報関連 ---
        case "auth/user-disabled":
            return FIREBASE.USER_DISABLED;
        case "auth/user-not-found":
            return FIREBASE.USER_NOT_FOUND;
        case "auth/wrong-password":
            return FIREBASE.WRONG_PASSWORD;
        case "auth/invalid-email":
            return FIREBASE.INVALID_EMAIL;
        case "auth/credential-already-in-use":
            return FIREBASE.CREDENTIAL_IN_USE;
        case "auth/account-exists-with-different-credential":
            return FIREBASE.ACCOUNT_EXISTS;
        case "auth/operation-not-allowed":
            return FIREBASE.OPERATION_NOT_ALLOWED;
        case "auth/invalid-api-key":
            return FIREBASE.INVALID_API_KEY;
        case "auth/app-not-authorized":
            return FIREBASE.APP_NOT_AUTHORIZED;

        // --- デフォルト ---
        default:
            // 未定義のエラーコードの場合は、元のメッセージ（英語）を含めるか、汎用メッセージを返す
            console.warn(`Unknown Firebase Error Code: ${error.code}`);
            return FIREBASE.UNKNOWN;
    }
};
