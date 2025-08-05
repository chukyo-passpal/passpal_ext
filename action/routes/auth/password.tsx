import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import TextButton from "../../components/textButton";
import { useState } from "react";
import { Lock } from "lucide-react";

const PasswordPage = () => {
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleOnClickButton = () => {
		navigate({ to: "/auth/init-setting" });
	};

	const handleOnClickTextButton = () => {
		navigate({ to: "/auth/student-id" });
	};

	return (
		<div className="w-full h-full flex flex-col gap-4">
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
				ログイン
			</Button>
			<TextButton onClick={handleOnClickTextButton}>学籍番号入力に戻る</TextButton>
		</div>
	);
};

export const Route = createFileRoute("/auth/password")({
	component: PasswordPage,
});
