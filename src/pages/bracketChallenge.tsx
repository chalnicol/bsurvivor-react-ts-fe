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

const BracketChallengePage = () => {
	const { id } = useParams<{ id: string }>();

	const [bracketChallenge, setBracketChallenge] =
		useState<BracketChallengeInfo | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [succes, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		//fetch bracket challenge..
		const fetchBracketChallenge = async () => {
			setIsLoading(true);
			setError(null);
			setSuccess(null);
			try {
				const response = await apiClient.get(`/bracket-challenges/${id}`);
				setBracketChallenge(response.data.data);
			} catch (error) {
				console.error(error);
				setError("Error fetching bracket challenge");
			} finally {
				setIsLoading(false);
			}
		};
		if (id) {
			fetchBracketChallenge();
		}
	}, [id]);

	return (
		<ContentBase className="px-4 py-7">
			{bracketChallenge ? (
				<>
					<h1 className="text-xl font-bold flex-1">
						<FontAwesomeIcon icon="caret-right" /> {bracketChallenge.name}
					</h1>
					{bracketChallenge.description && (
						<p className="text-sm my-1">{bracketChallenge.description}</p>
					)}

					<div className="md:flex gap-x-4 space-y-2 md:space-y-0 mt-3">
						<div className="flex-1 md:flex items-center gap-x-2">
							<p className="text-xs font-bold text-gray-600 mb-1 md:mb-0">
								Start Date
							</p>
							<p className="border border-gray-300 py-1 px-2 rounded bg-gray-200 flex-1">
								{displayLocalDate(bracketChallenge.start_date)}
							</p>
						</div>
						<div className="flex-1 md:flex items-center gap-x-2">
							<p className="text-xs font-bold text-gray-600 mb-1 md:mb-0">
								End Date
							</p>
							<p className="border border-gray-300 py-1 px-2 rounded bg-gray-200 flex-1">
								{displayLocalDate(bracketChallenge.end_date)}
							</p>
						</div>
					</div>

					<div className="mt-3">
						<BracketProvider
							data={bracketChallenge.rounds}
							isPreview={false}
						>
							<Bracket league={bracketChallenge.league} />
						</BracketProvider>
					</div>
				</>
			) : (
				<p className="p-3 border rounded-lg shadow border-gray-300">
					{isLoading ? "Loading..." : "Error fetching bracket challenge"}
				</p>
			)}
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketChallengePage;
