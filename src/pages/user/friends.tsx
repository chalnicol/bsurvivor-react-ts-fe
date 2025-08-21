import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import { useEffect, useMemo, useState } from "react";
import EndOfPage from "../../components/endOfPage";
import apiClient from "../../utils/axiosConfig";

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import Loader from "../../components/loader";
import type {
	FriendsInfo,
	SearchedUserInfo,
	UserMiniInfo,
} from "../../data/adminData";
import FriendsContainer from "../../components/friends/friendsContainer";
import StatusMessage from "../../components/statusMessage";

const FriendsList = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [searchedUsers, setSearchedUsers] = useState<UserMiniInfo[]>([]);
	const [friends, setFriends] = useState<FriendsInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchSearchedUsers = async (term: string) => {
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

	const fetchFriends = async () => {
		setIsLoading(true);
		setFriends(null);
		try {
			const response = await apiClient.get("/get-friends");
			setFriends(response.data.friends);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchFriends();
	}, []);

	const modifiedSearchedUsers = useMemo((): SearchedUserInfo[] => {
		if (!friends || !searchedUsers) {
			return [];
		}

		const activeFriendsIds = friends.active_friends.map(
			(friend) => friend.id
		);
		const toAcceptFriendsIds = friends.to_accept_friends.map(
			(friend) => friend.id
		);
		const pendingFriendsIds = friends.pending_friends.map(
			(friend) => friend.id
		);

		return searchedUsers.map((user) => {
			return {
				...user,
				is_friend: activeFriendsIds.includes(user.id),
				has_pending_received: toAcceptFriendsIds.includes(user.id),
				has_pending_sent: pendingFriendsIds.includes(user.id),
				is_blocked: false,
			};
		});
	}, [friends, searchedUsers]);

	const friendQuery = async (action: string, user_id: number) => {
		setIsLoading(true);
		setError(null);
		setSuccess(null);
		try {
			const response = await apiClient.post("/friends-action", {
				user_id,
				action,
			});
			setFriends(response.data.friends);
			setSuccess(response.data.message);
		} catch (error: any) {
			console.error(error);
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// const updateSearchedUsers = (action: string, userId: number) => {
	// 	setSearchedUsers((prev) => {
	// 		return prev.map((user) => {
	// 			if (user.id === userId) {
	// 				if (action == "add") {
	// 					return {
	// 						...user,
	// 						has_pending_sent: true,
	// 					};
	// 				} else if (action == "cancel") {
	// 					return {
	// 						...user,
	// 						has_pending_sent: false,
	// 					};
	// 				} else if (action == "remove") {
	// 					return {
	// 						...user,
	// 						is_friend: false,
	// 					};
	// 				} else if (action == "accept") {
	// 					return {
	// 						...user,
	// 						is_friend: true,
	// 					};
	// 				}
	// 			}
	// 			return user;
	// 		});
	// 	});
	// };

	// const updateFriends = (action: string, user: UserMiniInfo) => {
	// 	setFriends((prev) => {
	// 		if (!prev) return null;
	// 		if (action == "add") {
	// 			return {
	// 				...prev,
	// 				pending_friends: [...prev.pending_friends, user],
	// 			};
	// 		} else if (action === "remove") {
	// 			const newActiveFriends = prev.active_friends.filter(
	// 				(friend) => friend.id !== user.id
	// 			);
	// 			return {
	// 				...prev,
	// 				active_friends: newActiveFriends,
	// 			};
	// 		} else if (action === "cancel") {
	// 			const newPendingFriends = prev.pending_friends.filter(
	// 				(friend) => friend.id !== user.id
	// 			);
	// 			return {
	// 				...prev,
	// 				pending_friends: newPendingFriends,
	// 			};
	// 		} else if (action == "accept") {
	// 			return {
	// 				...prev,
	// 				active_friends: [...prev.active_friends, user],
	// 				to_accept_friends: prev.to_accept_friends.filter(
	// 					(friend) => friend.id !== user.id
	// 				),
	// 			};
	// 		}
	// 		return prev;
	// 	});
	// };

	const renderButton = (user: SearchedUserInfo): React.ReactNode => {
		if (user.is_friend) {
			return <span className="text-xs text-green-400">IS FRIEND</span>;
		} else if (user.has_pending_sent) {
			return <span className="text-xs text-amber-400">REQUEST SENT</span>;
		} else if (user.has_pending_received) {
			return (
				<span className="text-xs text-amber-400">REQUEST RECEIVED</span>
			);
		}
		//
		return (
			<button
				className="bg-blue-500 hover:bg-blue-500 cursor-pointer text-white text-xs px-2 py-0.5 rounded font-bold"
				onClick={() => friendQuery("add", user.id)}
			>
				ADD FRIEND
			</button>
		);
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
					className="text-xs bg-sky-500 hover:bg-sky-400 cursor-pointer text-white px-2 py-1 rounded font-semibold mt-2"
					onClick={fetchFriends}
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

				<div className="w-full lg:flex space-y-4 lg:space-y-0 mt-4 gap-x-6">
					<div className="space-y-4 flex-2">
						{/* active friends */}

						<FriendsContainer
							label="Friend Request Sent"
							btnLabel="CANCEL"
							btnAction="cancel"
							onClick={friendQuery}
							isLoading={isLoading}
							friends={friends?.pending_friends || []}
						/>
						<FriendsContainer
							label="Friend Request Received"
							btnLabel="ACCEPT"
							btnAction="accept"
							onClick={friendQuery}
							isLoading={isLoading}
							friends={friends?.to_accept_friends || []}
						/>
						<FriendsContainer
							label="Active Friends"
							btnLabel="REMOVE"
							btnAction="remove"
							onClick={friendQuery}
							isLoading={isLoading}
							friends={friends?.active_friends || []}
						/>
						<FriendsContainer
							label="Blocked Friends"
							btnLabel="ADD FRIEND"
							btnAction="add"
							onClick={friendQuery}
							isLoading={isLoading}
							friends={[]}
						/>
					</div>
					{/* add friends */}
					<div className="flex-1">
						<div className="border border-gray-400 rounded overflow-hidden">
							<h2 className="bg-gray-800 text-white px-3 py-2 font-semibold">
								Add Friends
							</h2>
							<div className="p-3 bg-gray-500">
								<input
									type="search"
									value={searchTerm}
									onChange={handleSearchInputChange}
									className="px-2 py-1 font-medium border-gray-300 text-white border-b w-full focus:outline-none"
									placeholder="Search users here..."
								/>
								<div className="border mt-3 border-gray-400/70 bg-gray-500/50 h-33 overflow-y-auto">
									{modifiedSearchedUsers.length > 0 ? (
										<>
											{modifiedSearchedUsers.map((user) => (
												<li
													key={user.id}
													className="odd:bg-gray-600 even:bg-gray-700 text-white px-2 py-1 flex items-center justify-between"
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
										<p className="px-3 py-2 h-full text-white bg-gray-500">
											{isLoading
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
			{isLoading && <Loader />}
			<EndOfPage />
		</ContentBase>
	);
};

export default FriendsList;
