import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import type { NotificationInfo, PaginatedResponse } from "../../data/adminData";
import { useEffect, useRef, useState } from "react";
import apiClient from "../../utils/axiosConfig";
// import Pagination from "../../components/pagination";
import EndOfPage from "../../components/endOfPage";
import Loader from "../../components/loader";
import StatusMessage from "../../components/statusMessage";
import ToDelete from "../../components/toDelete";
import { useAuth } from "../../context/auth/AuthProvider";
import Notification from "../../components/notifications";
import CustomButton from "../../components/customButton";

const NotificationsList = () => {
	const { user, fetchUnreadCount, updateUnreadCount } = useAuth();

	const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);
	// const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [toDelete, setToDelete] = useState<NotificationInfo | null>(null);
	const [batchDelete, setBatchDelete] = useState<boolean>(false);
	const [hasNewNotifications, setHasNewNotifications] =
		useState<boolean>(false);
	const [toView, setToView] = useState<string | null>(null);
	const [notificationsTotal, setNotificationsTotal] = useState<number>(0);

	const isInitialMount = useRef<boolean>(false);

	const fetchNotifications = async (page: number) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<
				PaginatedResponse<NotificationInfo>
			>(`/notifications?page=${page}`);
			const { data, meta } = response.data;

			// setNotifications((prev) => [...prev, ...data]);
			setNotifications((prevNotifications) => {
				if (page === 1) {
					return data;
				}
				// Create a Set of all existing comment IDs for quick lookup
				const existingIds = new Set(
					prevNotifications.map((notification) => notification.id)
				);

				// Filter the new data to only include comments that are not already in our state
				const newUniqueNotifications = data.filter(
					(notification) => !existingIds.has(notification.id)
				);

				// Combine the old and new comments
				return [...prevNotifications, ...newUniqueNotifications];
			});

			setCurrentPage(meta.current_page);
			setLastPage(meta.last_page);
			setNotificationsTotal(meta.total);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const markAsRead = async (id: string) => {
		setIsLoading(true);
		try {
			await apiClient.put(`/notifications/${id}/mark-as-read`);
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
			await apiClient.delete(`/notifications/${toDelete.id}`);
			setSuccess("Notification deleted successfully.");
			setNotifications((prev) =>
				prev.filter((notif) => notif.id !== toDelete.id)
			);
			if (!toDelete.is_read) {
				updateUnreadCount("decrement");
			}
			setNotificationsTotal((prev) => prev - 1);
			refreshList();
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
		setBatchDelete(false);
	};

	const handleDeleteNotification = (notif: NotificationInfo) => {
		setToDelete(notif);
		setSuccess(null);
		setError(null);
		setBatchDelete(false);
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

	const loadMoreNotifications = () => {
		if (currentPage < lastPage) {
			fetchNotifications(currentPage + 1);
		}
	};

	const refreshList = () => {
		// setNotifications([]);
		setCurrentPage(1);
		setLastPage(1);
		setToView(null);
		//setError(null);
		//setSuccess(null);
		//setToDelete(null);
		setHasNewNotifications(false);
		//..
		fetchNotifications(1);
		fetchUnreadCount();
	};

	const deleteAll = async () => {
		if (notifications.length === 0) return;
		const ids = notifications.map((notification) => notification.id);
		setIsLoading(true);
		try {
			await apiClient.post("/notifications/delete-all", {
				ids: ids,
			});
			setSuccess("All notifications deleted successfully.");
			setNotifications([]);
			setNotificationsTotal(0);
			setBatchDelete(false);
			refreshList();
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const markAllAsRead = async () => {
		if (notifications.length === 0) return;

		const ids = notifications
			.filter((notification) => !notification.is_read)
			.map((notification) => notification.id);

		setIsLoading(true);
		try {
			await apiClient.put("/notifications/mark-all-as-read", { ids: ids });
			setSuccess("All notifications marked as read successfully.");
			setNotifications((prev) => {
				return prev.map((notif) => {
					return {
						...notif,
						is_read: true,
					};
				});
			});
			fetchUnreadCount();
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// useEffect(() => {
	// 	fetchNotifications(1);
	// 	fetchUnreadCount();
	// }, []);

	useEffect(() => {
		if (!isInitialMount.current) {
			fetchNotifications(1);
			fetchUnreadCount();
			isInitialMount.current = true;
		}
	}, [isInitialMount.current]);

	useEffect(() => {
		if (!user) {
			return; // Don't attach a new listener if we're already listening
		}

		// Attach the listener
		window.Echo.private(`users.${user.id}`).notification(() => {
			// console.log("data", data);
			setHasNewNotifications(true);
		});

		// The cleanup function
		return () => {
			window.Echo.leaveChannel(`users.${user.id}`);
		};
	}, [user]);

	const unreadCount = notifications.filter(
		(notification) => !notification.is_read
	).length;

	const getNotificationsCountString = (): string => {
		if (notifications.length > 0) {
			return `(${notifications.length})`;
		}
		return "";
	};

	const getUnreadCountString = (): string => {
		const unreadCount = notifications.filter(
			(notification) => !notification.is_read
		).length;
		if (unreadCount > 0) {
			return `(${unreadCount})`;
		}
		return "";
	};

	const handleBatchDelete = () => {
		setBatchDelete(true);
		setSuccess(null);
		setError(null);
		setToDelete(null);
	};

	return (
		<>
			<title>{`NOTIFICATIONS | ${import.meta.env.VITE_APP_NAME}`}</title>
			<ContentBase className="py-7 px-4">
				<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
					<h1 className="text-xl font-bold">
						<FontAwesomeIcon icon="caret-right" /> My Notifications{" "}
						{notificationsTotal > 0 ? `(${notificationsTotal})` : ""}
					</h1>
					<p className="font-medium text-sm my-1">
						You can view and manage all your notifications here.
					</p>

					<div className="mt-4 overflow-x-auto">
						<div className="space-x-1.5">
							<CustomButton
								onClick={refreshList}
								disabled={isLoading || !hasNewNotifications}
								size="sm"
								color="sky"
								className="px-2"
							>
								REFRESH LIST
							</CustomButton>
							<CustomButton
								onClick={markAllAsRead}
								disabled={isLoading || unreadCount === 0}
								size="sm"
								color="teal"
								className="px-2"
							>
								{`MARK ALL AS READ ${getUnreadCountString()}`}
							</CustomButton>
							<CustomButton
								onClick={handleBatchDelete}
								disabled={isLoading || notifications.length === 0}
								size="sm"
								color="red"
								className="px-2"
							>
								{`DELETE ALL ${getNotificationsCountString()}`}
							</CustomButton>
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
								// name={toDelete.id}
								prompt={`Are you sure you want to delete "${toDelete.id.substring(
									0,
									15
								)}..."`}
								onConfirm={deleteNotification}
								onCancel={() => setToDelete(null)}
							/>
						)}
						{batchDelete && (
							<ToDelete
								// name={toDelete.id}
								prompt={`Are you sure you want to delete all notifications on this page?`}
								onConfirm={deleteAll}
								onCancel={() => setBatchDelete(false)}
							/>
						)}

						{notifications.length > 0 ? (
							<>
								<div className="mt-2 bg-gray-700 text-white overflow-hidden rounded min-w-[350px]">
									{notifications.map((notification) => (
										<Notification
											key={notification.id}
											notification={notification}
											toView={toView}
											onClick={handleNotificationClick}
											onDelete={handleDeleteNotification}
										/>
									))}
								</div>
								<div className="mt-3 text-center">
									{currentPage < lastPage ? (
										<button
											className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white text-sm font-semibold px-4 py-1 rounded space-x-2"
											onClick={loadMoreNotifications}
										>
											<FontAwesomeIcon
												icon="arrow-alt-circle-down"
												size="sm"
											/>
											<span>LOAD MORE</span>
										</button>
									) : (
										<span className="text-gray-400 text-sm font-bold rounded mx-auto px-4 select-none">
											- END OF NOTIFICATIONS -
										</span>
									)}
								</div>
							</>
						) : (
							<p className="mt-2 px-3 py-2 bg-gray-300 text-gray-700">
								{isLoading ? "Loading..." : "No notifications found."}
							</p>
						)}
					</div>
				</div>
				{isLoading && <Loader />}
				<EndOfPage />
			</ContentBase>
		</>
	);
};

export default NotificationsList;
