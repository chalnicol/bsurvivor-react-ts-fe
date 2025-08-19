import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import ContentBase from "../contentBase";
import ErrorDisplay from "../errorDisplay";
import LoadAuth from "./loadAuth";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const {
		authLoading,
		isAuthenticated,
		isLoading,
		error,
		fieldErrors,
		login,
		clearMessages,
	} = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || "/"; // Default to /dashboard

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await login(email, password);
		if (success) navigate(from, { replace: true });
	};

	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	useEffect(() => {
		return () => {
			clearMessages();
		};
	}, []);

	if (authLoading) {
		return <LoadAuth />;
	}

	return (
		<ContentBase className="flex items-center justify-center p-4">
			<div className="border border-gray-400 bg-white p-8 pt-6 rounded shadow-md w-full max-w-md">
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
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						{fieldErrors?.email && (
							<ErrorDisplay errors={fieldErrors.email} />
						)}
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
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className={`w-full  text-white py-2 rounded font-bold ${
							isLoading
								? "bg-gray-600 opacity-70"
								: "bg-gray-700 hover:bg-gray-600 cursor-pointer "
						}`}
						disabled={isLoading}
					>
						LOGIN
					</button>
				</form>
				{error && <p className="my-3 text-red-500">{error}</p>}

				<div className="mt-3">
					{isLoading ? (
						<span className="text-sm	text-gray-700 ">
							Forgot Password?
						</span>
					) : (
						<Link
							to="/forgot-password"
							className="text-sm	text-gray-700 hover:underline"
						>
							Forgot Password?
						</Link>
					)}
				</div>
			</div>
		</ContentBase>
	);
};
export default Login;
