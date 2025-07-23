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
