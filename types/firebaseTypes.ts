import type { UserCredential } from "firebase/auth";

// Firebase認証のトークンレスポンス
export interface TokenResponse {
    federatedId: string;
    providerId: string;
    email: string;
    emailVerified: boolean;
    firstName: string;
    fullName: string;
    lastName: string;
    photoUrl: string;
    localId: string;
    displayName: string;
    idToken: string;
    context: string;
    oauthAccessToken: string;
    oauthExpireIn: number;
    refreshToken: string;
    expiresIn: string;
    oauthIdToken: string;
    rawUserInfo: string; // JSON文字列
    kind: string;
}

export interface FirebaseAuthReponse extends UserCredential {
    _tokenResponse: TokenResponse;
}
