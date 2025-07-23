/**
 * ビデオのキーボードショートカット処理
 */

import { VIDEO_CONFIG } from "../constants";
import { VideoFeedbackManager, ICONS } from "./videoFeedback";

export class VideoKeyboardHandler {
    private feedbackManager: VideoFeedbackManager;

    constructor(feedbackManager: VideoFeedbackManager) {
        this.feedbackManager = feedbackManager;
    }

    /**
     * 数値を指定範囲内にクランプ
     */
    private clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * キーボードイベントを処理
     */
    handleKeydown(e: KeyboardEvent, targetVideo: HTMLVideoElement, videoWrapper: Element, savedScrollPosition: { x: number; y: number }): boolean {
        let handled = true;
        const setRate = (rate: number) => {
            targetVideo.playbackRate = this.clamp(rate, VIDEO_CONFIG.MIN_RATE, VIDEO_CONFIG.MAX_RATE);
        };

        switch (e.key.toLowerCase()) {
            case "j":
                targetVideo.currentTime = Math.max(0, targetVideo.currentTime - VIDEO_CONFIG.SEEK_LARGE);
                this.feedbackManager.showFeedback(videoWrapper, ICONS.rewind, `${VIDEO_CONFIG.SEEK_LARGE}s`);
                break;

            case "l":
                targetVideo.currentTime = Math.min(targetVideo.duration, targetVideo.currentTime + VIDEO_CONFIG.SEEK_LARGE);
                this.feedbackManager.showFeedback(videoWrapper, ICONS.forward, `${VIDEO_CONFIG.SEEK_LARGE}s`);
                break;

            case " ":
            case "k":
                const isPaused = targetVideo.paused;
                isPaused ? targetVideo.play() : targetVideo.pause();
                this.feedbackManager.showFeedback(videoWrapper, isPaused ? ICONS.play : ICONS.pause);
                break;

            case "s":
            case ",":
                setRate(targetVideo.playbackRate - VIDEO_CONFIG.RATE_STEP);
                this.feedbackManager.highlightButton(videoWrapper, "s");
                this.feedbackManager.showFeedback(videoWrapper, "", `${targetVideo.playbackRate.toFixed(2)}x`);
                break;

            case "d":
            case ".":
                setRate(targetVideo.playbackRate + VIDEO_CONFIG.RATE_STEP);
                this.feedbackManager.highlightButton(videoWrapper, "d");
                this.feedbackManager.showFeedback(videoWrapper, "", `${targetVideo.playbackRate.toFixed(2)}x`);
                break;

            case "arrowleft":
                targetVideo.currentTime = Math.max(0, targetVideo.currentTime - VIDEO_CONFIG.SEEK_SMALL);
                this.feedbackManager.showFeedback(videoWrapper, ICONS.rewind, `${VIDEO_CONFIG.SEEK_SMALL}s`);
                break;

            case "arrowright":
                targetVideo.currentTime = Math.min(targetVideo.duration, targetVideo.currentTime + VIDEO_CONFIG.SEEK_SMALL);
                this.feedbackManager.showFeedback(videoWrapper, ICONS.forward, `${VIDEO_CONFIG.SEEK_SMALL}s`);
                break;

            case "arrowup":
                targetVideo.volume = this.clamp(targetVideo.volume + VIDEO_CONFIG.VOLUME_STEP, 0, 1);
                this.showVolumePreference(targetVideo, videoWrapper);
                break;

            case "arrowdown":
                targetVideo.volume = this.clamp(targetVideo.volume - VIDEO_CONFIG.VOLUME_STEP, 0, 1);
                this.showVolumePreference(targetVideo, videoWrapper);
                break;

            case "m":
                targetVideo.muted = !targetVideo.muted;
                this.showVolumePreference(targetVideo, videoWrapper);
                break;

            case "p":
                if (document.pictureInPictureEnabled) {
                    this.handlePictureInPicture(targetVideo, videoWrapper);
                }
                break;

            case "f":
                this.handleFullscreen(targetVideo, videoWrapper, savedScrollPosition);
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.handleSeekToPercent(targetVideo, videoWrapper, parseInt(e.key));
                break;

            default:
                handled = false;
                break;
        }

        return handled;
    }

    /**
     * 音量フィードバック表示
     */
    private showVolumePreference(video: HTMLVideoElement, wrapper: Element): void {
        if (video.muted) {
            this.feedbackManager.showFeedback(wrapper, ICONS.volumeMute);
        } else {
            const volumeIcon = video.volume >= 0.5 ? ICONS.volumeUp : ICONS.volumeDown;
            const displayIcon = video.volume === 0 ? ICONS.volumeMute : volumeIcon;
            this.feedbackManager.showFeedback(wrapper, displayIcon, `${Math.round(video.volume * 100)}%`);
        }
    }

    /**
     * ピクチャインピクチャ処理
     */
    private async handlePictureInPicture(video: HTMLVideoElement, wrapper: Element): Promise<void> {
        try {
            await (document.pictureInPictureElement === video ? document.exitPictureInPicture() : video.requestPictureInPicture());
            this.feedbackManager.highlightButton(wrapper, "p");
        } catch (err) {
            console.error("PiPの切り替えに失敗しました:", err);
        }
    }

    /**
     * フルスクリーン処理
     */
    private handleFullscreen(video: HTMLVideoElement, wrapper: Element, savedScrollPosition: { x: number; y: number }): void {
        if (!document.fullscreenElement) {
            savedScrollPosition.x = window.scrollX;
            savedScrollPosition.y = window.scrollY;

            if (wrapper && wrapper.classList.contains(VIDEO_CONFIG.CLASSES.WRAP)) {
                wrapper.requestFullscreen().catch((err) => console.error("Fullscreen request failed:", err));
            } else {
                video.requestFullscreen().catch((err) => console.error("Fullscreen request failed:", err));
            }
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * パーセント位置へのシーク
     */
    private handleSeekToPercent(video: HTMLVideoElement, wrapper: Element, digit: number): void {
        if (video.duration) {
            const seekTime = video.duration * (digit / 10);
            video.currentTime = seekTime;
            this.feedbackManager.showFeedback(wrapper, "", `${digit * 10}%`);
        }
    }
}
