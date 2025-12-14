const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;

/**
 * 曜日の取得
 */
export const getDayOfWeek = (date: Date): string => {
    const dayIndex = date.getDay();
    return DAY_OF_WEEK[dayIndex] || "不明";
};

/**
 * 日付のフォーマット
 */
export const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1; // getMonth()は0始まりなので+1
    const day = date.getDate();
    return `${month}月${day}日`;
};

/**
 * 総時間を計算
 */
export const calculateTotalTime = (start: [number, number] | null, end: [number, number] | null): number => {
    if (!start || !end) return 0;
    return timeToMinutes(end[0], end[1]) - timeToMinutes(start[0], start[1]);
};

/**
 * 時間を分に変換
 */
export const timeToMinutes = (hours: number, minutes: number): number => hours * 60 + minutes;

/**
 * 時間を文字列に変換（HH:MM形式）
 */
export const timeToString = (hours: number, minutes: number): string =>
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

/**
 * 休日かどうかを判定
 */
export const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // 日曜日(0)または土曜日(6)
};

/**
 * 現在の時間が指定された時間範囲内かどうかを判定
 */
export const isTimeInRange = (now: number, start: [number, number] | null, end: [number, number] | null): boolean => {
    if (!start || !end) return false;

    const startMinutes = timeToMinutes(start[0], start[1]);
    const endMinutes = timeToMinutes(end[0], end[1]);

    return startMinutes <= now && now < endMinutes;
};
