import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../utils/api";
import Loader from "../components/loader";
import type { BracketChallengeEntryInfo } from "../data/adminData";
import Bracket from "../components/bracket/bracket";
import { BracketProvider } from "../context/bracket/BracketProvider";
import ContentBase from "../components/ContentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nbaLogo from "../assets/nba.png";
import pbaLogo from "../assets/pba.png";

const BracketChallengeEntryPage = () => {
	const { slug } = useParams<{ slug: string }>();

	const [bracketChallengeEntry, setBracketChallengeEnry] =
		useState<BracketChallengeEntryInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchBracketChallengeEntry = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get(
				`/bracket-challenge-entries/${slug}`
			);
			setBracketChallengeEnry(response.data.data);
			// console.log(response.data.user);
		} catch (error) {
			console.error("Error fetching bracket challenge:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!slug) {
			setIsLoading(false);
			return;
		}
		fetchBracketChallengeEntry();
	}, [slug]);

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				{bracketChallengeEntry ? (
					<>
						<div className="md:flex items-center gap-x-2 space-y-1 md:space-y-0">
							{bracketChallengeEntry.bracket_challenge.league ==
								"NBA" && (
								<img
									src={nbaLogo}
									alt="NBA"
									className="h-12 object-contain"
								/>
							)}
							{bracketChallengeEntry.bracket_challenge.league ==
								"PBA" && (
								<img
									src={pbaLogo}
									alt="PBA"
									className="h-7 object-contain"
								/>
							)}

							<h1 className="text-xl font-bold flex-1">
								{bracketChallengeEntry.name}
							</h1>
						</div>

						<hr className="my-4 shadow border-gray-300" />
						<div className="lg:flex gap-x-4 space-y-2 lg:space-y-0 mt-3">
							<div className="flex-1 lg:flex items-center gap-x-2 space-y-1 lg:space-y-0">
								<p className="text-xs font-bold text-gray-600">
									Bracket Challenge
								</p>
								<p className="border border-gray-400 py-1 px-2 rounded bg-gray-200 flex-1">
									{bracketChallengeEntry.bracket_challenge.name}
								</p>
							</div>

							<div className="flex-1 lg:flex items-center gap-x-2 space-y-1 lg:space-y-0">
								<p className="text-xs font-bold text-gray-600">
									Status
								</p>
								<p className="border border-gray-400 py-1 px-2 rounded bg-gray-200 flex-1">
									{bracketChallengeEntry.status}
								</p>
							</div>

							<div className="flex-1 lg:flex items-center gap-x-2 space-y-1 lg:space-y-0">
								<p className="text-xs font-bold text-gray-600">User</p>
								<p className="border border-gray-400 py-1 px-2 rounded bg-gray-200 flex-1">
									{bracketChallengeEntry.user.username}
								</p>
							</div>
						</div>

						<div className="mt-3">
							<BracketProvider
								bracketChallenge={
									bracketChallengeEntry.bracket_challenge
								}
								entryData={bracketChallengeEntry.entry_data}
								activeControls={false}
							>
								<Bracket
									league={
										bracketChallengeEntry.bracket_challenge.league
									}
								/>
							</BracketProvider>
						</div>
					</>
				) : (
					<>
						<h1 className="text-xl font-bold flex-1">
							<FontAwesomeIcon icon="caret-right" /> Bracket Challenge
							Entry
						</h1>
						<p className="mt-2 p-3 bg-gray-200">
							{isLoading
								? "Loading..."
								: "Error fetching bracket challenge entry"}
						</p>
					</>
				)}
			</div>
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketChallengeEntryPage;
