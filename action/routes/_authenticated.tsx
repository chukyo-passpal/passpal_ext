import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth/student-id",
				search: {
					// Save current location for redirect after login
					redirect: location.href,
				},
			});
		}
	},
	component: () => {
		<div className="m-5 p-0">
			<Outlet />
			<TanStackRouterDevtools />
		</div>;
	},
});
