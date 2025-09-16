import { useCallback, useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import StatusMessage from "../../../components/statusMessage";
import type { UserInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { useAdmin } from "../../../context/admin/AdminProvider";
import { useAuth } from "../../../context/auth/AuthProvider";
import ContentBase from "../../../components/contentBase";
import { displayLocalDate } from "../../../utils/dateTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
			setIsLoading(false);
			return;
		}
		const fetchUser = async () => {
			try {
				setIsLoading(true);
				setError(null);
				setSuccess(null);
				setError(null);
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
			} catch (error: any) {
				console.log("error", error);
				setError(error.message || "Failed to set roles.");
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
		<ContentBase className="px-4 py-7">
			<div className="p-3 lg:p-5 border bg-gray-100 rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">User Details</h1>
				</div>

				{/* inset content here.. */}
				<div className="mt-3">
					{success && (
						<StatusMessage
							type="success"
							message={success}
							onClose={() => setSuccess(null)}
						/>
					)}
					{error && (
						<StatusMessage
							type="error"
							message={error}
							onClose={() => setError(null)}
						/>
					)}
					{user ? (
						<>
							<div className="bg-gray-800 text-white p-4 rounded">
								<div className="sm:flex gap-x-4">
									<div className="flex-none">
										<div className="w-18 mx-auto aspect-square border-2 border-gray-400 text-gray-400 rounded-full shadow-lg overflow-hidden flex items-center justify-center">
											<FontAwesomeIcon icon="user" size="2xl" />
										</div>
									</div>
									<div className="flex-1 space-y-2">
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Username
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.username}
											</p>
										</div>
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Full Name
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.fullname}
											</p>
										</div>
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Email
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.email}
											</p>
										</div>
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Email Verified At
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.email_verified_at
													? displayLocalDate(
															user.email_verified_at
													  )
													: "--"}
											</p>
										</div>

										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Date Joined
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{displayLocalDate(user.created_at)}
											</p>
										</div>
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Social User
											</p>
											<p className="py-1.5 px-3 rounded bg-gray-600">
												{user.social_user ? "Yes" : "No"}
											</p>
										</div>
										{/* account status */}
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Account Status
											</p>
											<div className="py-1.5 px-3 rounded bg-gray-600">
												{auth && auth.id !== user.id ? (
													<button
														className={`font-bold cursor-pointer text-white text-sm rounded shadow px-3 py-0.5 ${
															user.is_blocked
																? "bg-amber-600 hover:bg-amber-500"
																: "bg-red-600 hover:bg-red-500"
														}`}
														onClick={handleToggleBlockUser}
													>
														{user.is_blocked
															? "UNBLOCK USER"
															: "BLOCK USER"}
													</button>
												) : (
													<span
														className={`font-bold text-xs text-center px-2 rounded text-white select-none ${
															user.is_blocked
																? "bg-red-500"
																: "bg-green-600"
														}`}
													>
														{user.is_blocked
															? "BLOCKED"
															: "ACTIVE"}
													</span>
												)}
											</div>
										</div>
										{/* roles */}
										<div>
											<p className="font-semibold text-xs border-gray-300 py-1">
												Roles
											</p>
											<div className="p-1.5 px-3 rounded bg-gray-600">
												{roles.map((role) => (
													<div
														key={role.id}
														className="flex items-center mb-1 hover:text-amber-400"
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
		</ContentBase>
	);
};

export default ViewUser;
