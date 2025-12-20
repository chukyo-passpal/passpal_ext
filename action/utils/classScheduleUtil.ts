import { isTimeInRange, isWeekend, timeToMinutes, type Time } from "./dateUtils";

/** 時限タイプ */
export type PeriodType = number | "lunch" | "break" | "outside" | "holiday";

/** 授業スケジュールアイテム */
export interface ClassScheduleItem {
    period: PeriodType;
    start: Time | null;
    end: Time | null;
    name: string;
}

/** キャンパス別授業スケジュール */
export interface ClassSchedules {
    nagoya: ClassScheduleItem[];
    toyota: ClassScheduleItem[];
}

/** 現在の時限情報 */
export interface PeriodInfo {
    current: ClassScheduleItem;
    remaining: number | null;
}

/** キャンパスタイプ */
export type Campus = "nagoya" | "toyota";

/** キャンパス別授業時間テーブル */
export const classScheduleTable: ClassSchedules = {
    nagoya: [
        { period: 1, start: [9, 0], end: [10, 30], name: "1限目" },
        { period: 2, start: [10, 45], end: [12, 15], name: "2限目" },
        { period: "lunch", start: [12, 15], end: [13, 10], name: "昼休み" },
        { period: 3, start: [13, 10], end: [14, 40], name: "3限目" },
        { period: 4, start: [14, 55], end: [16, 25], name: "4限目" },
        { period: 5, start: [16, 40], end: [18, 10], name: "5限目" },
    ],
    toyota: [
        { period: 1, start: [9, 30], end: [11, 0], name: "1限目" },
        { period: 2, start: [11, 10], end: [12, 40], name: "2限目" },
        { period: "lunch", start: [12, 40], end: [13, 30], name: "昼休み" },
        { period: 3, start: [13, 30], end: [15, 0], name: "3限目" },
        { period: 4, start: [15, 10], end: [16, 40], name: "4限目" },
        { period: 5, start: [16, 50], end: [18, 20], name: "5限目" },
    ],
};

/**
 * キャンパスの時限開始時刻マッピングを取得
 * @param campus キャンパス
 * @returns 時限番号と開始時刻のマッピング
 */
export const getPeriodTimeMapping = (campus: Campus): Record<number, Time> => {
    const schedule = classScheduleTable[campus];
    const mapping: Record<number, Time> = {};

    for (const item of schedule) {
        if (typeof item.period === "number" && item.start) {
            mapping[item.period] = item.start;
        }
    }

    return mapping;
};

/**
 * 残り時間を計算（分単位）
 * @param currentTime 現在時刻
 * @param endTime 終了時刻
 * @returns 残り時間（分）、終了時刻を過ぎている場合はnull
 */
const calculateRemainingTime = (currentTime: Date, endTime: Time | null): number | null => {
    if (!endTime) return null;

    const now = timeToMinutes(currentTime.getHours(), currentTime.getMinutes());
    const end = timeToMinutes(endTime[0], endTime[1]);
    const remaining = end - now;

    return remaining > 0 ? remaining : null;
};

/**
 * 休憩時間の情報を取得
 * @param now 現在時刻（分単位）
 * @param currentTime 現在時刻のDateオブジェクト
 * @param schedule 授業スケジュール
 * @returns 休憩時間情報、休憩時間でない場合はnull
 */
const getBreakPeriod = (now: number, currentTime: Date, schedule: ClassScheduleItem[]): PeriodInfo | null => {
    for (let i = 0; i < schedule.length - 1; i++) {
        const current = schedule[i];
        const next = schedule[i + 1];

        if (!current.end || !next.start) continue;

        const currentEnd = timeToMinutes(current.end[0], current.end[1]);
        const nextStart = timeToMinutes(next.start[0], next.start[1]);

        if (now >= currentEnd && now < nextStart) {
            return {
                current: {
                    period: "break",
                    name: "休憩時間",
                    start: current.end,
                    end: next.start,
                },
                remaining: calculateRemainingTime(currentTime, next.start),
            };
        }
    }
    return null;
};

/**
 * 現在の授業期間を取得
 * @param currentTime 現在時刻
 * @param campus キャンパス（名古屋 or 豊田）
 * @returns 現在の時限情報
 */
export const getCurrentPeriod = (currentTime: Date, campus: Campus): PeriodInfo | null => {
    // 休日チェック
    if (isWeekend(currentTime)) {
        return {
            current: {
                period: "holiday",
                start: null,
                end: null,
                name: "本日授業はありません",
            },
            remaining: null,
        };
    }

    const now = timeToMinutes(currentTime.getHours(), currentTime.getMinutes());
    const schedule = classScheduleTable[campus];

    // 授業時間内かチェック
    for (const period of schedule) {
        if (isTimeInRange(now, period.start, period.end)) {
            return {
                current: period,
                remaining: calculateRemainingTime(currentTime, period.end),
            };
        }
    }

    // 休憩時間かチェック
    const breakPeriod = getBreakPeriod(now, currentTime, schedule);
    if (breakPeriod) {
        return breakPeriod;
    }

    // 授業時間外
    const firstPeriod = schedule[0];
    const lastPeriod = schedule[schedule.length - 1];

    return {
        current: {
            period: "outside",
            name: "授業時間外",
            start: firstPeriod?.start || null,
            end: lastPeriod?.end || null,
        },
        remaining: null,
    };
};
