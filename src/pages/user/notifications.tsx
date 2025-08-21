import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContentBase from "../../components/contentBase";
import type { MetaInfo, NotificationInfo } from "../../data/adminData";
import { useEffect, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import Pagination from "../../components/pagination";
import EndOfPage from "../../components/endOfPage";
import Loader from "../../components/loader";

const NotificationsList = () => {
	const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [meta, setMeta] = useState<MetaInfo | null>(null);

	const fetchNotifications = async (page: number) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get(
				`/get-notifications?page=${page}`
			);
			setNotifications(response.data.data);
			setMeta(response.data.meta);
			setCurrentPage(page);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleNotificationClick = async (id: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.put("/mark-read", {
				notification_id: id,
			});
			updateNotifications(id);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
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

	useEffect(() => {
		fetchNotifications(currentPage);
	}, [currentPage]);

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold">
					<FontAwesomeIcon icon="caret-right" /> My Notifications
				</h1>
				<p className="font-medium text-sm my-1">
					You can view all your notifications here.
				</p>

				<button
					className="text-xs bg-sky-500 hover:bg-sky-400 cursor-pointer text-white px-2 py-1 rounded font-semibold mt-2"
					onClick={() => fetchNotifications(1)}
				>
					REFRESH LIST
				</button>

				<div className="mt-4 bg-gray-700 text-white overflow-hidden">
					{notifications.length > 0 ? (
						<>
							{notifications.map((notif) => (
								<div
									key={notif.id}
									className={`px-3 py-2 border-b border-gray-400 last:border-b-0 text-white rounded text-gray-700 cursor-pointer ${
										notif.is_read ? "" : "font-semibold bg-gray-600"
									}`}
									onClick={() => handleNotificationClick(notif.id)}
								>
									{notif.data.message}
								</div>
							))}
						</>
					) : (
						<p className="px-3 py-2 bg-gray-300 rounded text-gray-700">
							{isLoading ? "Loading..." : "No notifications found."}
						</p>
					)}
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
