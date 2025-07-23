import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { defaultSettings, type ExtensionSettings } from "../contents/utils/settings";
import GoogleLogInButton from "./components/signInButton";

const SettingsPopup: React.FC = () => {
    const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 設定を読み込み
        chrome.storage.sync.get(defaultSettings, (result) => {
            setSettings(result as ExtensionSettings);
            setLoading(false);

            // ダークモード設定に基づいてクラスを適用
            if (result.darkModeEnabled) {
                document.documentElement.classList.add("dark-mode");
            } else {
                document.documentElement.classList.remove("dark-mode");
            }
        });
    }, []);

    const handleSettingChange = (key: keyof ExtensionSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        // 設定を保存
        chrome.storage.sync.set({ [key]: value });

        // ダークモード設定の変更時にクラスを即座に更新
        if (key === "darkModeEnabled") {
            if (value) {
                document.documentElement.classList.add("dark-mode");
            } else {
                document.documentElement.classList.remove("dark-mode");
            }
        }
    };

    const handleApplySettings = () => {
        // 現在のタブを更新して設定を反映
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.reload(tabs[0].id);
            }
        });

        // ポップアップを閉じる
        window.close();
    };

    if (loading) {
        return (
            <div>
                <div>設定を読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="popup-container">
            <div className="popup-header">
                <h2>PassPal Extension 設定</h2>
            </div>
            <GoogleLogInButton />
            <div className="settings-list">
                <SettingItem
                    icon={<span>🌙</span>}
                    title="ダークモード"
                    description="大学システムにダークテーマを適用します"
                    checked={settings.darkModeEnabled}
                    onChange={(checked) => handleSettingChange("darkModeEnabled", checked)}
                />
                <SettingItem
                    icon={<span>🔄</span>}
                    title="自動再認証"
                    description="MaNaBo/ALBOシステムの自動再認証を有効にします"
                    checked={settings.autoReauthEnabled}
                    onChange={(checked) => handleSettingChange("autoReauthEnabled", checked)}
                />
                <SettingItem
                    icon={<span>🎬</span>}
                    title="動画コントロール"
                    description="高度な動画再生コントロールを追加します"
                    checked={settings.videControlsEnabled}
                    onChange={(checked) => handleSettingChange("videControlsEnabled", checked)}
                />
                <SettingItem
                    icon={<span>📞</span>}
                    title="出席呼び出し"
                    description="出席確認ポップアップを強制表示します"
                    checked={settings.attendanceCallerEnabled}
                    onChange={(checked) => handleSettingChange("attendanceCallerEnabled", checked)}
                />
                <SettingItem
                    icon={<span>📊</span>}
                    title="自動投票"
                    description="出席アンケートの自動送信を行います"
                    checked={settings.autoPollEnabled}
                    onChange={(checked) => handleSettingChange("autoPollEnabled", checked)}
                />
                <SettingItem
                    icon={<span>🔑</span>}
                    title="Shibbolethログイン"
                    description="Shibboleth認証の自動化を行います"
                    checked={settings.shibLoginEnabled}
                    onChange={(checked) => handleSettingChange("shibLoginEnabled", checked)}
                />
                <div className="apply-button-container">
                    <button className="apply-button" onClick={handleApplySettings}>
                        適用
                    </button>
                </div>
            </div>
        </div>
    );
};

interface SettingItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, description, checked, onChange }) => {
    return (
        <div className="setting-item">
            <div className="setting-content">
                <div className="setting-icon">{icon}</div>
                <div className="setting-info">
                    <div className="setting-title">{title}</div>
                    <div className="setting-description">{description}</div>
                </div>
            </div>
            <div className="setting-toggle">
                <label className="toggle-switch">
                    <input type="checkbox" id={title} checked={checked} onChange={(e) => onChange(e.target.checked)} />
                    <span className="toggle-slider"></span>
                </label>
            </div>
        </div>
    );
};

// ポップアップをマウント
const container = document.getElementById("popup-root");
if (container) {
    const root = createRoot(container);
    root.render(<SettingsPopup />);
}
