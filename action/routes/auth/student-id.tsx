import { createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/auth/AuthHeader";
import InputField from "../../components/InputField";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import Button from "../../components/Button";
import { useAuthStore } from "../../store/AuthStore";
import { isTokenExpired } from "../../utils/firebaseUtils";

const StudentIdPage = () => {
	const [tmpStudentId, setTmpStudentId] = useState("");
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const { setStudentId } = useAuthStore();

	useEffect(() => {
		try {
			const { studentId, IdToken } = useAuthStore.getState();
			// studentIdが入力済みで有効なトークンが存在する場合passwordへ遷移
			if (studentId && IdToken && !isTokenExpired(IdToken)) navigate({ to: "/auth/password" });
			// studentIdが入力済みの場合google-authに遷移
			if (studentId) navigate({ to: "/auth/google-auth" });
		} catch (error) {
			console.error("Failed to restore:", error);
		}
		inputRef.current?.focus();
	}, []);

	const validateStudentId = (id: string): boolean => {
		// 正規表現: 小文字のアルファベット1文字 + 数字6文字
		const regex = /^[a-z][0-9]{6}$/;
		return regex.test(id);
	};

	const handleOnClick = async () => {
		setError("");

		if (!validateStudentId(tmpStudentId)) {
			setError("小文字のアルファベット1文字+数字6文字で入力してください。（例: a123456）");
			return;
		}

		try {
			setIsLoading(true);
			setStudentId(tmpStudentId);
			console.log("Student ID saved successfully:", tmpStudentId);
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
				value={tmpStudentId}
				onChange={(e) => setTmpStudentId(e.target.value)}
				placeholder="例: t324076"
				maxLength={7}
				ref={inputRef}
				error={error}
			/>
			<Button variant="primary" disabled={!tmpStudentId.trim() || isLoading} onClick={handleOnClick}>
				{isLoading ? "ログイン中..." : "次へ"}
			</Button>
		</div>
	);
};

export const Route = createFileRoute("/auth/student-id")({
	component: StudentIdPage,
});
