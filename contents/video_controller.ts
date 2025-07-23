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

import React from "react";
import { createRoot } from "react-dom/client";
import { VideoSpeedControls, VideoPiPControls, VideoFeedback, ICONS } from "./components/VideoControls";

export default function videoController() {
    // --- 1. グローバル設定と状態管理 ---
    const MIN_RATE = 0.25;
    const MAX_RATE = 16.0;
    const RATE_STEP = 0.25;
    const INITIALIZED_ATTR = "data-v-ctrl-init";

    /** @type {HTMLVideoElement | null} */
    let focusedVideo: HTMLVideoElement | null = null;
    let savedScrollX = 0;
    let savedScrollY = 0;
    let feedbackTimeout: NodeJS.Timeout | null = null;

    // 注意: これらはReactコンポーネントのICONSと同期する必要があります

    // --- 3. ヘルパー関数 ---
    const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

    const setFocusedVideo = (newVideo: HTMLVideoElement | null): void => {
        if (!newVideo || !document.contains(newVideo)) return;
        document.querySelectorAll(".v-ctrl-wrap.v-ctrl-focused").forEach((el) => {
            el.classList.remove("v-ctrl-focused");
        });
        focusedVideo = newVideo;
        if (focusedVideo && focusedVideo.parentElement) {
            const parentWrap = focusedVideo.parentElement;
            parentWrap.classList.add("v-ctrl-focused");
            parentWrap.focus({ preventScroll: true });
        }
    };

    const highlightButtonByKey = (videoWrapper: Element | null, key: string): void => {
        if (!videoWrapper) return;
        const button = videoWrapper.querySelector(`[data-vctrl="${key}"]`) as HTMLElement;
        if (button) {
            if ((button as any).highlightTimeout) clearTimeout((button as any).highlightTimeout);

            button.classList.add("v-ctrl-highlight");

            (button as any).highlightTimeout = setTimeout(() => {
                button.classList.remove("v-ctrl-highlight");
            }, 200);
        }
    };

    // ★追加: フィードバック表示用の関数（React版）
    const showFeedback = (videoWrapper: Element | null, icon: React.ReactNode, text: string = ""): void => {
        if (!videoWrapper) return;
        const feedbackContainer = videoWrapper.querySelector(".v-ctrl-feedback-container");
        if (!feedbackContainer) return;

        const root = (feedbackContainer as any).__reactRoot;
        if (!root) return;

        root.render(
            React.createElement(VideoFeedback, {
                isVisible: true,
                icon: icon,
                text: text,
            })
        );

        if (feedbackTimeout) clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => {
            root.render(
                React.createElement(VideoFeedback, {
                    isVisible: false,
                    icon: icon,
                    text: text,
                })
            );
        }, 250);
    };

    document.addEventListener("fullscreenchange", () => {
        const fsElement = document.fullscreenElement;
        if (fsElement) {
            if (typeof (fsElement as any).focus === "function") {
                (fsElement as any).focus({ preventScroll: true });
            }
        } else {
            window.scrollTo(savedScrollX, savedScrollY);
            if (focusedVideo && focusedVideo.parentElement) {
                focusedVideo.parentElement.focus({ preventScroll: true });
            }
        }
    });

    // --- 4. UIの初期化（React版） ---
    function initializeVideoControls(video: HTMLVideoElement): void {
        if (video.hasAttribute(INITIALIZED_ATTR) || !video.parentElement) return;

        const parent = video.parentElement;
        parent.classList.add("v-ctrl-wrap");

        parent.setAttribute("tabindex", "-1");
        parent.style.outline = "none";

        // フィードバック表示用のコンテナを作成
        const feedbackContainer = document.createElement("div");
        feedbackContainer.className = "v-ctrl-feedback-container";
        parent.appendChild(feedbackContainer);

        // Reactコンポーネントをレンダリング
        const feedbackRoot = createRoot(feedbackContainer);
        (feedbackContainer as any).__reactRoot = feedbackRoot;

        // 初期状態のフィードバックをレンダリング
        feedbackRoot.render(
            React.createElement(VideoFeedback, {
                isVisible: false,
                icon: ICONS.play,
                text: "",
            })
        );

        // スピードコントロール用のコンテナを作成
        const speedContainer = document.createElement("div");
        speedContainer.className = "v-ctrl-speed-container";
        parent.appendChild(speedContainer);

        const speedRoot = createRoot(speedContainer);
        speedRoot.render(React.createElement(VideoSpeedControls, { video: video }));

        // PiPコントロール用のコンテナを作成
        if (document.pictureInPictureEnabled) {
            const pipContainer = document.createElement("div");
            pipContainer.className = "v-ctrl-pip-container";
            parent.appendChild(pipContainer);

            const pipRoot = createRoot(pipContainer);
            pipRoot.render(React.createElement(VideoPiPControls, { video: video }));
        }

        parent.addEventListener("click", () => setFocusedVideo(video));

        video.addEventListener("play", () => {
            setFocusedVideo(video);
        });

        video.setAttribute(INITIALIZED_ATTR, "true");
    }

    // --- 5. キーボードショートカット ---
    document.addEventListener(
        "keydown",
        (e) => {
            const activeEl = document.activeElement;
            if (
                e.ctrlKey ||
                e.metaKey ||
                e.altKey ||
                (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || (activeEl as any).isContentEditable))
            ) {
                return;
            }

            let targetVideo: HTMLVideoElement | null = null;
            if (focusedVideo && document.contains(focusedVideo)) {
                targetVideo = focusedVideo;
            } else {
                const allVideos = Array.from(document.querySelectorAll(`video[${INITIALIZED_ATTR}]`)) as HTMLVideoElement[];
                const fsElement = document.fullscreenElement;
                if (fsElement) {
                    targetVideo = (fsElement as Element).matches("video")
                        ? (fsElement as HTMLVideoElement)
                        : ((fsElement as Element).querySelector("video") as HTMLVideoElement);
                }
                if (!targetVideo) {
                    targetVideo = allVideos.find((v) => !v.paused) || null;
                }
                if (!targetVideo && allVideos.length > 0) {
                    targetVideo = allVideos[0];
                    if (targetVideo) setFocusedVideo(targetVideo);
                }
            }

            if (!targetVideo) return;

            const wrap = targetVideo.parentElement;
            // ★修正: wrapが存在しない場合は何もしない
            if (!wrap || !wrap.classList.contains("v-ctrl-wrap")) return;

            let handled = true;
            const setRate = (rate: number) => (targetVideo!.playbackRate = clamp(rate, MIN_RATE, MAX_RATE));

            switch (e.key.toLowerCase()) {
                case "j":
                    targetVideo.currentTime = Math.max(0, targetVideo.currentTime - 10);
                    showFeedback(wrap, ICONS.rewind, "10s");
                    break;
                case "l":
                    targetVideo.currentTime = Math.min(targetVideo.duration, targetVideo.currentTime + 10);
                    showFeedback(wrap, ICONS.forward, "10s");
                    break;
                case " ":
                case "k":
                    const isPaused = targetVideo.paused;
                    isPaused ? targetVideo.play() : targetVideo.pause();
                    showFeedback(wrap, isPaused ? ICONS.play : ICONS.pause);
                    break;
                case "s":
                case ",":
                    setRate(targetVideo.playbackRate - RATE_STEP);
                    highlightButtonByKey(wrap, "s");
                    showFeedback(wrap, "", `${targetVideo.playbackRate.toFixed(2)}x`);
                    break;
                case "d":
                case ".":
                    setRate(targetVideo.playbackRate + RATE_STEP);
                    highlightButtonByKey(wrap, "d");
                    showFeedback(wrap, "", `${targetVideo.playbackRate.toFixed(2)}x`);
                    break;
                case "arrowleft":
                    targetVideo.currentTime = Math.max(0, targetVideo.currentTime - 5);
                    showFeedback(wrap, ICONS.rewind, "5s");
                    break;
                case "arrowright":
                    targetVideo.currentTime = Math.min(targetVideo.duration, targetVideo.currentTime + 5);
                    showFeedback(wrap, ICONS.forward, "5s");
                    break;
                case "arrowup":
                    targetVideo.volume = clamp(targetVideo.volume + 0.1, 0, 1);
                    const upIcon = targetVideo.volume >= 0.5 ? ICONS.volumeUp : ICONS.volumeDown;
                    showFeedback(wrap, targetVideo.volume === 0 ? ICONS.volumeMute : upIcon, `${Math.round(targetVideo.volume * 100)}%`);
                    break;
                case "arrowdown":
                    targetVideo.volume = clamp(targetVideo.volume - 0.1, 0, 1);
                    const downIcon = targetVideo.volume >= 0.5 ? ICONS.volumeUp : ICONS.volumeDown;
                    showFeedback(wrap, targetVideo.volume === 0 ? ICONS.volumeMute : downIcon, `${Math.round(targetVideo.volume * 100)}%`);
                    break;
                case "m":
                    targetVideo.muted = !targetVideo.muted;
                    if (targetVideo.muted) {
                        showFeedback(wrap, ICONS.volumeMute);
                    } else {
                        const currentVolumeIcon = targetVideo.volume >= 0.5 ? ICONS.volumeUp : ICONS.volumeDown;
                        showFeedback(wrap, targetVideo.volume === 0 ? ICONS.volumeMute : currentVolumeIcon, `${Math.round(targetVideo.volume * 100)}%`);
                    }
                    break;
                case "p":
                    if (document.pictureInPictureEnabled) {
                        (async () => {
                            try {
                                await (document.pictureInPictureElement === targetVideo
                                    ? document.exitPictureInPicture()
                                    : targetVideo.requestPictureInPicture());
                            } catch (err) {
                                console.error("PiPの切り替えに失敗しました:", err);
                            }
                        })();
                        highlightButtonByKey(wrap, "p");
                    }
                    break;
                case "f":
                    if (!document.fullscreenElement) {
                        savedScrollX = window.scrollX;
                        savedScrollY = window.scrollY;
                        if (wrap && wrap.classList.contains("v-ctrl-wrap")) {
                            wrap.requestFullscreen().catch((err) => console.error("Fullscreen request failed:", err));
                        } else {
                            targetVideo.requestFullscreen().catch((err) => console.error("Fullscreen request failed:", err));
                        }
                    } else {
                        document.exitFullscreen();
                    }
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
                    if (targetVideo.duration) {
                        const seekTime = targetVideo.duration * (parseInt(e.key) / 10);
                        targetVideo.currentTime = seekTime;
                        showFeedback(wrap, "", `${parseInt(e.key) * 10}%`);
                    }
                    break;
                default:
                    handled = false;
                    break;
            }

            if (handled) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        true
    );

    // --- 6. ページ上のビデオの監視とセットアップ ---
    const setupVideo = (video: HTMLVideoElement) => {
        if (video.readyState > 0) {
            initializeVideoControls(video);
        } else {
            video.addEventListener("loadedmetadata", () => initializeVideoControls(video), { once: true });
        }
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;
                    const element = node as Element;
                    const videos = element.matches("video") ? [element] : element.querySelectorAll(`video:not([${INITIALIZED_ATTR}])`);
                    videos.forEach((video) => setupVideo(video as HTMLVideoElement));
                }
            }
            if (mutation.type === "attributes" && mutation.attributeName === INITIALIZED_ATTR) {
                const video = mutation.target as Element;
                if (video.matches("video") && video.getAttribute(INITIALIZED_ATTR) === "true") {
                    setFocusedVideo(video as HTMLVideoElement);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [INITIALIZED_ATTR],
    });

    document.querySelectorAll(`video:not([${INITIALIZED_ATTR}])`).forEach((video) => setupVideo(video as HTMLVideoElement));
}

videoController();
