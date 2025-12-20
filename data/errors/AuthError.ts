/**
 * 認証関連のエラー定義
 */

export class UnauthorizedError extends Error {
    constructor(message = "ログインに失敗しました。IDまたはパスワードが正しくありません。") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ExpiredSessionError extends Error {
    constructor(message = "セッションの有効期限が切れました。再度ログインしてください。") {
        super(message);
        this.name = "ExpiredSessionError";
    }
}

export class OverlapsError extends Error {
    constructor(message = "他の認証が行われています。") {
        super(message);
        this.name = "OverlapsError";
    }
}

export class AuthProcessError extends Error {
    constructor(message = "認証処理中にエラーが発生しました。") {
        super(message);
        this.name = "AuthProcessError";
    }
}
