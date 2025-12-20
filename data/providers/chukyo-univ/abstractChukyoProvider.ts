/**
 * 中京大学サービス用抽象プロバイダー
 * Chrome拡張機能向けに実装
 * Cookie管理はChromeに委任し、認証状態のみを管理
 */

import { chromeShibbolethAuth } from "../../clients/chromeAuth";

type CUService = "manabo" | "albo" | "cubics";

export interface ChukyoUserAuthData {
    studentId: string;
    cuIdPass: string;
}

export interface AbstractChukyoProvider {
    /**
     * 認証状態をクリアします
     */
    clearAuthState(): void;

    /**
     * ユーザー認証情報を設定します
     */
    setUser(user: ChukyoUserAuthData | null): void;
}

export abstract class IntegratedAbstractChukyoProvider implements AbstractChukyoProvider {
    protected abstract baseUrl: string;
    protected abstract authEnterPath: string;
    protected abstract authGoalPath: string;
    protected abstract serviceName: CUService;

    // 認証の有効期限（25分）
    protected credentialsRottenTime: number = 25 * 60 * 1000;

    protected user: ChukyoUserAuthData | null = null;

    // 最後に認証した時刻
    protected lastAuthenticatedAt: Date = new Date(0);

    public clearAuthState() {
        this.lastAuthenticatedAt = new Date(0);
    }

    public setUser(user: ChukyoUserAuthData | null) {
        this.user = user;
    }

    /**
     * 認証が有効期限内かどうかを確認
     */
    protected isAuthValid(): boolean {
        return this.lastAuthenticatedAt.getTime() + this.credentialsRottenTime > Date.now();
    }

    /**
     * ユーザー情報をもとにShibboleth認証を行います
     * Cookieの管理はChromeが自動で行います
     */
    protected async authentication(user: ChukyoUserAuthData): Promise<void> {
        const { studentId, cuIdPass } = user;

        // SSOログイン
        await chromeShibbolethAuth({
            enterUrl: `${this.baseUrl}${this.authEnterPath}`,
            goalUrl: `${this.baseUrl}${this.authGoalPath}`,
            username: studentId,
            password: cuIdPass,
        });

        // 認証成功時刻を記録
        this.lastAuthenticatedAt = new Date();
    }

    /**
     * 認証が必要な場合に認証を実行します
     */
    protected async ensureAuthenticated(): Promise<void> {
        if (!this.user) {
            throw new Error("ユーザー情報が設定されていません");
        }

        if (!this.isAuthValid()) {
            await this.authentication(this.user);
        }
    }
}
