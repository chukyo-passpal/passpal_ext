import type { CubicsAsTimetableDTO, ManaboTimetableDTO } from "@chukyo-passpal/web_parser";
import { defineExtensionMessaging } from "@webext-core/messaging";

import type { ChukyoUserAuthData } from "../data/providers/chukyo-univ/abstractChukyoProvider";
import type { FirebaseAuthReponse } from "../types/firebaseTypes";

/**
 * Shibbolethテスト用の認証情報
 */
export type ShibbolethTestCredentials = {
    username: string;
    password: string;
};

/**
 * 時間割データ
 */
export type TimetableData = {
    manabo: ManaboTimetableDTO;
    cubics: CubicsAsTimetableDTO;
};

/**
 * 拡張機能のメッセージングプロトコル定義
 */
interface ProtocolMap {
    // Firebase認証関連
    signIn: (data: { loginHint: string }) => FirebaseAuthReponse;
    firebaseAuth: (data: { loginHint: string }) => FirebaseAuthReponse;
    checkFirebaseAuth: () => boolean;

    // Shibboleth認証関連
    shibbolethTest: (data: ChukyoUserAuthData) => boolean;
    getShibbolethTestCredentials: () => ShibbolethTestCredentials | null;
    setProvidersUser: (data: ChukyoUserAuthData) => void;

    // データ取得
    fetchTimetable: () => TimetableData;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
