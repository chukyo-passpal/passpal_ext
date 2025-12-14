import { StrictMode } from "react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth/web-extension";
import ReactDOM from "react-dom/client";

import { auth } from "../firebase/firebase";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "./store/AuthStore";

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

// 認証状態を監視
onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setFirebaseUser(user);
});

const rootElement = document.getElementById("popup-root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <RouterProvider router={router} />;
        </StrictMode>
    );
}
