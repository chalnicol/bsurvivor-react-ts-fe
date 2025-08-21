import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { type BracketChallengeInfo } from "../data/adminData";
import { apiClient } from "../utils/api";
import { BracketProvider } from "../context/bracket/BracketProvider";

import Loader from "../components/loader";
import Bracket from "../components/bracket/bracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { displayLocalDate } from "../utils/dateTime";
import ContentBase from "../components/contentBase";
import { useAuth } from "../context/auth/AuthProvider";
import Detail from "../components/detail";
import { Link } from "react-router-dom";
import LoadAuth from "../components/auth/loadAuth";
import EndOfPage from "../components/endOfPage";
import Leaderboard from "../components/bracket/leaderboard";

interface BracketResponse {
	message: string;
	bracketChallenge: BracketChallengeInfo;
	bracketEntrySlug: string | null;
	showLeaderboard: boolean;
}
const BracketChallengePage = () => {
	const { isAuthenticated, authLoading } = useAuth();
	const location = useLocation();
	const { slug } = useParams<{ slug: string }>();

	const [bracketChallenge, setBracketChallenge] =
		useState<BracketChallengeInfo | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [entrySlug, setEntrySlug] = useState<string | null>(null);
	const [showLeaderboard, setShowLeaderboard] = useState<boolean>(true);

	useEffect(() => {
		//fetch bracket challenge..
		const fetchBracketChallenge = async () => {
			setIsLoading(true);
			try {
				const response = await apiClient.get<BracketResponse>(
					`/bracket-challenges/${slug}`
				);
				setBracketChallenge(response.data.bracketChallenge);
				setEntrySlug(response.data.bracketEntrySlug);
				setShowLeaderboard(response.data.showLeaderboard);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		if (slug) {
			fetchBracketChallenge();
		}
	}, [slug]);

	if (authLoading) {
		return <LoadAuth />;
	}

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold flex-1">
					<FontAwesomeIcon icon="caret-right" /> Bracket Challenge
				</h1>
				{bracketChallenge ? (
					<>
						<p className="font-medium text-sm my-1">
							Advance teams by selecting a winner in each matchup. One
							entry per bracket challenge is allowed, and no changes can
							be made after submission.
						</p>
						<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300 mt-4">
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2">
								<Detail label="Challenge Name">
									{bracketChallenge.name}
								</Detail>
								<Detail label="Submission Opens">
									{displayLocalDate(bracketChallenge.start_date)}
								</Detail>
								<Detail label="Submission Closes">
									{displayLocalDate(bracketChallenge.end_date)}
								</Detail>
							</div>
							<hr className="my-3 border-gray-400" />

							{isAuthenticated ? (
								entrySlug && (
									<div className="py-1 px-4 py-2 rounded mb-3 bg-rose-600 font-semibold sm:flex items-center justify-between space-y-2 sm:space-y-0">
										<div className="text-white">
											You have an entry for this bracket challenge.
										</div>
										<Link
											to={`/bracket-challenge-entries/${entrySlug}`}
											className="bg-gray-800 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-gray-700 block text-center w-26 mb-1 sm:mb-0"
										>
											VIEW ENTRY
										</Link>
									</div>
								)
							) : (
								<div className="py-2 px-4 bg-teal-400 font-semibold rounded mb-3 md:flex items-center justify-between">
									<span className="text-gray-600">
										To join this bracket challenge, you must be
										registered and logged in.
									</span>
									<div className="my-2 md:my-0 space-x-1">
										<Link
											to="/login"
											state={{ from: location }}
											replace={true}
											className="bg-gray-600 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
										>
											LOG IN
										</Link>
										<Link
											to="/register"
											state={{ from: location }}
											replace={true}
											className="bg-gray-600 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
										>
											REGISTER
										</Link>
									</div>
								</div>
							)}

							{/* bracket */}
							<div>
								<BracketProvider
									bracketChallenge={bracketChallenge}
									bracketMode={entrySlug ? "preview" : "submit"}
								>
									<Bracket />
								</BracketProvider>
							</div>
							{/* entry list */}

							{showLeaderboard && (
								<>
									<hr className="my-3 border-gray-400" />
									<Leaderboard
										bracketChallengeId={bracketChallenge.id}
									/>
								</>
							)}
						</div>
					</>
				) : (
					<div className="py-2 px-3 bg-gray-300 mt-4">
						{isLoading ? "Loading..." : "Bracket challenge not found."}
					</div>
				)}
			</div>
			<EndOfPage />
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketChallengePage;
