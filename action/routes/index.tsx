import { createFileRoute, Link } from "@tanstack/react-router";

const DashBoardPage = () => {
	return (
		<div className="w-full h-full flex flex-col gap-5">
			<h1>DashBoard</h1>
			<Link to="/settings" className="bg-primary text-white rounded px-4 py-2 text-center">
				設定
			</Link>
			<Link to="/auth/student-id" className="bg-primary text-white rounded px-4 py-2 text-center">
				ID入力
			</Link>
		</div>
	);
};

export const Route = createFileRoute("/")({
	component: DashBoardPage,
});
