import { useEffect, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import type { BracketChallengeEntryInfo } from "../../data/adminData";
import StatusPills from "../statusPills";

type LeaderboardType = "global" | "friends";

interface LeaderboardProps {
	bracketChallengeId: number;
}
const Leaderboard = ({ bracketChallengeId }: LeaderboardProps) => {
	const [type, setType] = useState<LeaderboardType>("global");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [leaderboard, setLeaderboard] = useState<BracketChallengeEntryInfo[]>(
		[]
	);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			setIsLoading(true);
			setLeaderboard([]);
			try {
				const response = await apiClient.get(
					`/bracket-challenges/${bracketChallengeId}/leaderboard?type=${type}`
				);
				setLeaderboard(response.data.entries);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchLeaderboard();
	}, [bracketChallengeId, type]);

	const handleButtonClick = (buttonType: LeaderboardType) => {
		setType(buttonType);
	};
	return (
		<div className="max-w-2xl mx-auto mb-6">
			<h2 className="font-bold text-sm text-center text-xl">LEADERBOARD</h2>
			<div className="border rounded overflow-hidden flex mt-4">
				<button
					className={`flex-1 border-r border-gray-400 px-2 py-1 font-bold ${
						type === "global"
							? "bg-gray-500"
							: "hover:bg-gray-700 cursor-pointer"
					}`}
					onClick={() => handleButtonClick("global")}
				>
					GLOBAL
				</button>
				<button
					className={`flex-1 border-r border-gray-400 px-2 py-1 font-bold ${
						type === "friends"
							? "bg-gray-500"
							: "hover:bg-gray-700 cursor-pointer"
					}`}
					onClick={() => handleButtonClick("friends")}
				>
					FRIENDS
				</button>
			</div>
			<div className="overflow-x-auto">
				<div className="min-w-lg">
					{leaderboard.length > 0 ? (
						<>
							<div className="grid grid-cols-4 text-center bg-gray-900 py-0.5 mt-4">
								<p>Rank</p>
								<p>Username</p>
								<p>Correct Predictions</p>
								<p>Status</p>
							</div>
							{leaderboard.map((entry, rank) => (
								<div
									key={entry.id}
									className="grid grid-cols-4 text-center even:bg-gray-600 py-1"
								>
									<p>{rank + 1}</p>
									<p>{entry.user.username}</p>
									<p>{entry.correct_predictions_count}</p>
									<p>
										<StatusPills status={entry.status} />
									</p>
								</div>
							))}
						</>
					) : (
						<div className="bg-gray-700 text-white px-2 py-1 mt-2 h-16 flex items-center justify-center rounded">
							{isLoading ? "LOADING..." : "No leaderboard data found."}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
