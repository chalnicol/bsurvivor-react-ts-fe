import { useState } from "react";
import type { CommentInfo } from "../data/adminData";
import Comment from "./comment";
import apiClient from "../utils/axiosConfig";
import { useAuth } from "../context/auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CommentsSectionProps {
	className?: string;
	challengeId: number;
	comments: CommentInfo[];
}

const CommentsSection = ({
	comments,
	challengeId,
	className,
}: CommentsSectionProps) => {
	const { isAuthenticated } = useAuth();

	const [toComment, setToComment] = useState<string>("");
	const [newComments, setNewComments] = useState<CommentInfo[]>(comments);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const addComment = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.post(
				`/bracket-challenges/${challengeId}/comment`,
				{
					comment: toComment,
				}
			);
			setToComment("");
			setNewComments((prev) => [...prev, response.data.comment]);
		} catch (error: any) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		addComment();
	};

	const updateComment = async (commentId: number, updatedBody: string) => {
		setIsLoading(true);
		try {
			await apiClient.put(`/comments/${commentId}`, {
				comment: updatedBody,
			});
			setNewComments((prev) =>
				prev.map((comment) => {
					if (comment.id === commentId) {
						return {
							...comment,
							body: updatedBody,
							updated_at: new Date().toISOString(),
						};
					}
					return comment;
				})
			);
		} catch (error: any) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const deleteComment = async (commentId: number) => {
		setIsLoading(true);
		try {
			await apiClient.delete(`/comments/${commentId}`);
			setNewComments((prev) =>
				prev.filter((comment) => comment.id !== commentId)
			);
		} catch (error: any) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const commentsCount: string =
		newComments.length > 0 ? `(${newComments.length})` : "";

	return (
		<div className={`${className}`}>
			<h2 className="font-bold text-lg">Comments {commentsCount}</h2>
			{/* <p className="text-gray-500 mt-0.5">
				Please make your comments friendly and constructive.
			</p> */}
			{isAuthenticated && (
				<form id="comment-form" onSubmit={handleSubmit} className="mt-2">
					<div className="flex items-start gap-x-2 mt-1">
						<input
							type="text"
							value={toComment}
							placeholder="Add a comment"
							className="flex-1 rounded border border-gray-500 placeholder:text-gray-500 w-full h-10 px-3 py-1 text-base focus:outline-none focus:ring-gray-500 focus:border-gray-500"
							onChange={(e) => setToComment(e.target.value)}
							required
						/>
						<button
							className={`text-white rounded font-bold px-4 py-2 ${
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
			<div className="mt-3">
				{newComments.length > 0 ? (
					<>
						{newComments.map((comment) => (
							<Comment
								key={comment.id}
								comment={comment}
								isLoading={isLoading}
								className="mb-2"
								onDelete={deleteComment}
								onUpdate={updateComment}
							/>
						))}
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
