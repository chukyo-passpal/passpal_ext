import type { FirebaseError } from "firebase/app";

/**
 * Firebase Authのエラーコードを日本語メッセージに変換する
 * @param error キャッチしたエラーオブジェクト
 * @returns ユーザー向けの日本語エラーメッセージ
 */
export const getFirebaseErrorMessage = (error: FirebaseError): string => {
    // エラーオブジェクトでない、またはcodeプロパティがない場合は汎用エラーを返す
    if (!error || typeof error !== "object") {
        return "予期しないエラーが発生しました。もう一度お試しください。";
    }

    console.log(error.code);
    switch (error.code) {
        // --- iframe関連 ---
        case "auth/iframe-load-error":
            return "認証サーバーへの接続がタイムアウトしました。通信環境を確認してください。";
        case "auth/iframe-load-timeout":
            return "認証システムが正しく読み込めませんでした。拡張機能を再起動してください。";

        // --- ユーザー操作・ポップアップ関連（最頻出） ---
        case "auth/popup-closed-by-user":
            return "認証ポップアップが閉じられました。ログインするにはウィンドウを閉じずに操作を完了してください。";
        case "auth/cancelled-popup-request":
            return "複数のポップアップが開かれています。一度閉じてからやり直してください。";
        case "auth/popup-blocked":
            return "ポップアップがブロックされました。ブラウザ設定でポップアップを許可してください。";

        // --- ネットワーク・サーバー関連 ---
        case "auth/network-request-failed":
            return "ネットワークエラーが発生しました。インターネット接続を確認してください。";
        case "auth/too-many-requests":
            return "アクセスが集中しています。しばらく時間を置いてから再度お試しください。";
        case "auth/internal-error":
            return "認証サーバー内部でエラーが発生しました。しばらく待ってから再試行してください。";

        // --- アカウント・認証情報関連 ---
        case "auth/user-disabled":
            return "このアカウントは現在無効化されています。管理者にお問い合わせください。";
        case "auth/user-not-found":
            return "アカウントが見つかりませんでした。";
        case "auth/wrong-password":
            return "パスワードが間違っています。";
        case "auth/invalid-email":
            return "メールアドレスの形式が正しくありません。";
        case "auth/credential-already-in-use":
            return "このアカウントは既に使用されています。";
        case "auth/account-exists-with-different-credential":
            return "同じメールアドレスですでに別のアカウントが存在します。その方法でログインしてください。";
        case "auth/operation-not-allowed":
            return "このログイン方法は現在許可されていません。運営にお問い合わせください。";
        case "auth/invalid-api-key":
            return "APIキーが無効です。アプリのバージョンが古い可能性があります。";
        case "auth/app-not-authorized":
            return "このドメインからの認証は許可されていません。";

        // --- デフォルト ---
        default:
            // 未定義のエラーコードの場合は、元のメッセージ（英語）を含めるか、汎用メッセージを返す
            console.warn(`Unknown Firebase Error Code: ${error.code}`);
            return "ログイン中にエラーが発生しました。もう一度お試しください。";
    }
};
