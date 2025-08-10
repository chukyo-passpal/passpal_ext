import useSettingsStore from "../../action/store/SettingsStore";

export interface LoginCredentials {
	studentId?: string;
	firebaseToken?: string;
	password?: string;
}

export interface ExtensionSettings {
	campusLocation: "nagoya" | "toyota";
	darkModeEnabled: boolean;
	autoReauthEnabled: boolean;
	videoControlsEnabled: boolean;
	attendanceCallerEnabled: boolean;
	autoPollEnabled: boolean;
	shibLoginEnabled: boolean;
}

export const defaultSettings: ExtensionSettings = {
	campusLocation: "nagoya",
	darkModeEnabled: false,
	autoReauthEnabled: false,
	videoControlsEnabled: false,
	attendanceCallerEnabled: false,
	autoPollEnabled: false,
	shibLoginEnabled: false,
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

export async function setAuthenticationData(loginCredentials: LoginCredentials): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.sync.set({ loginCredentials }, () => {
			resolve();
		});
	});
}

export async function setRecommendedSettings(): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.sync.set(
			{
				autoReauthEnabled: true,
				videControlsEnabled: true,
				attendanceCallerEnabled: true,
				autoPollEnabled: true,
				shibLoginEnabled: true,
			},
			() => {
				resolve();
			}
		);
	});
}

export async function clearAuthenticationData(): Promise<void> {
	return new Promise((resolve) => {
		chrome.storage.sync.remove(["loginCredentials"], () => {
			resolve();
		});
	});
}

export async function isUserAuthenticated(): Promise<boolean> {
	return new Promise((resolve) => {
		chrome.storage.sync.get(["loginCredentials"], (result) => {
			const credentials = result.loginCredentials;
			if (!credentials) {
				resolve(false);
				return;
			}
			resolve(credentials.studentId && credentials.password && credentials.firebaseToken ? true : false);
		});
	});
}
