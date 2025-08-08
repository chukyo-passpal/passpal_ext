import { useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import icon from "../../../images/extension_128.png";

const DashBoardHeader = () => {
	const navigate = useNavigate();

	const getGreetingMessage = (userName: string | null): string => {
		if (userName) {
			return `こんにちは、${userName}さん`;
		}
		return "こんにちは、ゲストさん";
	};

	const handleSettingsClick = () => {
		navigate({ to: "/settings" });
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full flex items-center justify-between">
				<div className="flex items-center gap-2">
					<img className="w-[32px] h-[32px] rounded-[8px]" src={icon} alt="PassPalアプリのアイコン" />
					<h1 className="text-[18px] font-bold">PassPal</h1>
				</div>
				<button
					type="button"
					onClick={handleSettingsClick}
					className="p-1 rounded-md hover:bg-gray-100 transition-colors"
					aria-label="設定画面を開く"
				>
					<Settings
						size={24}
						className="text-neutral-gray-600 hover:text-primary hover:scale-125 transition cursor-pointer"
					/>
				</button>
			</div>
			<p className="text-[14px] font-normal text-[#6B7280]">{getGreetingMessage("ゲスト")}</p>
		</div>
	);
};

export default DashBoardHeader;
