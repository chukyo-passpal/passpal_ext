import React, { useState, useEffect } from "react";
import type { AuthResponse } from "../../types/auth";
import type { LoginCredentials } from "./types";

interface LoginStep3Props {
    studentId: string;
    firebaseToken: string;
    onLoginComplete: (credentials: LoginCredentials) => void;
}

const LoginStep3: React.FC<LoginStep3Props> = ({ studentId, firebaseToken, onLoginComplete }) => {
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        // 初期表示時にパスワード入力フィールドにフォーカスを設定
        const inputElement = document.getElementById("password-input") as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    const handleLogin = async () => {
        if (!password.trim()) {
            setError("パスワードを入力してください。");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // ここで実際のShibboleth認証処理を実行
            // 現在は認証情報を保存して完了とする
            const credentials: LoginCredentials = {
                studentId,
                email: `${studentId}@m.chukyo-u.ac.jp`,
                password,
                firebaseToken,
            };

            onLoginComplete(credentials);
        } catch (error) {
            console.error("Login error:", error);
            setError("ログイン処理中にエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="login-step">
            <div className="login-header">
                <h2>PassPal Extension - パスワード認証</h2>
                <p>中京大学システムのパスワードを入力してください</p>
            </div>

            <div className="login-form">
                <div className="user-info">
                    <div className="user-detail">
                        <span className="label">学籍番号:</span>
                        <span className="value">{studentId}</span>
                    </div>
                    <div className="user-detail">
                        <span className="label">メールアドレス:</span>
                        <span className="value">{`${studentId}@m.chukyo-u.ac.jp`}</span>
                    </div>
                    <div className="auth-status">
                        <span className="status-icon">✅</span>
                        <span>Googleアカウント認証完了</span>
                    </div>
                </div>

                <div className="input-group">
                    <label htmlFor="password-input">CU_IDパスワード</label>
                    <input
                        id="password-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="パスワードを入力してください"
                        className={`login-input ${error ? "error" : ""}`}
                    />
                    {error && <div className="error-message">{error}</div>}
                </div>

                <button className="login-button primary" onClick={handleLogin} disabled={!password.trim() || isLoading}>
                    {isLoading ? "ログイン中..." : "ログインして開始する"}
                </button>

                <div className="login-note">
                    <p>※ このパスワードはShibboleth認証とMaNaBo/ALBOシステムへの自動ログインに使用されます。</p>
                </div>
            </div>
        </div>
    );
};

export default LoginStep3;
