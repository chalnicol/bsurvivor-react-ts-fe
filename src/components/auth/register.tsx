import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ContentBase from "../contentBase";
import ErrorDisplay from "../errorDisplay";
import TransparentIcon from "../transparentIcon";
import FormRules from "../formRules";

interface FormRulesInfo {
	isOpen: false;
	rules: string[];
}
interface FormRules {
	username: FormRulesInfo;
	password: FormRulesInfo;
}

const Register = () => {
	const location = useLocation();

	const [username, setUsername] = useState("");
	const [fullName, setFullName] = useState("");
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
			fullName,
			email,
			password,
			passwordConfirmation
		);
		if (success) {
			navigate("/email-verification-notice");
		}
	};

	const formRules = {
		username: [
			"Min. of 5 characters",
			"Max. of 15 characters",
			"No spaces and special characters",
		],
		fullname: [
			"Must be at least 5 characters long.",
			"Only hyphens and spaces are allowed.",
		],
		email: ["Must be a valid email address"],
		password: [
			"Must be at least 8 characters long",
			"Must have at least 1 lowercase letter",
			"Must have at least 1 uppercase letters",
			"Must have at least 1 number",
			"Must have at least 1 special character",
		],
	};

	return (
		<>
			<title>{`REGISTER | ${import.meta.env.VITE_APP_NAME}`}</title>
			<ContentBase className="flex items-center justify-center p-4">
				<div className="border border-gray-400 bg-white p-8 pt-6 rounded-lg shadow-md w-full max-w-md overflow-hidden relative">
					<TransparentIcon className="absolute w-60 opacity-10 rotate-30 -right-12 -top-12 z-0" />
					<div className="relative z-10">
						<h2 className="text-2xl font-bold mb-6 text-center">
							Register
						</h2>

						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<div className="flex items-center gap-x-1.5 mb-1">
									<label className="text-sm font-medium text-gray-700">
										Username
									</label>
									<FormRules rules={formRules.username} />
								</div>
								<input
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									maxLength={15}
									className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									disabled={isLoading}
									required
								/>
								{fieldErrors?.username && (
									<ErrorDisplay errors={fieldErrors.username} />
								)}
							</div>
							<div className="mb-4">
								<div className="flex items-center gap-x-1.5 mb-1">
									<label className="block text-sm font-medium text-gray-700">
										Full Name
									</label>
									<FormRules rules={formRules.fullname} />
								</div>
								<input
									type="text"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									maxLength={15}
									className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									disabled={isLoading}
									required
								/>
								{fieldErrors?.fullname && (
									<ErrorDisplay errors={fieldErrors.fullname} />
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
									className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									required
									disabled={isLoading}
								/>
								{fieldErrors?.email && (
									<ErrorDisplay errors={fieldErrors.email} />
								)}
							</div>
							<div className="mb-4">
								<div className="flex items-center gap-x-1.5 mb-1">
									<label className="block text-sm font-medium text-gray-700">
										Password
									</label>
									<FormRules rules={formRules.password} />
								</div>
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
									onChange={(e) =>
										setPasswordConfirmation(e.target.value)
									}
									className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
						{error && (
							<p className="my-3 text-red-500 text-sm">{error}</p>
						)}

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
				</div>
			</ContentBase>
		</>
	);
};
export default Register;
