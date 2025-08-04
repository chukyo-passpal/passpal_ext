import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Lock, StepForward, User } from "lucide-react";
import InputField from "./InputField";
import ToggleButtonBox from "./ToggleButtonBox";

interface LoginStep1Props {
	onNext: (studentId: string) => void;
}

const LoginStep1: React.FC<LoginStep1Props> = ({ onNext }) => {
	const [studentId, setStudentId] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [checked, setChecked] = useState<boolean>(false);

	useEffect(() => {
		// 初期表示時に学籍番号入力フィールドにフォーカスを設定
		const inputElement = document.getElementById("student-id-input") as HTMLInputElement;
		if (inputElement) {
			inputElement.focus();
		}
	}, []);

	const validateStudentId = (id: string): boolean => {
		// 正規表現: 小文字のアルファベット1文字 + 数字6文字
		const regex = /^[a-z][0-9]{6}$/;
		return regex.test(id);
	};

	const handleNext = () => {
		setError("");

		if (!validateStudentId(studentId)) {
			setError("小文字のアルファベット1文字+数字6文字で入力してください。（例: a123456）");
			return;
		}

		onNext(studentId);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleNext();
		}
	};

	return (
		<div className="p-6">
			<div className="login-header">
				<h2>PassPal Extension - ログイン</h2>
				<p>学籍番号を入力してください</p>
			</div>

			<div className="login-form">
				<div className="input-group">
					<InputField
						icon={<User size={20} />}
						label="学籍番号"
						type="password"
						error={error}
						value={studentId}
						onChange={(e) => setStudentId(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder="例: t324076"
						maxLength={7}
					/>
				</div>

				<Button
					variant="primary"
					rightIcon={<StepForward size={20} className="transition group-enabled:group-hover:translate-x-1" />}
					onClick={handleNext}
					disabled={!studentId.trim()}
				>
					次へ
				</Button>
				<ToggleButtonBox
					icon={<Lock size={24} />}
					title="自動ログイン"
					subTitle="大学サイトに自動でログイン"
					checked={checked}
					onChange={(e) => {
						setChecked(e.target.checked);
					}}
				/>
			</div>
		</div>
	);
};

export default LoginStep1;
