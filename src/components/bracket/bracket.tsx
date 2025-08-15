import { useBracket } from "../../context/bracket/BracketProvider";
import { useAuth } from "../../context/auth/AuthProvider";
import Conference from "./conference";
import Finals from "./finals";
import StatusMessage from "../statusMessage";

const Bracket = () => {
	const { isAuthenticated } = useAuth();
	const { league } = useBracket();

	const {
		error,
		success,
		isLoading,
		mode,
		isActive,
		hasProgressed,
		resetMessage,
		refreshBracket,
		updateBracket,
		submitPicks,
		resetBracket,
	} = useBracket();

	const handleSubmit = () => {
		if (!isAuthenticated) return;
		submitPicks();
	};

	return (
		<>
			{error && (
				<StatusMessage
					message={error}
					type="error"
					onClose={resetMessage}
				/>
			)}
			{success && (
				<StatusMessage
					message={success}
					type="success"
					onClose={resetMessage}
				/>
			)}

			<div className="w-full rounded relative text-black select-none">
				<div className="overflow-x-auto">
					{league == "NBA" && (
						<div className="flex gap-x-6 items-center min-w-4xl mb-3">
							<Conference
								league={"NBA"}
								conference={"EAST"}
								className="flex-1"
							/>
							<Finals league="NBA" className="flex-none" />
							<Conference
								league={"NBA"}
								conference={"WEST"}
								className="flex-1"
							/>
						</div>
					)}
					{league == "PBA" && (
						<div className="flex items-center sm:justify-center gap-x-4 mb-3">
							<Conference league="PBA" className="max-w-lg flex-none" />
							<Finals league="PBA" className="flex-none" />
						</div>
					)}
				</div>
				{isLoading && (
					<div className="absolute top-0 left-0 w-full h-full">
						<div className="absolute top-0 left-0 w-full h-full bg-black opacity-70"></div>
						<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
							<div className="px-4 py-3 bg-white rounded">
								<p className="font-semibold">
									{mode === "submit" ? "Submitting..." : "Saving..."}.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
			{mode == "submit" && isActive && (
				<>
					<hr className="my-2 border-gray-400" />
					<div className="flex items-center space-x-2 mt-3">
						<button
							className={`px-3 py-2 text-white min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-rose-400 opacity-70"
									: " bg-rose-600 hover:bg-rose-500 cursor-pointer"
							}`}
							onClick={resetBracket}
							disabled={isLoading}
						>
							RESET
						</button>
						{isAuthenticated && (
							<button
								className={`px-3 py-2 text-white min-w-30 rounded font-bold transition duration-200 ${
									isLoading
										? "bg-sky-400 opacity-70"
										: "bg-sky-600 hover:bg-sky-500 cursor-pointer"
								}`}
								onClick={handleSubmit}
								disabled={isLoading}
							>
								SUBMIT PICKS
							</button>
						)}
					</div>
				</>
			)}
			{mode == "update" && (
				<>
					<hr className="my-2 border-gray-400" />
					<div className="flex items-center space-x-2 mt-3">
						<button
							className={`px-3 py-2 text-white flex-1 w-full sm:flex-none sm:w-auto sm:min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-orange-400 opacity-70"
									: " bg-orange-600 hover:bg-orange-500 cursor-pointer"
							}`}
							onClick={resetBracket}
							disabled={isLoading}
						>
							RESET BRACKET
						</button>
						{hasProgressed && (
							<button
								className={`px-3 py-2 text-white flex-1 w-full sm:flex-none sm:w-auto sm:min-w-30 rounded font-bold transition duration-200 ${
									isLoading
										? "bg-blue-400 opacity-70"
										: " bg-blue-600 hover:bg-blue-500 cursor-pointer"
								}`}
								onClick={refreshBracket}
								disabled={isLoading}
							>
								REVERT TO SAVED
							</button>
						)}
						<button
							className={`px-3 py-2 text-white flex-1 w-full sm:flex-none sm:w-auto sm:min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-green-400 opacity-70"
									: "bg-green-600 hover:bg-green-500 cursor-pointer"
							}`}
							onClick={updateBracket}
							disabled={isLoading}
						>
							UPDATE BRACKET
						</button>
					</div>
				</>
			)}
		</>
	);
};

export default Bracket;
