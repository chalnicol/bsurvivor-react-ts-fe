import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import TransparentIcon from "../transparentIcon";
import AuthFormBase from "../authFormBase";

const resetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { resetPassword, isLoading, error, success, clearMessages } =
		useAuth(); // Destructure from context

	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const [isInvalid, setIsInvalid] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// if (password !== passwordConfirmation) {
		// 	// For now, let's just use context's error mechanism:
		// 	// setError('Passwords do not match.'); // If you want to use local state
		// 	console.error("Passwords do not match"); // Or use a notification library
		// 	return;
		// }

		const success = await resetPassword(
			email,
			token,
			password,
			passwordConfirmation
		);
		if (success) {
			setEmail("");
			setPassword("");
			setPasswordConfirmation("");
			setTimeout(() => navigate("/login"), 2000);
		}
	};

	useEffect(() => {
		return () => {
			clearMessages();
		};
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const urlToken = params.get("token");
		const urlEmail = params.get("email");

		console.log(urlToken, urlEmail);

		if (!urlEmail || !urlToken) {
			setIsInvalid(true);
		}
		if (urlToken) {
			setToken(urlToken);
		}
		if (urlEmail) {
			setEmail(urlEmail);
		}

		return () => {
			// clearMessages(); // Clean up messages/errors when component unmounts
		};
	}, [location.search]);

	if (isInvalid) {
		return (
			<AuthFormBase>
				<div className="border bg-white border-gray-500 p-3 m-auto rounded max-w-lg shadow-lg">
					<h2 className="font-bold text-lg">Invalid Link</h2>
					<p className="text-sm mt-2 mb-6">
						The password reset link is invalid or has expired. Please
						request a new one.
					</p>

					<button
						className="font-bold w-full text-sm text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded cursor-pointer"
						onClick={() => navigate("/forgot-password")}
					>
						REQUEST NEW LINK
					</button>
				</div>
			</AuthFormBase>
		);
	}

	return (
		<AuthFormBase>
			<div className="bg-white p-8 pt-6 rounded-lg shadow-md w-full m-auto max-w-md border border-gray-400 overflow-hidden relative">
				<TransparentIcon className="absolute w-60 opacity-15 rotate-30 -right-10 -top-10 z-0" />
				<div className="relative z-10">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Reset Password
					</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								value={email}
								disabled
								className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="new_password"
								className="block text-sm font-medium text-gray-700"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
								disabled={isLoading}
							/>
						</div>
						<div className="mb-6">
							<label
								htmlFor="password_confirmation"
								className="block text-sm font-medium text-gray-700"
							>
								Confirm Password
							</label>
							<input
								type="password"
								id="password_confirmation"
								value={passwordConfirmation}
								onChange={(e) =>
									setPasswordConfirmation(e.target.value)
								}
								className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
								required
								disabled={isLoading}
							/>
						</div>
						<button
							type="submit"
							className={`w-full text-white font-bold py-2 px-4 rounded transition duration-200 ${
								isLoading
									? "bg-gray-600 opacity-70"
									: "bg-gray-700 hover:bg-gray-600 cursor-pointer"
							}`}
							disabled={isLoading}
						>
							UPDATE PASSWORD
						</button>
					</form>
					{success && (
						<p className="text-green-600 text-sm my-3">{success}</p>
					)}
					{error && <p className="text-red-500 text-sm my-3">{error}</p>}
				</div>
			</div>
		</AuthFormBase>
	);
};
export default resetPassword;
