import { useState } from "react";
import { Calendar, ChevronDown, Clock, RotateCcw } from "lucide-react";

import { getPeriodTimeMapping, type Campus } from "../../utils/classScheduleUtil";
import { DAY_OF_WEEK, formatDateString, formatTimeString, setDayOfWeek, setTime } from "../../utils/dateUtils";

interface DebugTimeControlProps {
    currentTime: Date;
    campus: Campus;
    onTimeChange: (date: Date) => void;
    onReset: () => void;
}

/** 時限の配列 */
const PERIODS = [1, 2, 3, 4, 5] as const;

/**
 * デバッグ用の時間コントロールコンポーネント
 */
const DebugTimeControl: React.FC<DebugTimeControlProps> = ({ currentTime, campus, onTimeChange, onReset }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const periodTimes = getPeriodTimeMapping(campus);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [year, month, day] = e.target.value.split("-").map(Number);
        const newDate = new Date(currentTime);
        newDate.setFullYear(year, month - 1, day);
        onTimeChange(newDate);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        const newDate = setTime(currentTime, hours, minutes);
        onTimeChange(newDate);
    };

    const handleDayOfWeekChange = (dayIndex: number) => {
        const newDate = setDayOfWeek(currentTime, dayIndex);
        onTimeChange(newDate);
    };

    const handlePeriodChange = (period: number) => {
        const timeMapping = periodTimes[period];
        if (timeMapping) {
            const [hours, minutes] = timeMapping;
            const newDate = setTime(currentTime, hours, minutes);
            onTimeChange(newDate);
        }
    };

    return (
        <div
            className={`border-neutral-gray-200 fixed right-4 bottom-0.5 z-[9999] rounded-lg border bg-white shadow-2xl transition-all duration-300 ${
                isExpanded ? "w-80 p-4" : "w-auto p-1"
            }`}
        >
            <Header isExpanded={isExpanded} onToggle={toggleExpanded} />

            {isExpanded && (
                <div className="mt-3 flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
                    <DateInput value={formatDateString(currentTime)} onChange={handleDateChange} />
                    <TimeInput value={formatTimeString(currentTime)} onChange={handleTimeChange} />
                    <DayOfWeekSelector currentDay={currentTime.getDay()} onSelect={handleDayOfWeekChange} />
                    <PeriodSelector onSelect={handlePeriodChange} campus={campus} />
                    <ResetButton onClick={onReset} />
                </div>
            )}
        </div>
    );
};

/**
 * ヘッダーコンポーネント
 */
const Header: React.FC<{ isExpanded: boolean; onToggle: () => void }> = ({ isExpanded, onToggle }) => (
    <div className={isExpanded ? "mb-3 flex items-center justify-between" : "flex items-center justify-center"}>
        {isExpanded && (
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Clock size={16} />
                デバッグモード
            </h3>
        )}
        <button
            onClick={onToggle}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
            aria-label={isExpanded ? "デバッグモードを閉じる" : "デバッグモードを開く"}
        >
            {isExpanded ? <ChevronDown size={16} /> : <Clock size={16} />}
        </button>
    </div>
);

/**
 * 日付入力コンポーネント
 */
const DateInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
    value,
    onChange,
}) => (
    <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
            <Calendar size={14} />
            日付
        </label>
        <input
            type="date"
            value={value}
            onChange={onChange}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
    </div>
);

/**
 * 時刻入力コンポーネント
 */
const TimeInput: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
    value,
    onChange,
}) => (
    <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-xs font-medium text-gray-700">
            <Clock size={14} />
            時刻
        </label>
        <input
            type="time"
            value={value}
            onChange={onChange}
            className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
    </div>
);

/**
 * 曜日選択コンポーネント
 */
const DayOfWeekSelector: React.FC<{ currentDay: number; onSelect: (dayIndex: number) => void }> = ({
    currentDay,
    onSelect,
}) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">曜日</label>
        <div className="grid grid-cols-7 gap-1">
            {DAY_OF_WEEK.map((day, index) => {
                const isSelected = index === currentDay;
                return (
                    <button
                        key={day}
                        onClick={() => onSelect(index)}
                        className={`rounded px-2 py-1 text-xs ${
                            isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {day}
                    </button>
                );
            })}
        </div>
    </div>
);

/**
 * 時限選択コンポーネント
 */
const PeriodSelector: React.FC<{ onSelect: (period: number) => void; campus: Campus }> = ({ onSelect, campus }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">時限（{campus === "nagoya" ? "名古屋" : "豊田"}）</label>
        <div className="grid grid-cols-5 gap-1">
            {PERIODS.map((period) => (
                <button
                    key={period}
                    onClick={() => onSelect(period)}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
                >
                    {period}限
                </button>
            ))}
        </div>
    </div>
);

/**
 * リセットボタンコンポーネント
 */
const ResetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="mt-2 flex items-center justify-center gap-2 rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
    >
        <RotateCcw size={14} />
        現在時刻に戻す
    </button>
);

export default DebugTimeControl;
