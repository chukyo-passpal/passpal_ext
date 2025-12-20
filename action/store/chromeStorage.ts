/**
 * Chrome拡張機能用のストレージアダプター
 * chrome.storage.localを使用（容量制限: 10MB）
 * chrome.storage.syncは容量制限が厳しい（項目ごと8KB、合計102KB）ため使用しない
 */
export const chromeStorage = {
    getItem: async (name: string) => {
        const result = await chrome.storage.local.get(name);
        return result[name] || null;
    },
    setItem: async (name: string, value: string) => {
        await chrome.storage.local.set({ [name]: value });
    },
    removeItem: async (name: string) => {
        await chrome.storage.local.remove(name);
    },
};
