import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null); // Clear previous errors
		setLoading(true);
		try {
			await login(email, password);

			setLoading(false);
			navigate("/"); // Redirect to a protected route on success
		} catch (err: any) {
			const message =
				err.response?.data?.message ||
				"Login failed. Please check your credentials.";
			setError(message);
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[calc(100dvh-57px)]">
			<div className="border border-gray-300 bg-white p-8 pt-6 rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-sm font-medium mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							className="w-full p-2 border border-gray-300 rounded"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-sm font-medium mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							className="w-full p-2 border border-gray-300 rounded"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className={`w-full  text-white py-2 rounded font-bold ${
							loading
								? "bg-gray-600 opacity-60"
								: "bg-gray-700 hover:bg-gray-600 cursor-pointer "
						}`}
						disabled={loading}
					>
						LOGIN
					</button>
				</form>
				{error && <p className="my-3 text-red-500">{error}</p>}

				<div className="mt-3">
					<Link
						to="/forgot-password"
						className="text-sm	text-blue-500 hover:underline"
					>
						Forgot Password?
					</Link>
				</div>
			</div>
		</div>
	);
};
export default Login;
