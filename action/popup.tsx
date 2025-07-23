import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

interface ExtensionSettings {
    darkModeEnabled: boolean;
    autoReauthEnabled: boolean;
    videControlsEnabled: boolean;
    attendanceCallerEnabled: boolean;
    autoPollEnabled: boolean;
    shibLoginEnabled: boolean;
}

const defaultSettings: ExtensionSettings = {
    darkModeEnabled: true,
    autoReauthEnabled: true,
    videControlsEnabled: true,
    attendanceCallerEnabled: true,
    autoPollEnabled: true,
    shibLoginEnabled: true,
};

const SettingsPopup: React.FC = () => {
    const [settings, setSettings] = useState<ExtensionSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 設定を読み込み
        chrome.storage.sync.get(defaultSettings, (result) => {
            setSettings(result as ExtensionSettings);
            setLoading(false);
        });
    }, []);

    const handleSettingChange = (key: keyof ExtensionSettings, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        // 設定を保存
        chrome.storage.sync.set({ [key]: value });
    };

    if (loading) {
        return (
            <div>
                <div>設定を読み込み中...</div>
            </div>
        );
    }

    return <div></div>;
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
        <div>
            <div>
                <div>{icon}</div>
                <div>
                    <label htmlFor={title}>{title}</label>
                    <div>{description}</div>
                </div>
            </div>
            <label>
                <input type="checkbox" id={title} checked={checked} onChange={(e) => onChange(e.target.checked)} />
            </label>
        </div>
    );
};

// ポップアップをマウント
const container = document.getElementById("popup-root");
if (container) {
    const root = createRoot(container);
    root.render(<SettingsPopup />);
}
