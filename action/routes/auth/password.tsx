import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import TextButton from "../../components/TextButton";
import { useState } from "react";
import { Lock } from "lucide-react";
import useSettingsStore from "../../store/SettingsStore";

const PasswordPage = () => {
	const { auth } = Route.useRouteContext();
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { loginCredentials, clearSettings } = useSettingsStore();

	const handleOnClickButton = async () => {
		setIsLoading(true);
		try {
			auth.login({ ...loginCredentials, password });
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
		<div className="w-full h-full flex flex-col gap-6">
			<AuthHeader title="CU_IDのパスワードを入力" comment="t324016@m.chukyo-u.ac.jp" />
			<InputField
				icon={<Lock size={20} />}
				label="パスワード"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="パスワードを入力"
			/>
			<Button variant="primary" disabled={!password.trim()} onClick={handleOnClickButton}>
				{isLoading ? "ログイン中..." : "ログイン"}
			</Button>
			<TextButton onClick={handleOnClickTextButton}>学籍番号入力に戻る</TextButton>
		</div>
	);
};

export const Route = createFileRoute("/auth/password")({
	component: PasswordPage,
});
