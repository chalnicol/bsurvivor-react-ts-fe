import { useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import { type Response } from "../../data/userData";

const ChangePassword = () => {
	const { updatePassword, isLoading } = useAuth();

	const [currentPassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const [response, setResponse] = useState<Response | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newResponse = await updatePassword(
			currentPassword,
			password,
			passwordConfirmation
		);
		if (newResponse) {
			if (newResponse.success) {
				setCurrentPassword("");
				setPassword("");
				setPasswordConfirmation("");
			}
			setResponse(newResponse);
		}
	};

	return (
		<div className="p-6 rounded-lg shadow border border-gray-400">
			<div className="max-w-lg">
				<h1 className="text-lg font-bold">Change Password</h1>
				<hr className="mt-2 mb-4 border-gray-400 shadow-lg" />
				<form onSubmit={handleSubmit}>
					<div className="mb-2">
						<label htmlFor="old_password" className="text-xs">
							Current Password
						</label>
						<input
							type="password"
							id="old_password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							disabled={isLoading}
						/>
					</div>
					<div className="mb-2">
						<label htmlFor="new_password" className="text-xs">
							New Password
						</label>
						<input
							type="password"
							id="new_password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							disabled={isLoading}
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="confirm_new_password" className="text-xs">
							Confirm New Password
						</label>
						<input
							type="password"
							id="confirm_new_password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							disabled={isLoading}
						/>
					</div>

					<button
						type="submit"
						className={`text-white font-bold py-2 px-4 rounded transition duration-200 ${
							isLoading
								? "bg-gray-600 opacity-70"
								: "bg-gray-700 hover:bg-gray-600 cursor-pointer"
						}`}
						disabled={isLoading}
					>
						SAVE
					</button>
				</form>
				{response?.error && (
					<p className="my-3 text-sm text-red-500">{response.error}</p>
				)}
				{response?.success && (
					<p className="my-3 text-sm text-green-700">{response.success}</p>
				)}
			</div>
		</div>
	);
};

export default ChangePassword;
