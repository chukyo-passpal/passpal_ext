import { createRootRouteWithContext, Outlet, redirect, useLocation } from "@tanstack/react-router";
import type { AuthState } from "../auth";

interface MyRouterContext {
	auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => <Outlet />,
});
