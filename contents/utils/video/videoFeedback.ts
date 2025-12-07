/**
 * ビデオフィードバック表示機能
 */

import React from "react";
import { VideoFeedback, ICONS } from "../../components/VideoControls";
import { VIDEO_CONFIG } from "../constants";
import type { FeedbackContainer, HighlightableButton } from "../../types/PowerfulSyusseki";

export class VideoFeedbackManager {
    private feedbackTimeout: NodeJS.Timeout | null = null;

    /**
     * フィードバックを表示
     */
    showFeedback(videoWrapper: Element | null, icon: React.ReactNode, text: string = ""): void {
        if (!videoWrapper) return;

        const feedbackContainer = videoWrapper.querySelector(`.${VIDEO_CONFIG.CLASSES.FEEDBACK_CONTAINER}`);
        if (!feedbackContainer) return;

        const root = (feedbackContainer as FeedbackContainer).__reactRoot;
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

        const button = videoWrapper.querySelector(`[data-vctrl="${key}"]`) as HighlightableButton;
        if (!button) return;

        if (button.highlightTimeout) {
            clearTimeout(button.highlightTimeout);
        }

        button.classList.add(VIDEO_CONFIG.CLASSES.HIGHLIGHT);

        button.highlightTimeout = setTimeout(() => {
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
