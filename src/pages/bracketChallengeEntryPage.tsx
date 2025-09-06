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
import StatusPills from "../components/statusPills";

import { Link } from "react-router-dom";
import { CommentsProvider } from "../context/comment/CommentsProvider";
import CommentsSection from "../components/commentsSection";
import ShareToSocials from "../components/shareToSocials";
import { useAuth } from "../context/auth/AuthProvider";
// import { useAuth } from "../context/auth/AuthProvider";

const BracketChallengeEntryPage = () => {
	const { isAuthenticated, user } = useAuth();
	const { slug } = useParams<{ slug: string }>();

	const [bracketChallengeEntry, setBracketChallengeEnry] =
		useState<BracketChallengeEntryInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [totalCommentsCount, setTotalCommentsCount] = useState<number>(0);

	const fetchBracketChallengeEntry = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get(
				`/bracket-challenge-entries/${slug}`
			);
			const { message, entry, totalCommentsCount } = response.data;
			console.log(message);
			setBracketChallengeEnry(entry);
			setTotalCommentsCount(totalCommentsCount);
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

	const getEntryUsername = useCallback((): string => {
		if (bracketChallengeEntry) {
			if (
				isAuthenticated &&
				user &&
				user.id == bracketChallengeEntry.user.id
			) {
				return "You";
			}
			return bracketChallengeEntry.user.username;
		}
		return "";
	}, [user, isAuthenticated, bracketChallengeEntry]);

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold flex-1">
					<FontAwesomeIcon icon="caret-right" /> Bracket Challenge Entry
				</h1>

				{bracketChallengeEntry ? (
					<>
						<p className="text-sm font-medium my-1">
							View bracket challenge entry below.
						</p>

						<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300 mt-4">
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2">
								<Detail label="Entry ID">
									{bracketChallengeEntry.name}
								</Detail>

								<Detail label="Date Submitted">
									{displayLocalDate(bracketChallengeEntry.created_at)}
								</Detail>

								<Detail label="Bracket Challenge">
									<Link
										to={`/bracket-challenges/${bracketChallengeEntry.bracket_challenge.slug}`}
										className="hover:text-gray-400 border-b border-gray-300"
									>
										{bracketChallengeEntry.bracket_challenge.name}
										<FontAwesomeIcon
											icon="external-link"
											size="sm"
											className="ms-2"
										/>
									</Link>
								</Detail>
								<Detail label="Entry By">
									<Link
										to={`/users/${bracketChallengeEntry.user.username}`}
										className="hover:text-gray-400 border-b border-gray-300"
									>
										{getEntryUsername()}
										<FontAwesomeIcon
											icon="external-link"
											size="sm"
											className="ms-2"
										/>
									</Link>
								</Detail>
								<Detail label="Correct Picks Count">
									<span
										className={`font-semibold ${
											bracketChallengeEntry.correct_predictions_count >
												0 && "text-yellow-500"
										}`}
									>
										{bracketChallengeEntry.correct_predictions_count}
									</span>
								</Detail>
								<Detail label="Status">
									<StatusPills status={bracketChallengeEntry.status} />
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

						<ShareToSocials />

						<CommentsProvider
							resource="entries"
							resourceId={bracketChallengeEntry.id}
							totalCount={totalCommentsCount}
						>
							<CommentsSection className="mt-1" />
						</CommentsProvider>
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
