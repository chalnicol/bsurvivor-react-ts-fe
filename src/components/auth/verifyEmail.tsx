import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import ContentBase from "../contentBase";

const VerifyEmail = () => {
	const {
		message,
		error,
		isAuthenticated,
		authLoading,
		verifyEmail,
		clearMessages,
	} = useAuth();

	const location = useLocation();
	const navigate = useNavigate();

	const [isInvalid, setIsInvalid] = useState(false);

	const from = location.state?.from?.pathname || "/"; // Default to /dashboard

	useEffect(() => {
		return () => {
			clearMessages();
		};
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const email = params.get("email");
		const token = params.get("token");
		if (!authLoading) {
			if (!email || !token) {
				setIsInvalid(true);
				return;
			}
			const verify = async () => {
				const success = await verifyEmail(email, token);
				if (success) {
					// navigate(from, { replace: true });
					console.log("successful email verification.. redirecting");
				}
			};
			verify();
		}
	}, [location, navigate, authLoading]);

	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	if (isInvalid) {
		return (
			<ContentBase className="flex items-center justify-center p-4">
				<div className="border bg-white border-gray-500 p-3 rounded max-w-lg shadow-lg mx-auto">
					<h2 className="font-bold text-lg">Invalid Link</h2>
					<p className="text-sm mt-2 mb-6">
						The email verification link is invalid or has expired. Please
						ensure you clicked the most recent link sent to your email.
					</p>
				</div>
			</ContentBase>
		);
	}
	return (
		<ContentBase className="flex items-center justify-center p-4">
			<div className="border bg-white border-gray-500 p-3 rounded max-w-lg shadow-lg mx-auto">
				<h1 className="font-bold text-lg">Email Verification</h1>
				<p className="text-sm mt-2 mb-6">
					Almost done! Just a moment while we confirm your details..
				</p>
				{message && (
					<p className="text-green-600 text-sm my-3">{message}</p>
				)}
				{error && <p className="text-red-500 text-sm my-3">{error}</p>}
			</div>
		</ContentBase>
	);
};

export default VerifyEmail;
