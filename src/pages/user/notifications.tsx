import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import type { MetaInfo, NotificationInfo } from "../../data/adminData";
import { useEffect, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import Pagination from "../../components/pagination";
import EndOfPage from "../../components/endOfPage";
import Loader from "../../components/loader";
import { displayLocalDate } from "../../utils/dateTime";
import StatusMessage from "../../components/statusMessage";
import ToDelete from "../../components/toDelete";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";

const NotificationsList = () => {
	const { user, updateUnreadCount } = useAuth();

	const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [toDelete, setToDelete] = useState<NotificationInfo | null>(null);
	const [hasNewNotifications, setHasNewNotifications] =
		useState<boolean>(false);
	const [toView, setToView] = useState<string | null>(null);

	const fetchNotifications = async (page: number) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get(
				`/get-notifications?page=${page}`
			);
			setNotifications(response.data.data);
			setMeta(response.data.meta);
			setCurrentPage(page);
			setHasNewNotifications(false);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const markAsRead = async (id: string) => {
		setIsLoading(true);
		try {
			await apiClient.put("/mark-as-read-notification", {
				notification_id: id,
			});
			updateNotifications(id);
			updateUnreadCount("decrement");
			setToView(id);
		} catch (error: any) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteNotification = async () => {
		if (!toDelete) return;
		setIsLoading(true);
		try {
			await apiClient.delete(`/delete-notification/${toDelete.id}`);
			setSuccess("Notification deleted successfully.");
			setNotifications((prev) =>
				prev.filter((notif) => notif.id !== toDelete.id)
			);
			if (!toDelete.is_read) {
				updateUnreadCount("decrement");
			}
			if (meta) {
				const newTotal = notifications.length - 1;
				if (newTotal === 0 && meta.current_page > 1) {
					setCurrentPage((prev) => prev - 1);
				} else {
					fetchNotifications(currentPage);
				}
			}
		} catch (error: any) {
			setError(error.message);
		} finally {
			setToDelete(null);
			setIsLoading(false);
		}
	};

	const handleNotificationClick = (id: string, is_read: boolean) => {
		if (!is_read) {
			markAsRead(id);
		} else {
			if (toView && toView === id) {
				setToView(null);
			} else {
				setToView(id);
			}
		}
		setError(null);
		setSuccess(null);
		setToDelete(null);
	};

	const handleDeleteNotification = (notif: NotificationInfo) => {
		setToDelete(notif);
		setSuccess(null);
		setError(null);
	};

	const updateNotifications = (id: string) => {
		setNotifications((prev) => {
			return prev.map((notif) => {
				if (notif.id === id) {
					return {
						...notif,
						is_read: true,
					};
				}
				return notif;
			});
		});
	};

	const handlePageClick = (page: number) => {
		setCurrentPage(page);
	};

	const handleRefreshClick = () => {
		fetchNotifications(1);
		setCurrentPage(1);
	};

	useEffect(() => {
		fetchNotifications(currentPage);
	}, [currentPage]);

	useEffect(() => {
		if (!user) return;

		window.Echo.private(`users.${user.id}`).notification(() => {
			setHasNewNotifications(true);
		});
		return () => {
			window.Echo.leaveChannel(`users.${user.id}`);
		};
	}, [user]);

	const renderLink = (type: string, url: string): React.ReactNode => {
		if (type == "FriendRequestSent") {
			return (
				<Link
					to={url}
					className="text-white bg-amber-500 hover:bg-amber-400 text-xs px-2 mx-2 rounded font-bold"
				>
					FRIENDS
				</Link>
			);
		}
		return (
			<Link
				to={url}
				className="text-white bg-sky-500 hover:bg-sky-400 text-xs px-2 mx-2 rounded font-bold"
			>
				PAGE
			</Link>
		);
	};

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold">
					<FontAwesomeIcon icon="caret-right" /> My Notifications
				</h1>
				<p className="font-medium text-sm my-1">
					You can view all your notifications here.
				</p>

				<div className="mt-3 mb-4">
					{hasNewNotifications ? (
						<button
							className={`text-xs text-white px-3 py-1 rounded font-semibold bg-sky-500 hover:bg-sky-400 cursor-pointer`}
							onClick={handleRefreshClick}
						>
							GET NEW NOTIFICATIONS
						</button>
					) : (
						<span className="text-xs text-white px-3 py-1 rounded font-semibold bg-sky-400 opacity-80 select-none">
							GET NEW NOTIFICATIONS
						</span>
					)}
				</div>

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

				{toDelete && (
					<ToDelete
						name={toDelete.id}
						onConfirm={deleteNotification}
						onCancel={() => setToDelete(null)}
					/>
				)}

				<div className="mt-2 overflow-x-auto">
					<div className="bg-gray-700 text-white overflow-hidden rounded min-w-[350px]">
						{notifications.length > 0 ? (
							<>
								{notifications.map((notif) => (
									<div
										key={notif.id}
										className={`px-3 py-2 border-b border-gray-400 last:border-b-0 select-none flex items-center gap-x-2 cursor-pointer ${
											notif.id === toView && "bg-gray-800"
										}`}
									>
										{!notif.is_read && (
											<FontAwesomeIcon icon="circle" size="2xs" />
										)}
										<div
											className="flex-1 space-y-0.5"
											onClick={() =>
												handleNotificationClick(
													notif.id,
													notif.is_read
												)
											}
										>
											<p
												className={`${
													notif.is_read
														? "text-gray-200"
														: "text-white font-semibold"
												}`}
											>
												{notif.data.message}
											</p>
											{toView && toView === notif.id && (
												<p className="text-sm  max-w-md my-2 py-2 border-t border-gray-400">
													View
													{renderLink(notif.type, notif.data.url)}
												</p>
											)}
											<div className="sm:flex items-center gap-x-3 space-y-1 sm:space-y-0">
												<p className="text-xs text-orange-400">
													Date:{" "}
													<span className="text-gray-400">
														{displayLocalDate(notif.created_at)}
													</span>
												</p>
												<p className="text-xs text-orange-400">
													ID:{" "}
													<span className="text-gray-400">
														{notif.id}
													</span>
												</p>
											</div>
										</div>
										<button
											className="hover:text-gray-700 cursor-pointer ms-auto w-7 h-7 rounded-full border bg-gray-300 text-gray-600"
											onClick={() => handleDeleteNotification(notif)}
										>
											<FontAwesomeIcon icon="trash" size="sm" />
										</button>
									</div>
								))}
							</>
						) : (
							<p className="px-3 py-2 bg-gray-300 text-gray-700">
								{isLoading ? "Loading..." : "No notifications found."}
							</p>
						)}
					</div>
				</div>

				<Pagination
					meta={meta}
					onPageChange={handlePageClick}
					className="mt-5"
				/>
			</div>
			{isLoading && <Loader />}
			<EndOfPage />
		</ContentBase>
	);
};

export default NotificationsList;
