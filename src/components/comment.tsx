import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CommentInfo } from "../data/adminData";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/auth/AuthProvider";
import { getRelativeTime } from "../utils/dateTime";
import gsap from "gsap";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useComments } from "../context/comment/CommentsProvider";

interface CommentProps {
	comment: CommentInfo;
	className?: string;
}
const Comment = ({ comment, className }: CommentProps) => {
	const { user } = useAuth();
	const {
		updateComment,
		deleteComment,
		addReply,
		fetchReplies,
		loadMoreReplies,
		isLoading,
	} = useComments();

	const [editMode, setEditMode] = useState<boolean>(false);
	const [deleteMode, setDeleteMode] = useState<boolean>(false);
	const [replyMode, setReplyMode] = useState<boolean>(false);

	const [body, setBody] = useState<string>(comment.body);
	const [reply, setReply] = useState<string>("");
	const [displayTime, setDisplayTime] = useState<string>("");
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const [showReplies, setShowReplies] = useState<boolean>(false);

	const optionRef = useRef<HTMLDivElement>(null);
	const updateInputRef = useRef<HTMLInputElement>(null);
	const replyInputRef = useRef<HTMLInputElement>(null);

	const popupRef = useOutsideClick<HTMLDivElement>(() => {
		setShowOptions(false);
	});

	const isOwned = user && user.id === comment.user_id;

	const isEdited = comment.created_at !== comment.updated_at;

	const isReplyAllowed =
		user && user.id !== comment.user_id && comment.parent_id === null;

	useEffect(() => {
		setDisplayTime(getRelativeTime(comment.updated_at));

		const timer = setInterval(() => {
			setDisplayTime(getRelativeTime(comment.updated_at));
		}, 60 * 1000);
		return () => clearInterval(timer);
	}, [comment.updated_at]);

	useEffect(() => {
		if (showOptions && optionRef.current) {
			gsap.fromTo(
				optionRef.current,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.3,
					ease: "elastic(1, 0.5)",
					transformOrigin: "100% 0%",
				}
			);
		}
		return () => {
			if (showOptions && optionRef.current) {
				gsap.killTweensOf(optionRef.current);
			}
		};
	}, [showOptions]);

	useEffect(() => {
		if (replyMode && replyInputRef.current) {
			replyInputRef.current.focus();
		}
	}, [replyMode, replyInputRef.current]);

	useEffect(() => {
		if (editMode && updateInputRef.current) {
			updateInputRef.current.focus();
		}
	}, [editMode, updateInputRef.current]);

	const handleCancel = () => {
		setEditMode(false);
		setBody(comment.body);
	};

	const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await updateComment(comment.id, comment.parent_id, body);
		setEditMode(false);
	};

	const handleSubmitReply = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submitting reply");

		if (!comment.replies || comment.replies.length === 0) {
			await fetchReplies(comment.id, 1);
		}
		await addReply(comment.id, reply);
		setReplyMode(false);
		setReply("");
		setShowReplies(true);
	};

	const handleDelete = () => {
		deleteComment(comment.id, comment.parent_id);
		setReplyMode(false);
		setDeleteMode(false);
		setShowOptions(false);
	};

	const handleFetchReplies = async () => {
		if (showReplies) {
			setShowReplies(false);
		} else {
			if (!comment.replies || comment.replies.length === 0) {
				await fetchReplies(comment.id, 1);
			}
			setShowReplies(true);
		}
	};

	const handleEditMode = () => {
		setEditMode(true);
		setBody(comment.body);
		setDeleteMode(false);
		setReplyMode(false);
		setShowOptions(false);
		setShowReplies(false);
	};

	const handleDeleteMode = () => {
		setDeleteMode(true);
		setEditMode(false);
		setReplyMode(false);
		setBody(comment.body);
		setShowOptions(false);
		setShowReplies(false);
	};

	const handleReplyMode = () => {
		setReplyMode(true);
		setEditMode(false);
		setDeleteMode(false);
		setBody(comment.body);
		setShowOptions(false);
		setShowReplies(false);
	};

	return (
		<div className={`w-fullborder-t border-gray-300 ${className}`}>
			<div className="flex">
				{/* header */}
				<div className="flex-1">
					{/* username + date display */}
					<div className="flex items-center font-semibold text-gray-500 gap-x-2 select-none">
						<p
							className={`flex-none px-2 py-0.5 w-33 text-sm bg-zinc-800 ${
								isOwned ? "text-yellow-500" : "text-white"
							}`}
						>
							{comment.user.username}
						</p>
						<p className="text-sm">{displayTime}</p>
						{isEdited && <span className="text-sm">(edited)</span>}
					</div>
					{/* comment body */}
					{editMode ? (
						<form onSubmit={handleUpdate} className="mt-1 mb-4">
							<input
								ref={updateInputRef}
								type="text"
								value={body}
								className="w-full border-b border-gray-400 focus:outline-none py-1 block"
								onChange={(e) => setBody(e.target.value)}
							/>
							<div className="space-x-1 mt-1">
								<button
									type="button"
									className="text-xs bg-red-600 hover:bg-red-500 cursor-pointer text-white px-3 py-0.5 rounded font-bold"
									onClick={handleCancel}
									disabled={isLoading}
								>
									CANCEL
								</button>
								<button className="text-xs bg-sky-600 hoveer:bg-sky-500 cursor-pointer text-white px-3 py-0.5 rounded font-bold">
									UPDATE
								</button>
							</div>
						</form>
					) : (
						<p className="py-0.5 my-0.5 md:py-1 md:my-1">
							<FontAwesomeIcon
								icon="quote-left"
								size="2xs"
								className="me-1"
							/>
							<span className="text-sm md:text-base">
								{comment.body}
							</span>
						</p>
					)}
				</div>
				{/* ellipsis vertical */}
				<div className="w-12 px-2">
					<div
						ref={popupRef}
						className="flex-none w-full h-auto aspect-square relative mt-1"
					>
						<button
							className="text-center w-full h-full rounded-full hover:bg-gray-300 cursor-pointer flex items-center justify-center"
							onClick={() => setShowOptions((prev) => !prev)}
							disabled={isLoading}
						>
							<FontAwesomeIcon icon="ellipsis-vertical" size="lg" />
						</button>
						{showOptions && (
							<div
								ref={optionRef}
								className="absolute overflow-hidden flex flex-col w-28 border border-gray-300 rounded top-0 right-full bg-white text-sm z-10 shadow-md"
							>
								<p className="bg-gray-700 text-white text-right font-bold px-3 py-0.5">
									Options
								</p>

								{isReplyAllowed && (
									<button
										className="py-1 text-right px-3 hover:bg-sky-50 cursor-pointer"
										onClick={handleReplyMode}
										disabled={isLoading}
									>
										Reply
									</button>
								)}

								{isOwned && (
									<>
										<button
											className="py-1 text-right px-3 hover:bg-sky-50 cursor-pointer"
											onClick={handleEditMode}
										>
											Edit
										</button>
										<button
											className="py-1 text-right px-3 hover:bg-sky-50 cursor-pointer"
											onClick={handleDeleteMode}
										>
											Delete
										</button>
									</>
								)}

								{!isOwned && !isReplyAllowed && (
									<p className="px-3 py-1 text-right">-none-</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
			{/* reactions */}
			<div className="flex items-center gap-x-1">
				<button
					className={`flex items-center gap-x-1 text-sm font-semibold rounded border w-16 px-1 ${
						user && user.id !== comment.user_id
							? "hover:text-gray-500 cursor-pointer shadow border-neutral-400"
							: "border-neutral-300 bg-zinc-50"
					}`}
					disabled={!user || user.id === comment.user_id}
				>
					<FontAwesomeIcon icon="thumbs-up" className="px-1 py-0.5" />
					<span className="text-sm">1M</span>
				</button>
				{/* <span>100</span> */}
				<button
					className={`flex items-center gap-x-1 text-sm font-semibold rounded border  w-16 px-1 ${
						user && user.id !== comment.user_id
							? "hover:text-gray-500 cursor-pointer shadow border-neutral-400"
							: "border-neutral-300 bg-zinc-50"
					}`}
					disabled={!user || user.id === comment.user_id}
				>
					<FontAwesomeIcon icon="thumbs-down" className="px-1 py-0.5" />
					<span className="text-sm">1K</span>
				</button>
			</div>
			{/* replies */}
			<div>
				{replyMode && (
					<div className="my-2">
						<form onSubmit={handleSubmitReply} className="mt-1">
							<input
								ref={replyInputRef}
								type="text"
								className="border-b border-gray-400 w-full py-1 px-1 focus:outline-none"
								placeholder="Add a reply..."
								value={reply}
								onChange={(e) => setReply(e.target.value)}
							/>
							<div className="space-x-1 mt-1.5">
								<button
									type="button"
									className="text-xs bg-amber-600 hover:bg-amber-500 cursor-pointer text-white px-3 py-0.5 rounded font-bold"
									onClick={() => setReplyMode(false)}
								>
									CANCEL
								</button>
								<button className="text-xs bg-sky-600 hoveer:bg-sky-500 cursor-pointer text-white px-3 py-0.5 rounded font-bold">
									ADD REPLY
								</button>
							</div>
						</form>
					</div>
				)}
				{comment.replies_count > 0 && (
					<button
						className="bg-gray-400/50 hover:bg-gray-300/50 cursor-pointer text-left text-xs px-2 py-0.5 rounded-full w-33 mt-2"
						onClick={handleFetchReplies}
					>
						<FontAwesomeIcon
							icon={`${showReplies ? "caret-up" : "caret-down"}`}
							size="lg"
						/>
						<span className="ms-1.5 font-semibold">
							{`${showReplies ? "HIDE" : "SHOW"} ${
								comment.replies_count
							} ${comment.replies_count > 1 ? "REPLIES" : "REPLY"}`}
						</span>
					</button>
				)}
				{showReplies && (
					<div className="mt-2">
						{comment.replies && comment.replies.length > 0 && (
							<>
								{comment.replies.map((reply, index) => (
									<div key={reply.id} className="flex">
										<div className="flex-none w-6 relative overflow-hidden">
											<div
												className={`absolute w-0.5 left-0.5 top-0 bg-gray-600 ${
													index !== comment.replies.length - 1
														? "h-full"
														: "h-3"
												}`}
											></div>
											<div className="absolute w-3 left-0.5 top-3 h-0.5 bg-gray-600 -translate-y-1/2"></div>
											<div className="absolute w-2 aspect-square bg-gray-600 rounded-full top-3 left-3 -translate-y-1/2"></div>
										</div>
										<div className="flex-1 pb-3">
											<Comment key={reply.id} comment={reply} />
										</div>
									</div>
								))}
							</>
						)}
						{comment.current_page &&
							comment.last_page &&
							comment.current_page < comment.last_page && (
								<button
									className="bg-gray-400/50 hover:bg-gray-300/50 cursor-pointer text-left text-xs px-2 py-0.5 rounded-full w-38 ms-8"
									onClick={() => loadMoreReplies(comment.id)}
								>
									<FontAwesomeIcon icon="caret-down" size="lg" />
									<span className="ms-1.5 font-semibold">
										VIEW MORE REPLIES
									</span>
								</button>
							)}
					</div>
				)}
			</div>
			{/* deletes */}
			{deleteMode && (
				<div className="flex flex-wrap gap-x-2 items-center border-t border-gray-300 py-1.5 mt-2">
					<span className="font-semibold text-sm text-gray-500">
						{`Delete this ${comment.parent_id ? "reply" : "comment"}?`}
					</span>
					<div className="space-x-1">
						<button
							type="button"
							className="text-xs bg-zinc-500 hover:bg-zinc-400 cursor-pointer text-white px-3 py-0.5 font-bold rounded"
							onClick={() => setDeleteMode(false)}
						>
							CANCEL
						</button>
						<button
							className="text-xs bg-rose-500 hoveer:bg-rose-400 cursor-pointer text-white px-3 py-0.5 font-bold rounded"
							onClick={handleDelete}
						>
							CONFIRM
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
export default Comment;
