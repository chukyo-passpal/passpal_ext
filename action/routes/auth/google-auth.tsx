import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/auth/AuthHeader";
import { Mail } from "lucide-react";
import { GoogleSignInButton } from "../../components/auth/GoogleLoginButton";
import TextButton from "../../components/TextButton";
import { useState } from "react";
import { executeFirebaseAuth } from "../../utils/firebaseUtils";
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
			const authData = await executeFirebaseAuth(email);

			if (!authData.success) {
				setError(authData.error!);
				return;
			}

			const { idToken, displayName } = authData.data!;
			setIdToken(idToken);
			setName(displayName);
			navigate({ to: "/auth/password" });
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "予期しないエラーが発生しました";
			setError(errorMessage);
			console.error("Unexpected error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOnClickBackButton = async () => {
		navigate({ to: "/auth/student-id" });
	};

	return (
		<div className="w-full h-full flex flex-col gap-6">
			<AuthHeader title="Googleアカウント認証" comment="中京大学のGoogleアカウントでサインインしてください" />
			<div className="w-full bg-primary-light border border-primary rounded-[8px] p-4">
				<p className="text-[14px] font-semibold inherit ">対象メールアドレス</p>
				<p className="flex items-center gap-2 text-primary text-[14px] font-medium">
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
