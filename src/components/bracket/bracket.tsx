import { useBracket } from "../../context/bracket/BracketProvider";
import { useAuth } from "../../context/auth/AuthProvider";

import Conference from "./conference";
import Finals from "./finals";
import StatusMessage from "../statusMessage";
import { useLocation, useNavigate } from "react-router-dom";

interface BracketProps {
	league: string;
}
const Bracket = ({ league }: BracketProps) => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const {
		error,
		success,
		isLoading,
		activeControls,
		resetMessage,
		resetPicks,
		submitPicks,
	} = useBracket();

	const handleSubmit = () => {
		if (!isAuthenticated) {
			navigate("/login", { state: { from: location }, replace: true });
			return;
		}
		submitPicks(league);
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
			<div className="w-full bg-gray-200 border border-gray-400 rounded px-3 md:px-6 py-4 relative">
				<div className="overflow-x-auto">
					{league == "NBA" && (
						<div className="flex gap-x-6 items-center min-w-4xl mb-3">
							<Conference
								league="NBA"
								conference="EAST"
								className="flex-1"
							/>
							<Finals league="NBA" className="flex-none" />
							<Conference
								league="NBA"
								conference="WEST"
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
						<div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-70"></div>
						<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
							<div className="px-4 py-3 bg-white rounded">
								<p className="font-semibold">Submitting..</p>
							</div>
						</div>
					</div>
				)}
			</div>
			{activeControls && (
				<div className="md:flex items-center space-y-2 md:space-y-0 mt-3">
					<div className="space-x-2">
						<button
							className={`px-3 py-2  text-white min-w-30 rounded  font-bold transition duration-200 ${
								isLoading
									? "opacity-70 bg-red-400"
									: " bg-red-600 hover:bg-red-500 cursor-pointer"
							}`}
							onClick={resetPicks}
							disabled={isLoading}
						>
							RESET
						</button>
						<button
							className={`px-3 py-2 text-white min-w-30 rounded font-bold transition duration-200 ${
								isLoading
									? "bg-gray-600 opacity-70"
									: "bg-gray-700 hover:bg-gray-600 cursor-pointer"
							}`}
							onClick={handleSubmit}
							disabled={isLoading}
						>
							SUBMIT
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Bracket;
