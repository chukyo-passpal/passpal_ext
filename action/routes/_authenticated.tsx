import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuthStore } from "../store/AuthStore";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		console.log("Authenticated:", isAuthenticated);
		if (!isAuthenticated) {
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
