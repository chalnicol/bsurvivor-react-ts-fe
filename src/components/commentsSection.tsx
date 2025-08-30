import { useState } from "react";
import Comment from "./comment";
import { useAuth } from "../context/auth/AuthProvider";
import { useComments } from "../context/comment/CommentsProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CommentsSectionProps {
	className?: string;
}

const CommentsSection = ({ className }: CommentsSectionProps) => {
	const { isAuthenticated } = useAuth();
	const {
		comments,
		isLoading,
		totalCommentsCount,
		currentPage,
		lastPage,
		loadMoreComments,
		addComment,
	} = useComments();

	const [body, setBody] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addComment(body);
		setBody("");
	};

	const commentsCount: string =
		totalCommentsCount > 0 ? `(${totalCommentsCount})` : "";

	return (
		<div className={`${className}`}>
			<h2 className="font-bold text-lg">Comments {commentsCount}</h2>
			{/* <p className="text-gray-500 mt-0.5">
				Please make your comments friendly and constructive.
			</p> */}
			{isAuthenticated && (
				<form id="comment-form" onSubmit={handleSubmit} className="mt-2">
					<div className="md:flex items-start gap-x-2 mt-1 space-y-1 md:space-y-0">
						<input
							type="text"
							value={body}
							placeholder="Add a comment"
							className="flex-1 rounded border border-gray-500 placeholder:text-gray-500 w-full h-10 px-3 py-1 text-base focus:outline-none focus:ring-gray-500 focus:border-gray-500"
							onChange={(e) => setBody(e.target.value)}
							required
						/>
						<button
							className={`text-white rounded  w-full md:w-auto font-bold px-4 py-2 ${
								isLoading
									? "bg-gray-500 opacity-50"
									: "bg-gray-600 hover:bg-gray-500 cursor-pointer"
							}`}
							disabled={isLoading}
						>
							<FontAwesomeIcon icon="plus" /> ADD
						</button>
					</div>
				</form>
			)}
			<div className="mt-4 md:mt-3">
				{comments.length > 0 ? (
					<>
						{comments.map((comment) => (
							<Comment
								key={comment.id}
								className="mb-3"
								comment={comment}
							/>
						))}
						{isLoading ? (
							<div className="mt-3 text-center">
								<span className="text-gray-400 text-sm font-bold rounded mx-auto px-4 py-1">
									LOADING...
								</span>
							</div>
						) : (
							<div className="mt-3 text-center">
								{currentPage < lastPage ? (
									<button
										className="bg-gray-600 hover:bg-gray-500 cursor-pointer text-white text-sm font-semibold px-4 py-1.5 rounded space-x-2"
										onClick={loadMoreComments}
									>
										<FontAwesomeIcon icon="arrow-alt-circle-down" />
										<span>MORE COMMENTS</span>
									</button>
								) : (
									<span className="text-gray-400 text-sm font-bold rounded mx-auto px-4 py-1">
										END OF COMMENTS
									</span>
								)}
							</div>
						)}
					</>
				) : (
					<p className="text-gray-500 border border-gray-400 rounded p-2 bg-gray-300">
						No comments to display.
					</p>
				)}
			</div>
		</div>
	);
};

export default CommentsSection;
