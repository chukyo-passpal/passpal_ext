import { type IconName } from "lucide-react/dynamic";

import type { ExtensionSettings } from "../../../contents/utils/settings";

export interface SettingItem {
    key: keyof Omit<ExtensionSettings, "campusLocation" | "loginCredentials">;
    label: string;
    description: string;
    icon: IconName;
}

export interface SettingGruop {
    title: string;
    items: SettingItem[];
}

export const settingGroups: SettingGruop[] = [
    {
        title: "基本設定",
        items: [
            {
                key: "darkModeEnabled",
                label: "ダークモード",
                description: "大学システムにダークテーマを適用",
                icon: "moon",
            },
            {
                key: "autoReauthEnabled",
                label: "自動ログイン",
                description: "大学サイトに自動ログイン",
                icon: "lock",
            },
            {
                key: "videoControlsEnabled",
                label: "動画コントロール",
                description: "高度な動画再生コントロールを追加",
                icon: "clapperboard",
            },
            {
                key: "attendanceCallerEnabled",
                label: "出席呼び出し",
                description: "出席ポップアップを強制表示",
                icon: "phone-call",
            },
            {
                key: "shibLoginEnabled",
                label: "Shibbolethログイン",
                description: "Shibboleth認証の自動化",
                icon: "key",
            },
        ],
    },
    {
        title: "高度な機能",
        items: [
            {
                key: "autoPollEnabled",
                label: "自動フォーム入力",
                description: "フォームを自動で入力",
                icon: "zap",
            },
        ],
    },
];

export interface CampusSetting {
    value: "nagoya" | "toyota";
    label: string;
    description: string;
    icon: IconName;
}

export const campusSettings: CampusSetting[] = [
    {
        value: "nagoya",
        label: "名古屋キャンパス",
        description: "八事・名古屋",
        icon: "building",
    },
    {
        value: "toyota",
        label: "豊田キャンパス",
        description: "豊田・みよし",
        icon: "car",
    },
];
