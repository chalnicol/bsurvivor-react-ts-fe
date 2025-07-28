import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import type { LeagueInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { getTeamLogoSrc } from "../../../utils/imageService";
import { Link } from "react-router-dom";

const ViewLeague = () => {
	const { id } = useParams<{ id: string }>();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [league, setLeague] = useState<LeagueInfo | null>(null);

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			return;
		}
		const fetchLeague = async () => {
			try {
				setIsLoading(true);
				const response = await apiClient.get(`/admin/leagues/${id}`);
				setLeague(response.data.data);
				// console.log(response.data.user);
			} catch (error) {
				console.error("Error fetching league:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchLeague();
	}, [id]);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">League Details</h1>
				</div>

				{/* inset content here.. */}
				<div className="mt-3 max-w-lg">
					{league ? (
						<>
							<div className="space-y-3 text-sm">
								<div>
									<p className="bg-gray-300 px-2 py-1">Name</p>
									<p className="p-2 bg-gray-200">{league.name}</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Abbreviation</p>
									<p className="p-2 bg-gray-200">{league.abbr}</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">
										<span>Logo</span>
									</p>
									<p className="p-2 bg-gray-200">
										{league.logo ? (
											<img
												src={getTeamLogoSrc(league.logo)}
												alt={league.abbr}
												className="w-8 h-8 object-contain"
											/>
										) : (
											<span>--</span>
										)}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Teams</p>
									<div className="p-2 bg-gray-200 h-45 overflow-y-auto">
										{league.teams && league.teams.length > 0 ? (
											league.teams.map((team) => (
												<p
													key={team.id}
													className="py-0.5 border-b last:border-b-0 border-gray-300"
												>
													{team.name} ({team.abbr})
												</p>
											))
										) : (
											<p className="p-1">
												No teams found for this league.
											</p>
										)}
									</div>
								</div>
							</div>
							<Link
								to={`/admin/leagues/${league.id}/edit`}
								className="block w-full md:w-1/3 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-center font-bold py-1 px-4 rounded"
							>
								EDIT THIS LEAGUE
							</Link>
						</>
					) : (
						<p>
							{isLoading
								? "Loading league details..."
								: "No league data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</div>
	);
};

export default ViewLeague;
