import { useAuth } from "../../context/auth/AuthProvider";
import { useBracket } from "../../context/bracket/BracketProvider";
import Conference from "./conference";
import Finals from "./finals";
import { useLocation, useNavigate } from "react-router-dom";

interface BracketProps {
	league: string;
}
const Bracket = ({ league }: BracketProps) => {
	const { resetPicks, isPreview } = useBracket();
	const { isLoading, isAuthenticated } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

	const handleSubmit = () => {
		if (!isAuthenticated) {
			navigate("/login", { state: { from: location }, replace: true });
			return;
		}
		console.log("submitting..");
	};
	return (
		<>
			<div className="w-full bg-gray-200 border border-gray-300 rounded px-3 md:px-6 py-4">
				<div className="overflow-x-auto">
					{league == "NBA" && (
						<div className="flex gap-x-6 items-center min-w-4xl mb-3">
							<Conference
								league="NBA"
								conference="EAST"
								className="flex-1"
							/>
							<Finals league="NBA" />
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
							<Finals league="PBA" className="max-w-44 flex-none" />
						</div>
					)}
				</div>
			</div>

			{!isPreview && (
				<div className="md:flex items-center gap-x-4">
					<div className="space-x-2 my-3">
						<button
							className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white min-w-30 rounded cursor-pointer font-bold transition duration-200"
							onClick={resetPicks}
						>
							RESET PICKS
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

					{!isAuthenticated && (
						<>
							<p className="my-3">
								To join the excitement, you must be logged in.
							</p>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default Bracket;
