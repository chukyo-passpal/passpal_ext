import { useNavigate } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import icon from "../../../images/extension_128.png";
import { useAuthStore } from "../../store/AuthStore";

/**
 * 挨拶メッセージを取得
 */
const getGreetingMessage = (userName?: string | null): string => {
    return userName ? `こんにちは、${userName}さん` : "こんにちは、ゲストさん";
};

/**
 * ダッシュボードヘッダーコンポーネント
 */
const DashBoardHeader: React.FC = () => {
    const navigate = useNavigate();
    const { firebaseUser } = useAuthStore();

    const handleSettingsClick = () => {
        navigate({ to: "/settings" });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
                <Logo />
                <SettingsButton onClick={handleSettingsClick} />
            </div>
            <GreetingMessage userName={firebaseUser?.displayName} />
        </div>
    );
};

/**
 * ロゴコンポーネント
 */
const Logo: React.FC = () => (
    <div className="flex items-center gap-2">
        <img className="h-[32px] w-[32px] rounded-[8px]" src={icon} alt="PassPalアプリのアイコン" />
        <h1 className="text-[18px] font-bold">PassPal</h1>
    </div>
);

/**
 * 設定ボタンコンポーネント
 */
const SettingsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="rounded-md p-1 transition-colors hover:bg-gray-100"
        aria-label="設定画面を開く"
    >
        <Settings
            size={24}
            className="text-neutral-gray-600 hover:text-primary cursor-pointer transition hover:scale-125"
        />
    </button>
);

/**
 * 挨拶メッセージコンポーネント
 */
const GreetingMessage: React.FC<{ userName?: string | null }> = ({ userName }) => (
    <p className="text-[14px] font-normal text-[#6B7280]">{getGreetingMessage(userName)}</p>
);

export default DashBoardHeader;
