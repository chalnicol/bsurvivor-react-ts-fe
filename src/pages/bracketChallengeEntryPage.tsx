import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../utils/api";
import Loader from "../components/loader";
import type { BracketChallengeEntryInfo } from "../data/adminData";
import Bracket from "../components/bracket/bracket";
import { BracketProvider } from "../context/bracket/BracketProvider";
import ContentBase from "../components/contentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import nbaLogo from "../assets/nba.png";
import pbaLogo from "../assets/pba.png";
import Detail from "../components/detail";

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

	const bgClass = useCallback((status: string): string => {
		switch (status) {
			case "success":
				return "bg-green-600";
			case "failed":
				return "bg-red-600";
			case "active":
				return "bg-blue-500";
			default:
				return "bg-red-200";
		}
	}, []);

	// if (bracketChallengeEntry) {
	// 	console.log(bracketChallengeEntry.entry_data);
	// }

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				{bracketChallengeEntry ? (
					<>
						<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300">
							<div className="flex justify-center">
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
										className="h-8 object-contain"
									/>
								)}
							</div>

							<hr className="my-2 border-gray-400" />

							<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
								<Detail label="Entry Name">
									{bracketChallengeEntry.name}
								</Detail>
								<Detail label="Bracket Challenge">
									{bracketChallengeEntry.bracket_challenge.name}
								</Detail>
								<Detail label="User">
									{bracketChallengeEntry.user.username}
								</Detail>
								<Detail label="Status">
									<span
										className={`text-xs font-bold select-none rounded px-2 text-white ${bgClass(
											bracketChallengeEntry.status
										)}`}
									>
										{bracketChallengeEntry.status.toLocaleUpperCase()}
									</span>
								</Detail>
							</div>
							<hr className="my-2 border-gray-400" />
							{/* preview */}
							<div>
								<BracketProvider
									bracketChallenge={
										bracketChallengeEntry.bracket_challenge
									}
									predictions={bracketChallengeEntry.predictions}
									isPreview={true}
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
							Entry
						</h1>
						<p className="mt-2 p-3 bg-gray-300 rounded">
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
