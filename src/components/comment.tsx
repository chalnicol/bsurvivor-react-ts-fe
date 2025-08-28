import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CommentInfo } from "../data/adminData";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth/AuthProvider";
import { getRelativeTime } from "../utils/dateTime";

interface CommentProps {
	comment: CommentInfo;
	className?: string;
	isLoading: boolean;
	onUpdate: (commentId: number, comment: string) => void;
	onDelete: (commentId: number) => void;
}
const Comment = ({
	comment,
	isLoading,
	onUpdate,
	onDelete,
	className,
}: CommentProps) => {
	const { user } = useAuth();

	const [editMode, setEditMode] = useState<boolean>(false);
	const [body, setBody] = useState<string>(comment.body);
	const [displayTime, setDisplayTime] = useState<string>("");

	useEffect(() => {
		setDisplayTime(getRelativeTime(comment.updated_at));

		const timer = setInterval(() => {
			setDisplayTime(getRelativeTime(comment.updated_at));
		}, 60 * 1000);
		return () => clearInterval(timer);
	}, [comment.updated_at]);

	const handleCancel = () => {
		setEditMode(false);
		setBody(comment.body);
	};
	const handleUpdate = () => {
		setEditMode(false);
		onUpdate(comment.id, body);
	};

	const handleDelete = () => {
		onDelete(comment.id);
	};

	return (
		<div
			className={`overflow-hidden border border-gray-400 bg-gray-100 rounded ${className}`}
		>
			<div className="flex items-center justify-between font-semibold bg-gray-300 text-gray-500">
				<p className="px-3 py-1 space-x-2">
					<FontAwesomeIcon icon="user" />
					<span>{comment.user.username}</span>
				</p>
				<p className="px-3 py-1 text-sm">{displayTime}</p>
			</div>
			<div className="px-3 py-2">
				{editMode ? (
					<input
						type="text"
						value={body}
						className="w-full border border-gray-400 focus:outline-none px-2 py-1 rounded block"
						onChange={(e) => setBody(e.target.value)}
					/>
				) : (
					<p>{comment.body}</p>
				)}

				{/* <hr className="my-2 border-gray-500" /> */}
				{user && user.id === comment.user_id && (
					<div className="space-x-1 mt-2">
						<button
							className="bg-red-500 hover:bg-red-400 py-1 cursor-pointer font-semibold text-white px-2 rounded text-xs min-w-13"
							onClick={handleDelete}
							disabled={isLoading}
						>
							DELETE
						</button>
						{editMode ? (
							<>
								<button
									className="bg-amber-500 hover:bg-amber-400 py-1 cursor-pointer font-semibold text-white px-2 rounded text-xs min-w-13"
									onClick={handleCancel}
									disabled={isLoading}
								>
									CANCEL
								</button>
								<button
									className="bg-emerald-500 hover:bg-emerald-400 py-1 cursor-pointer font-semibold text-white px-2 rounded text-xs min-w-13"
									onClick={handleUpdate}
									disabled={isLoading}
								>
									UPDATE
								</button>
							</>
						) : (
							<button
								className="bg-sky-600 hover:bg-sky-500 py-1 cursor-pointer font-semibold text-white px-2 rounded text-xs min-w-13"
								onClick={() => setEditMode(true)}
								disabled={isLoading}
							>
								EDIT
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
export default Comment;
