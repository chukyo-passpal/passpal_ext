// Firebase認証のプロバイダーデータ
export interface ProviderData {
	providerId: string;
	uid: string;
	displayName: string | null;
	email: string | null;
	phoneNumber: string | null;
	photoURL: string | null;
}

// STSトークンマネージャー
export interface StsTokenManager {
	refreshToken: string;
	accessToken: string;
	expirationTime: number;
}

// Firebase User情報
export interface FirebaseUser {
	uid: string;
	email: string | null;
	emailVerified: boolean;
	displayName: string | null;
	isAnonymous: boolean;
	photoURL: string | null;
	providerData: ProviderData[];
	stsTokenManager: StsTokenManager;
	createdAt: string;
	lastLoginAt: string;
	apiKey: string;
	appName: string;
}

// Google認証のRAWユーザー情報
export interface GoogleRawUserInfo {
	name: string;
	granted_scopes: string;
	id: string;
	verified_email: boolean;
	given_name: string;
	hd: string;
	family_name: string;
	email: string;
	picture: string;
}

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

// Firebase認証の完全なレスポンス
export interface FirebaseAuthResult {
	user: FirebaseUser;
	providerId: string;
	_tokenResponse: TokenResponse;
	operationType: "signIn" | "signUp";
}

// JWT ID Token のペイロード
export interface IdTokenPayload {
	name: string;
	picture: string;
	iss: string; // issuer
	aud: string; // audience
	auth_time: number;
	user_id: string;
	sub: string; // subject
	iat: number; // issued at
	exp: number; // expires
	email: string;
	email_verified: boolean;
	firebase: {
		identities: {
			"google.com": string[];
			email: string[];
		};
		sign_in_provider: string;
	};
}

// OAuth ID Token のペイロード（Googleから直接）
export interface OAuthIdTokenPayload {
	iss: string;
	azp: string;
	aud: string;
	sub: string;
	hd: string; // hosted domain
	email: string;
	email_verified: boolean;
	at_hash: string;
	iat: number;
	exp: number;
}

// API呼び出し用の簡略化されたユーザー情報
export interface AuthenticatedUser {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string;
	idToken: string;
	refreshToken: string;
}

// Chrome拡張機能で使用する認証レスポンス
export interface AuthResponse {
	success: boolean;
	user?: AuthenticatedUser;
	error?: string;
}

// APIリクエスト用のヘッダー作成ヘルパー
export interface AuthHeaders {
	Authorization: string;
	"Content-Type": string;
}

// Firebase認証エラー
export interface FirebaseError extends Error {
	code: string;
	message: string;
	name: "FirebaseError";
}

// 認証状態の管理用
export interface AuthState {
	isAuthenticated: boolean;
	user: AuthenticatedUser | null;
	loading: boolean;
	error: string | null;
}

// ヘルパー関数の型定義
export type CreateAuthHeaders = (idToken: string) => AuthHeaders;
export type ExtractUserInfo = (authResult: FirebaseAuthResult) => AuthenticatedUser;
export type IsTokenExpired = (token: string) => boolean;

// 使用例のための関数シグネチャ
export interface AuthService {
	signIn(): Promise<AuthResponse>;
	signOut(): Promise<void>;
	getCurrentUser(): AuthenticatedUser | null;
	getAuthHeaders(): Promise<AuthHeaders>;
	refreshToken(): Promise<string>;
}
