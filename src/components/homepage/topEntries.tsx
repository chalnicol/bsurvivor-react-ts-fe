import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopEntryList from "./topEntryList";
import { useAdmin } from "../../context/admin/AdminProvider";
import { useEffect } from "react";

const TopEntries = () => {
	const {
		fetchBracketChallenges,
		ongoingChallenges,
		isOngoingLoading,
		isOngoingChallengesPopulated,
	} = useAdmin();

	useEffect(() => {
		if (!isOngoingChallengesPopulated) {
			fetchBracketChallenges("ongoing");
		}
	}, [isOngoingChallengesPopulated]);

	return (
		<div className="mb-12">
			<h2 className="text-lg font-bold">
				<FontAwesomeIcon icon="caret-right" /> Ongoing Bracket Challenges
			</h2>
			{/* <p className="text-sm my-1">
				This is the list of ongoing bracket challenges.
			</p> */}
			<hr className="my-2 border-gray-400" />
			{ongoingChallenges.length > 0 ? (
				<div className="md:flex gap-x-4 space-y-2 mb-4">
					{ongoingChallenges.map((bracketChallenge) => (
						<TopEntryList
							key={bracketChallenge.id}
							bracketChallenge={bracketChallenge}
						/>
					))}
				</div>
			) : (
				<div className="py-2 px-3 bg-gray-200">
					{isOngoingLoading
						? "Fetching ongoing bracket challenges..."
						: "No ongoing bracket challenges to display."}
				</div>
			)}
		</div>
	);
};

export default TopEntries;
