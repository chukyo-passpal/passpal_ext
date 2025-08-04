import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import { Mail } from "lucide-react";
import { GoogleSignInButton } from "../../components/GoogleLoginButton";

const GoogleAuthPage = () => {
	const navigate = useNavigate();

	const handleOnClick = () => {
		navigate({ to: "/auth/password" });
	};
	return (
		<div className="w-full h-full flex flex-col gap-4">
			<AuthHeader title="Googleアカウント認証" comment="中京大学のGoogleアカウントでサインインしてください" />
			<div className="w-full bg-primary-light border border-primary rounded-[8px] p-4">
				<p className="text-[14px] font-semibold inherit ">対象メールアドレス</p>
				<p className="flex items-center gap-2 text-primary text-[14px] font-medium font-[inherit]">
					<Mail size={16} />
					t324076@m.chukyo-u.ac.jp
				</p>
			</div>
			<GoogleSignInButton onClick={handleOnClick} />
		</div>
	);
};

export const Route = createFileRoute("/auth/google-auth")({
	component: GoogleAuthPage,
});
