import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { UserMiniInfo } from "../../data/adminData";

interface FriendsContainerProps {
	label: string;
	buttons: string[];
	friends: UserMiniInfo[];
	isLoading: boolean;
	onClick: (action: string, user_id: number) => void;
}
const FriendsContainer = ({
	label,
	buttons,
	friends,
	isLoading,
	onClick,
}: FriendsContainerProps) => {
	const btnClass = (btn: string): string => {
		switch (btn) {
			case "remove":
				return "bg-red-500 hover:bg-red-400";
			case "add":
				return "bg-blue-500 hover:bg-blue-400";
			case "cancel":
				return "bg-amber-500 hover:bg-amber-400";
			case "accept":
				return "bg-green-500 hover:bg-green-400";
			case "reject":
				return "bg-red-500 hover:bg-red-400";
			default:
				return "bg-gray-500 hover:bg-gray-400";
		}
	};

	return (
		<div className="border border-gray-400 rounded-t overflow-hidden">
			<h2 className="bg-gray-800 text-white px-3 py-2 font-semibold">
				{label}
			</h2>
			<div className="bg-gray-500 h-full max-h-41 overflow-y-auto shadow-inset">
				{friends && friends.length > 0 ? (
					<ul>
						{friends.map((friend) => (
							<li
								key={friend.id}
								className="odd:bg-gray-600 even:bg-gray-700 text-white px-2 py-2 flex items-center justify-between last:border-b border-gray-300"
							>
								<p>
									<FontAwesomeIcon icon="user" /> {friend.username}
								</p>
								<div className="space-x-1">
									{buttons.map((btn) => (
										<button
											key={btn}
											className={`cursor-pointer  text-white text-xs px-2 py-0.5 rounded font-bold ${btnClass(
												btn
											)}`}
											onClick={() => onClick(btn, friend.id)}
										>
											{btn.toUpperCase()}
										</button>
									))}
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className="p-2 bg-gray-500 text-white">
						{isLoading ? `Fetching ${label} ` : `No ${label} found.`}
					</p>
				)}
			</div>
		</div>
	);
};

export default FriendsContainer;
