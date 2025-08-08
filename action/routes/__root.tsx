import { createRootRouteWithContext, Outlet, redirect, useLocation } from "@tanstack/react-router";
import type { AuthState } from "../store/auth";

interface MyRouterContext {
	auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => <Outlet />,
});
