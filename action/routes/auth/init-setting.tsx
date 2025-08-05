import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import RadioButton from "../../components/RadioButton";
import { Building, Car, Check } from "lucide-react";
import ToggleButtonBox from "../../components/ToggleButtonBox";
import Button from "../../components/Button";

const InitSettingPage = () => {
	const navigate = useNavigate();

	const handleOnClick = () => {
		navigate({ to: "/" });
	};

	return (
		<div className="w-full h-full flex flex-col gap-4">
			<AuthHeader title="初期設定" comment="もうすぐです！" />
			<p className="text-[14px] font-medium">キャンパスを選択</p>
			<div className="flex flex-col gap-2">
				<RadioButton icon={<Building size={20} />} title="名古屋キャンパス" subTitle="八事・名古屋" name="campus" />
				<RadioButton icon={<Car size={20} />} title="豊田キャンパス" subTitle="豊田・みよし" name="campus" />
			</div>
			<div className="flex gap-[12px]">
				<label>
					<input type="checkbox" className="sr-only peer" />
					<div
						className="w-[20px] h-[20px] border flex items-center justify-center rounded-[4px] cursor-pointer 
					border-neutral-gray-200 peer-checked:bg-primary transition-colors"
					>
						<Check size={12} className="text-white" />
					</div>
				</label>
				<p className="text-[14px] text-[#6B7280]">
					<a className="text-primary underline">利用規約</a>および
					<a className="text-primary underline">プライバシーポリシー</a>に同意します
				</p>
			</div>
			<Button variant="primary" onClick={handleOnClick}>
				始める
			</Button>
		</div>
	);
};

export const Route = createFileRoute("/auth/init-setting")({
	component: InitSettingPage,
});
