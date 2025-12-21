import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import ClassSchedule from "../../components/dashboard/ClassSchedule";
import DashBoardHeader from "../../components/dashboard/DashBoardHeader";
import DebugTimeControl from "../../components/dashboard/DebugTimeControl";
import useSettingsStore from "../../store/SettingsStore";
import useTimetable from "../../store/timetableStore";
import { formatDate, getDayOfWeek, resetToNow } from "../../utils/dateUtils";

const UPDATE_INTERVAL = 30000; // 30秒
const IS_DEBUG = process.env.NODE_ENV === "development";

/**
 * 時間割データの初期ロードフック
 */
const useTimetableInitialLoad = () => {
    useEffect(() => {
        const { normalized, refetch } = useTimetable.getState();
        if (!normalized) {
            refetch();
        }
    }, []);
};

/**
 * 時刻の自動更新フック
 */
const useTimeUpdate = (updateTime: () => void) => {
    useEffect(() => {
        const timer = setInterval(updateTime, UPDATE_INTERVAL);
        return () => clearInterval(timer);
    }, [updateTime]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                updateTime();
            }
        };

        const handleFocus = () => {
            updateTime();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
        };
    }, [updateTime]);
};

const DashboardPage = () => {
    const { campusLocation } = useSettingsStore();
    const [currentTime, setCurrentTime] = useState<Date>(resetToNow());
    const [isDebugMode, setIsDebugMode] = useState(false);

    const updateTime = useCallback(() => {
        if (!isDebugMode) {
            setCurrentTime(resetToNow());
        }
    }, [isDebugMode]);

    const handleDebugTimeChange = (date: Date) => {
        setIsDebugMode(true);
        setCurrentTime(date);
    };

    const handleDebugReset = () => {
        setIsDebugMode(false);
        setCurrentTime(resetToNow());
    };

    useTimetableInitialLoad();
    useTimeUpdate(updateTime);

    return (
        <main className="flex h-full w-full flex-col gap-5">
            <DashBoardHeader />
            <DateSection currentTime={currentTime} />
            <ClassSchedule currentTime={currentTime} />

            {IS_DEBUG && (
                <DebugTimeControl
                    currentTime={currentTime}
                    campus={campusLocation}
                    onTimeChange={handleDebugTimeChange}
                    onReset={handleDebugReset}
                />
            )}
        </main>
    );
};

/**
 * 日付表示コンポーネント
 */
const DateSection: React.FC<{ currentTime: Date }> = ({ currentTime }) => (
    <div className="flex flex-col items-center gap-2">
        <time className="text-neutral-black text-[32px] font-bold" dateTime={currentTime.toISOString().split("T")[0]}>
            {formatDate(currentTime)}
        </time>
        <p className="text-[18px] font-normal text-[#6B7280]">{getDayOfWeek(currentTime)}曜日</p>
    </div>
);

export const Route = createFileRoute("/_authenticated/dashboard")({
    component: DashboardPage,
});
