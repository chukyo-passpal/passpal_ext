import { Children, createContext, use, useEffect, useState, type FC, type ReactNode } from "react";
import {
	clearAuthenticationData,
	isUserAuthenticated,
	setAuthenticationData,
	setRecommendedSettings,
} from "../contents/utils/settings";
import type { LoginCredentials } from "./components/types";

export interface AuthState {
	isAuthenticated: boolean;
	login: (LoginCredentials: LoginCredentials) => Promise<void>;
	logout: () => Promise<void>;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initialize = async () => {
			try {
				// 認証状態を確認
				const authenticated = await isUserAuthenticated();
				setIsAuthenticated(authenticated);
				console.log("authenticated: ", authenticated);
			} catch (error) {
				console.error("Initialization error:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};
		initialize();
	}, []);

	const login = async (loginCredentials: LoginCredentials) => {
		setIsLoading(true);
		try {
			await setAuthenticationData({ loginCredentials });
			setRecommendedSettings();
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Login error:", error);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await clearAuthenticationData();
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
	}

	return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = use(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
