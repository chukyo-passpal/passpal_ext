import type { AuthResponse } from "../../types/auth";

export interface LoginCredentials {
	studentId: string;
	email: string;
	password: string;
	firebaseToken: string;
}
