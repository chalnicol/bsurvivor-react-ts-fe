import type { BracketChallengeInfo } from "../../data/adminData";
import { useAdmin } from "../../context/admin/AdminProvider";

interface topEntryListProps {
	bracketChallenge: BracketChallengeInfo;
}

const TopEntryList = ({ bracketChallenge }: topEntryListProps) => {
	const { isLoading, fetchTopEntries } = useAdmin();

	return (
		<div className="flex-1">
			<div className="px-2 py-1 bg-red-600 text-white flex items-center">
				<p className="font-semibold flex-1">{bracketChallenge.name}</p>
				<button
					className="text-xs border rounded px-2 py-0.5 cursor-pointer hover:bg-red-500 text-white"
					onClick={() => fetchTopEntries(bracketChallenge.id)}
				>
					REFRESH LIST
				</button>
			</div>
			<div>
				{bracketChallenge.entries.length > 0 ? (
					bracketChallenge.entries.map((entry) => (
						<div
							key={entry.id}
							className="border-b border-gray-300 py-1 px-3 flex items-center even:bg-gray-300 odd:bg-gray-200"
						>
							<div className="w-full flex items-center justify-between">
								<p>{entry.user.username}</p>
								<p>
									<span className="text-sm">SCORE</span>:
									{entry.correct_predictions_count}1
								</p>
							</div>
						</div>
					))
				) : isLoading ? (
					<p>Loading..</p>
				) : (
					<p className="px-2 py-1 bg-gray-200">No top entries found.</p>
				)}
			</div>
		</div>
	);
};

export default TopEntryList;
