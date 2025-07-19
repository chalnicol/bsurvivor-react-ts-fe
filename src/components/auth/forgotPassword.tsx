import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const { forgotPassword, isLoading, error, message, clearMessages } =
		useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await forgotPassword(email); // Call context function
		if (success) {
			console.log("password link sent..");
			setEmail("");
		}
	};

	useEffect(() => {
		return () => {
			clearMessages();
		};
	}, []);

	return (
		<div className="flex items-center justify-center min-h-[calc(100dvh-57px)]">
			<div className="bg-white p-8 pt-6 rounded-lg shadow-md w-full max-w-md border border-gray-400">
				<h2 className="text-2xl font-bold mb-4 text-center">
					Forgot Password?
				</h2>
				<p className="text-sm leading-snug text-gray-600 mb-4 border-t border-gray-200 pt-2">
					Enter the email associated with your account. If it's registered
					with us, we'll send a password reset link to your inbox.
				</p>

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
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
						SEND RESET LINK
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
export default ForgotPassword;
