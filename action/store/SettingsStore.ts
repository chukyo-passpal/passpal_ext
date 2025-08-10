import { create } from "zustand";
import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware";
import { chromeStorage } from "./chromeStorage";

export interface SettingsState {
	campusLocation: "nagoya" | "toyota";
	darkModeEnabled: boolean;
	autoReauthEnabled: boolean;
	videoControlsEnabled: boolean;
	attendanceCallerEnabled: boolean;
	autoPollEnabled: boolean;
	shibLoginEnabled: boolean;
}

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
	setRecommendedSettings: () => void;

	// データ削除
	clearSettings: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
	persist(
		subscribeWithSelector((set) => ({
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
				}),
		})),
		{ name: "settingsStore", storage: createJSONStorage(() => chromeStorage) }
	)
);

useSettingsStore.subscribe(
	(state) => state.darkModeEnabled,
	(darkModeEnabled) => {
		console.log("darkModeEnabled");
		if (darkModeEnabled) {
			document.documentElement.classList.add("dark-mode");
		} else {
			document.documentElement.classList.remove("dark-mode");
		}
	}
);

export default useSettingsStore;
