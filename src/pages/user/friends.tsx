import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import { useEffect, useState } from "react";
import EndOfPage from "../../components/endOfPage";
import apiClient from "../../utils/axiosConfig";

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import Loader from "../../components/loader";
import type { SearchedUserInfo, UserMiniInfo } from "../../data/adminData";
import StatusMessage from "../../components/statusMessage";

type FriendsType = "active" | "sent" | "received";

const FriendsList = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchedUsers, setSearchedUsers] = useState<SearchedUserInfo[]>([]);
	const [friends, setFriends] = useState<UserMiniInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [activeTab, setActiveTab] = useState<FriendsType>("active");
	const [buttons, setButtons] = useState<string[]>([]);

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchSearchedUsers = async (term: string) => {
		// setIsLoading(true);
		setIsSearchLoading;
		setSearchedUsers([]);
		try {
			const response = await apiClient.get(`/search-users?search=${term}`);
			setSearchedUsers(response.data.users);
		} catch (error) {
			console.error(error);
		} finally {
			setIsSearchLoading(false);
		}
	};

	useEffect(() => {
		fetchSearchedUsers(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const fetchFriends = async (type: FriendsType) => {
		setIsLoading(true);
		// setFriends(null);
		try {
			const response = await apiClient.get(`/get-friends?type=${type}`);
			setFriends(response.data.friends);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (activeTab == "active") {
			setButtons(["remove"]);
		} else if (activeTab == "sent") {
			setButtons(["cancel"]);
		} else if (activeTab == "received") {
			setButtons(["accept", "reject"]);
		}
		fetchFriends(activeTab);
	}, [activeTab]);

	const friendQuery = async (action: string, user: UserMiniInfo) => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const response = await apiClient.post("/friends-action", {
				user_id: user.id,
				action: action,
			});
			// setFriends(response.data.friends);
			setSuccess(response.data.message);

			updateFriends(action, user);
		} catch (error: any) {
			console.error(error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const updateFriends = (action: string, user: UserMiniInfo) => {
		//update
		if (action == "add") {
			if (activeTab == "sent") {
				setFriends((prev) => {
					return [...prev, user];
				});
			}
		} else {
			setFriends((prev) => {
				return prev.filter((newUser) => newUser.id !== user.id);
			});
		}
		//..
		setSearchedUsers((prev) => {
			return prev.map((newUser) => {
				if (newUser.id == user.id) {
					if (action == "add") {
						return {
							...newUser,
							status: "request_sent",
						};
					} else if (action == "accept") {
						return {
							...newUser,
							status: "friends",
						};
					}
					return {
						...newUser,
						status: "not_friends",
					};
				}
				return newUser;
			});
		});
	};

	const renderButton = (user: SearchedUserInfo): React.ReactNode => {
		const { id, username } = user;

		switch (user.status) {
			case "friends":
				return <span className="text-xs text-green-400">IS FRIEND</span>;
			case "request_received":
				return (
					<span className="text-xs text-amber-400">REQUEST RECEIVED</span>
				);
			case "request_sent":
				return <span className="text-xs text-amber-400">REQUEST SENT</span>;
			default:
				return (
					<button
						className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white text-xs px-2 py-0.5 rounded font-bold"
						onClick={() => friendQuery("add", { id, username })}
					>
						ADD FRIEND
					</button>
				);
		}
	};

	const btnClass = (btn: string): string => {
		switch (btn) {
			case "remove":
				return "bg-red-500 hover:bg-red-400";
			case "add":
				return "bg-blue-500 hover:bg-blue-400";
			case "cancel":
				return "bg-amber-500 hover:bg-amber-400";
			case "accept":
				return "bg-green-500 hover:bg-green-400";
			case "reject":
				return "bg-red-500 hover:bg-red-400";
			default:
				return "bg-gray-500 hover:bg-gray-400";
		}
	};

	const handleRefreshListClick = async () => {
		if (searchTerm !== "") {
			await fetchSearchedUsers(searchTerm);
		}
		fetchFriends(activeTab);
	};

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold">
					<FontAwesomeIcon icon="caret-right" /> My Friends
				</h1>
				<p className="font-medium text-sm my-1">
					<span>
						You can add friends and manage your existing friend list here.
					</span>
				</p>
				<button
					className="text-xs bg-sky-500 hover:bg-sky-400 cursor-pointer text-white px-2 py-0.5 rounded font-semibold mt-2 mb-2"
					onClick={handleRefreshListClick}
				>
					REFRESH LIST
				</button>

				{success && (
					<StatusMessage
						message={success}
						type="success"
						onClose={() => setSuccess(null)}
					/>
				)}
				{error && (
					<StatusMessage
						message={error}
						type="error"
						onClose={() => setError(null)}
					/>
				)}

				<div className="w-full xl:flex space-y-4 xl:space-y-0 mt-2 gap-x-4">
					<div className="space-y-4 flex-2">
						{/* active friends */}
						<div className="border border-gray-400 rounded overflow-hidden bg-gray-600">
							<h2 className="bg-gray-800 text-white px-3 py-2 font-semibold">
								Friends
							</h2>
							<div className="h-64 overflow-y-auto">
								<div className="grid grid-cols-3 text-sm md:text-base border-y border-gray-500 overflow-hidden">
									<button
										className={`font-bold text-gray-300 border-r border-gray-500 py-0.5 ${
											activeTab == "active"
												? "bg-gray-500 text-yellow-400"
												: "hover:text-gray-400 cursor-pointer"
										}`}
										onClick={() => setActiveTab("active")}
										disabled={isLoading}
									>
										ACTIVE
									</button>
									<button
										className={`font-bold text-gray-300 border-r border-gray-500 py-0.5 ${
											activeTab == "received"
												? "bg-gray-500 text-yellow-400"
												: "hover:text-gray-400 cursor-pointer"
										}`}
										onClick={() => setActiveTab("received")}
										disabled={isLoading}
									>
										REQUEST RECEIVED
									</button>
									<button
										className={`font-bold text-gray-300 py-0.5 ${
											activeTab == "sent"
												? "bg-gray-500 text-yellow-400"
												: "hover:text-gray-400 cursor-pointer"
										}`}
										onClick={() => setActiveTab("sent")}
										disabled={isLoading}
									>
										REQUEST SENT
									</button>
								</div>

								<div>
									{friends && friends.length > 0 ? (
										<ul>
											{friends.map((friend) => (
												<li
													key={friend.id}
													className="odd:bg-gray-700 text-sm text-white px-2 py-2 flex items-center justify-between last:border-b border-gray-500"
												>
													<p>
														<FontAwesomeIcon icon="user" />{" "}
														{friend.username}
													</p>
													<div className="space-x-1">
														{buttons.map((btn) => (
															<button
																key={btn}
																className={`cursor-pointer  text-white text-xs px-2 py-0.5 rounded font-bold ${btnClass(
																	btn
																)}`}
																onClick={() =>
																	friendQuery(btn, friend)
																}
															>
																{btn.toUpperCase()}
															</button>
														))}
													</div>
												</li>
											))}
										</ul>
									) : (
										<p className="px-3 py-2 text-sm text-white">
											{isLoading ? "Loading.." : "No data found."}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className="flex-1">
						<div className="border border-gray-400 rounded overflow-hidden">
							<h2 className="bg-gray-800 text-white px-3 py-2 font-semibold">
								Add Friends
							</h2>
							<div className="p-3 bg-gray-600">
								<div className="flex items-center border-b border-gray-400">
									<input
										type="text"
										value={searchTerm}
										onChange={handleSearchInputChange}
										className="flex-1 px-2 py-1 font-medium text-white focus:outline-none"
										placeholder="Search users here..."
									/>
									{searchTerm && searchTerm !== "" && (
										<button
											className="text-white hover:bg-gray-500 cursor-pointer font-bold w-5 h-5 leading-3"
											onClick={() => setSearchTerm("")}
										>
											<FontAwesomeIcon icon="xmark" />
										</button>
									)}
								</div>
								<div className="border  mt-3 border-zinc-500 bg-gray-800 h-30 xl:h-47 overflow-y-auto">
									{searchedUsers.length > 0 ? (
										<>
											{searchedUsers.map((user) => (
												<li
													key={user.id}
													className="odd:bg-gray-700 text-white px-2 py-1 flex items-center justify-between"
												>
													<p>
														<FontAwesomeIcon icon="user" />{" "}
														{user.username}
													</p>
													{renderButton(user)}
												</li>
											))}
										</>
									) : (
										<p className="px-3 py-2 h-full text-gray-400">
											{isSearchLoading
												? "Loading..."
												: "No users to display."}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{(isLoading || isSearchLoading) && <Loader />}
			<EndOfPage />
		</ContentBase>
	);
};

export default FriendsList;
