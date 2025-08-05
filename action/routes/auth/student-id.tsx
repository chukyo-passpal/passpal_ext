import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import AuthHeader from "../../components/AuthHeader";
import InputField from "../../components/InputField";
import { useState } from "react";
import { User } from "lucide-react";
import Button from "../../components/Button";

const StudentIdPage = () => {
	const [studentId, setStudentId] = useState("");
	const navigate = useNavigate();

	const handleOnClick = () => {
		navigate({ to: "/auth/google-auth" });
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
			/>
			<Button variant="primary" disabled={!studentId.trim()} onClick={handleOnClick}>
				次へ
			</Button>
		</div>
	);
};

export const Route = createFileRoute("/auth/student-id")({
	component: StudentIdPage,
});
