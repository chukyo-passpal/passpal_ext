import { BookOpen, Clock, Coffee, Moon, TreePalm } from "lucide-react";

import type { DayOfWeek, Period } from "../../../utils/timetable";
import useSettingsStore from "../../store/SettingsStore";
import useTimetable from "../../store/timetableStore";
import { getCurrentPeriod, type Campus, type PeriodType } from "../../utils/classScheduleUtil";
import { calculateTotalTime, timeToString } from "../../utils/dateUtils";

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

const ClassSchedule: React.FC<ClassScheduleProps> = ({ currentTime }) => {
    const { campusLocation } = useSettingsStore();
    const { getClass } = useTimetable();
    const periodInfo = getCurrentPeriod(currentTime, campusLocation);

    // 現在の曜日を取得
    const dayOfWeek: DayOfWeek[] = ["日", "月", "火", "水", "木", "金", "土"];
    const currentDay = dayOfWeek[currentTime.getDay()];

    // 現在の時限を取得
    const currentPeriod = getCurrentPeriodNumber(currentTime, campusLocation);

    // 現在の授業を取得
    const currentClass = currentPeriod ? getClass(currentDay, currentPeriod) : null;

    /**
     * 期間タイプに応じたアイコンを取得
     */
    const getIcon = (period: PeriodType) => {
        switch (period) {
            case "lunch":
            case "break":
                return <Coffee />;
            case "outside":
                return <Moon />;
            case "holiday":
                return <TreePalm />;
            default:
                return <BookOpen />;
        }
    };

    /**
     * 進捗率を計算
     */
    const calculateProgress = (totalTime: number, remaining: number | null): number => {
        if (!remaining || totalTime <= 0) return 0;
        return Math.max(0, Math.min(100, ((totalTime - remaining) / totalTime) * 100));
    };

    /**
     * ローディング状態のレンダリング
     */
    const renderLoading = () => (
        <div className="mx-auto mt-8 max-w-md rounded-lg border-2 border-gray-300 bg-gray-100 p-6">
            <div className="text-center">
                <Clock className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                <p className="text-gray-600">時間割情報を読み込んでいます...</p>
            </div>
        </div>
    );

    /**
     * 時間範囲の表示
     */
    const renderTimeRange = (start: [number, number] | null, end: [number, number] | null) => {
        if (!start || !end) return null;

        return (
            <p className="text-[16px] text-[#6B7280]">
                {`${timeToString(start[0], start[1])} ～ ${timeToString(end[0], end[1])}`}
            </p>
        );
    };

    /**
     * プログレスバーの表示
     */
    const renderProgressBar = (totalTime: number, remaining: number | null) => {
        if (!remaining) return null;

        const progress = calculateProgress(totalTime, remaining);

        return (
            <div className="m-0 flex w-full items-center gap-2 p-0">
                <div className="bg-neutral-gray-200 relative h-2 flex-1 overflow-hidden rounded-full">
                    <div
                        className="bg-status-success absolute top-0 left-0 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`授業進捗 ${Math.round(progress)}%`}
                    />
                </div>
                <p className="text-status-success block text-[14px] font-semibold whitespace-nowrap">{`残り ${remaining}分`}</p>
            </div>
        );
    };

    // periodInfoがnullの場合はローディング表示
    if (!periodInfo) {
        return renderLoading();
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
                            {getIcon(current.period)}
                        </span>
                        {current.name}
                    </p>
                    {renderTimeRange(current.start, current.end)}
                </div>

                {/* 授業名表示 */}
                {currentClass && (
                    <div className="flex flex-col gap-1">
                        <p className="text-[16px] font-medium text-[#2D2D30]">{currentClass.name}</p>
                        {currentClass.teacher && (
                            <p className="text-[14px] text-[#6B7280]">担当: {currentClass.teacher}</p>
                        )}
                        {currentClass.classroom && (
                            <p className="text-[14px] text-[#6B7280]">教室: {currentClass.classroom}</p>
                        )}
                    </div>
                )}

                {/* 進捗バー */}
                {renderProgressBar(totalTime, remaining)}

                {/* TODO: 外部リンク用（コメントアウト） */}
                {/* <TextButton className="text-right">Manaboで開く</TextButton> */}
            </div>
        </div>
    );
};

export default ClassSchedule;
