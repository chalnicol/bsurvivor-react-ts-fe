import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdmin } from "../../context/admin/AdminProvider";

const BracketChallengeActiveList = () => {
	const {
		bracketChallenges,
		isLoading,
		isBracketChallengesPopulated,
		fetchBracketChallenges,
	} = useAdmin();

	useEffect(() => {
		if (!isBracketChallengesPopulated) {
			fetchBracketChallenges();
		}
	}, [isBracketChallengesPopulated]);

	return (
		<>
			<div className="w-full">
				<div className="sm:flex items-center gap-x-3 space-y-2">
					<h3 className="font-bold text-xl mb-1">
						<FontAwesomeIcon icon="caret-right" /> Active Bracket
						Challenges
					</h3>
					<button
						className={`font-bold text-xs px-2 py-0.5 block rounded text-white ${
							isLoading
								? "bg-amber-500 opacity-70"
								: "bg-amber-600 hover:bg-amber-500 cursor-pointer"
						}`}
						onClick={() => fetchBracketChallenges()}
						disabled={isLoading}
					>
						REFRESH LIST
					</button>
				</div>
				<hr className="my-2 border-gray-400" />
				{bracketChallenges.length > 0 ? (
					<div className="my-3">
						{bracketChallenges.map((bracketChallenge) => (
							<div
								key={bracketChallenge.id}
								className="sm:flex items-center space-y-1 md:space-y-0 even:bg-gray-300 odd:bg-gray-200 px-3 py-3 md:py-2  border-b border-gray-300"
							>
								<div className="flex-1 font-semibold text-gray-600">
									{bracketChallenge.name}
								</div>
								<Link
									to={`/bracket-challenges/${bracketChallenge.slug}`}
									className="bg-teal-700 font-bold hover:bg-teal-600 text-xs px-3 py-1 block w-26 md:w-18 rounded text-white text-center cursor-pointer"
								>
									VIEW
								</Link>
							</div>
						))}
					</div>
				) : (
					<div className="py-2 px-3 bg-gray-200">
						{isLoading
							? "Fetching active bracket challenges..."
							: "No active bracket challenges to display."}
					</div>
				)}
			</div>
		</>
	);
};

export default BracketChallengeActiveList;
