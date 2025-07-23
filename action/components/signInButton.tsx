import { useState } from "react";
import type { SignInMessage, AuthResponse, FirebaseError } from "../../types/auth";

interface SignInButtonProps {
    loginHint?: string;
}

export default function SignInButton({ loginHint = "t324076@m.chukyo-u.ac.jp" }: SignInButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const signInWithGoogle = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setAuthError(null);

            const message: SignInMessage = {
                type: "sign-in",
                loginHint,
            };

            const authData = (await chrome.runtime.sendMessage(message)) as AuthResponse | FirebaseError;

            if (authData && "name" in authData && authData.name === "FirebaseError") {
                const error = authData as FirebaseError;
                setAuthError(error.message);
                console.error("Auth Error:", error);
            } else {
                const result = authData as AuthResponse;
                console.log("Auth Data:", JSON.stringify(result, null, 2));
                // ここで認証成功の処理を追加可能
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
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={signInWithGoogle}
                disabled={isLoading}
                className={`
                    bg-white text-gray-600 mx-auto px-4 py-2 rounded-md flex items-center cursor-pointer text-center border-2
                    ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}
                `}
            >
                {isLoading ? "サインイン中..." : "Sign In with Google"}
            </button>
            {authError && <p className="text-red-500 text-sm text-center max-w-xs">{authError}</p>}
        </div>
    );
}
