// Chrome Extension Message Types
export interface SignInMessage {
    type: "sign-in";
    loginHint?: string;
}

export interface FirebaseAuthMessage {
    type: "firebase-auth";
    target: "offscreen";
    loginHint?: string;
}

export type ChromeExtensionMessage = SignInMessage | FirebaseAuthMessage;

// Offscreen Document Message Types
export interface IframeMessage {
    initAuth: true;
    loginHint?: string;
}

export interface OffscreenMessage {
    target: "offscreen";
    loginHint?: string;
}

// Chrome Runtime Message Handler Types
export type MessageSender = chrome.runtime.MessageSender;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SendResponse = (response?: any) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler = (message: any, sender: MessageSender, sendResponse: SendResponse) => boolean | void;
