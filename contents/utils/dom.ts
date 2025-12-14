/**
 * 指定したセレクタの要素が出現するまで待つPromise関数
 * @param {string} selector - 例: '#input-password'
 * @param {number} timeoutMs - タイムアウト（ミリ秒）, 例: 5000
 * @param {ParentNode} [parent=document] - 検索対象の親ノード
 * @returns {Promise<Element|null>} - 見つかればそのElement, 見つからなければnull
 */
export async function waitForElement(
    selector: string,
    timeoutMs: number = 5000,
    parent: ParentNode = document
): Promise<Element | null> {
    return new Promise((resolve) => {
        // 既に存在すれば即返す
        const el = parent.querySelector(selector);
        if (el) return resolve(el);

        // MutationObserverで監視
        const observer = new MutationObserver(() => {
            const el = parent.querySelector(selector);
            if (el) {
                observer.disconnect();
                clearTimeout(timer);
                resolve(el);
            }
        });

        observer.observe(parent instanceof Document ? parent.body : parent, {
            childList: true,
            subtree: true,
        });

        // タイムアウト処理
        const timer = setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeoutMs);
    });
}
