import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import { ERROR_MESSAGES } from "../../../utils/errorMessages";
import { sendMessage } from "../../../utils/messaging";
import AuthHeader from "../../components/auth/AuthHeader";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import TextButton from "../../components/TextButton";
import { useAuthStore } from "../../store/AuthStore";
import useSettingsStore from "../../store/SettingsStore";

const PasswordPage = () => {
    const [pass, setPass] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { clearSettings } = useSettingsStore();
    const { setCuIdPass, studentId } = useAuthStore();

    // 学籍番号が未入力の場合、学籍番号入力ページにリダイレクト
    useEffect(() => {
        if (!studentId) {
            navigate({ to: "/auth/student-id", replace: true });
        }
    }, [studentId, navigate]);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value);
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const handleLogin = async () => {
        if (!pass.trim()) {
            setErrorMessage(ERROR_MESSAGES.AUTH.EMPTY_PASSWORD);
            return;
        }

        if (!studentId) {
            return;
        }

        setErrorMessage("");
        setIsLoading(true);

        try {
            const result = await sendMessage("shibbolethTest", { studentId, cuIdPass: pass });

            if (result) {
                setCuIdPass(pass);
                await sendMessage("setProvidersUser", { studentId, cuIdPass: pass });
                navigate({ to: "/auth/init-setting" });
            } else {
                setErrorMessage(ERROR_MESSAGES.AUTH.AUTH_FAILED);
            }
        } catch (error) {
            console.error("Failed to Login:", error);
            setErrorMessage(ERROR_MESSAGES.AUTH.UNEXPECTED_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToStudentId = () => {
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
                value={pass}
                onChange={handlePasswordChange}
                placeholder="パスワードを入力"
                error={errorMessage}
            />
            <Button variant="primary" disabled={!pass.trim() || isLoading} onClick={handleLogin}>
                {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
            <TextButton onClick={handleBackToStudentId}>学籍番号入力に戻る</TextButton>
        </div>
    );
};

export const Route = createFileRoute("/auth/password")({
    component: PasswordPage,
});
