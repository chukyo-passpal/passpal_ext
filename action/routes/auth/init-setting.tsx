import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

import { campusSettings } from "../_authenticated/-settingsConfig";
import AuthHeader from "../../components/auth/AuthHeader";
import Button from "../../components/Button";
import RadioButtonBox from "../../components/RadioButtonBox";
import useSettingsStore from "../../store/SettingsStore";

const InitSettingPage = () => {
    const navigate = useNavigate();
    const { campusLocation, toggleCampusLocation, setRecommendedSettings } = useSettingsStore();
    const [agreementCheck, setAgreementCheck] = useState(false);

    const handleOnClick = () => {
        setRecommendedSettings();
        navigate({ to: "/dashboard" });
    };

    return (
        <div className="flex h-full w-full flex-col gap-6">
            <AuthHeader title="初期設定" comment="もうすぐです！" />
            <div>
                <p className="mb-4 text-[14px] font-medium">キャンパスを選択</p>
                <div className="flex flex-col gap-2">
                    {campusSettings.map((campus) => (
                        <RadioButtonBox
                            icon={<DynamicIcon name={campus.icon} size={20} />}
                            label={campus.label}
                            description={campus.description}
                            name="campus"
                            checked={campus.value === campusLocation}
                            value={campus.value}
                            onChange={toggleCampusLocation}
                        />
                    ))}
                </div>
            </div>
            <div className="flex gap-[12px]">
                <label>
                    <input
                        type="checkbox"
                        checked={agreementCheck}
                        className="peer sr-only"
                        onChange={() => setAgreementCheck((prev) => !prev)}
                    />
                    <div className="border-neutral-gray-600 peer-checked:bg-primary flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-[4px] border transition-colors">
                        <Check size={12} className="text-white" />
                    </div>
                </label>
                <p className="text-[14px] text-[#6B7280]">
                    <a className="text-primary underline">利用規約</a>および
                    <a className="text-primary underline">プライバシーポリシー</a>
                    に同意します
                </p>
            </div>
            <Button variant="primary" onClick={handleOnClick} disabled={!agreementCheck}>
                始める
            </Button>
        </div>
    );
};

export const Route = createFileRoute("/auth/init-setting")({
    component: InitSettingPage,
});
