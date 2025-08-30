import React from "react";
import type { CommentInfo } from "../../data/adminData";

export interface CommentsContextType {
	comments: CommentInfo[];
	isLoading: boolean;
	totalCommentsCount: number;
	currentPage: number;
	lastPage: number;
	loadMoreComments: () => void;
	addComment: (body: string) => Promise<void>;
	deleteComment: (commentId: number, parentId: number | null) => Promise<void>;
	updateComment: (
		commentId: number,
		parentId: number | null,
		body: string
	) => Promise<void>;
	addReply: (commentId: number, body: string) => Promise<void>;
	fetchReplies: (commentId: number, page: number) => Promise<void>;
	loadMoreReplies: (commentId: number) => void;
}

export const CommentsContext = React.createContext<
	CommentsContextType | undefined
>(undefined);
