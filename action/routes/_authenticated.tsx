import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth/student-id",
			});
		}
	},
	component: () => {
		return (
			<div className="p-5">
				<Outlet />
				<TanStackRouterDevtools />
			</div>
		);
	},
});
