/**
 * Chrome拡張機能用HTTPクライアント
 */

import { ChukyoMaintenanceError, NetworkError, PalAPIMaintenanceError, TimeoutError } from "../errors/NetworkError";

const DEFAULT_TIMEOUT_MS = 10000;

type HttpClientMode = "default" | "portal" | "palapi";

type HttpClientOptions = RequestInit & {
    timeoutMs?: number;
    clientMode?: HttpClientMode;
};

/**
 * User-Agent用の文字列を組み立てます。
 */
const buildUserAgent = (): string => {
    const manifest = chrome.runtime.getManifest();
    const appName = manifest.name ?? "PassPal";
    const appVersion = manifest.version ?? "unknown";

    return `${appName}/${appVersion} (Chrome Extension)`;
};

const userAgent = buildUserAgent();

/**
 * エラーがAbortErrorであるかを判定するユーティリティ関数
 */
const isAbortError = (error: unknown): boolean => {
    if (!error) {
        return false;
    }

    if (error instanceof Error) {
        return error.name === "AbortError";
    }

    return false;
};

/**
 * 共通のHTTPクライアント
 */
export const httpClient = async (input: string | URL, options: HttpClientOptions = {}): Promise<Response> => {
    const {
        timeoutMs: timeoutOverride = DEFAULT_TIMEOUT_MS,
        clientMode,
        mode,
        headers,
        signal,
        ...requestInit
    } = options;

    const timeoutMs = timeoutOverride ?? DEFAULT_TIMEOUT_MS;
    const httpClientMode: HttpClientMode = clientMode ?? "default";

    const controller = new AbortController();
    let timedOut = false;

    const timeoutId = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeoutMs);

    /**
     * 親シグナルの中断通知をリレーするためのコールバック
     */
    const abortCallback = () => controller.abort();
    if (signal) {
        if (signal.aborted) {
            controller.abort();
        } else {
            signal.addEventListener("abort", abortCallback);
        }
    }

    const finalHeaders = new Headers(headers);
    finalHeaders.set("User-Agent", userAgent);

    try {
        const url = typeof input === "string" ? input : input.toString();
        const { body, ...restInit } = requestInit as typeof requestInit & {
            body?: BodyInit | null;
        };

        const response = await fetch(url, {
            ...restInit,
            ...(body != null ? { body } : {}),
            headers: finalHeaders,
            signal: controller.signal,
            mode,
        });

        if (!response.ok) {
            if (httpClientMode === "portal" && response.status === 503) {
                throw new ChukyoMaintenanceError();
            }

            if (httpClientMode === "palapi" && response.status === 503) {
                throw new PalAPIMaintenanceError();
            }

            console.error(`HTTP error: ${response.status} ${response.statusText} URL: ${url}`);

            throw new NetworkError(`HTTP error: ${response.status} ${response.statusText}`);
        }

        return response;
    } catch (error) {
        if (
            error instanceof ChukyoMaintenanceError ||
            error instanceof NetworkError ||
            error instanceof TimeoutError ||
            error instanceof PalAPIMaintenanceError
        ) {
            throw error;
        }

        if (isAbortError(error) && timedOut) {
            throw new TimeoutError();
        }

        throw new NetworkError();
    } finally {
        clearTimeout(timeoutId);
        if (signal) {
            signal.removeEventListener("abort", abortCallback);
        }
    }
};

export type { HttpClientMode, HttpClientOptions };
