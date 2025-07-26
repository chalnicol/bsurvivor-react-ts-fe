import { useCallback, useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import StatusMessage from "../../../components/statusMessages";
import type { UserInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { useAdmin } from "../../../context/admin/AdminProvider";
import { useAuth } from "../../../context/auth/AuthProvider";

const ViewUser = () => {
	const { id } = useParams<{ id: string }>();
	const { roles, fetchRoles, isRolesPopulated } = useAdmin();
	const { user: auth, updateUser } = useAuth();

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<UserInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// const [roles, setRoles] = useState<string[]>([]);

	useEffect(() => {
		if (!isRolesPopulated) {
			fetchRoles();
		}
	}, [isRolesPopulated]);

	useEffect(() => {
		if (!id) {
			setError("Invalid user ID");
			setIsLoading(false);
			return;
		}
		const fetchUser = async () => {
			try {
				setIsLoading(true);
				setError(null);
				setSuccess(null);
				const response = await apiClient.get(`/admin/users/${id}`);
				setUser(response.data.data);
				// console.log(response.data.user);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUser();
	}, [id]);

	const handleRoleCheck = useCallback(
		async (role: string, checked: boolean) => {
			if (!user) {
				setError("Cannot toggle block status: User data not loaded.");
				return;
			}

			try {
				setIsLoading(true);
				setError(null);
				setSuccess(null);

				//..
				const response = await apiClient.patch(
					`/admin/users/${user.id}/updateRoles`,
					{
						role: role,
					}
				);

				if (auth && auth.id === user.id) {
					updateUser(response.data.user);
				}
				setSuccess(response.data.message);
				setUser((prevUser) => {
					if (prevUser) {
						return {
							...prevUser,
							roles: checked
								? [...prevUser.roles, role]
								: prevUser.roles.filter((r) => r !== role),
						};
					}
					return null;
				});
			} catch (err) {
				console.log("error", err);
			} finally {
				setIsLoading(false);
			}
		},
		[user, auth]
	);

	const handleToggleBlockUser = useCallback(async () => {
		if (!user) {
			setError("Cannot toggle block status: User data not loaded.");
			return; // Exit the function if user is null
		}
		try {
			setIsLoading(true);
			setError(null);
			setSuccess(null);
			const response = await apiClient.patch(
				`/admin/users/${id}/toggleBlock`
			);
			setSuccess(response.data.message);
			setUser((prevUser) => {
				if (prevUser) {
					// Double-check prevUser is not null before modifying
					return {
						...prevUser,
						is_blocked: !prevUser.is_blocked,
					};
				}
				return null; // Should ideally not happen if the `if (!user)` check passes
			});
		} catch (error) {
			console.error("Error toggling block status:", error);
			setError("Failed to toggle block status.");
		} finally {
			setIsLoading(false);
		}
	}, [user]);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">User Details</h1>
				</div>
				<StatusMessage success={success} error={error} />
				{/* inset content here.. */}
				<div className="mt-3 max-w-lg">
					{user ? (
						<>
							<div className="space-y-3 text-sm">
								{/* username */}
								<div>
									<p className="bg-gray-300 px-2 py-1">Username</p>
									<p className="p-2 bg-gray-200">{user.username}</p>
								</div>
								{/* email */}
								<div>
									<p className="bg-gray-300 px-2 py-1">Email</p>
									<p className="p-2 bg-gray-200">{user.email}</p>
								</div>
								{/* is blocked */}
								<div>
									<p className="bg-gray-300 px-2 py-1">
										<span>Account Status</span>
									</p>
									<div className="p-2 bg-gray-200">
										{auth && auth.id !== user.id ? (
											<button
												className={`font-bold cursor-pointer text-white py-1 rounded shadow min-w-20 ${
													user.is_blocked
														? "bg-green-600 hover:bg-green-500"
														: "bg-red-600 hover:bg-red-500"
												}`}
												onClick={handleToggleBlockUser}
											>
												{user.is_blocked ? "ACTIVATE" : "BLOCK"}
											</button>
										) : (
											<p>{user.is_blocked ? "blocked" : "active"}</p>
										)}
									</div>
								</div>
								{/* roles */}
								<div>
									<p className="bg-gray-300 px-2 py-1">Roles</p>
									<div className="p-2 bg-gray-200">
										<div>
											{roles.map((role) => (
												<div
													key={role.id}
													className="flex items-center mb-1 hover:text-amber-700"
												>
													<input
														type="checkbox"
														id={role.name}
														className="w-4 h-4"
														checked={user.roles.includes(
															role.name
														)}
														onChange={(e) =>
															handleRoleCheck(
																role.name,
																e.target.checked
															)
														}
													/>
													<label
														htmlFor={role.name}
														className="ml-2 text-sm"
													>
														{role.name}
													</label>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</>
					) : (
						<p>
							{isLoading
								? "Loading user details..."
								: "No user data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</div>
	);
};

export default ViewUser;
