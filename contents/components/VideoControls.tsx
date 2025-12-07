import React, { useState, useEffect, useRef } from "react";

interface VideoControlsProps {
    video: HTMLVideoElement;
    onRateChange?: (rate: number) => void;
    onPlayPause?: (isPlaying: boolean) => void;
}

const ICONS = {
    play: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M320-200v-560l440 280-440 280Z" />
        </svg>
    ),
    pause: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
        </svg>
    ),
    forward: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z" />
        </svg>
    ),
    rewind: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z" />
        </svg>
    ),
    volumeUp: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
        </svg>
    ),
    volumeDown: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M200-360v-240h160l200-200v640L360-360H200Zm440 40v-322q45 21 72.5 65t27.5 97q0 53-27.5 96T640-320ZM480-606l-86 86H280v80h114l86 86v-252ZM380-480Z" />
        </svg>
    ),
    volumeMute: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
        </svg>
    ),
    pip: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
            <path d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z" />
        </svg>
    ),
};

const MIN_RATE = 0.25;
const MAX_RATE = 16.0;
const RATE_STEP = 0.25;

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const VideoSpeedControls: React.FC<{ video: HTMLVideoElement }> = ({ video }) => {
    const [playbackRate, setPlaybackRate] = useState(video.playbackRate);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const inputRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const handleRateChange = () => {
            setPlaybackRate(video.playbackRate);
        };

        video.addEventListener("ratechange", handleRateChange);
        return () => video.removeEventListener("ratechange", handleRateChange);
    }, [video]);

    const updatePlaybackRate = (rate: number) => {
        const clampedRate = clamp(rate, MIN_RATE, MAX_RATE);
        video.playbackRate = clampedRate;
        setPlaybackRate(clampedRate);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        updatePlaybackRate(playbackRate - RATE_STEP);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        updatePlaybackRate(playbackRate + RATE_STEP);
    };

    const handleDisplayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setEditValue(playbackRate.toFixed(2));
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(inputRef.current);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
        }, 0);
    };

    const handleDisplayBlur = () => {
        setIsEditing(false);
        const newRate = parseFloat(editValue) || playbackRate;
        updatePlaybackRate(newRate);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === "Enter") {
            e.preventDefault();
            handleDisplayBlur();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setEditValue(playbackRate.toFixed(2));
        }
    };

    return (
        <div className="v-ctrl-ui v-ctrl-speed">
            <button data-vctrl="s" onClick={handleDecrease}>
                -
            </button>
            <span
                ref={inputRef}
                className="v-ctrl-rate-display"
                title="クリックして速度を直接入力"
                onClick={handleDisplayClick}
                onBlur={handleDisplayBlur}
                onKeyDown={handleKeyDown}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
            >
                {isEditing ? editValue : `${playbackRate.toFixed(2)}x`}
            </span>
            <button data-vctrl="d" onClick={handleIncrease}>
                +
            </button>
        </div>
    );
};

export const VideoPiPControls: React.FC<{ video: HTMLVideoElement }> = ({ video }) => {
    const [isPiP, setIsPiP] = useState(false);

    useEffect(() => {
        const handleEnterPiP = () => setIsPiP(true);
        const handleLeavePiP = () => setIsPiP(false);

        video.addEventListener("enterpictureinpicture", handleEnterPiP);
        video.addEventListener("leavepictureinpicture", handleLeavePiP);

        // Initial state
        setIsPiP(document.pictureInPictureElement === video);

        return () => {
            video.removeEventListener("enterpictureinpicture", handleEnterPiP);
            video.removeEventListener("leavepictureinpicture", handleLeavePiP);
        };
    }, [video]);

    const handlePiPToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (document.pictureInPictureElement === video) {
                await document.exitPictureInPicture();
            } else {
                await video.requestPictureInPicture();
            }
        } catch (err) {
            console.error("PiP Error:", err);
        }
    };

    if (!document.pictureInPictureEnabled) {
        return null;
    }

    return (
        <div className="v-ctrl-ui v-ctrl-pip">
            <button
                data-vctrl="p"
                className={isPiP ? "active" : ""}
                title={isPiP ? "ピクチャーインピクチャーを終了 (p)" : "ピクチャーインピクチャー (p)"}
                onClick={handlePiPToggle}
            >
                {ICONS.pip}
            </button>
        </div>
    );
};

export const VideoFeedback: React.FC<{
    isVisible: boolean;
    icon: React.ReactNode;
    text?: string;
}> = ({ isVisible, icon, text }) => {
    return (
        <div className={`v-ctrl-feedback ${isVisible ? "v-ctrl-show" : ""}`}>
            {icon}
            {text && <span>{text}</span>}
        </div>
    );
};

export const VideoControls: React.FC<VideoControlsProps> = ({ video }) => {
    return (
        <>
            <VideoSpeedControls video={video} />
            <VideoPiPControls video={video} />
        </>
    );
};

export { ICONS };
export default VideoControls;
