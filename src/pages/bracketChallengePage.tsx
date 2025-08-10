import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { type BracketChallengeInfo } from "../data/adminData";
import { apiClient } from "../utils/api";
import { BracketProvider } from "../context/bracket/BracketProvider";

import Loader from "../components/loader";
import Bracket from "../components/bracket/bracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { displayLocalDate } from "../utils/dateToLocal";
import ContentBase from "../components/contentBase";
import { useAuth } from "../context/auth/AuthProvider";
import nbaLogo from "../assets/nba.png";
import pbaLogo from "../assets/pba.png";
import Detail from "../components/detail";
import { Link } from "react-router-dom";

interface BracketResponse {
	message: string;
	bracketChallenge: BracketChallengeInfo;
	bracketEntrySlug: string;
}
const BracketChallengePage = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();
	const { slug } = useParams<{ slug: string }>();

	const [bracketChallenge, setBracketChallenge] =
		useState<BracketChallengeInfo | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [entrySlug, setEntrySlug] = useState<string>("");

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

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				{bracketChallenge ? (
					<>
						<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300">
							<div className="flex items-center gap-x-2 space-y-1 md:space-y-0">
								{bracketChallenge.league == "NBA" && (
									<img
										src={nbaLogo}
										alt="NBA"
										className="h-12 object-contain"
									/>
								)}
								{bracketChallenge.league == "PBA" && (
									<img
										src={pbaLogo}
										alt="PBA"
										className="h-7 object-contain"
									/>
								)}
								<div>
									<h1 className="text-xl font-bold flex-1">
										{bracketChallenge.name}
									</h1>
									{bracketChallenge.description && (
										<p className="text-sm">
											{bracketChallenge.description}
										</p>
									)}
								</div>
							</div>

							<hr className="my-2 border-gray-400" />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
								<Detail label="Start Date">
									{displayLocalDate(bracketChallenge.start_date)}
								</Detail>
								<Detail label="End Date">
									{displayLocalDate(bracketChallenge.end_date)}
								</Detail>
							</div>
							<hr className="my-2 border-gray-400" />

							{isAuthenticated && entrySlug !== "" && (
								<div className="py-1 px-4 py-2 rounded mb-3 bg-rose-600 font-semibold sm:flex items-center justify-between space-y-2 sm:space-y-0">
									<div className="text-white">
										You already have an entry for this challenge.
									</div>
									<Link
										to={`/bracket-challenge-entries/${entrySlug}`}
										className="bg-gray-800 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-gray-700 block text-center w-26 mb-1 sm:mb-0"
									>
										VIEW ENTRY
									</Link>
								</div>
							)}

							{!isAuthenticated && (
								<div className="py-2 px-4 bg-teal-600 font-semibold rounded mb-3 sm:flex items-center justify-between space-y-2 sm:space-y-0">
									<span className="text-white">
										To join the bracket challenge, you must be
										registered and logged in.
									</span>
									<div className="mb-1 sm:mb-0 space-x-1">
										{/* <button
											className="bg-teal-800 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-teal-700"
											onClick={() => handleAuthButtonClick("login")}
										>
											LOG IN
										</button> */}
										<Link
											to="/login"
											state={{ from: location }}
											replace={true}
											className="bg-gray-800 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
										>
											LOG IN
										</Link>
										<Link
											to="/register"
											state={{ from: location }}
											replace={true}
											className="bg-gray-800 font-semibold text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
										>
											REGISTER
										</Link>
									</div>
								</div>
							)}

							{/* preview */}
							<div>
								<BracketProvider
									bracketChallenge={bracketChallenge}
									isPreview={entrySlug !== ""}
								>
									<Bracket />
								</BracketProvider>
							</div>
						</div>
					</>
				) : (
					<>
						<h1 className="text-xl font-bold flex-1">
							<FontAwesomeIcon icon="caret-right" /> Bracket Challenge
						</h1>
						<p className="mt-2 p-3 bg-gray-300 rounded">
							{isLoading
								? "Loading..."
								: "Error fetching bracket challenge"}
						</p>
					</>
				)}
			</div>
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketChallengePage;
