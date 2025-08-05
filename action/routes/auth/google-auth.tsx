import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import { Mail } from "lucide-react";
import { GoogleSignInButton } from "../../components/GoogleLoginButton";
import TextButton from "../../components/TextButton";

const GoogleAuthPage = () => {
	const navigate = useNavigate();

	const handleOnClickSignInButton = () => {
		navigate({ to: "/auth/password" });
	};
	const handleOnClickBackButton = () => {
		navigate({ to: "/auth/student-id" });
	};

	return (
		<div className="w-full h-full flex flex-col gap-6">
			<AuthHeader title="Googleアカウント認証" comment="中京大学のGoogleアカウントでサインインしてください" />
			<div className="w-full bg-primary-light border border-primary rounded-[8px] p-4">
				<p className="text-[14px] font-semibold inherit ">対象メールアドレス</p>
				<p className="flex items-center gap-2 text-primary text-[14px] font-medium font-[inherit]">
					<Mail size={16} />
					t324076@m.chukyo-u.ac.jp
				</p>
			</div>
			<GoogleSignInButton onClick={handleOnClickSignInButton} />
			<TextButton onClick={handleOnClickBackButton}>学籍番号入力に戻る</TextButton>
		</div>
	);
};

export const Route = createFileRoute("/auth/google-auth")({
	component: GoogleAuthPage,
});
