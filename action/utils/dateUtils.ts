/** 曜日の配列 */
export const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** 曜日の型 */
export type DayOfWeekType = (typeof DAY_OF_WEEK)[number];

/** 時間を表す型 [時, 分] */
export type Time = [number, number];

/**
 * 曜日の取得
 * @param date 日付
 * @returns 曜日（日〜土）
 */
export const getDayOfWeek = (date: Date): DayOfWeekType => {
    const dayIndex = date.getDay();
    return DAY_OF_WEEK[dayIndex];
};

/**
 * 日付のフォーマット（M月D日形式）
 */
export const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1; // getMonth()は0始まりなので+1
    const day = date.getDate();
    return `${month}月${day}日`;
};

/**
 * 日付を "YYYY-MM-DD" 形式にフォーマット
 */
export const formatDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

/**
 * 時刻を "HH:MM" 形式にフォーマット
 */
export const formatTimeString = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

/**
 * 総時間を計算（分単位）
 * @param start 開始時刻
 * @param end 終了時刻
 * @returns 総時間（分）
 */
export const calculateTotalTime = (start: Time | null, end: Time | null): number => {
    if (!start || !end) return 0;
    return timeToMinutes(end[0], end[1]) - timeToMinutes(start[0], start[1]);
};

/**
 * 時間を分に変換
 * @param hours 時
 * @param minutes 分
 * @returns 分単位の時間
 */
export const timeToMinutes = (hours: number, minutes: number): number => hours * 60 + minutes;

/**
 * 時間を文字列に変換（HH:MM形式）
 * @param hours 時
 * @param minutes 分
 * @returns HH:MM形式の文字列
 */
export const timeToString = (hours: number, minutes: number): string =>
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

/**
 * 休日（土日）かどうかを判定
 * @param date 日付
 * @returns 土日の場合true
 */
export const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 日曜日(0)または土曜日(6)
};

/**
 * 現在の時間が指定された時間範囲内かどうかを判定
 * @param now 現在時刻（分単位）
 * @param start 開始時刻
 * @param end 終了時刻
 * @returns 時間範囲内の場合true
 */
export const isTimeInRange = (now: number, start: Time | null, end: Time | null): boolean => {
    if (!start || !end) return false;

    const startMinutes = timeToMinutes(start[0], start[1]);
    const endMinutes = timeToMinutes(end[0], end[1]);

    return startMinutes <= now && now < endMinutes;
};
