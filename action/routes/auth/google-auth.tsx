import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { FirebaseError } from "firebase/app";
import { Mail } from "lucide-react";

import { getFirebaseErrorMessage } from "../../../utils/firebaseUtils";
import { sendMessage } from "../../../utils/messaging";
import AuthHeader from "../../components/auth/AuthHeader";
import { GoogleSignInButton } from "../../components/auth/GoogleLoginButton";
import TextButton from "../../components/TextButton";
import { useAuthStore } from "../../store/AuthStore";

const GoogleAuthPage = () => {
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const { setIdToken, clearAuthInfo, studentId, setName } = useAuthStore();
    // 学籍番号に@m.chukyo-u.ac.jpを付与してメールアドレスを生成
    const email = `${studentId}@m.chukyo-u.ac.jp`;

    const navigate = useNavigate();

    const handleOnClickSignInButton = async () => {
        setIsLoading(true);
        setError("");

        try {
            const authResponse = await sendMessage("signIn", { loginHint: email });
            const { displayName } = authResponse.user;
            const { idToken } = authResponse._tokenResponse;
            setIdToken(idToken);
            setName(displayName!);
            navigate({ to: "/auth/password" });
        } catch (error: unknown) {
            const errorMessage = getFirebaseErrorMessage(error as FirebaseError);
            console.error(error);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnClickBackButton = async () => {
        clearAuthInfo();
        navigate({ to: "/auth/student-id" });
    };

    return (
        <div className="flex h-full w-full flex-col gap-6">
            <AuthHeader title="Googleアカウント認証" comment="中京大学のGoogleアカウントでサインインしてください" />
            <div className="bg-primary-light border-primary w-full rounded-lg border p-4">
                <p className="inherit text-[14px] font-semibold">対象メールアドレス</p>
                <p className="text-primary flex items-center gap-2 text-[14px] font-medium">
                    <Mail size={16} />
                    {email}
                </p>
            </div>
            <GoogleSignInButton onClick={handleOnClickSignInButton} disabled={isLoading}>
                {isLoading ? "サインイン中..." : "Googleアカウントでサインイン"}
            </GoogleSignInButton>
            {error && <div className="text-status-error">{error}</div>}
            <TextButton onClick={handleOnClickBackButton} disabled={isLoading}>
                学籍番号入力に戻る
            </TextButton>
        </div>
    );
};

export const Route = createFileRoute("/auth/google-auth")({
    component: GoogleAuthPage,
});
