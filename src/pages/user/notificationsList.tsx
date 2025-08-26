import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import type { MetaInfo, NotificationInfo } from "../../data/adminData";
import { useEffect, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import Pagination from "../../components/pagination";
import EndOfPage from "../../components/endOfPage";
import Loader from "../../components/loader";
import StatusMessage from "../../components/statusMessage";
import ToDelete from "../../components/toDelete";
import { useAuth } from "../../context/auth/AuthProvider";
import Notification from "../../components/notifications";

const NotificationsList = () => {
	const {
		// user,
		fetchUnreadCount,
		updateUnreadCount,
	} = useAuth();

	const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [toDelete, setToDelete] = useState<NotificationInfo | null>(null);
	const [isActiveButton, setIsActiveButton] = useState<boolean>(false);
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
			setIsActiveButton(false);
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
		// setToView(null);
		fetchUnreadCount();
		if (currentPage > 1) {
			setCurrentPage(1);
		} else {
			fetchNotifications(1);
			// setCurrentPage(1);
		}
	};

	useEffect(() => {
		fetchNotifications(currentPage);
		fetchUnreadCount();
	}, [currentPage]);

	useEffect(() => {
		let timer: number;
		if (!isActiveButton) {
			timer = setTimeout(() => {
				setIsActiveButton(true);
			}, 5000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [isActiveButton]);

	// useEffect(() => {
	// 	if (!user) return;

	// 	window.Echo.private(`users.${user.id}`).notification(() => {
	// 		setHasNewNotifications(true);
	// 	});
	// 	return () => {
	// 		window.Echo.leaveChannel(`users.${user.id}`);
	// 	};
	// }, [user]);

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
					{isActiveButton ? (
						<button
							className={`text-xs text-white px-3 py-0.5 rounded font-semibold bg-sky-500 hover:bg-sky-400 cursor-pointer`}
							onClick={handleRefreshClick}
						>
							REFRESH LIST
						</button>
					) : (
						<span className="text-xs text-white px-3 py-1 rounded font-semibold bg-sky-300 opacity-80 select-none">
							REFRESH LIST
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
								{notifications.map((notification) => (
									<Notification
										key={notification.id}
										notification={notification}
										toView={toView}
										onClick={handleNotificationClick}
										onDelete={handleDeleteNotification}
									/>
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
