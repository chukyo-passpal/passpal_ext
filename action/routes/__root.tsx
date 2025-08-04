import {
  createRootRoute,
  Link,
  Navigate,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <div className="m-4 p-0">
      <Navigate to="/" />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});
