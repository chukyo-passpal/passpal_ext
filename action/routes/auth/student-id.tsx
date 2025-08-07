import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import InputField from "../../components/InputField";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import Button from "../../components/Button";
import { getSetting, setAuthenticationData } from "../../../contents/utils/settings";

const StudentIdPage = () => {
	const [studentId, setStudentId] = useState("");
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const initialize = async () => {
			try {
				const loginInfo = await getSetting("loginCredentials");
				// studentIdが入力済みの場合google-authの遷移
				if (loginInfo.studentId) navigate({ to: "/auth/google-auth" });
				// firebaseTokenが存在する場合passwordに遷移
				if (loginInfo.firebaseToken) navigate({ to: "/auth/password" });
			} catch (error) {
				console.error("Failed to restore:", error);
			}
		};

		initialize();
		inputRef.current?.focus();
	}, []);

	const validateStudentId = (id: string): boolean => {
		// 正規表現: 小文字のアルファベット1文字 + 数字6文字
		const regex = /^[a-z][0-9]{6}$/;
		return regex.test(id);
	};

	const handleOnClick = async () => {
		setError("");
		setIsLoading(true);

		if (!validateStudentId(studentId)) {
			setError("小文字のアルファベット1文字+数字6文字で入力してください。（例: a123456）");
			return;
		}

		try {
			await setAuthenticationData({ studentId });
			console.log("Student ID saved successfully:", studentId);
			navigate({ to: "/auth/google-auth" });
		} catch (error) {
			console.error("Failed to save student ID:", error);
			setError("学籍番号の保存に失敗しました。もう一度お試しください。");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full h-full flex flex-col gap-6">
			<AuthHeader title="ログイン" comment="学籍番号を入力してください" />
			<InputField
				icon={<User size={20} />}
				label="学籍番号"
				type="text"
				value={studentId}
				onChange={(e) => setStudentId(e.target.value)}
				placeholder="例: t324076"
				maxLength={7}
				ref={inputRef}
				error={error}
			/>
			<Button variant="primary" disabled={!studentId.trim() || isLoading} onClick={handleOnClick}>
				{isLoading ? "ログイン中..." : "次へ"}
			</Button>
		</div>
	);
};

export const Route = createFileRoute("/auth/student-id")({
	component: StudentIdPage,
});
