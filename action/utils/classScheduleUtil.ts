import { isTimeInRange, isWeekend, timeToMinutes } from "./dateUtils";

export type PeriodType = number | "lunch" | "break" | "outside" | "holiday";

export interface ClassScheduleItem {
    period: PeriodType;
    start: [number, number] | null;
    end: [number, number] | null;
    name: string;
}

export interface ClassSchedules {
    nagoya: ClassScheduleItem[];
    toyota: ClassScheduleItem[];
}

export interface PeriodInfo {
    current: ClassScheduleItem;
    remaining: number | null;
}

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
 * 残り時間を計算（分単位）
 */
const calcRemainingTime = (currentTime: Date, endTime: [number, number] | null): number | null => {
    if (!endTime) return null;

    const now = timeToMinutes(currentTime.getHours(), currentTime.getMinutes());
    const end = timeToMinutes(endTime[0], endTime[1]);
    const remaining = end - now;

    return remaining > 0 ? remaining : null;
};

/**
 * 休憩時間の情報を取得
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
                remaining: calcRemainingTime(currentTime, next.start),
            };
        }
    }
    return null;
};

/**
 * 現在の授業期間を取得
 */
export const getCurrentPeriod = (currentTime: Date, campus: "nagoya" | "toyota"): PeriodInfo | null => {
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
                remaining: calcRemainingTime(currentTime, period.end),
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
