import { useAuth } from "../context/auth/AuthProvider";
import ReactionButton from "./reactionButton";

interface ReactionsProps {
	likeableId: number;
	likeableParentId?: number | null;
	userVote: "like" | "dislike" | null;
	likesCount: number;
	dislikesCount: number;
	size?: "xs" | "sm" | "lg";
	onVote: (
		id: number,
		parentId: number | null,
		vote: "like" | "dislike"
	) => void;
	className?: string;
}
const Reactions = ({
	likeableId,
	likeableParentId,
	likesCount,
	dislikesCount,
	userVote,
	onVote,
	size,
	className,
}: ReactionsProps) => {
	const { isAuthenticated } = useAuth();

	const handleVoteClick = (vote: "like" | "dislike") => {
		onVote(likeableId, likeableParentId || null, vote);
	};

	const sizeProps = size && { size };

	return (
		<div
			className={`inline-flex items-center gap-x-9 bg-white border border-gray-400 shadow rounded-full p-1 ${className}`}
		>
			<ReactionButton
				type="like"
				disabled={!isAuthenticated}
				selected={(userVote && userVote == "like") || false}
				count={likesCount}
				onClick={() => handleVoteClick("like")}
				{...sizeProps}
			/>
			<ReactionButton
				type="dislike"
				disabled={!isAuthenticated}
				selected={(userVote && userVote == "dislike") || false}
				count={dislikesCount}
				onClick={() => handleVoteClick("dislike")}
				{...sizeProps}
			/>
		</div>
	);
};

export default Reactions;
