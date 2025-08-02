import React, { useState, useEffect } from "react";
import Button from "./Button";
import { StepForward } from "lucide-react";

interface LoginStep1Props {
  onNext: (studentId: string) => void;
}

const LoginStep1: React.FC<LoginStep1Props> = ({ onNext }) => {
  const [studentId, setStudentId] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 初期表示時に学籍番号入力フィールドにフォーカスを設定
    const inputElement = document.getElementById(
      "student-id-input"
    ) as HTMLInputElement;
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
      setError(
        "小文字のアルファベット1文字+数字6文字で入力してください。（例: a123456）"
      );
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
    <div className="login-step">
      <div className="login-header">
        <h2>PassPal Extension - ログイン</h2>
        <p>学籍番号を入力してください</p>
      </div>

      <div className="login-form">
        <div className="input-group">
          <label htmlFor="student-id-input">学籍番号</label>
          <input
            id="student-id-input"
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例: a123456"
            className={`login-input ${error ? "error" : ""}`}
            maxLength={7}
          />
          {error && <div className="error-message">{error}</div>}
        </div>

        <Button
          variant="primary"
          onClick={handleNext}
          disabled={!validateStudentId(studentId)}
        >
          <span className="absolute">次へ</span>
          <span className="ml-auto mr-2 transition group-hover:group-enabled:translate-x-2">
            <StepForward size={20} />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default LoginStep1;
