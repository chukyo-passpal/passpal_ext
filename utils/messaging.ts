import { defineExtensionMessaging } from "@webext-core/messaging";

import type { FirebaseAuthReponse } from "../types/firebaseTypes";

interface ProtocolMap {
    signIn: (data: { loginHint: string }) => FirebaseAuthReponse;
    firebaseAuth: (data: { loginHint: string }) => FirebaseAuthReponse;
    checkFirebaseAuth: () => boolean;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
