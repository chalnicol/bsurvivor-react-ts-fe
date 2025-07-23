import { Link } from "react-router-dom";
import BreadCrumbs from "../../../components/breadCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type LeagueInfo } from "../../../data/adminData";
import { useEffect, useState } from "react";
import api from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";

const ViewLeagues = () => {
	const [loading, setLoading] = useState(false);
	// const [error, setError] = useState<string | null>(null);
	const [leagues, setLeagues] = useState<LeagueInfo[]>([]);

	useEffect(() => {
		const fetchLeagues = async () => {
			setLoading(true);
			setLeagues([]);
			try {
				const response = await api.get(`/admin/leagues/`);
				setLeagues(response.data.data);
			} catch (err) {
				console.log("error", err);
			} finally {
				setLoading(false);
			}
		};
		fetchLeagues();
	}, []);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Leagues</h1>
					<Link
						to="/admin/leagues/create"
						className="text-sm bg-gray-700 hover:bg-gray-600 text-center text-white rounded p-2 text-xs font-bold"
					>
						<FontAwesomeIcon icon="plus" className="me-1" />
						NEW LEAGUE
					</Link>
				</div>

				<div className="mt-4 overflow-x-auto">
					{leagues.length > 0 ? (
						<table className="w-full text-sm min-w-xl text-nowrap">
							<thead className="text-white bg-gray-700 font-semibold">
								<tr>
									<td className="px-2 py-1">ID</td>
									<td className="px-2 py-1">Name</td>
									<td className="px-2 py-1">Initials</td>
									<td className="px-2 py-1">Logo</td>
									<td className="px-2 py-1">Actions</td>
								</tr>
							</thead>
							<tbody>
								{leagues.map((league) => (
									<tr key={league.id} className="even:bg-gray-200">
										<td className="px-2 py-1">{league.id}</td>
										<td className="px-2 py-1">{league.name}</td>
										<td className="px-2 py-1">{league.abbr}</td>
										<td className="px-2 py-1">
											{league.logo ? (
												<img
													src={league.logo}
													alt={league.abbr}
													className="w-10 h-10 object-contain"
												/>
											) : (
												<p className="text-gray-500">--</p>
											)}
										</td>
										<td className="px-2 py-1 flex items-center space-x-1">
											<Link
												to={`/admin/leagues/${league.slug}`}
												className="block shadow cursor-pointer hover:bg-teal-500 bg-teal-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												view
											</Link>
											<Link
												to={`/admin/leagues/${league.slug}/edit`}
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
							{loading
								? "Fetching leagues..."
								: "No leagues data found."}
						</p>
					)}
				</div>
			</div>
			{loading && <Loader />}
		</div>
	);
};

export default ViewLeagues;
