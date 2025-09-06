import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface NotificationLinkProps {
	unreadCount: number;
	className?: string;
}

const NotificationLink = ({
	unreadCount,
	className,
}: NotificationLinkProps) => {
	return (
		<div className={`relative ${className}`}>
			<Link to="/notifications" className="hover:text-gray-400 px-1">
				<FontAwesomeIcon icon="bell" size="lg" />
				{unreadCount > 0 && (
					<p className="bg-red-500 font-bold rounded-full text-[0.65rem] text-white absolute bottom-2.5 left-3 z-10 w-4 text-center leading-4 h-auto aspect-square">
						{unreadCount > 99 ? "99+" : unreadCount}
					</p>
				)}
			</Link>
		</div>
	);
};

export default NotificationLink;
