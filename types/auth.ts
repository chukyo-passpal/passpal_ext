// Firebase Authentication Types
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface FirebaseAuthResult {
  user: FirebaseUser;
  credential?: any;
  operationType?: string;
}

export interface FirebaseError {
  name: "FirebaseError";
  code: string;
  message: string;
}

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
export type SendResponse = (response?: any) => void;
export type MessageHandler = (
  message: any,
  sender: MessageSender,
  sendResponse: SendResponse
) => boolean | void;

// Auth Response Types
export type AuthResponse = FirebaseAuthResult | FirebaseError;