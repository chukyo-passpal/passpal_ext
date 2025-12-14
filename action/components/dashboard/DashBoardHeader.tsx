import { useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import icon from "../../../images/extension_128.png";
import { useAuthStore } from "../../store/AuthStore";

const DashBoardHeader = () => {
    const navigate = useNavigate();
    const { name } = useAuthStore();

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
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <img className="h-[32px] w-[32px] rounded-[8px]" src={icon} alt="PassPalアプリのアイコン" />
                    <h1 className="text-[18px] font-bold">PassPal</h1>
                </div>
                <button
                    type="button"
                    onClick={handleSettingsClick}
                    className="rounded-md p-1 transition-colors hover:bg-gray-100"
                    aria-label="設定画面を開く"
                >
                    <Settings
                        size={24}
                        className="text-neutral-gray-600 hover:text-primary cursor-pointer transition hover:scale-125"
                    />
                </button>
            </div>
            <p className="text-[14px] font-normal text-[#6B7280]">{getGreetingMessage(name)}</p>
        </div>
    );
};

export default DashBoardHeader;
