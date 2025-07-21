(function() {
    'use strict';

    // ページ上に 'notify' オブジェクトとその 'init' メソッドが存在することを確認してから実行
    if (window.notify && typeof window.notify.init === 'function') {
        window.notify.init();
    }
})();