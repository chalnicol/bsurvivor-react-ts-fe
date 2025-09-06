import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { NotificationInfo } from "../data/adminData";
import { Link } from "react-router-dom";
import { displayLocalDate } from "../utils/dateTime";
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
		} else if (type == "CommentToEntry") {
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

	return (
		<div
			key={notification.id}
			className={`px-3 py-2 border-b border-gray-400 last:border-b-0 select-none flex items-center gap-x-4 cursor-pointer ${
				isOpen ? "bg-gray-800" : "hover:bg-gray-600"
			}`}
		>
			<div
				className="flex-1 space-y-0.5"
				onClick={() => onClick(notification.id, notification.is_read)}
			>
				<p
					className={`space-x-2 ${
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

				<div className="sm:flex items-center gap-x-3 space-y-1 sm:space-y-0 mt-1">
					<div className="text-xs space-x-2 flex">
						<p className="text-orange-400 bg-zinc-600 px-1 min-w-10 font-semibold">
							ID
						</p>
						<p className="text-gray-400">{notification.id}</p>
					</div>
					<div className="text-xs space-x-2 flex">
						<p className="text-orange-400 bg-zinc-600 px-1 min-w-10 font-semibold">
							Date
						</p>
						<p className="text-gray-400">
							{displayLocalDate(notification.created_at)}
						</p>
					</div>
				</div>
			</div>
			<button
				className="flex-nonehover:text-gray-700 cursor-pointer ms-auto w-7 h-7 rounded-full border bg-gray-300 text-gray-600"
				onClick={() => onDelete(notification)}
			>
				<FontAwesomeIcon icon="trash" size="sm" />
			</button>
		</div>
	);
};
export default Notification;
