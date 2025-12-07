import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Info, Lock, LogOut } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import SettingCard from "../../components/SettingCard";
import InputField from "../../components/InputField";
import { useState } from "react";
import Button from "../../components/Button";
import RadioButtonBox from "../../components/RadioButtonBox";
import ToggleButtonBox from "../../components/ToggleButtonBox";
import type { ExtensionSettings } from "../../../contents/utils/settings";
import useSettingsStore from "../../store/SettingsStore";
import { campusSettings, settingGroups } from "./-settingsConfig";
import { useAuthStore } from "../../store/AuthStore";

const SettingsPage = () => {
    const navigate = useNavigate();
    const [tmpPassword, setTmpPassword] = useState("");
    const store = useSettingsStore();
    const { setPassword, clearAuthInfo } = useAuthStore();

    const toggleFunctions: Record<keyof Omit<ExtensionSettings, "campusLocation" | "loginCredentials">, () => void> = {
        darkModeEnabled: store.toggleDarkMode,
        autoReauthEnabled: store.toggleAutoReauth,
        videoControlsEnabled: store.toggleVideoControls,
        attendanceCallerEnabled: store.toggleAttendanceCaller,
        shibLoginEnabled: store.toggleShibLogin,
        autoPollEnabled: store.toggleAutoPoll,
    };

    const handleOnClickChangePassword = () => {
        setPassword(tmpPassword);
        setTmpPassword("");
    };

    const handleOnClickLogout = () => {
        clearAuthInfo();
        store.clearSettings();
        navigate({ to: "/auth/student-id" });
    };

    const handleOnClickBack = async () => {
        navigate({ to: "/dashboard" });
    };

    return (
        <div className="w-full h-full flex flex-col gap-5">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={handleOnClickBack} className="cursor-pointer text-neutral-gray-600 hover:text-primary transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <p className="text-neutral-black text-[18px] font-bold">設定</p>
                </div>
                <p className="text-[#6B7280] text-[14px] font-normal">機能の有効/無効を切り替えできます</p>
            </div>
            <SettingCard title="アカウント情報">
                <div className="flex flex-col gap-1">
                    <p className="text-[14px] font-medium text-neutral-black">t324016</p>
                    <p className="text-[12px] font-normal text-[#6B7280]">t324016@m.chukyo-u.ac.jp</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p className="text-[14px] font-medium text-neutral-black">CU_IDパスワード再入力</p>
                    <InputField
                        icon={<Lock size={20} />}
                        label="パスワード"
                        type="password"
                        value={tmpPassword}
                        onChange={(e) => setTmpPassword(e.target.value)}
                        placeholder="パスワードを入力"
                    />
                    <Button isSquare={true} className="" onClick={handleOnClickChangePassword}>
                        パスワードを更新
                    </Button>
                    <Button isSquare={true} leftIcon={<LogOut size={20} />} variant="danger" onClick={handleOnClickLogout}>
                        ログアウト
                    </Button>
                </div>
            </SettingCard>
            <SettingCard title="キャンパス情報">
                <p className="text-[14px] font-medium">キャンパスを選択</p>
                <div className="flex flex-col gap-2">
                    {campusSettings.map((campus) => (
                        <RadioButtonBox
                            icon={<DynamicIcon name={campus.icon} size={20} />}
                            label={campus.label}
                            description={campus.description}
                            name="campus"
                            checked={campus.value === store.campusLocation}
                            value={campus.value}
                            onChange={store.toggleCampusLocation}
                        />
                    ))}
                </div>
            </SettingCard>
            {settingGroups.map((group) => (
                <SettingCard title={group.title} border={false}>
                    {group.items.map((item) => (
                        <ToggleButtonBox
                            label={item.label}
                            description={item.description}
                            icon={<DynamicIcon name={item.icon} size={24} />}
                            checked={store[item.key]}
                            onChange={toggleFunctions[item.key]}
                        />
                    ))}
                </SettingCard>
            ))}
            <SettingCard title="このアプリについて">
                <button className="group relative h-[68px] flex items-center justify-between border border-neutral-gray-200 rounded-[8px] cursor-pointer px-4 transition hover:border-primary">
                    <div className="flex items-center gap-3">
                        <span className="text-neutral-gray-600">{<Info size={24} />}</span>
                        <div>
                            <p className="text-[14px] text-left font-medium text-neutral-black">PassPal Chrome Extension</p>
                            <p className="text-[12px] text-left text-neutral-gray-600">version 1.0.0</p>
                        </div>
                        <span className="text-neutral-gray-600 absolute right-4">{<ChevronRight size={20} />}</span>
                    </div>
                </button>
                <button className="group relative h-[68px] flex items-center justify-between border border-neutral-gray-200 rounded-[8px] cursor-pointer px-4 transition hover:border-primary">
                    <span className="text-[14px] font-medium text-neutral-black">ライセンス情報</span>
                    <span>
                        <ChevronRight size={20} className="text-neutral-gray-600" />
                    </span>
                </button>
            </SettingCard>
        </div>
    );
};

export const Route = createFileRoute("/_authenticated/settings")({
    component: SettingsPage,
});
