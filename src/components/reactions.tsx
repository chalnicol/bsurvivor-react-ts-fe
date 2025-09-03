import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../context/auth/AuthProvider";
import { formatNumberShorthand } from "../utils/numbers";

interface ReactionVoteProps {
	likeableId: number;
	likeableParentId: number | null;
	userVote: "like" | "dislike" | null;
	likesCount: number;
	dislikesCount: number;
	size?: "lg";
	onVote: (
		id: number,
		parentId: number | null,
		vote: "like" | "dislike"
	) => void;
}
const ReactionVote = ({
	likeableId,
	likeableParentId,
	likesCount,
	dislikesCount,
	userVote,
	size,
	onVote,
}: ReactionVoteProps) => {
	const { isAuthenticated } = useAuth();

	const getCount = (count: number): string => {
		if (count && count > 0) {
			return formatNumberShorthand(count);
		}
		return "";
	};

	return (
		<div className="flex items-center select-none gap-x-4 ps-2">
			<div className="flex items-center gap-x-0.5">
				<button
					className={`rounded flex items-center justify-center py-0.5 ${
						isAuthenticated &&
						"cursor-pointer text-gray-600 hover:text-emerald-500 hover:scale-120 transition-scale ease-in duration-100"
					} ${userVote && userVote == "like" && "text-emerald-600"}`}
					onClick={() => onVote(likeableId, likeableParentId, "like")}
					disabled={!isAuthenticated}
				>
					<FontAwesomeIcon icon="thumbs-up" size="lg" />
				</button>
				<p className="w-8 font-bold">{getCount(likesCount)}</p>
			</div>
			<div className="flex items-center gap-x-0.5">
				<button
					className={`rounded flex items-center justify-center py-0.5 ${
						isAuthenticated &&
						"cursor-pointer text-gray-600 hover:text-rose-500 hover:scale-120 transition-scale ease-in duration-100"
					} ${userVote && userVote == "dislike" && "text-rose-600"}`}
					onClick={() => onVote(likeableId, likeableParentId, "dislike")}
					disabled={!isAuthenticated}
				>
					<FontAwesomeIcon icon="thumbs-down" size="lg" />
				</button>
				<p className="w-8 font-bold">{getCount(dislikesCount)}</p>
			</div>
		</div>
	);
};

export default ReactionVote;
