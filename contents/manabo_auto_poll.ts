// アンケートに自動回答し、カスタム確認ダイアログを含めて最後まで自動で送信します。

export default function manaboAutoPoll() {
    /**
     * 回答ロジック：すべての質問で2番目を選択し、テキストエリアを埋める
     */
    function answerQuestions() {
        try {
            const questions = document.querySelectorAll("#attend-send-form table tbody tr");
            questions.forEach((row) => {
                // ラジオボタンとチェックボックスの処理 (2番目を選択)
                const inputs = row.querySelectorAll("input[type='radio'], input[type='checkbox']");
                if (inputs.length > 1) {
                    (inputs[1] as HTMLInputElement).click();
                }

                // テキストエリアの処理 (空の場合のみ「特になし。」と記入)
                const textarea = row.querySelector("textarea.answer-form") as HTMLTextAreaElement;
                if (textarea && !textarea.value) {
                    textarea.value = "特になし。";
                }
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 送信と、それに伴う一連の確認ダイアログを処理する
     */
    function submitAndConfirm() {
        // ダイアログが表示されるのを監視し、自動でクリックする
        const dialogObserver = new MutationObserver((mutations, obs) => {
            // 1. 最初の確認ダイアログを探す (「はい」をクリック)
            const confirmYesButton = document.querySelector(".btn-common-confirm-modal-yes") as HTMLButtonElement;
            if (confirmYesButton && confirmYesButton.offsetParent !== null) {
                confirmYesButton.click();
            }

            // 2. 最終の完了ダイアログを探す (「OK」をクリック)
            const finalOkButton = document.querySelector("#btn-common-alert-modal-ok") as HTMLButtonElement;
            if (finalOkButton && finalOkButton.offsetParent !== null) {
                finalOkButton.click();
                obs.disconnect(); // 全ての処理が完了したので監視を停止
            }
        });

        // 監視を開始 (body全体の要素の追加・削除を監視)
        dialogObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // ページ最下部にある目印の要素を取得
        const endline = document.querySelector("#endline");
        if (endline) {
            // その目印が表示されるまでスクロール
            endline.scrollIntoView({ behavior: "smooth" });
        }

        // スクロール処理とボタンの有効化を待つために少し遅延させる
        setTimeout(() => {
            const submitButton = document.querySelector(".attend-finish-button") as HTMLButtonElement;
            if (submitButton) {
                // ボタンが無効化されていた場合のために、強制的に有効化
                submitButton.disabled = false;
                submitButton.click();
            } else {
                dialogObserver.disconnect(); // 続行不可能なので監視を停止
            }
        }, 500); // 0.5秒待機
    }

    // --- メイン処理 ---
    // ページの読み込みが完了したら、回答と送信のプロセスを開始する
    if (document.readyState === "complete") {
        if (answerQuestions()) {
            submitAndConfirm();
        }
    } else {
        window.addEventListener("load", () => {
            if (answerQuestions()) {
                submitAndConfirm();
            }
        });
    }
}

manaboAutoPoll();
