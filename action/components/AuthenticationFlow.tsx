import React, { useEffect, useState } from "react";
import LoginStep1 from "./LoginStep1";
import LoginStep2 from "./LoginStep2";
import LoginStep3 from "./LoginStep3";
import type { AuthResponse } from "../../types/auth";
import { getSetting, setAuthenticationData, setRecommendedSettings } from "../../contents/utils/settings";
import type { LoginCredentials } from "./types";

interface AuthenticationFlowProps {
	onAuthComplete: () => void;
}

type AuthStep = 1 | 2 | 3;

const AuthenticationFlow: React.FC<AuthenticationFlowProps> = ({ onAuthComplete }) => {
	const [currentStep, setCurrentStep] = useState<AuthStep>(1);
	const [studentId, setStudentId] = useState<string>("");
	const [firebaseToken, setFirebaseToken] = useState<string>("");

	useEffect(() => {
		(async () => {
			let step: AuthStep = 1;
			const loginInfo = await getSetting("loginCredentials");
			if (loginInfo && loginInfo.studentId && loginInfo.firebaseToken) {
				setStudentId(loginInfo.studentId);
				setFirebaseToken(loginInfo.firebaseToken);
				step = 3;
			} else if (loginInfo && loginInfo.studentId) {
				setStudentId(loginInfo.studentId);
				step = 2;
			}
			setCurrentStep(step);
		})();
	}, []);

	const handleStep1Next = (id: string) => {
		setStudentId(id);
		setAuthenticationData({ loginCredentials: { studentId: id } });
		setCurrentStep(2);
	};

	const handleStep2Next = (authData: AuthResponse) => {
		const token = "user" in authData ? authData.user?.uid || "" : "";
		setFirebaseToken(token);
		setAuthenticationData({ loginCredentials: { studentId, firebaseToken: token } });
		setCurrentStep(3);
	};

	const handleStep2Back = () => {
		setCurrentStep(1);
		setFirebaseToken("");
		setStudentId("");
		setAuthenticationData({ loginCredentials: {} });
	};

	const handleLoginComplete = (credentials: LoginCredentials) => {
		console.log("Authentication completed:", credentials);
		setAuthenticationData({
			loginCredentials: {
				studentId: credentials.studentId,
				password: credentials.password,
				firebaseToken: credentials.firebaseToken,
			},
		});
		setRecommendedSettings();
		onAuthComplete();
	};

	return (
		<div className="authentication-flow">
			{currentStep === 1 && <LoginStep1 onNext={handleStep1Next} />}

			{currentStep === 2 && <LoginStep2 studentId={studentId} onNext={handleStep2Next} onBack={handleStep2Back} />}

			{currentStep === 3 && firebaseToken && (
				<LoginStep3 studentId={studentId} firebaseToken={firebaseToken} onLoginComplete={handleLoginComplete} />
			)}
		</div>
	);
};

export default AuthenticationFlow;
