import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopEntryList from "./topEntryList";
import { useAdmin } from "../../context/admin/AdminProvider";
import { useEffect } from "react";

const TopEntries = () => {
	const {
		isLoading,
		fetchBracketChallenges,
		ongoingChallenges,
		isOngoingLoading,
		ongoingChallengesFetched,
	} = useAdmin();

	useEffect(() => {
		if (!ongoingChallengesFetched) {
			fetchBracketChallenges("ongoing");
		}
	}, [ongoingChallengesFetched]);

	return (
		<div className="mb-12">
			<h3 className="font-bold text-xl">
				<FontAwesomeIcon icon="caret-right" /> Top Challenge Entries
			</h3>

			<p className="text-sm">
				This is the list of ongoing bracket challenges.
			</p>
			<button
				className={`font-bold text-xs px-2 py-0.5 block rounded text-white mt-3 ${
					isLoading
						? "bg-amber-400 opacity-80"
						: "bg-amber-500 hover:bg-amber-400 cursor-pointer"
				}`}
				onClick={() => fetchBracketChallenges("ongoing")}
				disabled={isLoading}
			>
				REFRESH LIST
			</button>
			{ongoingChallenges.length > 0 ? (
				<div className="space-y-4 mb-4 mt-2">
					{ongoingChallenges.map((bracketChallenge) => (
						<TopEntryList
							key={bracketChallenge.id}
							bracketChallenge={bracketChallenge}
						/>
					))}
				</div>
			) : (
				<div className="py-2 px-3 bg-gray-200 mt-2">
					{isOngoingLoading
						? "Fetching top entries..."
						: "No top entries to display."}
				</div>
			)}
		</div>
	);
};

export default TopEntries;
