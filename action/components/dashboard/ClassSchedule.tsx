import { BookOpen, Clock, Coffee, Moon, TreePalm } from "lucide-react";
import { getCurrentPeriod, type PeriodType } from "../../utils/classScheduleUtil";
import useSettingsStore from "../../store/SettingsStore";
import { calculateTotalTime, timeToString } from "../../utils/dateUtils";

interface ClassScheduleProps {
	currentTime: Date;
}

const ClassSchedule: React.FC<ClassScheduleProps> = ({ currentTime }) => {
	const { campusLocation } = useSettingsStore();
	const periodInfo = getCurrentPeriod(currentTime, campusLocation);
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
		<div className="max-w-md mx-auto mt-8 p-6 bg-gray-100 rounded-lg border-2 border-gray-300">
			<div className="text-center">
				<Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
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
			<div className="flex w-full items-center gap-2 m-0 p-0">
				<div className="relative flex-1 h-2 bg-neutral-gray-200 rounded-full overflow-hidden">
					<div
						className="absolute left-0 top-0 h-2 bg-status-success rounded-full transition-all duration-500"
						style={{ width: `${progress}%` }}
						role="progressbar"
						aria-valuenow={Math.round(progress)}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label={`授業進捗 ${Math.round(progress)}%`}
					/>
				</div>
				<p className="block text-status-success text-[14px] font-semibold whitespace-nowrap">{`残り ${remaining}分`}</p>
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
		<div className="w-full h-full p-[20px] flex flex-col gap-4 items-center justify-center border border-neutral-gray-200 rounded-[12px]">
			{/* ヘッダー */}
			<p className="w-full flex items-center text-[18px] text-left font-semibold">
				<Clock size={20} className="inline text-primary mr-[12px]" />
				現在の授業
			</p>

			{/* メインコンテンツ */}
			<div className="w-full flex flex-col gap-3">
				{/* 授業情報 */}
				<div className="flex w-full items-center justify-between m-0 p-0">
					<p className="flex items-center text-[20px] font-bold gap-3 text-neutral-black">
						<span className="text-primary" aria-hidden="true">
							{getIcon(current.period)}
						</span>
						{current.name}
					</p>
					{renderTimeRange(current.start, current.end)}
				</div>

				{/* 進捗バー */}
				{renderProgressBar(totalTime, remaining)}

				{/* TODO: 授業名表示用（コメントアウト） */}
				{/* <p className="text-[16px] font-medium text-[#2D2D30]">アルゴリズムとデータ構造</p> */}

				{/* TODO: 外部リンク用（コメントアウト） */}
				{/* <TextButton className="text-right">Manaboで開く</TextButton> */}
			</div>
		</div>
	);
};

export default ClassSchedule;
