import { useCallback, useContext, useState, type ReactNode } from "react";

import { CommentsContext } from "./CommentsContext";
import type { CommentInfo, PaginatedResponse } from "../../data/adminData";
import apiClient from "../../utils/axiosConfig";

interface CommentsProviderProps {
	// comments: CommentInfo[];
	totalCount: number;
	children: ReactNode;
	resource: "challenges" | "entries";
	resourceId: number;
}

export const CommentsProvider = ({
	resource,
	resourceId,
	totalCount,
	children,
}: CommentsProviderProps) => {
	const [comments, setComments] = useState<CommentInfo[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [totalCommentsCount, setTotalCommentsCount] =
		useState<number>(totalCount);
	const [activeId, setActiveId] = useState<number | null>(null);

	const fetchComments = useCallback(
		async (page: number) => {
			try {
				setIsLoading(true);
				const prefix =
					resource == "challenges"
						? "bracket-challenges"
						: "bracket-challenge-entries";
				const response = await apiClient.get<
					PaginatedResponse<CommentInfo>
				>(`/${prefix}/${resourceId}/comments?page=${page}`);
				const { data, meta } = response.data;
				// setComments((prevComments) => [...prevComments, ...data]);
				setComments((prevComments) => {
					// Create a Set of all existing comment IDs for quick lookup
					const existingIds = new Set(
						prevComments.map((comment) => comment.id)
					);

					// Filter the new data to only include comments that are not already in our state
					const newUniqueComments = data.filter(
						(comment) => !existingIds.has(comment.id)
					);

					// Combine the old and new comments
					return [...prevComments, ...newUniqueComments];
				});
				// setTotalCommentsCount(meta.total);
				setCurrentPage(meta.current_page);
				setLastPage(meta.last_page);
			} catch (error: any) {
				console.error("Error fetching comments:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[resource, resourceId]
	);

	const loadMoreComments = useCallback(() => {
		if (currentPage < lastPage) {
			fetchComments(currentPage + 1);
		}
	}, [currentPage, lastPage]);

	const addComment = useCallback(
		async (body: string): Promise<void> => {
			try {
				setIsLoading(true);

				const url = `${
					resource == "challenges"
						? "bracket-challenges"
						: "bracket-challenge-entries"
				}/${resourceId}/comments`;

				const response = await apiClient.post(url, {
					body,
				});

				const newComment = response.data.comment;
				const isDuplicate = comments.some(
					(comment) => comment.id === newComment.id
				);

				setComments((prev) => {
					if (isDuplicate) {
						return prev;
					}
					return [newComment, ...prev];
				});
				setTotalCommentsCount((prev) => {
					if (isDuplicate) {
						return prev;
					}
					return prev + 1;
				});
			} catch (error: any) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		},
		[resource, resourceId]
	);

	const updateComment = useCallback(
		async (
			commentId: number,
			parentId: number | null,
			updatedBody: string
		): Promise<void> => {
			setIsLoading(true);
			try {
				await apiClient.put(`/comments/${commentId}`, {
					updatedBody,
				});
				if (!parentId) {
					setComments((prev) =>
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
				} else {
					setComments((prev) =>
						prev.map((comment) => {
							if (comment.id === parentId) {
								const replies = comment.replies || [];

								return {
									...comment,
									replies: replies.map((reply) => {
										if (reply.id === commentId) {
											return {
												...reply,
												body: updatedBody,
												updated_at: new Date().toISOString(),
											};
										}
										return reply;
									}),
								};
							}
							return comment;
						})
					);
				}
			} catch (error: any) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const deleteComment = useCallback(
		async (
			commentId: number,
			parentId: number | null = null
		): Promise<void> => {
			setIsLoading(true);
			try {
				await apiClient.delete(`/comments/${commentId}`);
				if (!parentId) {
					setComments((prev) =>
						prev.filter((comment) => comment.id !== commentId)
					);
				} else {
					setComments((prev) =>
						prev.map((comment) => {
							if (comment.id === parentId) {
								return {
									...comment,
									replies_count: comment.replies_count - 1,
									replies: comment.replies?.filter(
										(reply) => reply.id !== commentId
									),
								};
							}
							return comment;
						})
					);
				}
				setTotalCommentsCount((prev) => prev - 1);
			} catch (error: any) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const fetchReplies = useCallback(
		async (commentId: number, page: number): Promise<void> => {
			try {
				setIsLoading(true);
				const response = await apiClient.get<
					PaginatedResponse<CommentInfo>
				>(`/comments/${commentId}/replies?page=${page}`);
				// Renaming `data` to `newReplies` to avoid confusion
				const { data: newReplies, meta } = response.data;

				setComments((prev) => {
					return prev.map((comment) => {
						if (comment.id === commentId) {
							// Get the existing replies, defaulting to an empty array
							const existingReplies = comment.replies || [];

							// Create a Set of existing reply IDs for fast lookup
							const existingReplyIds = new Set(
								existingReplies.map((reply) => reply.id)
							);

							// Filter the new replies to include only those not already in our state
							const uniqueNewReplies = newReplies.filter(
								(reply) => !existingReplyIds.has(reply.id)
							);

							return {
								...comment,
								// Append the unique new replies to the existing list
								replies: [...existingReplies, ...uniqueNewReplies],
								replies_count: meta.total,
								last_page: meta.last_page,
								current_page: meta.current_page,
							};
						}
						return comment;
					});
				});
			} catch (error: any) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		},
		// We're good with the empty dependency array as long as apiClient and setComments are stable
		[]
	);

	const loadMoreReplies = useCallback(
		(commentId: number) => {
			const comment = comments.find((comment) => comment.id === commentId);
			if (!comment) return;
			if (!comment.current_page || !comment.last_page) return;
			if (comment.current_page < comment.last_page) {
				fetchReplies(commentId, comment.current_page + 1);
			}
		},
		[comments]
	);

	const addReply = useCallback(
		async (commentId: number, reply: string): Promise<void> => {
			try {
				setIsLoading(true);
				const response = await apiClient.post(
					`/comments/${commentId}/replies`,
					{
						body: reply,
					}
				);
				console.log(response.data.reply);
				setComments((prev) => {
					return prev.map((comment) => {
						if (comment.id === commentId) {
							return {
								...comment,
								replies_count: comment.replies_count + 1,
								replies: [
									response.data.reply,
									...(comment.replies || []),
								],
							};
						}
						return comment;
					});
				});
				setTotalCommentsCount((prev) => prev + 1);
			} catch (error: any) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const commentVote = useCallback(
		async (
			commentId: number,
			parentId: number | null,
			voteType: "like" | "dislike"
		) => {
			const is_like = voteType === "like";
			try {
				const response = await apiClient.post(`/likes`, {
					is_like: is_like,
					likeable_id: commentId,
					model_name: "Comment",
				});
				const votes = response.data.votes;

				if (!parentId) {
					setComments((prev) => {
						return prev.map((comment) => {
							if (comment.id === commentId) {
								let newVote =
									comment.user_vote != voteType ? voteType : null;

								return {
									...comment,
									user_vote: newVote,
									votes: votes,
								};
							}
							return comment;
						});
					});
				} else {
					setComments((prev) =>
						prev.map((comment) => {
							if (comment.id === parentId) {
								const replies = comment.replies || [];

								return {
									...comment,
									replies: replies.map((reply) => {
										if (reply.id === commentId) {
											let newVote =
												reply.user_vote != voteType
													? voteType
													: null;
											return {
												...reply,
												user_vote: newVote,
												votes: votes,
											};
										}
										return reply;
									}),
								};
							}
							return comment;
						})
					);
				}
			} catch (error) {
				console.error("Error submitting vote:", error);
			}
		},
		[]
	);

	const updateActiveId = useCallback((id: number | null) => {
		setActiveId(id);
	}, []);

	return (
		<CommentsContext.Provider
			value={{
				comments,
				isLoading,
				totalCommentsCount,
				currentPage,
				lastPage,
				activeId,
				updateActiveId,
				commentVote,
				fetchComments,
				fetchReplies,
				loadMoreReplies,
				loadMoreComments,
				addComment,
				updateComment,
				deleteComment,
				addReply,
			}}
		>
			{children}
		</CommentsContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useComments = () => {
	const context = useContext(CommentsContext);
	if (context === undefined) {
		throw new Error("useComments must be used within an CommentsProvider");
	}
	return context;
};
