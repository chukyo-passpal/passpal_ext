import React, { useState } from "react";
import type { SignInMessage, AuthResponse, FirebaseError } from "../../types/auth";

interface LoginStep2Props {
    studentId: string;
    onNext: (authData: AuthResponse) => void;
    onBack: () => void;
}

const LoginStep2: React.FC<LoginStep2Props> = ({ studentId, onNext, onBack }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // 学籍番号に@m.chukyo-u.ac.jpを付与してメールアドレスを生成
    const email = `${studentId}@m.chukyo-u.ac.jp`;

    const signInWithGoogle = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const message: SignInMessage = {
                type: "sign-in",
                loginHint: email,
            };

            const authData = await new Promise<AuthResponse | FirebaseError>((resolve, reject) => {
                chrome.runtime.sendMessage(message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        console.log("Received response:", response);
                        resolve(response);
                    }
                });
            });

            if (authData && "name" in authData && authData.name === "FirebaseError") {
                const error = authData as FirebaseError;

                // ドメインエラーのチェック
                if (error.code === "auth/invalid-domain" || (error.message && error.message.includes("chukyo-u.ac.jp"))) {
                    setAuthError("中京大学のメールアドレスでログインしてください。");
                } else {
                    setAuthError(error.message || "認証中にエラーが発生しました");
                }
                console.error("Auth Error:", error);
            } else {
                const result = authData as AuthResponse;
                console.log("Auth Success:", result);

                // 認証成功時、Step 3へ自動遷移
                onNext(result);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "認証中にエラーが発生しました";
            setAuthError(errorMessage);
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-step">
            <div className="login-header">
                <h2>PassPal Extension - Googleアカウント認証</h2>
                <p>中京大学のGoogleアカウントでサインインしてください</p>
            </div>

            <div className="login-form">
                <div className="email-display">
                    <label>対象メールアドレス</label>
                    <div className="email-value">{email}</div>
                </div>

                <button onClick={signInWithGoogle} disabled={isLoading} className={`login-button google ${isLoading ? "loading" : ""}`}>
                    <span className="google-icon">🔐</span>
                    {isLoading ? "サインイン中..." : "サインイン（Googleアカウント）"}
                </button>

                {authError && <div className="error-message">{authError}</div>}

                <button className="login-button secondary" onClick={onBack} disabled={isLoading}>
                    学籍番号入力に戻る
                </button>
            </div>
        </div>
    );
};

export default LoginStep2;
