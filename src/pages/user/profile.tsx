import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";

useAuth;
const ProfilePage = () => {
	const { user } = useAuth();

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		if (user) {
			setUsername(user.username);
			setEmail(user.email);
		}
	}, [user]);

	return (
		<div className="py-10  min-h-[calc(100dvh-57px)]">
			<div className="max-w-xl space-y-8">
				{/* profile */}
				<div className="p-6 rounded-lg shadow border border-gray-300">
					<h1 className="text-lg font-semibold">Profile Information</h1>
					<hr className="my-2 border-gray-400 shadow-lg" />
					{user ? (
						<div>
							<form>
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
										className="border border-gray-500 rounded p-1 w-full shadow-sm"
										placeholder="username here"
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
										className="border border-gray-500 rounded p-1 w-full shadow-sm"
										placeholder="username here"
									/>
								</div>
								<button
									type="submit"
									className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white font-bold py-2 px-4 rounded transition duration-200"
								>
									SAVE
								</button>
							</form>
						</div>
					) : (
						<p className="mt-2">User Information is not available..</p>
					)}
				</div>
				{/* change password */}
				<div className="p-6 rounded-lg shadow border border-gray-300">
					<h1 className="text-lg font-bold">Change Password</h1>
					<hr className="mt-2 mb-4 border-gray-400 shadow-lg" />
					<form>
						<div className="mb-2">
							<label htmlFor="old_password" className="text-xs">
								Old Password
							</label>
							<input
								type="password"
								id="old_password"
								className="border border-gray-500 rounded p-1 w-full shadow-sm"
							/>
						</div>
						<div className="mb-2">
							<label htmlFor="new_password" className="text-xs">
								New Password
							</label>
							<input
								type="password"
								id="new_password"
								className="border border-gray-500 rounded p-1 w-full shadow-sm"
							/>
						</div>
						<div className="mb-6">
							<label htmlFor="confirm_new_password" className="text-xs">
								Confirm New Password
							</label>
							<input
								type="password"
								id="confirm_new_password"
								className="border border-gray-500 rounded p-1 w-full shadow-sm"
							/>
						</div>

						<button
							type="submit"
							className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white font-bold py-2 px-4 rounded transition duration-200"
						>
							SAVE
						</button>
					</form>
				</div>
				{/* delete account */}
				<div className="p-6 rounded-lg shadow border border-gray-300">
					<h1 className="text-lg font-bold">Delete Account</h1>
					<hr className="mt-2 mb-4 border-gray-400 shadow-lg" />
					<p className="text-sm">
						Once your account is deleted, there is no going back.
					</p>
					<form>
						<input
							type="submit"
							value="DELETE ACCOUNT"
							className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-bold text-white my-4 cursor-pointer"
						/>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
