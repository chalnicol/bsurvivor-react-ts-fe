import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import React, { useEffect, useState } from "react";
import EndOfPage from "../../components/endOfPage";
import apiClient from "../../utils/axiosConfig";

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import type {
	ColorType,
	SearchedUserInfo,
	TabInfo,
	UserMiniInfo,
} from "../../data/adminData";
import StatusMessage from "../../components/statusMessage";
import { Link, useSearchParams } from "react-router-dom";
import CustomButton from "../../components/customButton";
import MenuBar from "../../components/menuBar";
import Spinner from "../../components/spinner";

export type FriendsTab = "active" | "sent" | "received" | "search";

// interface FriendsCountInfo {
// 	active: number;
// 	sent: number;
// 	received: number;
// }

interface FriendsTabInfo extends TabInfo<FriendsTab> {}

const FriendsList = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	// const [activeTab, setActiveTab]
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchedUsers, setSearchedUsers] = useState<SearchedUserInfo[]>([]);
	const [friends, setFriends] = useState<UserMiniInfo[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// const [activeTab, setActiveTab] = useState<FriendsTab>("active");
	const activeTab: FriendsTab =
		(searchParams.get("tab") as FriendsTab) || "active";

	const [buttons, setButtons] = useState<string[]>([]);
	const [friendsCount, setFriendsCount] = useState<Record<
		FriendsTab,
		number
	> | null>(null);

	const inputRef = React.useRef<HTMLInputElement>(null);

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchSearchedUsers = async (term: string) => {
		// setIsLoading(true);
		setIsLoading(true);
		setSearchedUsers([]);
		try {
			const response = await apiClient.get(`/search-users?search=${term}`);
			setSearchedUsers(response.data.users);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSearchedUsers(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const fetchFriends = async (type: string) => {
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
		if (activeTab !== "search") {
			fetchFriends(activeTab);
		} else {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	}, [activeTab]);

	// useEffect(() => {
	// 	// Check if the 'page' parameter is missing from the URL
	// 	if (!searchParams.get("tab")) {
	// 		// If it's missing, add it to the URL with the default value of '1'
	// 		// The { replace: true } option ensures a new history entry is NOT created
	// 		setSearchParams({ tab: "active" }, { replace: true });
	// 	}
	// }, [searchParams, setSearchParams]);

	const tabs: FriendsTabInfo[] = [
		{ id: 1, label: "FRIENDS", tab: "active", type: "button" },
		{ id: 2, label: "REQUEST SENT", tab: "sent", type: "button" },
		{ id: 3, label: "REQUEST RECEIVED", tab: "received", type: "button" },
		{ id: 4, label: "FRIENDS SEARCH", tab: "search", type: "button" },
	];

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
		// if (action == "add") {
		// 	if (activeTab == "sent") {
		// 		setFriends((prev) => {
		// 			return [...prev, user];
		// 		});
		// 	}
		// }

		if (action !== "add") {
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
		if (user.status == "not_friends") {
			return (
				<CustomButton
					label="ADD FRIEND"
					color="blue"
					onClick={() => friendQuery("add", user)}
					size="sm"
					className="px-4"
					disabled={isLoading}
				/>
			);
		}
		if (user.status == "request_sent") {
			return (
				<p className="font-bold text-xs text-orange-400">REQUEST SENT</p>
			);
		}
		if (user.status == "request_received") {
			return (
				<p className="font-bold text-xs text-lime-200">REQUEST RECEIVED</p>
			);
		}
		if (user.status == "friends") {
			return <p className="font-bold text-xs text-emerald-300">FRIEND</p>;
		}
		return <span>--</span>;
	};

	const getColorType = (btn: string): ColorType => {
		switch (btn) {
			case "accept":
				return "green";
			case "reject":
				return "red";
			case "cancel":
				return "amber";
			case "remove":
				return "red";
			default:
				return "blue";
		}
	};

	// const handleRefreshListClick = async () => {
	// 	if (searchTerm !== "") {
	// 		await fetchSearchedUsers(searchTerm);
	// 	}
	// 	fetchFriends(activeTab);
	// };

	const handleTabCLick = (tab: FriendsTab) => {
		// setActiveTab(tab);
		setSearchParams({ tab: tab }, { replace: true });
		// if (tab !== "search") {
		// 	fetchFriends(tab);
		// }
	};

	const getLabel = (tab: FriendsTabInfo): string => {
		if (friendsCount && friendsCount[tab.tab] > 0) {
			return `${tab.label} (${friendsCount[tab.tab]})`;
		}
		return tab.label;
	};

	return (
		<>
			<title>{`FRIENDS | ${import.meta.env.VITE_APP_NAME}`}</title>
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

					{/* <RefreshButton
					label="REFRESH LIST"
					size="sm"
					color="sky"
					className="mt-2 mb-3 shadow"
					onClick={handleRefreshListClick}
				/> */}

					<div className="mt-5">
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
						{/*friends */}
						<div className="flex flex-col md:flex-row border border-gray-400 rounded overflow-hidden bg-gray-800 h-100">
							<div className="block md:hidden border-b border-gray-300 px-3 py-1.5">
								<MenuBar<FriendsTab>
									activeTab={activeTab}
									tabs={tabs}
									onClick={handleTabCLick}
									tabsCount={friendsCount}
									isLoading={isLoading}
									className="text-white"
								/>
							</div>

							<div className="flex-none hidden md:flex flex-col text-sm border-e border-gray-500 p-3 space-y-1.5 min-w-50 lg:min-w-60">
								{tabs.map((t) => (
									<button
										key={t.id}
										className={`font-bold text-left text-gray-300 border border-gray-400 py-1.5 px-3 ${
											activeTab == t.tab
												? "text-yellow-500"
												: "bg-gray-700 hover:bg-gray-600 cursor-pointer"
										}`}
										onClick={() => handleTabCLick(t.tab)}
										disabled={isLoading}
									>
										{getLabel(t)}
									</button>
								))}
							</div>
							<div className="flex-1 p-3">
								<div className="h-full overflow-y-auto">
									{activeTab !== "search" ? (
										<>
											{friends && friends.length > 0 ? (
												<ul>
													{friends.map((friend) => (
														<li
															key={friend.id}
															className="odd:bg-gray-700  text-sm text-white px-3 py-0.5 flex items-center justify-between border-b border-gray-500"
														>
															<Link
																to={`/users/${friend.username}`}
																className="group flex items-center"
															>
																<div>
																	<FontAwesomeIcon
																		icon="user"
																		size="lg"
																		className="mr-2"
																	/>
																</div>
																<div>
																	<p className="group-hover:text-gray-300">
																		{friend.fullname}
																	</p>
																	<p className="text-xs text-gray-300 group-hover:text-gray-400">
																		{friend.username}
																	</p>
																</div>
															</Link>
															<div className="space-x-1">
																{buttons.map((btn) => (
																	<CustomButton
																		key={btn}
																		label={btn.toUpperCase()}
																		color={getColorType(btn)}
																		onClick={() =>
																			friendQuery(
																				btn,
																				friend
																			)
																		}
																		size="sm"
																		className="shadow"
																		disabled={isLoading}
																	/>
																))}
															</div>
														</li>
													))}
												</ul>
											) : (
												<>
													{isLoading ? (
														<Spinner size="sm" />
													) : (
														<p className="px-3 py-2 bg-gray-600 text-white">
															No users to display.
														</p>
													)}
												</>
											)}
										</>
									) : (
										<div className="flex flex-col w-full h-full">
											<div className="flex items-center border-b border-gray-400">
												<input
													ref={inputRef}
													type="text"
													value={searchTerm}
													onChange={handleSearchInputChange}
													className="flex-1 px-1 py-1 font-medium text-white focus:outline-none"
													placeholder="Search users here..."
													// disabled={isSearchLoading}
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
											<div className="flex-1 mt-3 border border-gray-500 bg-gray-800 overflow-y-auto">
												{searchedUsers.length > 0 ? (
													<ul>
														{searchedUsers.map((user) => (
															<li
																key={user.id}
																className="odd:bg-gray-700/40 border-b border-gray-600 text-sm text-white px-2 py-1 flex items-center justify-between"
															>
																<Link
																	to={`/users/${user.username}`}
																	className="group flex items-center"
																>
																	<div>
																		<FontAwesomeIcon
																			icon="user"
																			size="lg"
																			className="mr-2"
																		/>
																	</div>
																	<div>
																		<p className="group-hover:text-gray-300">
																			{user.fullname}
																		</p>
																		<p className="text-xs text-gray-300 group-hover:text-gray-400">
																			{user.username}
																		</p>
																	</div>
																</Link>

																{renderButton(user)}
															</li>
														))}
													</ul>
												) : (
													<>
														{isLoading ? (
															<Spinner size="sm" />
														) : (
															<p className="px-3 py-2 h-full text-gray-400">
																No users to display.
															</p>
														)}
													</>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* {(isLoading || isSearchLoading) && <Loader />} */}
				<EndOfPage />
			</ContentBase>
		</>
	);
};

export default FriendsList;
