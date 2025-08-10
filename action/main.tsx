import { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter, createMemoryHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import useSettingsStore from "./store/SettingsStore";
import { getSettings } from "../contents/utils/settings";

// メモリヒストリーを使用（Chrome拡張に最適）
const memoryHistory = createMemoryHistory({
	initialEntries: ["/dashboard"], // 常に '/' から開始
});

const router = createRouter({
	routeTree,
	history: memoryHistory,
	defaultPreload: "intent",
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const InnerApp = () => {
	const test = async () => {
		console.log(await getSettings());
	};
	test();
	return <RouterProvider router={router} />;
};

const rootElement = document.getElementById("popup-root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<InnerApp />
		</StrictMode>
	);
}
