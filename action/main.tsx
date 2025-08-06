import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter, createMemoryHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth } from "./auth";

// メモリヒストリーを使用（Chrome拡張に最適）
const memoryHistory = createMemoryHistory({
	initialEntries: ["/"], // 常に '/' から開始
});

const router = createRouter({
	routeTree,
	history: memoryHistory,
	defaultPreload: "intent",
	scrollRestoration: true,
	basepath: "/dashboard",
	context: {
		auth: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const InnerApp = () => {
	const auth = useAuth();
	return <RouterProvider router={router} context={{ auth }} />;
};

const rootElement = document.getElementById("popup-root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<AuthProvider>
				<InnerApp />
			</AuthProvider>
		</StrictMode>
	);
}
