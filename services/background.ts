import type { SignInMessage, FirebaseAuthMessage, AuthResponse, FirebaseError, MessageHandler } from "../types/auth";

const OFFSCREEN_DOCUMENT_PATH: string = "/pages/offscreen.html";

let creating: Promise<void> | null = null;

async function hasDocument(): Promise<boolean> {
	if (!("clients" in self)) {
		return false;
	}
	const matchedClients = await (self as any).clients.matchAll();
	return matchedClients.some((c: any) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH));
}

async function setupOffscreenDocument(path: string): Promise<void> {
	if (!(await hasDocument())) {
		if (creating) {
			await creating;
		} else {
			creating = chrome.offscreen.createDocument({
				url: path,
				reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
				justification: "authentication",
			});
			await creating;
			creating = null;
		}
	}

	// offscreenドキュメントの準備完了を待つ
	await waitForOffscreenReady();
}

async function waitForOffscreenReady(): Promise<void> {
	return new Promise((resolve) => {
		// シンプルに少し待つだけ
		setTimeout(resolve, 1000);
	});
}

function getAuth(loginHint?: string): Promise<AuthResponse> {
	return new Promise(async (resolve, reject) => {
		const message: FirebaseAuthMessage = {
			type: "firebase-auth",
			target: "offscreen",
			loginHint: loginHint,
		};

		// タイムアウト設定（6分）
		const timeoutId = setTimeout(() => {
			reject(new Error("Authentication request timeout"));
		}, 360000);

		try {
			const auth = (await chrome.runtime.sendMessage(message)) as AuthResponse;
			clearTimeout(timeoutId);

			if (auth && "name" in auth && auth.name === "FirebaseError") {
				reject(auth as FirebaseError);
			} else {
				resolve(auth);
			}
		} catch (error) {
			clearTimeout(timeoutId);
			reject(error);
		}
	});
}

async function firebaseAuth(loginHint: string = ""): Promise<AuthResponse | FirebaseError | void> {
	try {
		// offscreenドキュメントを閉じずに再利用
		await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

		const auth = await getAuth(loginHint);
		console.log("User Authenticated", auth);

		// 成功時もoffscreenドキュメントを閉じない
		return auth;
	} catch (error) {
		const err = error as FirebaseError;
		console.error("Authentication failed:", err);
		// エラー時もoffscreenドキュメントを保持
		throw err;
	}
}

const messageHandler = (message: any, _sender: any, _sendResponse: any) => {
	console.log("Received message:", message.type); // デバッグログ追加

	// 認証リクエスト
	if (message.type === "sign-in") {
		console.log("Processing sign-in request");
		firebaseAuth(message.loginHint)
			.then((result) => {
				console.log("Authentication result:", result);
				_sendResponse(result);
			})
			.catch((error) => {
				console.error("Authentication failed:", error);
				_sendResponse(error);
			});
		return true;
	}

	console.log("unknown message type", message.type);
	return false;
};

chrome.runtime.onMessage.addListener(messageHandler);

// 拡張機能開始時にoffscreenドキュメントを準備
chrome.runtime.onStartup.addListener(() => {
	setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
});

chrome.runtime.onInstalled.addListener(() => {
	setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);
});
