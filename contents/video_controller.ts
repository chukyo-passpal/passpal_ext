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

    //操作フィードバック用のSVGアイコン集
    const ICONS = {
        play: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M320-200v-560l440 280-440 280Z"/></svg>',
        pause: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/></svg>',
        forward:
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/></svg>',
        rewind: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/></svg>',
        volumeUp:
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>',
        volumeDown:
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-360v-240h160l200-200v640L360-360H200Zm440 40v-322q45 21 72.5 65t27.5 97q0 53-27.5 96T640-320ZM480-606l-86 86H280v80h114l86 86v-252ZM380-480Z"/></svg>',
        volumeMute:
            '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/></svg>',
        // ★追加: PiP用のアイコン
        pip: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z"/></svg>',
    };

    // --- 2. スタイルの定義と注入 ---
    document.head.appendChild(
        Object.assign(document.createElement("style"), {
            textContent: `
      .v-ctrl-wrap { position: relative; }
      
      .v-ctrl-ui {
        position: absolute; top: 10px; z-index: 2147483647;
        display: flex; gap: 5px; align-items: center;
      }
      .v-ctrl-speed { left: 10px; }
      .v-ctrl-pip { right: 10px; }
      
      .v-ctrl-ui button, .v-ctrl-rate-display {
        background: rgba(0, 0, 0, 0.5); 
        color: white; border: 1px solid #fff8;
        border-radius: 4px; cursor: pointer; font-weight: bold;
        font-size: 14px; padding: 4px 8px; font-family: monospace;
        transition: background-color 0.1s ease;
        display: flex; /* ★追加: アイコンを中央に配置するため */
        align-items: center; /* ★追加: アイコンを中央に配置するため */
        justify-content: center; /* ★追加: アイコンを中央に配置するため */
      }
      
      .v-ctrl-ui button:hover, .v-ctrl-rate-display:hover {
        background-color: rgba(0, 123, 255, 0.5);
      }
      
      .v-ctrl-ui button.v-ctrl-highlight {
        background-color: rgba(0, 123, 255, 0.5);
      }
      
      .v-ctrl-rate-display { cursor: text; }
      .v-ctrl-rate-display:focus { outline: 2px solid #007bff; }
      .v-ctrl-pip button.active { background: #d9534f; border-color: #d43f3a; }

      .v-ctrl-wrap:fullscreen {
        background-color: black; display: flex;
        align-items: center; justify-content: center;
      }
      .v-ctrl-wrap:fullscreen video {
        width: 100%; height: 100%; object-fit: contain;
      }

      
      .v-ctrl-feedback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.3);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 20px;
        font-family: sans-serif;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
        pointer-events: none;
        z-index: 2147483647;
      }
      .v-ctrl-feedback.v-ctrl-show {
        opacity: 1;
        visibility: visible;
      }
      .v-ctrl-feedback svg {
          width: 32px;
          height: 32px;
          fill: white;
      }
      
    `,
        })
    );

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

    // ★追加: フィードバック表示用の関数
    const showFeedback = (videoWrapper: Element | null, icon: string, text: string = ""): void => {
        if (!videoWrapper) return;
        const feedbackDisplay = videoWrapper.querySelector(".v-ctrl-feedback");
        if (!feedbackDisplay) return;

        feedbackDisplay.innerHTML = `${icon}${text ? `<span>${text}</span>` : ""}`;
        feedbackDisplay.classList.add("v-ctrl-show");

        if (feedbackTimeout) clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => {
            feedbackDisplay.classList.remove("v-ctrl-show");
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

    // --- 4. UIの初期化 ---
    function initializeVideoControls(video: HTMLVideoElement): void {
        if (video.hasAttribute(INITIALIZED_ATTR) || !video.parentElement) return;

        const parent = video.parentElement;
        parent.classList.add("v-ctrl-wrap");

        parent.setAttribute("tabindex", "-1");
        parent.style.outline = "none";

        // ★追加: フィードバック表示用の要素を作成して追加
        const feedbackDisplay = Object.assign(document.createElement("div"), {
            className: "v-ctrl-feedback",
        });
        parent.appendChild(feedbackDisplay);

        parent.addEventListener("click", () => setFocusedVideo(video));

        video.addEventListener("play", () => {
            setFocusedVideo(video);
        });

        const createUIContainer = (className: string, elements: HTMLElement[]): HTMLDivElement => {
            const div = Object.assign(document.createElement("div"), {
                className: `v-ctrl-ui ${className}`,
            });
            elements.forEach((el: HTMLElement) => div.appendChild(el));
            return div;
        };

        const setPlaybackRate = (rate: number | string): void => {
            video.playbackRate = clamp(parseFloat(String(rate)) || 1.0, MIN_RATE, MAX_RATE);
        };

        const speedDisplay = Object.assign(document.createElement("span"), {
            className: "v-ctrl-rate-display",
            title: "クリックして速度を直接入力",
        });
        const updateSpeedDisplay = () => {
            if (document.activeElement !== speedDisplay) {
                speedDisplay.textContent = video.playbackRate.toFixed(2) + "x";
            }
        };
        speedDisplay.onclick = (e) => {
            e.stopPropagation();
            speedDisplay.contentEditable = "true";
            speedDisplay.focus();
            document.execCommand("selectAll", false, undefined);
        };
        speedDisplay.addEventListener("blur", () => {
            speedDisplay.contentEditable = "false";
            setPlaybackRate(speedDisplay.textContent);
            updateSpeedDisplay();
        });
        speedDisplay.addEventListener("keydown", (e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
                e.preventDefault();
                speedDisplay.blur();
            } else if (e.key === "Escape") {
                speedDisplay.blur();
                updateSpeedDisplay();
            }
        });

        const decreaseBtn = Object.assign(document.createElement("button"), {
            textContent: "-",
        });
        decreaseBtn.dataset.vctrl = "s";
        decreaseBtn.onclick = (e) => {
            e.stopPropagation();
            setPlaybackRate(video.playbackRate - RATE_STEP);
        };

        const increaseBtn = Object.assign(document.createElement("button"), {
            textContent: "+",
        });
        increaseBtn.dataset.vctrl = "d";
        increaseBtn.onclick = (e) => {
            e.stopPropagation();
            setPlaybackRate(video.playbackRate + RATE_STEP);
        };

        const speedControls = createUIContainer("v-ctrl-speed", [decreaseBtn, speedDisplay, increaseBtn]);
        video.addEventListener("ratechange", updateSpeedDisplay);
        updateSpeedDisplay();

        let pipControl = null;
        if (document.pictureInPictureEnabled) {
            const pipButton = Object.assign(document.createElement("button"), {
                // ★変更: textContent の代わりに innerHTML を使用
                innerHTML: ICONS.pip,
                onclick: async (e: Event) => {
                    e.stopPropagation();
                    try {
                        await (document.pictureInPictureElement === video ? document.exitPictureInPicture() : video.requestPictureInPicture());
                    } catch (err) {
                        console.error("PiP Error:", err);
                    }
                },
            });
            pipButton.dataset.vctrl = "p";

            pipControl = createUIContainer("v-ctrl-pip", [pipButton]);

            // ★変更: ボタンのテキスト更新を、ツールチップの更新に変更
            const updatePipButton = () => {
                const isPiP = document.pictureInPictureElement === video;
                pipButton.classList.toggle("active", isPiP);
                pipButton.title = isPiP ? "ピクチャーインピクチャーを終了 (p)" : "ピクチャーインピクチャー (p)";
            };
            video.addEventListener("enterpictureinpicture", updatePipButton);
            video.addEventListener("leavepictureinpicture", updatePipButton);
            updatePipButton();
        }

        if (speedControls) parent.appendChild(speedControls);
        if (pipControl) parent.appendChild(pipControl);

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
