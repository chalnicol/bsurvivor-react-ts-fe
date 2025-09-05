import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import { useEffect, useState } from "react";
import EndOfPage from "../../components/endOfPage";
import apiClient from "../../utils/axiosConfig";

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import type {
	ColorType,
	SearchedUserInfo,
	UserMiniInfo,
} from "../../data/adminData";
import StatusMessage from "../../components/statusMessage";
import RefreshButton from "../../components/refreshButton";
import CustomButton from "../../components/customButton";
import Spinner from "../../components/spinner";
import { Link } from "react-router-dom";

type FriendsType = "active" | "sent" | "received";

interface FriendsCountInfo {
	active: number;
	sent: number;
	received: number;
}

interface TabInfo {
	id: number;
	label: string;
	type: FriendsType;
}

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
	const [friendsCount, setFriendsCount] = useState<FriendsCountInfo | null>(
		null
	);

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchSearchedUsers = async (term: string) => {
		// setIsLoading(true);
		setIsSearchLoading(true);
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
		setFriends([]);
		try {
			const response = await apiClient.get(`/get-friends?type=${type}`);
			const { friends, count } = response.data;
			setFriends(friends);
			setFriendsCount(count);
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
		setFriendsCount((prev) => {
			if (!prev) return null;
			if (action == "add") {
				return {
					...prev,
					sent: prev.sent + 1,
				};
			} else if (action == "accept") {
				return {
					...prev,
					active: prev.active + 1,
					received: prev.received - 1,
				};
			} else if (action == "cancel") {
				return {
					...prev,
					sent: prev.sent - 1,
				};
			} else if (action == "remove") {
				return {
					...prev,
					active: prev.active - 1,
				};
			} else if (action == "reject") {
				return {
					...prev,
					received: prev.received - 1,
				};
			}
			return prev;
		});
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
		const { id, username, fullname } = user;

		switch (user.status) {
			case "friends":
				return (
					<span className="text-xs text-green-400 font-semibold">
						FRIEND
					</span>
				);
			case "request_received":
				return (
					<span className="text-xs text-amber-400 font-semibold">
						REQUEST RECEIVED
					</span>
				);
			case "request_sent":
				return (
					<span className="text-xs text-amber-400 font-semibold">
						REQUEST SENT
					</span>
				);
			default:
				return (
					<CustomButton
						label="ADD FRIEND"
						color="blue"
						onClick={() => friendQuery("add", { id, username, fullname })}
						size="sm"
						className="shadow"
						disabled={isSearchLoading}
					/>
				);
		}
	};

	const getColorType = (btn: string): ColorType => {
		switch (btn) {
			case "accept":
				return "emerald";
			case "reject":
				return "red";
			case "cancel":
				return "yellow";
			case "remove":
				return "red";
			default:
				return "blue";
		}
	};

	const handleRefreshListClick = async () => {
		if (searchTerm !== "") {
			await fetchSearchedUsers(searchTerm);
		}
		fetchFriends(activeTab);
	};

	const tabs: TabInfo[] = [
		{ id: 1, label: "ACTIVE", type: "active" },
		{ id: 2, label: "REQUEST RECEIVED", type: "received" },
		{ id: 3, label: "REQUEST SENT", type: "sent" },
	];

	const getLabel = (tab: TabInfo): string => {
		if (friendsCount && friendsCount[tab.type] > 0) {
			return `${tab.label} (${friendsCount[tab.type]})`;
		}
		return tab.label;
	};

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold">
					<FontAwesomeIcon icon="caret-right" /> My Friends
				</h1>
				<p className="font-medium text-sm my-1">
					<span>
						Add friends and manage your existing friends list here.
					</span>
				</p>

				<RefreshButton
					label="REFRESH LIST"
					size="sm"
					color="sky"
					className="mt-2 mb-3 shadow"
					onClick={handleRefreshListClick}
				/>

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
							<div className="flex flex-wrap text-xs md:text-sm border-y border-gray-500 overflow-hidden">
								{tabs.map((tab) => (
									<button
										key={tab.id}
										className={`flex-1 font-bold text-gray-300 border-r border-gray-500 last:border-r-0 py-1 ${
											activeTab == tab.type
												? "bg-gray-500 text-yellow-400"
												: "hover:text-gray-400 cursor-pointer"
										}`}
										onClick={() => setActiveTab(tab.type)}
										disabled={isLoading}
									>
										{getLabel(tab)}
									</button>
								))}
							</div>

							<div className="h-57 overflow-y-auto">
								{friends && friends.length > 0 ? (
									<ul>
										{friends.map((friend) => (
											<li
												key={friend.id}
												className="even:bg-gray-700 odd:bg-gray-700/30 text-sm text-white px-2 py-1.5 flex items-center justify-between border-b border-gray-500"
											>
												<p>
													<FontAwesomeIcon
														icon="user"
														className="mr-2"
													/>
													<Link
														to={`/users/${friend.username}`}
														className="hover:text-gray-400"
													>
														{friend.username}
													</Link>
												</p>
												<div className="space-x-1">
													{buttons.map((btn) => (
														<CustomButton
															key={btn}
															label={btn.toUpperCase()}
															color={getColorType(btn)}
															onClick={() =>
																friendQuery(btn, friend)
															}
															size="sm"
															className="shadow"
															disabled={isSearchLoading}
														/>
													))}
												</div>
											</li>
										))}
									</ul>
								) : (
									<>
										{isLoading ? (
											<Spinner />
										) : (
											<p className="px-3 py-2 h-full text-gray-400">
												No users to display.
											</p>
										)}
									</>
								)}
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
										disabled={isSearchLoading}
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
								<div className="border  mt-3 border-zinc-500 bg-gray-800 h-34 xl:h-47 overflow-y-auto">
									{searchedUsers.length > 0 ? (
										<ul>
											{searchedUsers.map((user) => (
												<li
													key={user.id}
													className="odd:bg-gray-700 text-sm text-white px-2 py-1 flex items-center justify-between"
												>
													<p>
														<FontAwesomeIcon icon="user" />{" "}
														{user.username}
													</p>
													{renderButton(user)}
												</li>
											))}
										</ul>
									) : (
										<>
											{isSearchLoading ? (
												<Spinner />
											) : (
												<p className="px-3 py-2 h-full text-gray-400">
													No users to display.
												</p>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<EndOfPage />
		</ContentBase>
	);
};

export default FriendsList;
