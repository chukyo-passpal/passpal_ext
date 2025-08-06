import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	Bell,
	Building,
	Calendar,
	Car,
	ChevronRight,
	Download,
	Info,
	Lock,
	LogOut,
	Zap,
} from "lucide-react";
import SettingCard from "../../components/SettingCard";
import InputField from "../../components/InputField";
import { useState } from "react";
import Button from "../../components/Button";
import RadioButtonBox from "../../components/RadioButtonBox";
import ToggleButtonBox from "../../components/ToggleButtonBox";

const SettingsPage = () => {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");

	const handleOnClickBack = () => {
		navigate({ to: "/dashboard" });
	};
	return (
		<div className="w-full h-full flex flex-col gap-5">
			<div className="flex flex-col gap-4 w-full">
				<div className="flex items-center gap-2">
					<button
						onClick={handleOnClickBack}
						className="cursor-pointer text-neutral-gray-600 hover:text-primary transition-colors"
					>
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
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="パスワードを入力"
					/>
					<Button isSquare={true} className="">
						パスワードを更新
					</Button>
					<Button isSquare={true} leftIcon={<LogOut size={20} />} variant="danger">
						ログアウト
					</Button>
				</div>
			</SettingCard>
			<SettingCard title="キャンパス情報">
				<p className="text-[14px] font-medium">キャンパスを選択</p>
				<div className="flex flex-col gap-2">
					<RadioButtonBox
						icon={<Building size={20} />}
						title="名古屋キャンパス"
						subTitle="八事・名古屋"
						name="campus"
					/>
					<RadioButtonBox icon={<Car size={20} />} title="豊田キャンパス" subTitle="豊田・みよし" name="campus" />
				</div>
			</SettingCard>
			<SettingCard title="基本設定" border={false}>
				<ToggleButtonBox title="自動ログイン" subTitle="大学サイトに自動ログイン" icon={<Lock size={24} />} />
				<ToggleButtonBox title="通知機能" subTitle="重要なお知らせを通知" icon={<Bell size={24} />} />
				<ToggleButtonBox title="時間割同期" subTitle="時間割を自動で取得・更新" icon={<Calendar size={24} />} />
			</SettingCard>
			<SettingCard title="高度な機能" border={false}>
				<ToggleButtonBox title="自動フォーム入力" subTitle="フォームを自動で入力" icon={<Zap size={24} />} />
				<ToggleButtonBox title="ファイル自動保存" subTitle="資料を自動でダウンロード" icon={<Download size={24} />} />
			</SettingCard>
			<SettingCard title="このアプリについて">
				<button className="group relative w-full h-[68px] flex items-center justify-between border border-neutral-gray-200 rounded-[8px] cursor-pointer px-4 transition hover:border-primary">
					<div className="flex items-center gap-3">
						<span className="text-neutral-gray-600">{<Info size={24} />}</span>
						<div>
							<p className="text-[14px] text-left font-medium text-neutral-black">PassPal Chrome Extension</p>
							<p className="text-[12px] text-left text-neutral-gray-600">version 1.0.0</p>
						</div>
						<span className="text-neutral-gray-600 absolute right-4">{<ChevronRight size={20} />}</span>
					</div>
				</button>
				<button className="group relative w-full h-[68px] flex items-center justify-between border border-neutral-gray-200 rounded-[8px] cursor-pointer px-4 transition hover:border-primary">
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
