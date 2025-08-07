import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import { Mail } from "lucide-react";
import { GoogleSignInButton } from "../../components/GoogleLoginButton";
import TextButton from "../../components/TextButton";
import { useEffect, useState } from "react";
import type { AuthResponse, FirebaseError, SignInMessage } from "../../../types/auth";
import { clearAuthenticationData, getSetting, setAuthenticationData } from "../../../contents/utils/settings";

const GoogleAuthPage = () => {
	const [studentId, setStudentId] = useState<string | undefined>(undefined);
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	// 学籍番号に@m.chukyo-u.ac.jpを付与してメールアドレスを生成
	const email = `${studentId}@m.chukyo-u.ac.jp`;

	const navigate = useNavigate();

	useEffect(() => {
		const initializeStudentId = async () => {
			try {
				const LoginInfo = await getSetting("loginCredentials");
				setStudentId(LoginInfo.studentId);
				console.log("Restored student ID from sync storage:", LoginInfo.studentId);
			} catch (error) {
				console.error("Failed to restore student ID:", error);
			}
		};

		initializeStudentId();
	}, []);

	const handleOnClickSignInButton = async () => {
		setIsLoading(true);
		setError("");
		console.log(email);
		try {
			const message: SignInMessage = {
				type: "sign-in",
				loginHint: email,
			};

			const authData = await new Promise<AuthResponse | FirebaseError>((resolve, reject) => {
				chrome.runtime.sendMessage(message, (response) => {
					chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(response);
				});
			});

			if (authData && "name" in authData && authData.name === "FirebaseError") {
				const error = authData as FirebaseError;
				const isDomainError = error.code === "auth/invalid-domain" || error.message?.includes("chukyo-u.ac.jp");
				setError(
					isDomainError
						? "中京大学のメールアドレスでログインしてください。"
						: error.message || "認証中にエラーが発生しました"
				);
				console.error("Auth Error:", error);
				return;
			}
			const token = "user" in authData ? authData.user?.uid || "" : "";
			await setAuthenticationData({ loginCredentials: { studentId, firebaseToken: token } });
			console.log("Auth Success:", authData);
			navigate({ to: "/auth/password" });
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "認証中にエラーが発生しました";
			setError(errorMessage);
			console.error("Sign in error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOnClickBackButton = async () => {
		clearAuthenticationData();
		navigate({ to: "/auth/student-id" });
	};

	return (
		<div className="w-full h-full flex flex-col gap-6">
			<AuthHeader title="Googleアカウント認証" comment="中京大学のGoogleアカウントでサインインしてください" />
			<div className="w-full bg-primary-light border border-primary rounded-[8px] p-4">
				<p className="text-[14px] font-semibold inherit ">対象メールアドレス</p>
				<p className="flex items-center gap-2 text-primary text-[14px] font-medium">
					<Mail size={16} />
					{studentId}@m.chukyo-u.ac.jp
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
