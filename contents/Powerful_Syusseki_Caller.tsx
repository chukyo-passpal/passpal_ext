import React from "react";
import { createRoot } from "react-dom/client";

import PowerfulSyussekiButton from "./components/PowerfulSyussekiButton";
import { executeNotifyCaller } from "./utils/scriptInjection";
import { getSetting } from "./utils/settings";

(function () {
    "use strict";

    const attendanceCallerEnabled = getSetting("attendanceCallerEnabled");

    if (!attendanceCallerEnabled) {
        return;
    }

    const handleButtonClick = async () => {
        // `notify_caller.js`をページの<body>に注入して実行する
        await executeNotifyCaller();
    };

    // Reactアプリケーションをマウントするためのコンテナを作成
    const appContainer = document.createElement("div");
    appContainer.id = "powerful-syusseki-caller-react-root";
    document.body.appendChild(appContainer);

    // Reactアプリケーションをレンダリング
    const root = createRoot(appContainer);
    root.render(
        <React.StrictMode>
            <PowerfulSyussekiButton onButtonClick={handleButtonClick} />
        </React.StrictMode>
    );
})();
