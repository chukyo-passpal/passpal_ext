import { Clock } from "lucide-react";

import type { DayOfWeek, Period } from "../../../utils/timetable";
import { MANABO_URLS } from "../../../utils/urls";
import useSettingsStore from "../../store/SettingsStore";
import useTimetable from "../../store/timetableStore";
import { getCurrentPeriod, type Campus } from "../../utils/classScheduleUtil";
import { calculateTotalTime, getDayOfWeekIndex, timeObjectToString, type Time } from "../../utils/dateUtils";
import TextButton from "../TextButton";
import { ClassInfo } from "./ClassInfo";
import { ClassProgressBar } from "./ClassProgressBar";
import { ClassScheduleIcon } from "./ClassScheduleIcon";
import { ClassScheduleLoading } from "./ClassScheduleLoading";

interface ClassScheduleProps {
    currentTime: Date;
}

/**
 * 現在の時限を取得
 * @param currentTime 現在時刻
 * @param campus キャンパス
 * @returns 現在の時限（1-7）、授業時間外の場合はnull
 */
const getCurrentPeriodNumber = (currentTime: Date, campus: Campus): Period | null => {
    const periodInfo = getCurrentPeriod(currentTime, campus);
    if (!periodInfo) return null;

    const { period } = periodInfo.current;
    if (typeof period === "number" && period >= 1 && period <= 7) {
        return period.toString() as Period;
    }
    return null;
};

/**
 * 時間範囲の表示コンポーネント
 */
const TimeRange: React.FC<{ start: Time | null; end: Time | null }> = ({ start, end }) => {
    if (!start || !end) return null;

    return <p className="text-[16px] text-[#6B7280]">{`${timeObjectToString(start)} ～ ${timeObjectToString(end)}`}</p>;
};

const ClassSchedule: React.FC<ClassScheduleProps> = ({ currentTime }) => {
    const { campusLocation } = useSettingsStore();
    const { getClass } = useTimetable();
    const periodInfo = getCurrentPeriod(currentTime, campusLocation);

    // 現在の曜日を取得
    const dayOfWeek: DayOfWeek[] = ["日", "月", "火", "水", "木", "金", "土"];
    const currentDayIndex = getDayOfWeekIndex(currentTime);
    const currentDay = dayOfWeek[currentDayIndex];

    // 現在の時限を取得
    const currentPeriod = getCurrentPeriodNumber(currentTime, campusLocation);

    // 現在の授業を取得
    const currentClass = currentPeriod ? getClass(currentDay, currentPeriod) : null;

    // periodInfoがnullの場合はローディング表示
    if (!periodInfo) {
        return <ClassScheduleLoading />;
    }

    const { current, remaining } = periodInfo;
    const totalTime = calculateTotalTime(current.start, current.end);

    return (
        <div className="border-neutral-gray-200 flex h-full w-full flex-col items-center justify-center gap-4 rounded-[12px] border p-[20px]">
            {/* ヘッダー */}
            <p className="flex w-full items-center text-left text-[18px] font-semibold">
                <Clock size={20} className="text-primary mr-[12px] inline" />
                現在の授業
            </p>

            {/* メインコンテンツ */}
            <div className="flex w-full flex-col gap-3">
                {/* 授業情報 */}
                <div className="m-0 flex w-full items-center justify-between p-0">
                    <p className="text-neutral-black flex items-center gap-3 text-[20px] font-bold">
                        <span className="text-primary" aria-hidden="true">
                            <ClassScheduleIcon period={current.period} />
                        </span>
                        {current.name}
                    </p>
                    <TimeRange start={current.start} end={current.end} />
                </div>

                {/* 授業名表示 */}
                <ClassInfo currentClass={currentClass} />

                {/* 進捗バー */}
                <ClassProgressBar totalTime={totalTime} remaining={remaining} />

                {/* Manaboで開くボタン */}
                {currentClass?.manaboUrl && (
                    <TextButton
                        className="text-right"
                        onClick={() => {
                            if (currentClass.manaboUrl) {
                                chrome.tabs.create({ url: new URL(currentClass.manaboUrl, MANABO_URLS.base).href });
                            }
                        }}
                    >
                        Manaboで開く
                    </TextButton>
                )}
            </div>
        </div>
    );
};

export default ClassSchedule;
