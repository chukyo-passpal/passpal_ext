/**
 * Manabo学習支援システム関連の型定義
 * 中京大学のManabo学習プラットフォーム専用の型定義
 */

import { type AuthResult, type AuthCredentials, type BaseOptions, type QueryResult } from "./common";

// ===== Manaboドメイン関連の型 =====

/** Manaboシステムのドメイン */
export const MANABO_DOMAIN = "manabo.cnc.chukyo-u.ac.jp" as const;

/** Manaboのページタイプ */
export type ManaboPageType = "dashboard" | "course" | "assignment" | "video" | "attendance" | "poll" | "login" | "error" | "unknown";

// ===== 認証・ログイン関連の型 =====

/** Manaboの認証情報 */
export interface ManaboCredentials extends AuthCredentials {
    readonly studentId?: string;
    readonly rememberMe?: boolean;
}

/** Manaboの認証結果 */
export interface ManaboAuthResult extends AuthResult {
    readonly sessionId?: string;
    readonly userId?: string;
    readonly userType?: "student" | "teacher" | "admin";
}

/** リダイレクト処理の設定 */
export interface ManaboRedirectConfig {
    readonly enabled: boolean;
    readonly autoRedirect: boolean;
    readonly targetUrl?: string;
    readonly delay: number;
    readonly maxAttempts: number;
}

// ===== 出席機能関連の型 =====

/** 出席ボタンの状態 */
export type AttendanceButtonState = "ready" | "calling" | "completed" | "error" | "disabled";

/** 出席呼び出し結果 */
export interface AttendanceCallResult {
    readonly success: boolean;
    readonly buttonState: AttendanceButtonState;
    readonly message?: string;
    readonly timestamp: Date;
}

/** 出席ボタンの設定 */
export interface AttendanceButtonConfig extends BaseOptions {
    readonly buttonText: string;
    readonly successText: string;
    readonly errorText: string;
    readonly position: "top" | "bottom" | "fixed";
    readonly autoCall: boolean;
    readonly callDelay: number;
}

/** 出席ボタンのHTML要素 */
export interface AttendanceButtonElements {
    readonly container: QueryResult<HTMLDivElement>;
    readonly button: QueryResult<HTMLButtonElement>;
    readonly text: QueryResult<HTMLSpanElement>;
    readonly icon: QueryResult<HTMLElement>;
}

// ===== アンケート・ポーリング関連の型 =====

/** アンケートの状態 */
export type PollStatus = "available" | "completed" | "expired" | "not_found";

/** アンケート情報 */
export interface PollInfo {
    readonly id: string;
    readonly title: string;
    readonly status: PollStatus;
    readonly deadline?: Date;
    readonly isRequired: boolean;
}

/** 自動アンケート設定 */
export interface AutoPollConfig extends BaseOptions {
    readonly checkInterval: number;
    readonly autoSubmit: boolean;
    readonly defaultAnswers?: Record<string, string>;
    readonly skipOptional: boolean;
}

/** アンケート処理結果 */
export interface PollProcessResult {
    readonly pollId: string;
    readonly action: "detected" | "submitted" | "skipped" | "failed";
    readonly message?: string;
    readonly timestamp: Date;
}

// ===== ビデオ関連の型 =====

/** ビデオの状態 */
export type VideoState = "playing" | "paused" | "ended" | "loading" | "error";

/** ビデオ制御の設定 */
export interface VideoControlConfig extends BaseOptions {
    readonly showControls: boolean;
    readonly enableKeyboard: boolean;
    readonly enablePiP: boolean;
    readonly speedControl: boolean;
    readonly volumeControl: boolean;
    readonly fullscreenControl: boolean;
}

/** ビデオ要素の情報 */
export interface VideoElementInfo {
    readonly element: QueryResult<HTMLVideoElement>;
    readonly state: VideoState;
    readonly currentTime: number;
    readonly duration: number;
    readonly volume: number;
    readonly playbackRate: number;
    readonly isPiP: boolean;
    readonly isFullscreen: boolean;
}

