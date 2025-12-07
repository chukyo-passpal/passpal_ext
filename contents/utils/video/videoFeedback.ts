/**
 * ビデオフィードバック表示機能
 */

import React from "react";
import { VideoFeedback, ICONS } from "../../components/VideoControls";
import { VIDEO_CONFIG } from "../constants";

export class VideoFeedbackManager {
    private feedbackTimeout: NodeJS.Timeout | null = null;

    /**
     * フィードバックを表示
     */
    showFeedback(videoWrapper: Element | null, icon: React.ReactNode, text: string = ""): void {
        if (!videoWrapper) return;

        const feedbackContainer = videoWrapper.querySelector(`.${VIDEO_CONFIG.CLASSES.FEEDBACK_CONTAINER}`);
        if (!feedbackContainer) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const root = (feedbackContainer as any).__reactRoot;
        if (!root) return;

        root.render(
            React.createElement(VideoFeedback, {
                isVisible: true,
                icon: icon,
                text: text,
            })
        );

        if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
        this.feedbackTimeout = setTimeout(() => {
            root.render(
                React.createElement(VideoFeedback, {
                    isVisible: false,
                    icon: icon,
                    text: text,
                })
            );
        }, VIDEO_CONFIG.FEEDBACK_DISPLAY_DURATION);
    }

    /**
     * ボタンハイライト表示
     */
    highlightButton(videoWrapper: Element | null, key: string): void {
        if (!videoWrapper) return;

        const button = videoWrapper.querySelector(`[data-vctrl="${key}"]`) as HTMLElement;
        if (!button) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((button as any).highlightTimeout) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clearTimeout((button as any).highlightTimeout);
        }

        button.classList.add(VIDEO_CONFIG.CLASSES.HIGHLIGHT);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (button as any).highlightTimeout = setTimeout(() => {
            button.classList.remove(VIDEO_CONFIG.CLASSES.HIGHLIGHT);
        }, VIDEO_CONFIG.BUTTON_HIGHLIGHT_DURATION);
    }

    /**
     * クリーンアップ
     */
    destroy(): void {
        if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
            this.feedbackTimeout = null;
        }
    }
}

export { ICONS };
