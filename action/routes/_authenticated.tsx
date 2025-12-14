import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { initFirebaseUser } from "../../firebase/authHelper";
import { useAuthStore } from "../store/AuthStore";

export const Route = createFileRoute("/_authenticated")({
    beforeLoad: async () => {
        await initFirebaseUser();
        const { studentId, cuIdPass, firebaseUser } = useAuthStore.getState();
        console.log(studentId, cuIdPass, firebaseUser);
        if (!(studentId && firebaseUser && cuIdPass)) {
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
