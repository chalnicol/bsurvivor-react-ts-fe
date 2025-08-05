import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type BracketChallengeInfo } from "../data/adminData";
import { apiClient } from "../utils/api";
import { BracketProvider } from "../context/bracket/BracketProvider";

import Loader from "../components/loader";
import Bracket from "../components/bracket/bracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { displayLocalDate } from "../utils/dateToLocal";
import ContentBase from "../components/ContentBase";
import { useAuth } from "../context/auth/AuthProvider";
import nbaLogo from "../assets/nba.png";
import pbaLogo from "../assets/pba.png";

const BracketChallengePage = () => {
	const { isAuthenticated } = useAuth();
	const { slug } = useParams<{ slug: string }>();

	const [bracketChallenge, setBracketChallenge] =
		useState<BracketChallengeInfo | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [hasEntry, setHasEntry] = useState<boolean>(false);
	6;

	useEffect(() => {
		//fetch bracket challenge..
		const fetchBracketChallenge = async () => {
			setIsLoading(true);
			try {
				const response = await apiClient.get(`/bracket-challenges/${slug}`);
				setBracketChallenge(response.data.bracketChallenge);
				setHasEntry(response.data.hasEntry);
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
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				{bracketChallenge ? (
					<>
						<div className="md:flex items-center gap-x-2 space-y-1 md:space-y-0">
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

						<hr className="my-4 shadow border-gray-300" />

						<div className="md:flex gap-x-4 space-y-2 md:space-y-0 mt-3">
							<div className="flex-1 md:flex items-center gap-x-2 space-y-1 md:space-y-0">
								<p className="text-xs font-bold text-gray-600">
									Start Date
								</p>
								<p className="border border-gray-400 py-1 px-2 rounded bg-gray-200 flex-1">
									{displayLocalDate(bracketChallenge.start_date)}
								</p>
							</div>

							<div className="flex-1 md:flex items-center gap-x-2 space-y-1 md:space-y-0">
								<p className="text-xs font-bold text-gray-600">
									End Date
								</p>
								<p className="border border-gray-400 py-1 px-2 rounded bg-gray-200 flex-1">
									{displayLocalDate(bracketChallenge.end_date)}
								</p>
							</div>
						</div>
						{hasEntry && (
							<div className="py-1 px-4 py-2 rounded mt-3 bg-cyan-400 font-semibold text-white">
								You already have an entry for this challenge.
							</div>
						)}

						{!isAuthenticated && (
							<p className="py-2 px-4 bg-amber-400 font-semibold rounded my-3">
								To join the bracket challenge, you must be logged in.
							</p>
						)}

						<div className="mt-3">
							<BracketProvider
								bracketChallenge={bracketChallenge}
								activeControls={!hasEntry}
							>
								<Bracket league={bracketChallenge.league} />
							</BracketProvider>
						</div>
					</>
				) : (
					<>
						<h1 className="text-xl font-bold flex-1">
							<FontAwesomeIcon icon="caret-right" /> Bracket Challenge
						</h1>
						<p className="mt-2 p-3 bg-gray-200">
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
