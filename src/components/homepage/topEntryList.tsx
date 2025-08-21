import type { BracketChallengeInfo } from "../../data/adminData";
import { useAdmin } from "../../context/admin/AdminProvider";
import { Link } from "react-router-dom";
import StatusPills from "../statusPills";
import Detail from "../detail";

interface topEntryListProps {
	bracketChallenge: BracketChallengeInfo;
}

const TopEntryList = ({ bracketChallenge }: topEntryListProps) => {
	const { isLoading } = useAdmin();

	return (
		<div className="overflow-hidden border border-gray-500 rounded">
			<div className="min-w-[350px]">
				<div
					className={`px-3 py-1 text-lg font-bold text-white flex items-center justify-between shadow ${
						bracketChallenge.league == "NBA"
							? "bg-red-700"
							: "bg-blue-700"
					}`}
				>
					<h1>{bracketChallenge.name}</h1>
					<Link
						to={`/bracket-challenges/${bracketChallenge.slug}`}
						className="border rounded text-white text-sm px-3 hover:bg-white/20"
					>
						VIEW
					</Link>
				</div>
				<div className="px-3 py-2 bg-gray-800 ">
					{bracketChallenge.entries.length > 0 ? (
						<>
							<p className="text-gray-700 text-sm font-bold text-white mb-2">
								TOP SUBMITTED ENTRIES
							</p>

							{bracketChallenge.entries.map((entry) => (
								<Link
									to={`/bracket-challenge-entries/${entry.slug}`}
									key={entry.id}
								>
									<div className="sm:grid md:grid-cols-2 lg:grid-cols-3 px-3 py-2 space-y-1 border border-gray-500 bg-gray-700 hover:bg-gray-500 text-sm text-white rounded mb-2 shadow">
										<Detail label="User">
											{entry.user.username}
										</Detail>

										<Detail label="Correct Predictions">
											{entry.correct_predictions_count}
										</Detail>
										<Detail label="Status">
											<StatusPills status={entry.status} />
										</Detail>
									</div>
								</Link>
							))}
						</>
					) : isLoading ? (
						<p>Loading...</p>
					) : (
						<p>No entries found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default TopEntryList;
