import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAdmin } from "../../context/admin/AdminProvider";
import { displayLocalDate } from "../../utils/dateTime";
import Detail from "../detail";

const BracketChallengeActiveList = () => {
	const {
		activeChallenges,
		isLoading,
		activeChallengesFetched,
		fetchBracketChallenges,
	} = useAdmin();

	useEffect(() => {
		if (!activeChallengesFetched) {
			fetchBracketChallenges("active");
		}
	}, [activeChallengesFetched]);

	return (
		<>
			<div className="w-full">
				<h3 className="font-bold text-xl">
					<FontAwesomeIcon icon="caret-right" /> Active Bracket Challenges
				</h3>
				<p className="text-sm">
					Take a look and submit your bracket challenge entry
				</p>
				<button
					className={`font-bold text-xs px-2 py-0.5 block rounded text-white mt-3 ${
						isLoading
							? "bg-amber-400 opacity-80"
							: "bg-amber-500 hover:bg-amber-400 cursor-pointer"
					}`}
					onClick={() => fetchBracketChallenges("active")}
					disabled={isLoading}
				>
					REFRESH LIST
				</button>

				{/* <hr className="my-2 border-gray-400 text-gray-500" /> */}
				<div className="overflow-x-hidden mt-2">
					<div className="min-w-xl">
						{activeChallenges.length > 0 ? (
							<>
								{activeChallenges.map((bracketChallenge) => (
									<Link
										to={`/bracket-challenges/${bracketChallenge.slug}`}
										key={bracketChallenge.id}
									>
										<div className="sm:grid md:grid-cols-2 px-3 py-2 space-y-1 border border-gray-400 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded mb-1 shadow">
											<Detail label="Name">
												{bracketChallenge.name}
											</Detail>
											<Detail label="League">
												<span
													className={`font-semibold px-1 ${
														bracketChallenge.league == "NBA"
															? "text-red-500"
															: "text-blue-500"
													}`}
												>
													{bracketChallenge.league}
												</span>
											</Detail>
											<Detail label="Start Date">
												{displayLocalDate(
													bracketChallenge.start_date
												)}
											</Detail>
											<Detail label="End Date">
												{displayLocalDate(
													bracketChallenge.end_date
												)}
											</Detail>
										</div>
									</Link>
								))}
							</>
						) : (
							<div className="py-2 px-3 bg-gray-200">
								{isLoading
									? "Fetching active bracket challenges..."
									: "No active bracket challenges to display."}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default BracketChallengeActiveList;
