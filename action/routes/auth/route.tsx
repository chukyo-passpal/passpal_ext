import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createFileRoute("/auth")({
	component: () => {
		return (
			<div className="m-6 p-0">
				<Outlet />
				<TanStackRouterDevtools />
			</div>
		);
	},
});
