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
    const { signIn, studentId, setStudentId } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    // 学籍番号に@m.chukyo-u.ac.jpを付与してメールアドレスを生成
    const email = `${studentId}@m.chukyo-u.ac.jp`;

    const navigate = useNavigate();

    const handleOnClickSignInButton = async () => {
        setIsLoading(true);
        try {
            const authResponse = await sendMessage("signIn", { loginHint: email });
            console.log(authResponse);
            await signIn(authResponse._tokenResponse.oauthAccessToken);
            navigate({ to: "/auth/password" });
        } catch (e) {
            setError(getFirebaseErrorMessage(e as FirebaseError));
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnClickBackButton = async () => {
        setStudentId(null);
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
