/**
 * 時間割状態管理
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { sendMessage } from "../../utils/messaging";
import {
    normalizeTimetable,
    type Class,
    type DayOfWeek,
    type NormalizedTimetable,
    type Period,
} from "../../utils/timetable";
import { chromeStorage } from "./chromeStorage";

export interface TimetableState {
    /** 正規化された時間割データ */
    normalized: NormalizedTimetable | null;
    /** ローディング状態 */
    loading: boolean;
    /** 最終取得日時 */
    lastFetchedAt: Date | null;
}

export interface TimetableActions {
    /** 時間割データを再取得 */
    refetch: () => Promise<void>;
    /** 特定の曜日・時限の授業を取得 */
    getClass: (day: DayOfWeek, period: Period) => Class | null;
    /** 特定の曜日の全授業を取得 */
    getClassesForDay: (day: DayOfWeek) => (Class | null)[];
    /** 今日の授業を取得 */
    getTodayClasses: () => (Class | null)[];
    /** 全ての授業を配列で取得 */
    getAllClasses: () => Class[];
}

const useTimetable = create<TimetableState & TimetableActions>()(
    persist(
        immer((set, get) => ({
            normalized: null,
            loading: false,
            lastFetchedAt: null,

            refetch: async () => {
                set((state) => {
                    state.loading = true;
                });

                try {
                    const result = await sendMessage("fetchTimetable", undefined);
                    const normalized = normalizeTimetable(result);

                    set((state) => {
                        state.normalized = normalized;
                        state.lastFetchedAt = new Date();
                        state.loading = false;
                    });
                } catch (error) {
                    set((state) => {
                        state.loading = false;
                    });
                    throw error;
                }
            },

            getClass: (day: DayOfWeek, period: Period) => {
                const { normalized } = get();
                if (!normalized) return null;
                return normalized.schedule[day][period];
            },

            getClassesForDay: (day: DayOfWeek) => {
                const { normalized } = get();
                if (!normalized) return [];
                const periods: Period[] = ["1", "2", "3", "4", "5", "6", "7"];
                return periods.map((period) => normalized.schedule[day][period]);
            },

            getTodayClasses: () => {
                const { normalized } = get();
                if (!normalized) return [];

                const today = new Date();
                const dayIndex = today.getDay();
                const dayMap: DayOfWeek[] = ["日", "月", "火", "水", "木", "金", "土"];
                const day = dayMap[dayIndex];

                const periods: Period[] = ["1", "2", "3", "4", "5", "6", "7"];
                return periods.map((period) => normalized.schedule[day][period]);
            },

            getAllClasses: () => {
                const { normalized } = get();
                if (!normalized) return [];

                const classes: Class[] = [];
                const days: DayOfWeek[] = ["月", "火", "水", "木", "金", "土", "日"];
                const periods: Period[] = ["1", "2", "3", "4", "5", "6", "7"];

                days.forEach((day) => {
                    periods.forEach((period) => {
                        const cls = normalized.schedule[day][period];
                        if (cls) {
                            classes.push(cls);
                        }
                    });
                });

                return classes;
            },
        })),
        {
            name: "timetableStore",
            storage: createJSONStorage(() => chromeStorage),
            partialize: (state) => ({
                normalized: state.normalized,
                lastFetchedAt: state.lastFetchedAt,
            }),
        }
    )
);

export default useTimetable;
