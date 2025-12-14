import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import AuthHeader from "../../components/auth/AuthHeader";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import TextButton from "../../components/TextButton";
import { useAuthStore } from "../../store/AuthStore";
import useSettingsStore from "../../store/SettingsStore";

const PasswordPage = () => {
    const [tmpPassword, setTmpPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { clearSettings } = useSettingsStore();
    const { setPassword, setIsAuthenticated } = useAuthStore();

    const handleOnClickButton = async () => {
        setIsLoading(true);
        try {
            setPassword(tmpPassword);
            setIsAuthenticated(true);
            setIsLoading(true);
            navigate({ to: "/auth/init-setting" });
        } catch (error) {
            console.error("Failed to Login:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnClickTextButton = () => {
        clearSettings();
        navigate({ to: "/auth/student-id" });
    };

    return (
        <div className="flex h-full w-full flex-col gap-6">
            <AuthHeader title="CU_IDのパスワードを入力" comment="t324016@m.chukyo-u.ac.jp" />
            <InputField
                icon={<Lock size={20} />}
                label="パスワード"
                type="password"
                value={tmpPassword}
                onChange={(e) => setTmpPassword(e.target.value)}
                placeholder="パスワードを入力"
            />
            <Button variant="primary" disabled={!tmpPassword.trim()} onClick={handleOnClickButton}>
                {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
            <TextButton onClick={handleOnClickTextButton}>学籍番号入力に戻る</TextButton>
        </div>
    );
};

export const Route = createFileRoute("/auth/password")({
    component: PasswordPage,
});
