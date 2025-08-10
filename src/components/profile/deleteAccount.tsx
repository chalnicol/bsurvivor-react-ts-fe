import { useState } from "react";
import { useAuth } from "../../context/auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
	const { deleteAccount, isLoading } = useAuth();
	const navigate = useNavigate();
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleDeleteClick = () => {
		setShowConfirmation(true); // Show the confirmation dialog
	};

	const handleConfirmDelete = async () => {
		const success = await deleteAccount();
		if (success) {
			navigate("/login");
		}
		setShowConfirmation(false); // Hide confirmation dialog regardless of success/failure
	};

	return (
		<div className="p-6 rounded-lg shadow border border-gray-400 bg-gray-100">
			<div className="max-w-lg">
				<h1 className="text-lg font-bold">Delete Account</h1>
				<hr className="mt-2 mb-4 border-gray-400 shadow-lg" />
				<p className="text-sm">
					Deleting your account is permanent and cannot be undone.
				</p>
				{/* {error && <p className="text-red-500 text-sm my-3">{error}</p>} */}
				{!showConfirmation ? (
					<button
						className={`mt-5 px-4 py-2 rounded text-white font-bold  ${
							isLoading
								? "bg-red-400 opacity-70"
								: "bg-red-600 hover:bg-red-500 cursor-pointer"
						}`}
						onClick={handleDeleteClick}
						disabled={isLoading}
					>
						DELETE ACCOUNT
					</button>
				) : (
					<div className="p-3 border border-gray-300 mt-6 rounded bg-gray-100 shadow">
						<p>
							Are you absolutely sure you want to delete your account?
						</p>
						<div className="space-x-2 mt-3">
							<button
								className={`px-4 py-2 rounded text-white font-bold  ${
									isLoading
										? "bg-red-400 opacity-70"
										: "bg-red-500 hover:bg-red-400 cursor-pointer"
								}`}
								onClick={handleConfirmDelete}
								disabled={isLoading}
							>
								Delete
							</button>
							<button
								className={`px-4 py-2 rounded text-white font-bold  ${
									isLoading
										? "bg-gray-600 opacity-70"
										: "bg-gray-700 hover:bg-gray-700 cursor-pointer"
								}`}
								onClick={() => setShowConfirmation(false)}
								disabled={isLoading}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DeleteAccount;
