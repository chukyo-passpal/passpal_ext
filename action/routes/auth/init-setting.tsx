import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import RadioButtonBox from "../../components/RadioButtonBox";
import { Check } from "lucide-react";
import Button from "../../components/Button";
import { campusSettings } from "../_authenticated/-settingsConfig";
import { DynamicIcon } from "lucide-react/dynamic";
import useSettingsStore from "../../store/SettingsStore";
import { useState } from "react";

const InitSettingPage = () => {
	const navigate = useNavigate();
	const store = useSettingsStore();
	const [agreementCheck, setAgreementCheck] = useState(false);

	const handleOnClick = () => {
		navigate({ to: "/dashboard" });
	};

	return (
		<div className="w-full h-full flex flex-col gap-6">
			<AuthHeader title="初期設定" comment="もうすぐです！" />
			<div>
				<p className="text-[14px] font-medium mb-4">キャンパスを選択</p>
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
			</div>
			<div className="flex gap-[12px]">
				<label>
					<input
						type="checkbox"
						checked={agreementCheck}
						className="sr-only peer"
						onChange={() => setAgreementCheck((prev) => !prev)}
					/>
					<div
						className="w-[20px] h-[20px] border flex items-center justify-center rounded-[4px] cursor-pointer 
					border-neutral-gray-600 peer-checked:bg-primary transition-colors"
					>
						<Check size={12} className="text-white" />
					</div>
				</label>
				<p className="text-[14px] text-[#6B7280]">
					<a className="text-primary underline">利用規約</a>および
					<a className="text-primary underline">プライバシーポリシー</a>に同意します
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
