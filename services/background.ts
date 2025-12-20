import { parseCubicsAsTimetable, parseManaboTimetable } from "@chukyo-passpal/web_parser";

import alboProviderInstance from "../data/providers/chukyo-univ/alboProvider";
import cubicsProviderInstance from "../data/providers/chukyo-univ/cubicsProvider";
import manaboProviderInstance from "../data/providers/chukyo-univ/manaboProvider";
import { auth } from "../firebase/firebase";
import { onMessage, sendMessage } from "../utils/messaging";
import { ALBO_URLS, CUBICS_URLS, MANABO_URLS, SHIBBOLETH_URLS } from "../utils/urls";

const OFFSCREEN_DOCUMENT_PATH: string = "/pages/offscreen.html";
const AUTH_RELATED_DOMAINS = [MANABO_URLS.base, SHIBBOLETH_URLS.loginForm, CUBICS_URLS.base, ALBO_URLS.base] as const;

declare const self: ServiceWorkerGlobalScope;

let creating: Promise<void> | null = null;

async function hasDocument(): Promise<boolean> {
    const matchedClients = await self.clients.matchAll();
    return matchedClients.some((c) => c.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH));
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
}

async function closeOffscreenDocument() {
    if (!(await hasDocument())) {
        return;
    }
    await chrome.offscreen.closeDocument();
}

/**
 * 指定されたドメインのCookieをすべて削除
 */
async function clearDomainCookies(domains: readonly string[]): Promise<void> {
    for (const domain of domains) {
        const cookies = await chrome.cookies.getAll({ url: domain });
        await Promise.all(
            cookies.map((cookie) =>
                chrome.cookies.remove({
                    url: domain,
                    name: cookie.name,
                })
            )
        );
    }
}

onMessage("signIn", async ({ data }) => {
    try {
        await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

        //offscreenへ認証実行を依頼
        const user = await sendMessage("firebaseAuth", {
            loginHint: data.loginHint,
        });

        // 成功したらoffscreenを閉じる
        await closeOffscreenDocument();

        return user;
    } catch (error) {
        console.error("SignIn Error", error);
        throw error;
    } finally {
        closeOffscreenDocument();
    }
});

onMessage("checkFirebaseAuth", async () => {
    await auth.authStateReady();
    const user = auth.currentUser;
    return user ? true : false;
});

/**
 * ユーザー情報をプロバイダーに設定
 */
onMessage("setProvidersUser", ({ data }) => {
    alboProviderInstance.setUser(data);
    cubicsProviderInstance.setUser(data);
    manaboProviderInstance.setUser(data);
});

onMessage("shibbolethTest", async ({ data }) => {
    const { studentId, cuIdPass } = data;

    await clearDomainCookies(AUTH_RELATED_DOMAINS);

    await chrome.storage.session.set({
        shibbolethTestCredentials: { username: studentId, password: cuIdPass },
    });

    try {
        const result = await manaboProviderInstance.authTest(studentId, cuIdPass);
        return result;
    } finally {
        await chrome.storage.session.remove("shibbolethTestCredentials");
    }
});

onMessage("getShibbolethTestCredentials", async () => {
    const result = await chrome.storage.session.get("shibbolethTestCredentials");
    return result.shibbolethTestCredentials || null;
});

onMessage("fetchTimetable", async () => {
    // Manaboから時間割HTMLを取得
    const manaboHtml = await manaboProviderInstance.post(
        "/",
        "application/x-www-form-urlencoded",
        "action=glexa_ajax_timetable_view"
    );

    // Cubicsから時間割HTMLを取得
    const cubicsHtml = await cubicsProviderInstance.get(
        "/unias/UnSSOLoginControl2?REQ_ACTION_DO=/ARF010.do&REQ_PRFR_MNU_ID=MNUIDSTD0103"
    );

    // パース
    const manaboResult = parseManaboTimetable(manaboHtml);
    const cubicsResult = parseCubicsAsTimetable(cubicsHtml);

    if (!manaboResult.success) {
        throw new Error(`Manabo timetable parse error: ${manaboResult.error.message}`);
    }

    if (!cubicsResult.success) {
        throw new Error(`Cubics timetable parse error: ${cubicsResult.error.message}`);
    }

    return {
        manabo: manaboResult.data,
        cubics: cubicsResult.data,
    };
});
