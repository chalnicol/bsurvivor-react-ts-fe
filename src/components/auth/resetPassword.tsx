import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";

const resetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { resetPassword, loading, error, message, clearMessages } = useAuth(); // Destructure from context

	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== passwordConfirmation) {
			// Set local error for mismatch before calling context
			// (or let context handle if you want to centralize all validation feedback)
			// For now, let's just use context's error mechanism:
			// setError('Passwords do not match.'); // If you want to use local state
			console.error("Passwords do not match"); // Or use a notification library
			return;
		}

		await resetPassword(email, token, password, passwordConfirmation);
		// console.log("wee", error);
		// if (!error) {
		// 	// If there's no error, assume success and navigate
		// 	setTimeout(() => {
		// 		navigate("/login");
		// 	}, 3000);
		// }
	};

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const urlToken = params.get("token");
		const urlEmail = params.get("email");

		if (urlToken) {
			setToken(urlToken);
		}
		if (urlEmail) {
			setEmail(urlEmail);
		}

		return () => {
			// clearMessages(); // Clean up messages/errors when component unmounts
		};
	}, [location.search, clearMessages]);

	if (!token || !email) {
		return (
			<div className="py-7">
				<div className="border border-gray-500 p-3 rounded max-w-lg shadow-lg">
					<h2 className="font-bold text-lg">Invalid Link</h2>
					<p className="text-sm mt-2 mb-6">
						The password reset link is invalid or has expired. Please
						request a new one.
					</p>
					<div className="text-right">
						<button
							className="font-bold text-sm text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded cursor-pointer"
							onClick={() => navigate("/forgot-password")}
						>
							REQUEST NEW LINK
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-[calc(100dvh-57px)]">
			<div className="bg-white p-8 pt-6 rounded-lg shadow-md w-full max-w-md border border-gray-300">
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
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required
							disabled={loading}
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
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
							required
							disabled={loading}
						/>
					</div>
					<button
						type="submit"
						className={`w-full text-white font-bold py-2 px-4 rounded transition duration-200 ${
							loading
								? "bg-gray-600 opacity-90"
								: "bg-gray-700 hover:bg-gray-600 cursor-pointer"
						}`}
						disabled={loading}
					>
						SUBMIT
					</button>
				</form>
				{message && (
					<p className="text-green-600 text-sm my-3">{message}</p>
				)}
				{error && <p className="text-red-500 text-sm my-3">{error}</p>}
			</div>
		</div>
	);
};
export default resetPassword;
