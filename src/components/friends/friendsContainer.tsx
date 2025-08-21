import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { UserMiniInfo } from "../../data/adminData";

interface FriendsContainerProps {
	label: string;
	btnLabel: string;
	btnAction: "remove" | "add" | "cancel" | "accept";
	friends: UserMiniInfo[];
	isLoading: boolean;
	onClick: (action: string, user_id: number) => void;
}
const FriendsContainer = ({
	label,
	btnLabel,
	btnAction,
	friends,
	isLoading,
	onClick,
}: FriendsContainerProps) => {
	const btnClass = (): string => {
		switch (btnAction) {
			case "remove":
				return "bg-red-500 hover:bg-red-500";
			case "add":
				return "bg-blue-500 hover:bg-blue-500";
			case "cancel":
				return "bg-amber-500 hover:bg-amber-500";
			case "accept":
				return "bg-green-500 hover:bg-green-500";
			default:
				return "bg-gray-500 hover:bg-gray-500";
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
								<button
									className={`cursor-pointer  text-white text-xs px-2 py-0.5 rounded font-bold ${btnClass()}`}
									onClick={() => onClick(btnAction, friend.id)}
								>
									{btnLabel}
								</button>
							</li>
						))}
					</ul>
				) : (
					<p className="p-2 bg-gray-500 text-white">
						{isLoading ? `Fetching ${label} ` : `No ${label} to display`}
					</p>
				)}
			</div>
		</div>
	);
};

export default FriendsContainer;
