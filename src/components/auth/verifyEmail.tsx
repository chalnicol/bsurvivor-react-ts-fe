import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import TransparentIcon from "../transparentIcon";
import AuthFormBase from "../authFormBase";

const VerifyEmail = () => {
	const {
		success,
		error,
		authLoading,
		isLoading,
		verifyEmail,
		clearMessages,
	} = useAuth();

	const navigate = useNavigate();

	const [isInvalid, setIsInvalid] = useState(false);

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
					console.log("successful email verification.. redirecting");
					setTimeout(() => navigate("/login"), 2000);
				}
			};
			verify();
		}
	}, [location, navigate, authLoading]);

	// useEffect(() => {
	// 	if (isAuthenticated) {
	// 		navigate(from, { replace: true });
	// 	}
	// }, [isAuthenticated, navigate, from]);

	return (
		<AuthFormBase>
			<div className="border bg-white border-gray-500 px-4 py-3 rounded w-full max-w-md m-auto min-h-30 text-center shadow-lg relative overflow-hidden">
				<TransparentIcon className="absolute w-45 opacity-10 rotate-30 -right-10 -top-10 z-0" />
				<div className="relative z-10">
					{isInvalid ? (
						<>
							<h2 className="font-bold text-lg">Invalid Link</h2>
							<p className="text-sm mt-2 mb-6">
								The email verification link is invalid or has expired.
								Please ensure you clicked the most recent link sent to
								your email.
							</p>
						</>
					) : (
						<>
							<h1 className="font-bold text-lg text-center">
								Email Verification
							</h1>
							<p className="text-gray-600 text-sm mt-1">
								Almost done! Just a moment while we confirm your
								details..
							</p>
							<hr className="mt-3 mb-2 border-gray-300" />
							{error && <p className="text-red-600 text-sm">{error}</p>}
							{success && (
								<p className="text-green-600 text-sm">{success}</p>
							)}
							{(isLoading || authLoading) && (
								<p className="text-gray-600 text-sm">
									Verifying email...
								</p>
							)}
						</>
					)}
				</div>
			</div>
		</AuthFormBase>
	);
};

export default VerifyEmail;
