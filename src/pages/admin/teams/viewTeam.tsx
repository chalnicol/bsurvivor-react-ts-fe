import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import type { AnyTeamInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { getTeamLogoSrc } from "../../../utils/imageService";
import { Link } from "react-router-dom";
// import { useAdmin } from "../../../context/admin/AdminProvider";

const ViewTeam = () => {
	const { id } = useParams<{ id: string }>();

	const [team, setTeam] = useState<AnyTeamInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchTeam = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get(`/admin/teams/${id}`);
			setTeam(response.data.data);
			// console.log(response.data.user);
		} catch (error) {
			console.error("Error fetching user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			return;
		}
		fetchTeam();
	}, [id]);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Team Details</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-3 max-w-lg">
					{team ? (
						<>
							<div className="space-y-3 text-sm">
								<div>
									<p className="bg-gray-300 px-2 py-1">Name</p>
									<p className="p-2 bg-gray-200">{team.name}</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Initials</p>
									<p className="p-2 bg-gray-200">{team.abbr}</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">League</p>
									<p className="p-2 bg-gray-200">{team.league}</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Conference</p>
									<p className="p-2 bg-gray-200">
										{team.league == "NBA" ? team.conference : "--"}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Logo</p>
									<p className="p-2 bg-gray-200">
										{team.logo ? (
											<img
												src={getTeamLogoSrc(team.logo)}
												alt={team.abbr}
												className="w-8 h-8 object-contain"
											/>
										) : (
											<span>--</span>
										)}
									</p>
								</div>
							</div>
							<Link
								to={`/admin/teams/${team.id}/edit`}
								className="block w-full md:w-1/3 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-center font-bold py-1 px-4 rounded"
							>
								EDIT THIS TEAM
							</Link>
						</>
					) : (
						<p>
							{isLoading
								? "Loading team details..."
								: "No team data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</div>
	);
};

export default ViewTeam;
