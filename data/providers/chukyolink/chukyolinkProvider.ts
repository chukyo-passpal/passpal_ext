/**
 * ChukyoLinkプロバイダー
 * Chrome拡張機能向けに実装
 */

import { ChukyoLink_URLS } from "../../../utils/urls";
import { httpClient } from "../../clients/httpClient";

export interface ChukyoLinkProvider {
    /**
     * ChukyoLinkの指定パスにGETリクエストを送り、内容を取得します。
     */
    get(path: string): Promise<string>;
}

export class IntegratedChukyoLinkProvider implements ChukyoLinkProvider {
    protected baseUrl = ChukyoLink_URLS.base;

    public async get(path: string): Promise<string> {
        const response = await httpClient(`${this.baseUrl}${path}`, {
            clientMode: "default",
            method: "GET",
        });
        return await response.text();
    }
}

const chukyoLinkProviderInstance = new IntegratedChukyoLinkProvider();
export default chukyoLinkProviderInstance;
