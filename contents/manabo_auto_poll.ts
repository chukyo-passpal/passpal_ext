// アンケートに自動回答し、カスタム確認ダイアログを含めて最後まで自動で送信します。

import { getSetting } from "./utils/settings";

export default function manaboAutoPoll() {
    const autoPollEnabled = getSetting("autoPollEnabled");

    if (!autoPollEnabled) {
        return;
    }
    /**
     * 回答ロジック：すべての質問で2番目を選択し、テキストエリアを埋める
     */
    function answerQuestions(): boolean {
        try {
            const questions = document.querySelectorAll<HTMLTableRowElement>("#attend-send-form table tbody tr");
            questions.forEach((row) => {
                // ラジオボタンとチェックボックスの処理 (2番目を選択)
                const inputs = Array.from(
                    row.querySelectorAll<HTMLInputElement>("input[type='radio'], input[type='checkbox']")
                );
                if (inputs.length > 1 && inputs[1]) {
                    inputs[1].click();
                }

                // テキストエリアの処理 (空の場合のみ「特になし。」と記入)
                const textarea = row.querySelector<HTMLTextAreaElement>("textarea.answer-form");
                if (textarea && !textarea.value) {
                    textarea.value = "特になし。";
                }
            });
            return true;
        } catch (error) {
            console.error("Failed to answer questions:", error);
            return false;
        }
    }

    /**
     * 送信と、それに伴う一連の確認ダイアログを処理する
     */
    function submitAndConfirm(): void {
        // ダイアログが表示されるのを監視し、自動でクリックする
        const dialogObserver = new MutationObserver((_mutations, obs) => {
            // 1. 最初の確認ダイアログを探す (「はい」をクリック)
            const confirmYesButton = document.querySelector<HTMLButtonElement>(".btn-common-confirm-modal-yes");
            if (confirmYesButton && confirmYesButton.offsetParent !== null) {
                confirmYesButton.click();
            }

            // 2. 最終の完了ダイアログを探す (「OK」をクリック)
            const finalOkButton = document.querySelector<HTMLButtonElement>("#btn-common-alert-modal-ok");
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
        const endline = document.querySelector<HTMLElement>("#endline");
        if (endline) {
            // その目印が表示されるまでスクロール
            endline.scrollIntoView({ behavior: "smooth" });
        }

        // スクロール処理とボタンの有効化を待つために少し遅延させる
        setTimeout(() => {
            const submitButton = document.querySelector<HTMLButtonElement>(".attend-finish-button");
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
