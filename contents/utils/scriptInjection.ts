/**
 * スクリプトをページのDOMに注入する関数
 * @param filePath - 注入するスクリプトファイルのパス
 * @param tag - スクリプトを注入するHTML要素のタグ名
 */
export const injectScript = (filePath: string, tag: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const node = document.getElementsByTagName(tag)[0] || document.documentElement;
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        // chrome.runtime.getURLを使用して、拡張機能内のファイルへの完全なURLを取得する
        script.setAttribute("src", filePath);

        // 注入したスクリプトは実行後にDOMから削除する
        script.onload = () => {
            script.remove();
            resolve();
        };
        script.onerror = () => {
            console.error(`Failed to load script: ${filePath}`);
            script.remove();
            reject(new Error(`Failed to load script: ${filePath}`));
        };

        node.appendChild(script);
    });
};

/**
 * notify_caller.jsを注入して実行する
 */
export const executeNotifyCaller = async (): Promise<void> => {
    try {
        await injectScript(chrome.runtime.getURL("scripts/notify_caller.js"), "body");
    } catch (error) {
        console.error("Failed to execute notify caller:", error);
    }
};
