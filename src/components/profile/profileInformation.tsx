import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
// import { useNavigate } from "react-router-dom";

const ProfileInformation = () => {
	const { user, message, error, profileWindow, isLoading, updateProfile } =
		useAuth();
	// const navigate = useNavigate();
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	useEffect(() => {
		if (user) {
			setEmail(user.email || "");
			setUsername(user.username || "");
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await updateProfile(username, email);
	};

	return (
		<div className="p-6 rounded-lg bg-gray-100 shadow border border-gray-400">
			<div className="max-w-lg">
				<h1 className="text-lg font-bold">Profile Information</h1>
				<hr className="my-2 border-gray-400 shadow-lg" />
				{user ? (
					<div>
						<form onSubmit={handleSubmit}>
							<div className="mb-2">
								<label htmlFor="username" className="text-xs">
									Username
								</label>
								<br />
								<input
									type="text"
									id="username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="username here"
									disabled={isLoading}
								/>
							</div>
							<div className="mb-6">
								<label htmlFor="email" className="text-xs">
									Email
								</label>
								<br />
								<input
									type="text"
									id="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
									placeholder="username here"
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
						{profileWindow === "details" && error && (
							<p className="my-3 text-sm text-red-500">{error}</p>
						)}
						{profileWindow === "details" && message && (
							<p className="my-3 text-sm text-green-700">{message}</p>
						)}
					</div>
				) : (
					<p className="mt-2">User Information is not available..</p>
				)}
			</div>
		</div>
	);
};

export default ProfileInformation;
