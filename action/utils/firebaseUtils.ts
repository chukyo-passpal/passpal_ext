import type {
	FirebaseAuthResult,
	AuthenticatedUser,
	AuthHeaders,
	IdTokenPayload,
	AuthResponse,
	GoogleRawUserInfo,
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
 * ローカルストレージから認証情報を取得（Chrome拡張機能では使用不可）
 * 代わりにchrome.storageを使用することを推奨
 */
export const getStoredAuthInfo = async (): Promise<AuthenticatedUser | null> => {
	try {
		// Chrome拡張機能の場合
		if (typeof chrome !== "undefined" && chrome.storage) {
			const result = await chrome.storage.local.get(["authUser"]);
			return result.authUser || null;
		}

		// 通常のWebアプリケーションの場合
		const stored = localStorage.getItem("authUser");
		return stored ? JSON.parse(stored) : null;
	} catch {
		return null;
	}
};

/**
 * 認証情報をストレージに保存
 */
export const storeAuthInfo = async (user: AuthenticatedUser): Promise<void> => {
	try {
		// Chrome拡張機能の場合
		if (typeof chrome !== "undefined" && chrome.storage) {
			await chrome.storage.local.set({ authUser: user });
			return;
		}

		// 通常のWebアプリケーションの場合
		localStorage.setItem("authUser", JSON.stringify(user));
	} catch (error) {
		console.error("Failed to store auth info:", error);
	}
};

/**
 * 認証情報をストレージから削除
 */
export const clearAuthInfo = async (): Promise<void> => {
	try {
		// Chrome拡張機能の場合
		if (typeof chrome !== "undefined" && chrome.storage) {
			await chrome.storage.local.remove(["authUser"]);
			return;
		}

		// 通常のWebアプリケーションの場合
		localStorage.removeItem("authUser");
	} catch (error) {
		console.error("Failed to clear auth info:", error);
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

// Chrome拡張機能での使用例
export class ChromeAuthManager {
	private user: AuthenticatedUser | null = null;

	async initialize(): Promise<boolean> {
		this.user = await getStoredAuthInfo();

		if (this.user && !isTokenExpired(this.user.idToken)) {
			return true;
		}

		await this.clearAuth();
		return false;
	}

	async signIn(): Promise<AuthResponse> {
		// backgroundスクリプトに認証リクエストを送信
		return new Promise((resolve) => {
			chrome.runtime.sendMessage({ type: "sign-in" }, (response) => {
				if (response.success && response.user) {
					this.user = response.user;
					storeAuthInfo(response.user);
				}
				resolve(response);
			});
		});
	}

	async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
		if (!this.user || isTokenExpired(this.user.idToken)) {
			throw new Error("Not authenticated or token expired");
		}

		return authenticatedFetch(url, options, this.user.idToken);
	}

	async clearAuth(): Promise<void> {
		this.user = null;
		await clearAuthInfo();
	}

	getCurrentUser(): AuthenticatedUser | null {
		return this.user;
	}
}
