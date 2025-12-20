/**
 * ネットワーク関連のエラー定義
 */

export class ChukyoMaintenanceError extends Error {
    constructor(message = "ポータルサイトがメンテナンス中です。") {
        super(message);
        this.name = "ChukyoMaintenanceError";
    }
}

export class PalAPIMaintenanceError extends Error {
    constructor(message = "PassPalがメンテナンス中です。") {
        super(message);
        this.name = "PalAPIMaintenanceError";
    }
}

export class TimeoutError extends Error {
    constructor(message = "リクエストがタイムアウトしました。") {
        super(message);
        this.name = "TimeoutError";
    }
}

export class NetworkError extends Error {
    constructor(message = "ネットワークエラーが発生しました") {
        super(message);
        this.name = "NetworkError";
    }
}
