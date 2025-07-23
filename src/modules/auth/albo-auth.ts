/**
 * Albo認証処理統合モジュール
 * 
 * 元のファイル:
 * - albo_relogin.ts: ログアウトメッセージ検出後のリダイレクト
 * - albo_error_login.ts: Internal Server Errorページからのリダイレクト
 */

import { SELECTORS, MESSAGES } from '../../utils/constants';
import { RedirectManager } from '../../utils/redirect';
import type { BaseOptions, QueryResult } from '../../types/common';

export interface AlboAuthOptions extends BaseOptions {
  readonly checkLogoutMessage?: boolean;
  readonly checkErrorPage?: boolean;
}

/**
 * Albo認証エラー状態の種類
 */
export enum AlboErrorType {
  LOGOUT = 'logout',
  SERVER_ERROR = 'server_error',
  UNKNOWN = 'unknown'
}

/**
 * Albo認証リダイレクト処理を管理するクラス
 */
export class AlboAuthManager {
  private static readonly DEFAULT_OPTIONS: AlboAuthOptions = {
    enabled: true,
    checkLogoutMessage: true,
    checkErrorPage: true,
  };

  /**
   * ログアウトメッセージの検出
   * (旧 albo_relogin.ts の機能)
   */
  static detectLogoutMessage(): boolean {
    const messageElement: QueryResult<HTMLElement> = document.querySelector(
      SELECTORS.ALBO.LOGOUT_MESSAGE
    );
    
    return messageElement?.textContent?.includes(MESSAGES.ALBO.LOGOUT_TEXT) ?? false;
  }

  /**
   * Internal Server Errorページの検出
   * (旧 albo_error_login.ts の機能)
   */
  static detectServerError(): boolean {
    const errorElement: QueryResult<HTMLHeadingElement> = document.querySelector(
      SELECTORS.ALBO.ERROR_TITLE
    );
    
    return errorElement?.textContent?.includes(MESSAGES.ALBO.ERROR_TEXT) ?? false;
  }

  /**
   * 現在のエラー状態を検出
   */
  static detectErrorType(): AlboErrorType {
    if (this.detectLogoutMessage()) {
      return AlboErrorType.LOGOUT;
    }
    
    if (this.detectServerError()) {
      return AlboErrorType.SERVER_ERROR;
    }
    
    return AlboErrorType.UNKNOWN;
  }

  /**
   * ログアウト後のリダイレクト処理
   * (旧 albo_relogin.ts 相当)
   */
  static handleLogoutRedirect(): void {
    if (this.detectLogoutMessage()) {
      RedirectManager.redirectToAlboLogin();
    }
  }

  /**
   * エラーページからのリダイレクト処理
   * (旧 albo_error_login.ts 相当)
   */
  static handleErrorRedirect(): void {
    if (this.detectServerError()) {
      RedirectManager.redirectToAlboLogin();
    }
  }

  /**
   * 統合初期化関数 - 両方の状態をチェックして適切にリダイレクト
   */
  static initialize(options: Partial<AlboAuthOptions> = {}): void {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!config.enabled) {
      return;
    }

    // ログアウトメッセージのチェック
    if (config.checkLogoutMessage && this.detectLogoutMessage()) {
      RedirectManager.redirectToAlboLogin();
      return;
    }

    // エラーページのチェック
    if (config.checkErrorPage && this.detectServerError()) {
      RedirectManager.redirectToAlboLogin();
      return;
    }
  }

  /**
   * エラー状態に応じた処理を実行
   */
  static handleAuthError(errorType?: AlboErrorType): void {
    const detectedError = errorType || this.detectErrorType();
    
    switch (detectedError) {
      case AlboErrorType.LOGOUT:
        this.handleLogoutRedirect();
        break;
        
      case AlboErrorType.SERVER_ERROR:
        this.handleErrorRedirect();
        break;
        
      case AlboErrorType.UNKNOWN:
        // 何もしない（デバッグログ等は必要に応じて追加）
        break;
    }
  }
}

// 個別の機能を直接エクスポート（後方互換性のため）

/**
 * 旧 albo_relogin.ts 相当の処理
 */
export function alboRelogin(): void {
  AlboAuthManager.handleLogoutRedirect();
}

/**
 * 旧 albo_error_login.ts 相当の処理
 */
export function alboErrorLogin(): void {
  AlboAuthManager.handleErrorRedirect();
}

// デフォルトエクスポート（自動実行）
export default function initializeAlboAuth(): void {
  AlboAuthManager.initialize();
}

// 自動実行
initializeAlboAuth();