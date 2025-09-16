import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NotificationInfo } from "../data/adminData";
import { Link } from "react-router-dom";
import { getRelativeTime } from "../utils/dateTime";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface NotificationProps {
	notification: NotificationInfo;
	toView: string | null;
	onClick: (id: string, is_read: boolean) => void;
	onDelete: (notification: NotificationInfo) => void;
}
const Notification = ({
	notification,
	toView,
	onClick,
	onDelete,
}: NotificationProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [displayTime, setDisplayTime] = useState<string>("");

	const contentRef = useRef<HTMLDivElement>(null);

	const renderLink = (type: string, url: string): React.ReactNode => {
		let bgClass = "";
		let label = "";

		if (type == "FriendRequestSentNotification") {
			bgClass = "bg-amber-500 hover:bg-amber-400";
			label = "FRIENDS";
		} else if (
			type == "WelcomeUserNotification" ||
			type == "PasswordResetSuccess"
		) {
			bgClass = "bg-emerald-500 hover:bg-emerald-400";
			label = "PROFILE";
		} else if (type == "BracketEntryUpdated") {
			bgClass = "bg-rose-500 hover:bg-rose-400";
			label = "ENTRY";
		} else if (type == "CommentToEntry" || type == "RepliedToComment") {
			bgClass = "bg-orange-500 hover:bg-orange-400";
			label = "COMMENT";
		} else {
			bgClass = "bg-gray-500 hover:bg-gray-400";
			label = "PAGE";
		}

		return (
			<Link
				to={url}
				className={`text-white text-xs px-2 py-0.5 mx-2 rounded font-bold ${bgClass}`}
			>
				{label}
			</Link>
		);
	};

	const openAnim = () => {
		if (contentRef.current) {
			gsap.fromTo(
				contentRef.current,
				{ height: 0 },
				{
					height: "auto",
					duration: 0.4,
					ease: "power4.out",
					transformOrigin: "0% 100%",
				}
			);
		}
	};

	useEffect(() => {
		setIsOpen(toView === notification.id);
	}, [notification.id, toView]);

	useEffect(() => {
		if (isOpen) {
			openAnim();
		}
		return () => {
			if (contentRef.current) {
				gsap.killTweensOf(contentRef.current);
			}
		};
	}, [isOpen]);

	useEffect(() => {
		setDisplayTime(getRelativeTime(notification.created_at));

		const timer = setInterval(() => {
			setDisplayTime(getRelativeTime(notification.created_at));
		}, 60 * 1000);
		return () => clearInterval(timer);
	}, [notification.created_at]);

	return (
		<div
			key={notification.id}
			className={`px-3 py-2 border-b border-gray-500 last:border-b-0 select-none flex items-center gap-x-6 cursor-pointer ${
				isOpen ? "bg-gray-800" : "hover:bg-gray-600"
			}`}
		>
			<div
				className="flex-1 space-y-0.5"
				onClick={() => onClick(notification.id, notification.is_read)}
			>
				<p
					className={`space-x-2 text-sm ${
						notification.is_read
							? "text-gray-200"
							: "text-white font-semibold"
					}`}
				>
					{/* <FontAwesomeIcon
						icon={notification.is_read ? "envelope-open" : "envelope"}
					/> */}
					{!notification.is_read && (
						<FontAwesomeIcon icon="circle" size="2xs" />
					)}
					<span>{notification.data.message}</span>
				</p>

				{isOpen && (
					<div
						ref={contentRef}
						className="my-2 px-3 py-2 overflow-hidden bg-gray-700 rounded"
					>
						<div className="flex items-center text-xs">
							<span>View</span>
							{renderLink(notification.type, notification.data.url)}
						</div>
					</div>
				)}

				<div className="flex text-xs text-gray-400 gap-x-2 mt-1">
					<p>{displayTime}</p>
					<p>ID: {notification.id}</p>
				</div>
			</div>
			<button
				className="flex-none hover:bg-gray-400 cursor-pointer ms-auto px-1 w-6 aspect-square rounded-full border bg-gray-300 text-gray-600"
				onClick={() => onDelete(notification)}
			>
				<FontAwesomeIcon icon="trash" size="xs" />
			</button>
		</div>
	);
};
export default Notification;
