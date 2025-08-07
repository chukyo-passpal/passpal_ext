import { create } from "zustand";
import { getSettings, type ExtensionSettings } from "../../contents/utils/settings";
import type { LoginCredentials } from "../../contents/utils/settings";

export interface SettingsActions {
	// トグル
	toggleCampusLocation: () => void;
	toggleDarkMode: () => void;
	toggleVideoControls: () => void;
	toggleShibLogin: () => void;
	toggleAutoReauth: () => void;
	toggleAutoPoll: () => void;
	toggleAttendanceCaller: () => void;

	// セット
	setCampusLocation: (location: "nagoya" | "toyota") => void;
	setDarkModeEnabled: (enabled: boolean) => void;
	setVideoControlsEnabled: (enabled: boolean) => void;
	setShibLoginEnabled: (enabled: boolean) => void;
	setAutoReauthEnabled: (enabled: boolean) => void;
	setAutoPollEnabled: (enabled: boolean) => void;
	setAttendanceCallerEnabled: (enabled: boolean) => void;
	setLoginCredentials: (loginInfo: LoginCredentials) => void;
	setRecommendedSettings: () => void;

	// データ削除
	clearSettings: () => void;

	// 読みこみ
	loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<ExtensionSettings & SettingsActions>()((set) => ({
	campusLocation: "nagoya",

	// UI設定系
	darkModeEnabled: false,
	videoControlsEnabled: false,

	// 認証・ログイン系
	shibLoginEnabled: false,
	autoReauthEnabled: false,

	// 自動化系
	autoPollEnabled: false,

	attendanceCallerEnabled: false,

	loginCredentials: {},

	// トグル関数の実装
	toggleCampusLocation: () =>
		set((state) => ({
			campusLocation: state.campusLocation === "nagoya" ? "toyota" : "nagoya",
		})),

	toggleDarkMode: () => set((state) => ({ darkModeEnabled: !state.darkModeEnabled })),

	toggleVideoControls: () => set((state) => ({ videoControlsEnabled: !state.videoControlsEnabled })),

	toggleShibLogin: () => set((state) => ({ shibLoginEnabled: !state.shibLoginEnabled })),

	toggleAutoReauth: () => set((state) => ({ autoReauthEnabled: !state.autoReauthEnabled })),

	toggleAutoPoll: () => set((state) => ({ autoPollEnabled: !state.autoPollEnabled })),

	toggleAttendanceCaller: () => set((state) => ({ attendanceCallerEnabled: !state.attendanceCallerEnabled })),

	// セット関数の実装
	setCampusLocation: (location) => set({ campusLocation: location }),
	setDarkModeEnabled: (enabled) => set({ darkModeEnabled: enabled }),
	setVideoControlsEnabled: (enabled) => set({ videoControlsEnabled: enabled }),
	setShibLoginEnabled: (enabled) => set({ shibLoginEnabled: enabled }),
	setAutoReauthEnabled: (enabled) => set({ autoReauthEnabled: enabled }),
	setAutoPollEnabled: (enabled) => set({ autoPollEnabled: enabled }),
	setAttendanceCallerEnabled: (enabled) => set({ attendanceCallerEnabled: enabled }),
	setLoginCredentials: (loginCredentials) => {
		set({ loginCredentials });
	},
	setRecommendedSettings: () => {
		set({
			autoReauthEnabled: true,
			videoControlsEnabled: true,
			attendanceCallerEnabled: true,
			autoPollEnabled: true,
			shibLoginEnabled: true,
		});
	},

	clearSettings: () =>
		set({
			campusLocation: "nagoya",
			darkModeEnabled: false,
			videoControlsEnabled: false,
			shibLoginEnabled: false,
			autoReauthEnabled: false,
			autoPollEnabled: false,
			attendanceCallerEnabled: false,
			loginCredentials: {},
		}),

	loadSettings: async () => set(await getSettings()),
}));

//変更があるたびに保存
useSettingsStore.subscribe(async (state) => {
	try {
		await chrome.storage.sync.set(state);
	} catch {
		console.log("Save error:", chrome.runtime.lastError);
	}
});

export default useSettingsStore;
