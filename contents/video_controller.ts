/**
 * Webページ上のHTML5ビデオ要素にカスタムコントロール機能を追加します。
 *
 * 主な機能:
 * - 再生速度の柔軟な変更（ボタン、直接入力）
 * - 豊富なキーボードショートカット
 * - ショートカット操作時の視覚的フィードバック表示
 * - フルスクリーン表示の最適化と操作性の向上
 * - フルスクリーン解除後のスクロール位置復元
 * - 複数動画利用時のアクティブ動画フォーカス機能
 */

/**
 * ビデオ制御機能を管理するメインクラス
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { VideoSpeedControls, VideoPiPControls, VideoFeedback, ICONS } from "./components/VideoControls";
import { VIDEO_CONFIG } from "./utils/constants";
import { VideoFeedbackManager } from "./utils/video/videoFeedback";
import { VideoKeyboardHandler } from "./utils/video/VideoKeyboardHandler";

export class VideoControllerClass {
    private focusedVideo: HTMLVideoElement | null = null;
    private savedScrollPosition = { x: 0, y: 0 };
    private feedbackManager: VideoFeedbackManager;
    private keyboardHandler: VideoKeyboardHandler;
    private observer: MutationObserver | null = null;

    constructor() {
        this.feedbackManager = new VideoFeedbackManager();
        this.keyboardHandler = new VideoKeyboardHandler(this.feedbackManager);
        this.initialize();
    }

    /**
     * 初期化
     */
    private initialize(): void {
        this.setupEventListeners();
        this.setupMutationObserver();
        this.initializeExistingVideos();
    }

    /**
     * イベントリスナーの設定
     */
    private setupEventListeners(): void {
        // フルスクリーン変更の監視
        document.addEventListener("fullscreenchange", this.handleFullscreenChange.bind(this));

        // キーボードショートカット
        document.addEventListener("keydown", this.handleKeydown.bind(this), true);
    }

    /**
     * フルスクリーン変更処理
     */
    private handleFullscreenChange(): void {
        const fsElement = document.fullscreenElement;
        if (fsElement) {
            if (typeof (fsElement as any).focus === "function") {
                (fsElement as any).focus({ preventScroll: true });
            }
        } else {
            window.scrollTo(this.savedScrollPosition.x, this.savedScrollPosition.y);
            if (this.focusedVideo && this.focusedVideo.parentElement) {
                this.focusedVideo.parentElement.focus({ preventScroll: true });
            }
        }
    }

    /**
     * キーボードイベント処理
     */
    private handleKeydown(e: KeyboardEvent): void {
        const activeEl = document.activeElement;

        // 入力フィールドでは処理しない
        if (
            e.ctrlKey ||
            e.metaKey ||
            e.altKey ||
            (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || (activeEl as any).isContentEditable))
        ) {
            return;
        }

        const targetVideo = this.getTargetVideo();
        if (!targetVideo) return;

        const wrapper = targetVideo.parentElement;
        if (!wrapper || !wrapper.classList.contains(VIDEO_CONFIG.CLASSES.WRAP)) return;

        const handled = this.keyboardHandler.handleKeydown(e, targetVideo, wrapper, this.savedScrollPosition);

        if (handled) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    /**
     * 対象ビデオを取得
     */
    private getTargetVideo(): HTMLVideoElement | null {
        // フォーカスされたビデオがあればそれを使用
        if (this.focusedVideo && document.contains(this.focusedVideo)) {
            return this.focusedVideo;
        }

        const allVideos = Array.from(document.querySelectorAll(`video[${VIDEO_CONFIG.INITIALIZED_ATTR}]`)) as HTMLVideoElement[];

        // フルスクリーン中のビデオを優先
        const fsElement = document.fullscreenElement;
        if (fsElement) {
            const fsVideo = fsElement.matches("video") ? (fsElement as HTMLVideoElement) : (fsElement.querySelector("video") as HTMLVideoElement);
            if (fsVideo) return fsVideo;
        }

        // 再生中のビデオを優先
        const playingVideo = allVideos.find((v) => !v.paused);
        if (playingVideo) return playingVideo;

        // 最初のビデオをフォールバック
        if (allVideos.length > 0) {
            const firstVideo = allVideos[0];
            this.setFocusedVideo(firstVideo);
            return firstVideo;
        }

        return null;
    }

    /**
     * フォーカスビデオを設定
     */
    private setFocusedVideo(video: HTMLVideoElement | null): void {
        if (!video || !document.contains(video)) return;

        // 既存のフォーカスを削除
        document.querySelectorAll(`.${VIDEO_CONFIG.CLASSES.FOCUSED}`).forEach((el) => {
            el.classList.remove(VIDEO_CONFIG.CLASSES.FOCUSED);
        });

        this.focusedVideo = video;

        if (this.focusedVideo && this.focusedVideo.parentElement) {
            const parentWrap = this.focusedVideo.parentElement;
            parentWrap.classList.add(VIDEO_CONFIG.CLASSES.FOCUSED);
            parentWrap.focus({ preventScroll: true });
        }
    }

    /**
     * ビデオコントロールの初期化処理
     */
    private initializeVideoControls(video: HTMLVideoElement): void {
        if (video.hasAttribute(VIDEO_CONFIG.INITIALIZED_ATTR) || !video.parentElement) {
            return;
        }

        const parent = video.parentElement;
        parent.classList.add(VIDEO_CONFIG.CLASSES.WRAP);
        parent.setAttribute("tabindex", "-1");
        parent.style.outline = "none";

        // フィードバック表示コンテナ
        this.createFeedbackContainer(parent);

        // スピードコントロール
        this.createSpeedControls(parent, video);

        // PiPコントロール
        if (document.pictureInPictureEnabled) {
            this.createPiPControls(parent, video);
        }

        // イベントリスナー
        parent.addEventListener("click", () => this.setFocusedVideo(video));
        video.addEventListener("play", () => this.setFocusedVideo(video));

        video.setAttribute(VIDEO_CONFIG.INITIALIZED_ATTR, "true");
    }

    /**
     * フィードバックコンテナの作成
     */
    private createFeedbackContainer(parent: Element): void {
        const feedbackContainer = document.createElement("div");
        feedbackContainer.className = VIDEO_CONFIG.CLASSES.FEEDBACK_CONTAINER;
        parent.appendChild(feedbackContainer);

        const feedbackRoot = createRoot(feedbackContainer);
        (feedbackContainer as any).__reactRoot = feedbackRoot;

        feedbackRoot.render(
            React.createElement(VideoFeedback, {
                isVisible: false,
                icon: ICONS.play,
                text: "",
            })
        );
    }

    /**
     * スピードコントロールの作成
     */
    private createSpeedControls(parent: Element, video: HTMLVideoElement): void {
        const speedContainer = document.createElement("div");
        speedContainer.className = VIDEO_CONFIG.CLASSES.SPEED_CONTAINER;
        parent.appendChild(speedContainer);

        const speedRoot = createRoot(speedContainer);
        speedRoot.render(React.createElement(VideoSpeedControls, { video: video }));
    }

    /**
     * PiPコントロールの作成
     */
    private createPiPControls(parent: Element, video: HTMLVideoElement): void {
        const pipContainer = document.createElement("div");
        pipContainer.className = VIDEO_CONFIG.CLASSES.PIP_CONTAINER;
        parent.appendChild(pipContainer);

        const pipRoot = createRoot(pipContainer);
        pipRoot.render(React.createElement(VideoPiPControls, { video: video }));
    }

    /**
     * ビデオのセットアップ
     */
    private setupVideo(video: HTMLVideoElement): void {
        if (video.readyState > 0) {
            this.initializeVideoControls(video);
        } else {
            video.addEventListener("loadedmetadata", () => this.initializeVideoControls(video), { once: true });
        }
    }

    /**
     * MutationObserverの設定
     */
    private setupMutationObserver(): void {
        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        const element = node as Element;
                        const videos = element.matches("video") ? [element] : element.querySelectorAll(`video:not([${VIDEO_CONFIG.INITIALIZED_ATTR}])`);

                        videos.forEach((video) => this.setupVideo(video as HTMLVideoElement));
                    }
                }

                if (mutation.type === "attributes" && mutation.attributeName === VIDEO_CONFIG.INITIALIZED_ATTR) {
                    const video = mutation.target as Element;
                    if (video.matches("video") && video.getAttribute(VIDEO_CONFIG.INITIALIZED_ATTR) === "true") {
                        this.setFocusedVideo(video as HTMLVideoElement);
                    }
                }
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [VIDEO_CONFIG.INITIALIZED_ATTR],
        });
    }

    /**
     * 既存のビデオを初期化
     */
    private initializeExistingVideos(): void {
        document.querySelectorAll(`video:not([${VIDEO_CONFIG.INITIALIZED_ATTR}])`).forEach((video) => this.setupVideo(video as HTMLVideoElement));
    }

    /**
     * クリーンアップ
     */
    destroy(): void {
        this.feedbackManager.destroy();

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // イベントリスナーを削除（実装時はより詳細な管理が必要）
        document.removeEventListener("fullscreenchange", this.handleFullscreenChange);
        document.removeEventListener("keydown", this.handleKeydown);
    }
}

window.addEventListener("load", async () => {
    new VideoControllerClass();
});
