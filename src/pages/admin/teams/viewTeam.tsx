import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import type { AnyTeamInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { getTeamLogoSrc } from "../../../utils/imageService";
import { Link } from "react-router-dom";
import ContentBase from "../../../components/contentBase";
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
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Team Details</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-3 max-w-lg">
					{team ? (
						<>
							<div className="mt-6 flex gap-x-3 ">
								<div className="flex-none">
									<img
										src={getTeamLogoSrc(team.logo || "")}
										alt={team.abbr}
										className="w-16 h-16 object-contain"
									/>
								</div>
								<div className="flex-1 py-1">
									<h1 className="text-xl font-semibold text-gray-900">
										{team.fname} {team.lname}
									</h1>
									<h2 className="text-lg font-semibold text-gray-600">
										( {team.abbr} )
									</h2>
								</div>
							</div>
							<hr className="my-2 border-gray-300 shadow" />
							<div className="space-y-2">
								<div>
									<p className="text-sm">League</p>
									<p className="px-3 py-2 border border-gray-200 bg-gray-200 font-semibold rounded mt-1">
										{team.league}
									</p>
								</div>
								{team.league == "NBA" && (
									<div>
										<p className="text-sm">Conference</p>
										<p className="px-3 py-2 border border-gray-200 bg-gray-200 font-semibold rounded mt-1">
											{team.conference}
										</p>
									</div>
								)}
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
		</ContentBase>
	);
};

export default ViewTeam;