/** ビデオコントロールボタンの設定 */
export interface VideoControlButton {
    readonly key: string;
    readonly label: string;
    readonly icon: string;
    readonly action: () => void;
    readonly enabled: boolean;
    readonly visible: boolean;
}

// ===== アイコンジャンプ関連の型 =====

/** アイコンジャンプの設定 */
export interface IconJumpConfig extends BaseOptions {
    readonly targetSelector: string;
    readonly jumpType: "smooth" | "instant";
    readonly offset: number;
    readonly highlightDuration: number;
}

/** ジャンプ対象の要素情報 */
export interface JumpTargetInfo {
    readonly element: QueryResult<HTMLElement>;
    readonly isVisible: boolean;
    readonly position: {
        readonly top: number;
        readonly left: number;
    };
    readonly size: {
        readonly width: number;
        readonly height: number;
    };
}

// ===== 通知システム関連の型 =====

/** 通知の種類 */
export type NotificationType = "info" | "success" | "warning" | "error";

/** Manabo通知の設定 */
export interface ManaboNotificationConfig {
    readonly enabled: boolean;
    readonly position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    readonly duration: number;
    readonly showIcon: boolean;
    readonly sound: boolean;
}

/** 通知メッセージ */
export interface NotificationMessage {
    readonly type: NotificationType;
    readonly title: string;
    readonly message: string;
    readonly duration?: number;
    readonly actions?: Array<{
        readonly label: string;
        readonly action: () => void;
    }>;
}

/** 通知システムのインターフェース */
export interface ManaboNotificationSystem {
    init(): void;
    show(message: NotificationMessage): void;
    hide(id?: string): void;
    clear(): void;
    isEnabled(): boolean;
}

// ===== DOM要素のセレクター定数 =====

/** Manaboページの主要セレクター */
export const MANABO_SELECTORS = {
    // 共通要素
    BODY: "body",
    MAIN_CONTENT: "#main-content",
    NAVIGATION: ".navigation",

    // 認証・ログイン
    LOGIN_FORM: "#login-form",
    USERNAME_INPUT: 'input[name="username"]',
    PASSWORD_INPUT: 'input[name="password"]',
    LOGIN_BUTTON: 'button[type="submit"]',

    // 出席関連
    ATTENDANCE_SECTION: ".attendance-section",
    ATTENDANCE_BUTTON: ".attendance-btn",
    ATTENDANCE_STATUS: ".attendance-status",

    // ビデオ関連
    VIDEO_CONTAINER: ".video-container",
    VIDEO_ELEMENT: "video",
    VIDEO_CONTROLS: ".video-controls",

    // アンケート関連
    POLL_CONTAINER: ".poll-container",
    POLL_FORM: ".poll-form",
    POLL_SUBMIT: ".poll-submit",

    // アイコン・ナビゲーション
    ICON_MENU: ".icon-menu",
    JUMP_TARGET: ".jump-target",

    // 通知
    NOTIFICATION_AREA: ".notification-area",
    NOTIFICATION_ITEM: ".notification-item",
} as const;

// ===== エラー関連の型 =====

/** Manabo固有のエラー */
export class ManaboError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly pageType?: ManaboPageType,
        public readonly context?: Record<string, any>
    ) {
        super(message);
        this.name = "ManaboError";
    }
}

/** 認証エラー */
export class ManaboAuthError extends ManaboError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, "MANABO_AUTH_ERROR", "login", context);
        this.name = "ManaboAuthError";
    }
}

/** 出席エラー */
export class AttendanceError extends ManaboError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, "ATTENDANCE_ERROR", "attendance", context);
        this.name = "AttendanceError";
    }
}

/** ビデオエラー */
export class VideoError extends ManaboError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, "VIDEO_ERROR", "video", context);
        this.name = "VideoError";
    }
}

// ===== ページ検出とマッチング =====

/** ページマッチングの結果 */
export interface PageMatchResult {
    readonly matched: boolean;
    readonly pageType: ManaboPageType;
    readonly confidence: number;
    readonly features: string[];
}

/** ページ検出の設定 */
export interface PageDetectionConfig {
    readonly enabledFeatures: string[];
    readonly confidenceThreshold: number;
    readonly recheckInterval: number;
}
