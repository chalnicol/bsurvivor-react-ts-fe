import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type BracketChallengeInfo } from "../data/adminData";
import { apiClient } from "../utils/api";
import { BracketProvider } from "../context/bracket/BracketProvider";

import Loader from "../components/loader";
import Bracket from "../components/bracket/bracket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			{bracketChallenge ? (
				<>
					<h1 className="text-xl font-bold flex-1">
						<FontAwesomeIcon icon="caret-right" /> {bracketChallenge.name}
					</h1>
					{bracketChallenge.description && (
						<p className="text-sm my-1">{bracketChallenge.description}</p>
					)}

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
		</div>
	);
};

export default BracketChallengePage;
