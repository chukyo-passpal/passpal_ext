/**
 * 共通の型定義
 * PassPal拡張機能全体で使用される基本的な型定義
 */

// ===== 基本的なユーティリティ型 =====

/** DOM要素のクエリ結果を表す型 */
export type QueryResult<T extends Element = Element> = T | null;

/** 非同期処理の結果を表す型 */
export type AsyncResult<T, E = Error> = Promise<{ success: true; data: T } | { success: false; error: E }>;

/** オプション設定を表す基本型 */
export interface BaseOptions {
  readonly enabled: boolean;
  readonly timeout?: number;
}

// ===== DOM操作関連の型 =====

/** DOM要素作成のオプション */
export interface ElementCreationOptions {
  readonly tag: keyof HTMLElementTagNameMap;
  readonly className?: string;
  readonly id?: string;
  readonly textContent?: string;
  readonly innerHTML?: string;
  readonly attributes?: Record<string, string>;
  readonly styles?: Partial<CSSStyleDeclaration>;
}

/** イベントリスナーの設定 */
export interface EventListenerConfig<K extends keyof HTMLElementEventMap = keyof HTMLElementEventMap> {
  readonly event: K;
  readonly handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void;
  readonly options?: boolean | AddEventListenerOptions;
}

/** カスタムHTML要素（拡張プロパティ付き） */
export interface ExtendedHTMLElement extends HTMLElement {
  highlightTimeout?: NodeJS.Timeout;
  [key: string]: any;
}

// ===== 認証関連の基本型 =====

/** 認証状態を表す型 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'pending' | 'error';

/** 認証結果の基本型 */
export interface AuthResult {
  readonly status: AuthStatus;
  readonly message?: string;
  readonly redirectUrl?: string;
}

/** 認証情報の基本インターフェース */
export interface AuthCredentials {
  readonly username: string;
  readonly password: string;
}

// ===== テーマ関連の型 =====

/** テーマの種類 */
export type Theme = 'light' | 'dark' | 'auto';

/** テーマ設定 */
export interface ThemeConfig {
  readonly theme: Theme;
  readonly autoDetect?: boolean;
  readonly followSystemTheme?: boolean;
}

// ===== ログ・デバッグ関連の型 =====

/** ログレベル */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/** ログエントリ */
export interface LogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: Date;
  readonly context?: string;
  readonly data?: any;
}

// ===== ネットワーク・リダイレクト関連の型 =====

/** リダイレクト設定 */
export interface RedirectConfig {
  readonly enabled: boolean;
  readonly delay?: number;
  readonly maxRetries?: number;
  readonly retryDelay?: number;
}

/** URL検証の結果 */
export interface UrlValidationResult {
  readonly isValid: boolean;
  readonly hostname?: string;
  readonly pathname?: string;
  readonly errors?: string[];
}

// ===== ユーティリティ関数の型 =====

/** sleep関数の型定義 */
export type SleepFunction = (ms: number) => Promise<void>;

/** DOM要素の安全な取得関数の型 */
export type SafeQuerySelector = <T extends Element = Element>(
  selector: string,
  context?: Document | Element
) => QueryResult<T>;

/** クリーンアップ関数の型 */
export type CleanupFunction = () => void;

// ===== エラー関連の型 =====

/** カスタムエラーの基本クラス */
export abstract class PassPalError extends Error {
  abstract readonly code: string;
  abstract readonly category: string;
  
  constructor(
    message: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** DOM操作エラー */
export class DOMError extends PassPalError {
  readonly code = 'DOM_ERROR';
  readonly category = 'DOM';
}

/** 認証エラー */
export class AuthError extends PassPalError {
  readonly code = 'AUTH_ERROR';
  readonly category = 'AUTHENTICATION';
}

/** ネットワークエラー */
export class NetworkError extends PassPalError {
  readonly code = 'NETWORK_ERROR';
  readonly category = 'NETWORK';
}

// ===== 設定管理関連の型 =====

/** 拡張機能の設定項目 */
export interface ExtensionConfig {
  readonly version: string;
  readonly debug: boolean;
  readonly features: {
    readonly attendance: BaseOptions;
    readonly darkMode: ThemeConfig;
    readonly autoLogin: BaseOptions & { credentials?: AuthCredentials };
    readonly videoControls: BaseOptions;
    readonly iconJump: BaseOptions;
    readonly autoPoll: BaseOptions;
  };
}

/** 設定の更新イベント */
export interface ConfigUpdateEvent {
  readonly key: keyof ExtensionConfig;
  readonly oldValue: any;
  readonly newValue: any;
  readonly timestamp: Date;
}