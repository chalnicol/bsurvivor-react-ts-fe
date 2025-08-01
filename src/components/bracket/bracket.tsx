import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthProvider";
import { useBracket } from "../../context/bracket/BracketProvider";
import Conference from "./conference";
import Finals from "./finals";

interface BracketProps {
	league: string;
}
const Bracket = ({ league }: BracketProps) => {
	const { resetPicks, isPreview } = useBracket();
	const { isAuthenticated } = useAuth();

	return (
		<>
			<div className="w-full bg-gray-200 border border-gray-200 rounded px-3 md:px-6 py-4">
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
				<div className="flex items-center gap-x-4">
					<div className="space-x-2 my-3">
						<button
							className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white min-w-30 rounded cursor-pointer font-bold transition duration-200"
							onClick={resetPicks}
						>
							RESET PICKS
						</button>
						{isAuthenticated ? (
							<button
								className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white min-w-30 rounded cursor-pointer font-bold transition duration-200"
								onClick={resetPicks}
							>
								SUBMIT
							</button>
						) : (
							<p className="inline-block text-center px-3 py-2 bg-gray-400 text-white w-30 rounded font-bold select-none cursor-not-allowed">
								SUBMIT
							</p>
						)}
					</div>

					{!isAuthenticated && (
						<>
							<p className="my-3 flex-1">
								Note: To join the excitement, simply{" "}
								<span>
									<Link to="/register" className="underline">
										register
									</Link>
								</span>{" "}
								or{" "}
								<span>
									<Link to="/login" className="underline">
										log in
									</Link>
								</span>{" "}
								to submit an entry.
							</p>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default Bracket;
