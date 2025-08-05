import { createRootRoute, Link, Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => {
		const location = useLocation();
		const isAuthPage = location.pathname.startsWith("/auth");

		if (isAuthPage) {
			return (
				<div className="m-6 p-0">
					<Outlet />
				</div>
			);
		}
		return (
			<div className="m-5 p-0">
				<Navigate to="/" />
				<Outlet />
				<TanStackRouterDevtools />
			</div>
		);
	},
});
