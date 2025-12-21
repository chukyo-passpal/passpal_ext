interface ClassProgressBarProps {
    totalTime: number;
    remaining: number | null;
}

/**
 * 進捗率を計算
 */
const calculateProgress = (totalTime: number, remaining: number | null): number => {
    if (!remaining || totalTime <= 0) return 0;
    return Math.max(0, Math.min(100, ((totalTime - remaining) / totalTime) * 100));
};

/**
 * 授業の進捗バーを表示するコンポーネント
 */
export const ClassProgressBar: React.FC<ClassProgressBarProps> = ({ totalTime, remaining }) => {
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
