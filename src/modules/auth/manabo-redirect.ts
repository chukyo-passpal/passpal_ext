/**
 * Manabo認証リダイレクト処理
 * 
 * 元のファイル:
 * - manabo_relogin.ts: ページロード完了後の自動リダイレクト
 * - manabo_blue_jump.ts: パスワード入力欄検出による条件付きリダイレクト
 */

import { SELECTORS } from '../../utils/constants';
import { RedirectManager } from '../../utils/redirect';
import type { BaseOptions, SleepFunction } from '../../types/common';

export interface ManaboRedirectOptions extends BaseOptions {
  readonly checkPasswordInput?: boolean;
  readonly delay?: number;
}

/**
 * Manaboリダイレクト処理を管理するクラス
 */
export class ManaboRedirectManager {
  private static readonly DEFAULT_OPTIONS: ManaboRedirectOptions = {
    enabled: true,
    checkPasswordInput: true,
    delay: 1000,
  };

  private static sleep: SleepFunction = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));

  /**
   * ページロード完了後のリダイレクト処理
   * (旧 manabo_relogin.ts の機能)
   */
  static initializeLoadRedirect(): void {
    window.addEventListener('load', () => {
      RedirectManager.redirectToManaboAuth();
    });
  }

  /**
   * パスワード入力欄検出によるリダイレクト処理
   * (旧 manabo_blue_jump.ts の機能)
   */
  static async initializeConditionalRedirect(
    options: Partial<ManaboRedirectOptions> = {}
  ): Promise<void> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!config.enabled) {
      return;
    }

    // 指定されたdelayで待機
    if (config.delay && config.delay > 0) {
      await this.sleep(config.delay);
    }

    // パスワード入力欄の存在確認
    if (config.checkPasswordInput) {
      const passwordInput = document.querySelector(SELECTORS.MANABO.PASSWORD_INPUT);
      
      if (passwordInput) {
        RedirectManager.redirectToManaboAuth();
      }
    }
  }

  /**
   * 統合初期化関数 - 両方の機能を組み合わせて使用
   */
  static initialize(options: Partial<ManaboRedirectOptions> = {}): void {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!config.enabled) {
      return;
    }

    // パスワード入力欄のチェックを優先
    if (config.checkPasswordInput) {
      this.initializeConditionalRedirect(config);
    } else {
      // チェックが無効な場合はロード完了時リダイレクト
      this.initializeLoadRedirect();
    }
  }
}

// 個別の機能を直接エクスポート（後方互換性のため）

/**
 * 旧 manabo_relogin.ts 相当の処理
 */
export function manaboRelogin(): void {
  ManaboRedirectManager.initializeLoadRedirect();
}

/**
 * 旧 manabo_blue_jump.ts 相当の処理
 */
export async function manaboBlueJump(): Promise<void> {
  await ManaboRedirectManager.initializeConditionalRedirect();
}

// デフォルトエクスポート（自動実行）
export default function initializeManaboRedirect(): void {
  ManaboRedirectManager.initialize();
}

// 自動実行
initializeManaboRedirect();