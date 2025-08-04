import { Link, createFileRoute } from "@tanstack/react-router";

const SettingsPage = () => {
	return (
		<div className="flex flex-col gap-4 p-4">
			<h1>Settings</h1>
			<Link to="/" className="bg-primary text-white rounded px-4 py-2 text-center">
				ダッシュボード
			</Link>
		</div>
	);
};

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});
