import type { SignInMessage } from "../../types/authMessage";
import type {
	FirebaseAuthResult,
	AuthenticatedUser,
	AuthHeaders,
	IdTokenPayload,
	AuthResponse,
	GoogleRawUserInfo,
	FirebaseError,
} from "../../types/firebaseTypes";

/**
 * Firebase認証結果から必要な情報を抽出
 */
export const extractUserInfo = (authResult: FirebaseAuthResult): AuthenticatedUser => {
	const { user, _tokenResponse } = authResult;

	return {
		uid: user.uid,
		email: user.email || "",
		displayName: user.displayName || "",
		photoURL: user.photoURL || "",
		idToken: _tokenResponse.idToken,
		refreshToken: _tokenResponse.refreshToken,
	};
};

/**
 * APIリクエスト用のAuthorizationヘッダーを作成
 */
export const createAuthHeaders = (idToken: string): AuthHeaders => {
	return {
		Authorization: `Bearer ${idToken}`,
		"Content-Type": "application/json",
	};
};

/**
 * JWTトークンの有効期限をチェック
 */
export const isTokenExpired = (token: string): boolean => {
	try {
		const payload = JSON.parse(atob(token.split(".")[1])) as IdTokenPayload;
		const currentTime = Math.floor(Date.now() / 1000);
		return payload.exp < currentTime;
	} catch {
		return true;
	}
};

/**
 * JWTトークンからペイロードを取得
 */
export const decodeIdToken = (idToken: string): IdTokenPayload | null => {
	try {
		const payload = JSON.parse(atob(idToken.split(".")[1])) as IdTokenPayload;
		return payload;
	} catch (error) {
		console.error("Failed to decode ID token:", error);
		return null;
	}
};

/**
 * RawUserInfo（JSON文字列）をパース
 */
export const parseRawUserInfo = (rawUserInfo: string): GoogleRawUserInfo | null => {
	try {
		return JSON.parse(rawUserInfo) as GoogleRawUserInfo;
	} catch (error) {
		console.error("Failed to parse raw user info:", error);
		return null;
	}
};

/**
 * Firebase認証レスポンスを Chrome拡張機能用のレスポンスに変換
 */
export const createAuthResponse = (authResult: FirebaseAuthResult): AuthResponse => {
	try {
		const user = extractUserInfo(authResult);
		return {
			success: true,
			user,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Authentication failed",
		};
	}
};

/**
 * 認証済みAPIリクエストを送信
 */
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {},
	idToken: string
): Promise<Response> => {
	const headers = createAuthHeaders(idToken);

	return fetch(url, {
		...options,
		headers: {
			...headers,
			...options.headers,
		},
	});
};

/**
 * トークンの残り有効時間を秒で取得
 */
export const getTokenTimeRemaining = (token: string): number => {
	try {
		const payload = JSON.parse(atob(token.split(".")[1])) as IdTokenPayload;
		const currentTime = Math.floor(Date.now() / 1000);
		return Math.max(0, payload.exp - currentTime);
	} catch {
		return 0;
	}
};

/**
 * ユーザー情報の表示用フォーマット
 */
export const formatUserForDisplay = (user: AuthenticatedUser) => {
	return {
		name: user.displayName || "Unknown User",
		email: user.email,
		avatar: user.photoURL,
		id: user.uid,
	};
};

/**
 * Firebase認証レスポンスがエラーかどうかを判定
 */
const isFirebaseError = (authData: FirebaseAuthResult | FirebaseError): authData is FirebaseError => {
	return authData && "name" in authData && authData.name === "FirebaseError";
};

/**
 * Firebase認証エラーを解析してユーザーフレンドリーなメッセージを生成
 */
const parseAuthError = (error: FirebaseError): string => {
	const isDomainError = error.code === "auth/invalid-domain" || error.message?.includes("chukyo-u.ac.jp");

	if (isDomainError) {
		return "中京大学のメールアドレスでログインしてください。";
	}

	return error.message || "認証中にエラーが発生しました";
};

/**
 * Firebase認証を実行するメイン関数
 */
export const executeFirebaseAuth = async (
	email: string
): Promise<{
	success: boolean;
	data?: { idToken: string; displayName: string };
	error?: string;
}> => {
	try {
		const message: SignInMessage = {
			type: "sign-in",
			loginHint: email,
		};

		const authData = await new Promise<FirebaseAuthResult | FirebaseError>((resolve, reject) => {
			chrome.runtime.sendMessage(message, (response) => {
				if (chrome.runtime.lastError) {
					reject(new Error(chrome.runtime.lastError.message));
				} else {
					resolve(response);
				}
			});
		});

		// エラーレスポンスの処理
		if (isFirebaseError(authData)) {
			const errorMessage = parseAuthError(authData);
			console.error("Auth Error:", authData);
			return {
				success: false,
				error: errorMessage,
			};
		}

		// 成功レスポンスの処理
		const { idToken, displayName } = extractUserInfo(authData as FirebaseAuthResult);
		console.log("Auth Success:", authData);

		return {
			success: true,
			data: { idToken, displayName },
		};
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "認証中にエラーが発生しました";
		console.error("Sign in error:", error);

		return {
			success: false,
			error: errorMessage,
		};
	}
};
