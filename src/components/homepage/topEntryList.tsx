import type { BracketChallengeInfo } from "../../data/adminData";
import { useAdmin } from "../../context/admin/AdminProvider";
import { Link } from "react-router-dom";
import StatusPills from "../statusPills";

interface topEntryListProps {
	bracketChallenge: BracketChallengeInfo;
}

const TopEntryList = ({ bracketChallenge }: topEntryListProps) => {
	const { isLoading } = useAdmin();

	return (
		<div className="overflow-x-auto">
			<div className="min-w-3xl">
				<div
					className={`px-2 py-1 text-lg font-bold text-white ${
						bracketChallenge.league == "NBA"
							? "bg-red-700"
							: "bg-blue-700"
					}`}
				>
					<h1>{bracketChallenge.name}</h1>
				</div>
				{bracketChallenge.entries.length > 0 ? (
					<>
						<div className="grid grid-cols-4 bg-gray-800 text-white font-bold text-sm">
							<p className="px-2 py-0.5">Username</p>
							<p className="px-2 py-0.5">Correct Predictions</p>
							<p className="px-2 py-0.5">Status</p>
							<p className="px-2 py-0.5">View</p>
						</div>

						{bracketChallenge.entries.map((entry) => (
							<div
								className="grid grid-cols-4 odd:bg-gray-200 even:bg-gray-50"
								key={entry.id}
							>
								<p className="px-2 py-0.5 font-semibold text-gray-600">
									{entry.user.username}
								</p>
								<p className="px-2 py-0.5 font-semibold text-gray-600">
									{entry.correct_predictions_count}
								</p>
								<p className="px-2 py-0.5">
									<StatusPills status={entry.status} />
								</p>
								<p className="px-2 py-0.5">
									<Link
										to={`/bracket-challenge-entries/${entry.slug}`}
										className="bg-teal-700 hover:bg-teal-600 text-white px-2 text-xs rounded font-bold"
									>
										VIEW
									</Link>
								</p>
							</div>
						))}
					</>
				) : isLoading ? (
					<p>Loading...</p>
				) : (
					<p>No entries found.</p>
				)}
			</div>
		</div>
	);
};

export default TopEntryList;
