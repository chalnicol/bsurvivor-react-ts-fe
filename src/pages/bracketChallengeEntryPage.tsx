import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../utils/api";
import Loader from "../components/loader";
import type { BracketChallengeEntryInfo } from "../data/adminData";
import Bracket from "../components/bracket/bracket";
import { BracketProvider } from "../context/bracket/BracketProvider";
import ContentBase from "../components/contentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Detail from "../components/detail";
import { displayLocalDate } from "../utils/dateTime";
import EndOfPage from "../components/endOfPage";

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
			case "eliminated":
				return "bg-red-600";
			case "active":
				return "bg-blue-600";
			default:
				return "bg-gray-500";
		}
	}, []);

	// if (bracketChallengeEntry) {
	// 	console.log(bracketChallengeEntry.entry_data);
	// }

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold flex-1">
					<FontAwesomeIcon icon="caret-right" /> Bracket Challenge Entry
				</h1>

				{bracketChallengeEntry ? (
					<>
						<p className="text-sm font-medium my-1">
							View your bracket challenge entry below.
						</p>
						<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300 mt-4">
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2">
								<Detail label="Entry Name">
									{bracketChallengeEntry.name}
								</Detail>
								<Detail label="Entry By">
									{bracketChallengeEntry.user.username}
								</Detail>
								<Detail label="League">
									{bracketChallengeEntry.bracket_challenge.league}
								</Detail>
								<Detail label="Bracket Challenge">
									{bracketChallengeEntry.bracket_challenge.name}
								</Detail>
								<Detail label="Date Submitted">
									{displayLocalDate(bracketChallengeEntry.created_at)}
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
							<hr className="my-4 border-gray-400" />
							{/* preview */}
							<div>
								<BracketProvider
									bracketChallenge={
										bracketChallengeEntry.bracket_challenge
									}
									predictions={bracketChallengeEntry.predictions}
									bracketMode={"preview"}
								>
									<Bracket />
								</BracketProvider>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="mt-2 p-3 bg-gray-300 rounded">
							{isLoading
								? "Loading..."
								: "Bracket challenge entry not found."}
						</div>
					</>
				)}
			</div>
			<EndOfPage />
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketChallengeEntryPage;
