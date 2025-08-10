import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentBase from "../contentBase";
import ErrorDisplay from "../errorDisplay";

const Register = () => {
	const location = useLocation();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const {
		error,
		fieldErrors,
		isLoading,
		isAuthenticated,
		register,
		clearMessages,
	} = useAuth();
	const navigate = useNavigate();

	const from = location.state?.from?.pathname || "/"; // Default to /dashboard

	useEffect(() => {
		// clearMessages();
		return () => {
			clearMessages();
		};
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const success = await register(
			username,
			email,
			password,
			passwordConfirmation
		);
		if (success) {
			navigate("/");
		} else {
			console.log("e", error);
		}
	};

	return (
		<ContentBase className="flex items-center justify-center p-4">
			<div className="border border-gray-400 bg-white p-8 pt-6 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Username{" "}
							<span className="text-xs text-gray-400">
								(Max of 15 characters)
							</span>
						</label>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							maxLength={15}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
						/>
						{fieldErrors?.username && (
							<ErrorDisplay errors={fieldErrors.username} />
						)}
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
							disabled={isLoading}
						/>
						{fieldErrors?.email && (
							<ErrorDisplay errors={fieldErrors.email} />
						)}
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
							disabled={isLoading}
						/>
						{fieldErrors?.password && (
							<ErrorDisplay errors={fieldErrors.password} />
						)}
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Confirm Password
						</label>
						<input
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							required
							disabled={isLoading}
						/>
					</div>

					<button
						type="submit"
						className={`w-full text-white py-2 font-bold rounded ${
							isLoading
								? "bg-gray-600 opacity-70"
								: "bg-gray-700 hover:bg-gray-600 cursor-pointer transition duration-200"
						} `}
					>
						REGISTER
					</button>
				</form>
				{error && <p className="my-3 text-red-500 text-sm">{error}</p>}

				<div className="mt-3">
					{isLoading ? (
						<span className="text-sm	text-gray-700 ">
							I have already an account?
						</span>
					) : (
						<Link
							to="/login"
							className="text-sm	text-gray-700 hover:underline"
						>
							I have already an account?
						</Link>
					)}
				</div>
			</div>
		</ContentBase>
	);
};
export default Register;
