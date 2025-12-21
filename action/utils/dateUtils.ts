// ==================== 定数 ====================

/** 曜日の配列 */
export const DAY_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** 曜日の型 */
export type DayOfWeekType = (typeof DAY_OF_WEEK)[number];

/** 時間を表す型 [時, 分] */
export type Time = [number, number];

// ==================== 日付取得関数 ====================

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
 * 曜日のインデックスを取得
 * @param date 日付
 * @returns 曜日インデックス（0: 日曜 〜 6: 土曜）
 */
export const getDayOfWeekIndex = (date: Date): number => {
    return date.getDay();
};

// ==================== 日付フォーマット関数 ====================

/**
 * 日付のフォーマット（M月D日形式）
 * @param date 日付
 * @returns "M月D日" 形式の文字列
 */
export const formatDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
};

/**
 * 日付を "YYYY-MM-DD" 形式にフォーマット
 * @param date 日付
 * @returns "YYYY-MM-DD" 形式の文字列
 */
export const formatDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
};

/**
 * 時刻を "HH:MM" 形式にフォーマット
 * @param date 日付
 * @returns "HH:MM" 形式の文字列
 */
export const formatTimeString = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
};

// ==================== 日付操作関数 ====================

/**
 * 日付に日数を加算
 * @param date 元の日付
 * @param days 加算する日数
 * @returns 新しいDateオブジェクト
 */
export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * 日付の曜日を変更
 * @param date 元の日付
 * @param targetDayIndex 目標曜日インデックス（0: 日曜 〜 6: 土曜）
 * @returns 新しいDateオブジェクト
 */
export const setDayOfWeek = (date: Date, targetDayIndex: number): Date => {
    const offset = targetDayIndex - date.getDay();
    return addDays(date, offset);
};

/**
 * 日付の時刻を設定
 * @param date 元の日付
 * @param hours 時
 * @param minutes 分
 * @returns 新しいDateオブジェクト
 */
export const setTime = (date: Date, hours: number, minutes: number): Date => {
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
};

/**
 * 日付を現在日時にリセット
 * @returns 現在のDateオブジェクト
 */
export const resetToNow = (): Date => {
    return new Date();
};

// ==================== 時刻計算関数 ====================

/**
 * 時間を分に変換
 * @param hours 時
 * @param minutes 分
 * @returns 分単位の時間
 */
export const timeToMinutes = (hours: number, minutes: number): number => hours * 60 + minutes;

/**
 * Timeオブジェクトを分に変換
 * @param time 時刻 [時, 分]
 * @returns 分単位の時間
 */
export const timeObjectToMinutes = (time: Time): number => {
    return timeToMinutes(time[0], time[1]);
};

/**
 * 総時間を計算（分単位）
 * @param start 開始時刻
 * @param end 終了時刻
 * @returns 総時間（分）
 */
export const calculateTotalTime = (start: Time | null, end: Time | null): number => {
    if (!start || !end) return 0;
    return timeObjectToMinutes(end) - timeObjectToMinutes(start);
};

/**
 * 時間を文字列に変換（HH:MM形式）
 * @param hours 時
 * @param minutes 分
 * @returns HH:MM形式の文字列
 */
export const timeToString = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

/**
 * Timeオブジェクトを文字列に変換（HH:MM形式）
 * @param time 時刻 [時, 分]
 * @returns HH:MM形式の文字列
 */
export const timeObjectToString = (time: Time): string => {
    return timeToString(time[0], time[1]);
};

// ==================== 日付判定関数 ====================

/**
 * 休日（土日）かどうかを判定
 * @param date 日付
 * @returns 土日の場合true
 */
export const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
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

    const startMinutes = timeObjectToMinutes(start);
    const endMinutes = timeObjectToMinutes(end);

    return startMinutes <= now && now < endMinutes;
};
