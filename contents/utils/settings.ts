export interface ExtensionSettings {
    darkModeEnabled: boolean;
    autoReauthEnabled: boolean;
    videControlsEnabled: boolean;
    attendanceCallerEnabled: boolean;
    autoPollEnabled: boolean;
    shibLoginEnabled: boolean;
}

export const defaultSettings: ExtensionSettings = {
    darkModeEnabled: false,
    autoReauthEnabled: true,
    videControlsEnabled: true,
    attendanceCallerEnabled: true,
    autoPollEnabled: true,
    shibLoginEnabled: true,
};

export async function getSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(defaultSettings, (result) => {
            resolve(result as ExtensionSettings);
        });
    });
}

export async function getSetting<K extends keyof ExtensionSettings>(key: K): Promise<ExtensionSettings[K]> {
    const settings = await getSettings();
    return settings[key];
}
