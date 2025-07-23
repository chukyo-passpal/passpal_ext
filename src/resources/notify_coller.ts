export default function notifyColler() {
    // ページ上に 'notify' オブジェクトとその 'init' メソッドが存在することを確認してから実行
    if ((window as any).notify && typeof (window as any).notify.init === "function") {
        (window as any).notify.init();
    }
}

notifyColler();
