import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import BreadCrumbs from "../../../components/breadCrumbs";

interface BracketChallengeInfo {
	id: number;
	name: string;
	league: string;
	startDate: string;
	endDate: string;
}
const ViewBracketChallenges = () => {
	const bracketChallenges: BracketChallengeInfo[] = [
		{
			id: 1,
			name: "Challenge 1",
			league: "NBA",
			startDate: "2023-08-01",
			endDate: "2023-08-31",
		},
		{
			id: 2,
			name: "Challenge 2",
			league: "PBA",
			startDate: "2023-09-01",
			endDate: "2023-09-30",
		},
		{
			id: 3,
			name: "Challenge 3",
			league: "PBA",
			startDate: "2023-09-01",
			endDate: "2023-09-30",
		},
		// Add more challenge data as needed
	];

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)]">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Bracket Challenges</h1>
					<Link
						to="/admin/bracket-challenges/create"
						className="text-sm bg-gray-700 hover:bg-gray-600 text-center text-white rounded p-2 text-xs font-bold"
					>
						<FontAwesomeIcon icon="plus" className="me-1" />
						NEW CHALLENGE
					</Link>
				</div>

				<div className="mt-4 overflow-x-auto">
					{bracketChallenges.length > 0 ? (
						<table className="w-full text-sm min-w-xl text-nowrap">
							<thead className="text-white bg-gray-700 font-semibold">
								<tr>
									<td className="px-2 py-1">ID</td>
									<td className="px-2 py-1">Name</td>
									<td className="px-2 py-1">League</td>
									<td className="px-2 py-1">Start Date</td>
									<td className="px-2 py-1">End Date</td>
									<td className="px-2 py-1">Actions</td>
								</tr>
							</thead>
							<tbody>
								{bracketChallenges.map((challenge) => (
									<tr key={challenge.id} className="even:bg-gray-200">
										<td className="px-2 py-1">{challenge.id}</td>
										<td className="px-2 py-1">{challenge.name}</td>
										<td className="px-2 py-1">{challenge.league}</td>
										<td className="px-2 py-1">
											{challenge.startDate}
										</td>
										<td className="px-2 py-1">{challenge.endDate}</td>

										<td className="px-2 py-1 flex items-center space-x-1">
											<Link
												to={`/admin/bracket-challenges/${challenge.id}`}
												className="block shadow cursor-pointer hover:bg-teal-500 bg-teal-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												view
											</Link>
											<Link
												to={`/admin/bracket-challenges/${challenge.id}/edit`}
												className="block shadow cursor-pointer hover:bg-cyan-500 bg-cyan-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												edit
											</Link>
											<button className="shadow cursor-pointer hover:bg-red-500 bg-red-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold">
												delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No Bracket Challenges found.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ViewBracketChallenges;
