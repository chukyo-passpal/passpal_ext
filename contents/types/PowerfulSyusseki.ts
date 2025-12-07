import type { Root } from "react-dom/client";

export interface ButtonState {
    isLoading: boolean;
    detectMash: boolean;
}

export interface PowerfulSyussekiButtonProps {
    onButtonClick: () => void;
}

export interface ScriptInjectionOptions {
    filePath: string;
    tag: string;
}

export interface FeedbackContainer extends Element {
    __reactRoot?: Root;
}

export interface HighlightableButton extends HTMLElement {
    highlightTimeout?: NodeJS.Timeout;
}
