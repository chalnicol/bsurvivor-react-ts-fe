import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import type { BracketChallengeEntryInfo } from "../../../data/adminData";
import Bracket from "../../../components/bracket/bracket";
import { BracketProvider } from "../../../context/bracket/BracketProvider";
import ContentBase from "../../../components/ContentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ViewBracketChallengeEntry = () => {
	const { id } = useParams<{ id: string }>();

	const [bracketChallengeEntry, setBracketChallengeEnry] =
		useState<BracketChallengeEntryInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchBracketChallengeEntry = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get(
				`/admin/bracket-challenge-entries/${id}`
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
		if (!id) {
			setIsLoading(false);
			return;
		}
		fetchBracketChallengeEntry();
	}, [id]);

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">
						Bracket Challenge Entry Details
					</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-4">
					{bracketChallengeEntry ? (
						<>
							<h2 className="text-2xl font-bold text-gray-600">
								<FontAwesomeIcon icon="caret-right" />{" "}
								{bracketChallengeEntry.name}
							</h2>
							<hr className="my-3 border-gray-300 shadow" />
							<div className="grid md:grid-cols-3 grid-cols-1 gap-x-4 gap-y-2 mb-2">
								<div>
									<p className="text-sm">User</p>
									<p
										className={`px-3 py-2 border border-gray-400 bg-gray-200 font-semibold rounded mt-1`}
									>
										{bracketChallengeEntry.user.username}
									</p>
								</div>
								<div>
									<p className="text-sm">Bracket Challenge Name</p>
									<p
										className={`px-3 py-2 border border-gray-400 bg-gray-200 font-semibold rounded mt-1`}
									>
										{bracketChallengeEntry.bracket_challenge.name}
									</p>
								</div>
								<div>
									<p className="text-sm">League</p>
									<p
										className={`px-3 py-2 border border-gray-400 bg-gray-200 font-semibold rounded mt-1`}
									>
										{bracketChallengeEntry.bracket_challenge.league}
									</p>
								</div>
							</div>
							{/* preview */}
							<div>
								<p className="text-sm">Preview</p>
								<div className="mt-1">
									<BracketProvider
										bracketChallenge={
											bracketChallengeEntry.bracket_challenge
										}
										entryData={bracketChallengeEntry.entry_data}
										activeControls={false}
									>
										<Bracket
											league={
												bracketChallengeEntry.bracket_challenge
													.league
											}
										/>
									</BracketProvider>
								</div>
							</div>
						</>
					) : (
						<p className="bg-gray-200 px-3 py-2">
							{isLoading
								? "Loading bracket challenge entry details..."
								: "No bracket challenge entry data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default ViewBracketChallengeEntry;
