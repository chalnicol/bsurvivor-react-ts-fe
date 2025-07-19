import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import { type Response } from "../../data/userData";

const ProfileInformation = () => {
	const { user, isLoading, updateProfile } = useAuth();

	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");

	const [response, setResponse] = useState<Response | null>(null);

	// useEffect(() => {
	// 	return () => {
	// 		setShowMessage(false);
	// 	};
	// }, []);

	useEffect(() => {
		if (user) {
			setEmail(user.email || "");
			setUsername(user.username || "");
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const resp = await updateProfile(username, email);
		if (resp) {
			setResponse(resp);
		}
	};

	return (
		<div className="p-6 rounded-lg shadow border border-gray-300">
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
						{response?.error && (
							<p className="my-3 text-sm text-red-500">
								{response.error}
							</p>
						)}
						{response?.success && (
							<p className="my-3 text-sm text-green-500">
								{response.success}
							</p>
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
