(function () {
    "use strict";

    const html_PSCBtn = `
    <style>
    .psc-btn {
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        border: none;
        background: none;
        color: #0f1923;
        cursor: pointer;
        position: relative;
        padding: 8px;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 14px;
        transition: all .15s ease;pointer-events: initial;

        position: absolute;
        bottom: 10px;
        right: 10px;

    }

    .psc-btn::before,
    .psc-btn::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        left: 0;
        height: calc(50% - 5px);
        border: 1px solid #7D8082;
        transition: all .15s ease;
    }

    .psc-btn::before {
        top: 0;
        border-bottom-width: 0;
    }

    .psc-btn::after {
        bottom: 0;
        border-top-width: 0;
    }

    .psc-btn:active,
    .psc-btn:focus {
        outline: none;
    }

    .psc-btn:active::before,
    .psc-btn:active::after {
        right: 3px;
        left: 3px;
    }

    .psc-btn:active::before {
        top: 3px;
    }

    .psc-btn:active::after {
        bottom: 3px;
    }

    .psc-btn-lg {
        position: relative;
        display: block;
        padding: 10px 20px;
        color: #fff;
        background-color: #0f1923;
        overflow: hidden;
        box-shadow: inset 0px 0px 0px 1px transparent;

        width: 21rem;
    }

    .psc-btn-lg::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 2px;
        height: 2px;
        background-color: #0f1923;
    }

    .psc-btn-lg::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 4px;
        height: 4px;
        background-color: #0f1923;
        transition: all .2s ease;
    }

    .psc-btn-sl {
        display: block;
        position: absolute;
        top: 0;
        bottom: -1px;
        left: -8px;
        width: 0;
        background-color: #ff4655;
        transform: skew(-15deg);
        transition: all .2s ease;
    }

    .psc-btn-text {
        position: relative;
    }

    .psc-btn:hover {
        color: #0f1923;
    }

    .psc-btn:hover .psc-btn-sl {
        width: calc(100% + 15px);
    }

    .psc-btn:hover .psc-btn-lg::after {
        background-color: #fff;
    }
</style>
<button class="psc-btn">
    <span class="psc-btn-lg">
        <span class="psc-btn-sl"></span>
        <span class="psc-btn-text"></span>
    </span>
</button>`;

    const btn_text_content = { default: "出席ウィンドウの強制取得", loaded: "取得が完了しました！" };

    // Your code here...
    const d_body = document.querySelector("body")!;
    const d_PSCDisplay = d_body.appendChild(document.createElement("div"));
    d_PSCDisplay.id = "psc-display";

    d_PSCDisplay.style.position = "fixed";
    d_PSCDisplay.style.top = "0";
    d_PSCDisplay.style.left = "0";
    d_PSCDisplay.style.width = "100%";
    d_PSCDisplay.style.height = "100%";
    d_PSCDisplay.style.pointerEvents = "none";

    d_PSCDisplay.innerHTML = html_PSCBtn;

    const d_PSCButton = d_PSCDisplay.querySelector(".psc-btn") as HTMLButtonElement;
    const d_PSCButton_text = d_PSCButton.querySelector(".psc-btn-text") as HTMLSpanElement;

    d_PSCButton_text.innerHTML = btn_text_content.default;
    let detectMash = false;
    d_PSCButton.onclick = (e) => {
        if (detectMash === false) {
            detectMash = true;
            d_PSCButton_text.innerHTML = btn_text_content.loaded;

            const injectScript = (filePath: string, tag: string) => {
                const node = document.getElementsByTagName(tag)[0] || document.documentElement;
                const script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                // chrome.runtime.getURLを使用して、拡張機能内のファイルへの完全なURLを取得する
                script.setAttribute("src", filePath);

                // 注入したスクリプトは実行後にDOMから削除する
                script.onload = () => {
                    script.remove();
                };
                script.onerror = () => {
                    console.error(`Failed to load script: ${filePath}`);
                    script.remove();
                };

                node.appendChild(script);
            };

            // `notify_caller.js`をページの<body>に注入して実行する
            injectScript(chrome.runtime.getURL("scripts/notify_caller.js"), "body");
            setTimeout(() => {
                detectMash = false;
                d_PSCButton_text.innerHTML = btn_text_content.default;
            }, 3000);
        }
    };
})();
