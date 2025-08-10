import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import ClassSchedule from "../../components/dashboard/ClassSchedule";
import { formatDate, getDayOfWeek } from "../../utils/dateUtils";
import DashBoardHeader from "../../components/dashboard/DashBoardHeader";

const UPDATE_INTERVAL = 30000; // 30秒

const DashboardPage = () => {
	const [currentTime, setCurrentTime] = useState<Date>(new Date());

	/**
	 * 時間を更新
	 */
	const updateTime = useCallback(() => {
		setCurrentTime(new Date());
	}, []);

	/**
	 * 日付表示コンポーネント
	 */
	const DateSection = () => (
		<div className="flex flex-col gap-2 items-center">
			<time className="text-[32px] font-bold text-neutral-black" dateTime={currentTime.toISOString().split("T")[0]}>
				{formatDate(currentTime)}
			</time>
			<p className="text-[18px] font-normal text-[#6B7280]">{getDayOfWeek(currentTime)}曜日</p>
		</div>
	);

	// 時間更新のタイマー設定
	useEffect(() => {
		const timer = setInterval(updateTime, UPDATE_INTERVAL);

		return () => {
			clearInterval(timer);
		};
	}, [updateTime]);

	// ページフォーカス時に時間を更新
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

	return (
		<main className="w-full h-full flex flex-col gap-5">
			<DashBoardHeader />
			<DateSection />
			<ClassSchedule currentTime={currentTime} />
		</main>
	);
};

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashboardPage,
});
