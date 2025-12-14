export const chromeStorage = {
    getItem: async (name: string) => {
        const result = await chrome.storage.sync.get(name);
        return result[name] || null;
    },
    setItem: async (name: string, value: string) => {
        await chrome.storage.sync.set({ [name]: value });
    },
    removeItem: async (name: string) => {
        await chrome.storage.sync.remove(name);
    },
};
