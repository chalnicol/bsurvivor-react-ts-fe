import { Link } from "react-router-dom";
import BreadCrumbs from "../../../components/breadCrumbs";

import { type NBATeamInfo } from "../../../data/nbaData";
import { type PBATeamInfo } from "../../../data/pbaData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";

type TeamInfo = NBATeamInfo | PBATeamInfo;

const ViewTeams = () => {
	const [teams, setTeams] = useState<TeamInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchTeams = async () => {
			setIsLoading(true);
			setTeams([]);
			try {
				const response = await apiClient.get("/admin/teams");
				setTeams(response.data.data);
				// console.log(response.data);
			} catch (error) {
				console.error("Error fetching teams:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTeams();
	}, []);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Teams</h1>
					<Link
						to="/admin/leagues/create"
						className="text-sm bg-gray-700 hover:bg-gray-600 text-center text-white rounded p-2 text-xs font-bold"
					>
						<FontAwesomeIcon icon="plus" className="me-1" />
						NEW TEAM
					</Link>
				</div>

				<div className="mt-4 overflow-x-auto">
					{teams.length > 0 ? (
						<table className="w-full text-sm min-w-xl text-nowrap">
							<thead className="text-white bg-gray-700 font-semibold">
								<tr>
									<td className="px-2 py-1">ID</td>
									<td className="px-2 py-1">Name</td>
									<td className="px-2 py-1">Logo</td>
									<td className="px-2 py-1">Initials</td>
									<td className="px-2 py-1">League</td>
									<td className="px-2 py-1">Conference</td>

									<td className="px-2 py-1">Actions</td>
								</tr>
							</thead>
							<tbody>
								{teams.map((team) => (
									<tr key={team.id} className="even:bg-gray-200">
										<td className="px-2 py-1">{team.id}</td>
										<td className="px-2 py-1">{team.name}</td>
										<td className="px-2 py-1">
											{team.logo ? (
												<img
													src={team.logo}
													alt={team.abbr}
													className="w-6 h-6 object-contain"
												/>
											) : (
												<p className="text-gray-500">--</p>
											)}
										</td>
										<td className="px-2 py-1">{team.abbr}</td>

										<td className="px-2 py-1">{team.league}</td>
										<td className="px-2 py-1">
											{team.league === "NBA" ? (
												<span>{team.conference}</span>
											) : (
												<span>N/A</span>
											)}
										</td>

										<td className="px-2 py-1 flex items-center space-x-1">
											<Link
												to={`/admin/teams/${team.slug}`}
												className="block shadow cursor-pointer hover:bg-teal-500 bg-teal-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												view
											</Link>
											<Link
												to={`/admin/leagues/${team.slug}/edit`}
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
						<p>
							{isLoading ? "Fetching teams..." : "No teams data found."}
						</p>
					)}
				</div>
			</div>
			{isLoading && <Loader />}
		</div>
	);
};

export default ViewTeams;
