import { Link } from "react-router-dom";
import { apiClient } from "../../utils/api";
import { useEffect, useState } from "react";
import { type BracketChallengeInfo } from "../../data/adminData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BracketChallengeActiveList = () => {
	const [bracketChallenges, setBracketChallenges] = useState<
		BracketChallengeInfo[]
	>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		//fetch all active bracket challenges
		const fetchActiveBracketChallenges = async () => {
			setIsLoading(true);
			try {
				const response = await apiClient.get("/bracket-challenges/active");
				// console.log(response.data.challenges);
				setBracketChallenges(response.data.challenges);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchActiveBracketChallenges();
	}, []);

	return (
		<>
			<div className="w-full">
				<h3 className="font-bold text-lg mb-1">
					<FontAwesomeIcon icon="caret-right" /> Active Bracket Challenges
				</h3>

				{bracketChallenges.length > 0 ? (
					<div className="mb-4">
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
					<p>
						{isLoading
							? "Loading..."
							: "No active bracket challenges found."}
					</p>
				)}
			</div>
		</>
	);
};

export default BracketChallengeActiveList;
