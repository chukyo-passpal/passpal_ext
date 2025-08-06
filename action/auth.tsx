import { Children, createContext, use, useEffect, useState, type FC, type ReactNode } from "react";
import {
	clearAuthenticationData,
	isUserAuthenticated,
	setAuthenticationData,
	setRecommendedSettings,
} from "../contents/utils/settings";

interface User {
	studentId: string;
	firebaseToken: string;
}

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	login: (user: User, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
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

	const login = async (user: User, password: string) => {
		const loginCredentials = { ...user, password };
		setIsLoading(true);
		try {
			await setAuthenticationData({ loginCredentials });
			setRecommendedSettings();
			setUser(user);
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
			setUser(null);
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

	return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = use(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
