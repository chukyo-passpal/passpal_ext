import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Button from "../../components/Button";

const DashBoardPage = () => {
	const navigate = useNavigate();
	const { auth } = Route.useRouteContext();
	const onClickSetting = () => {
		navigate({ to: "/settings" });
	};
	const onClickIdInput = async () => {
		await auth.logout();
		navigate({ to: "/auth/student-id" });
	};
	return (
		<div className="w-full h-full flex flex-col gap-5">
			<h1>DashBoard</h1>
			<Button onClick={onClickSetting}>設定</Button>
			<Button onClick={onClickIdInput}>ID入力</Button>
		</div>
	);
};

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashBoardPage,
});
