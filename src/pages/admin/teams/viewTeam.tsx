import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import StatusMessage from "../../../components/statusMessages";
import type { AnyTeamInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
// import { useAdmin } from "../../../context/admin/AdminProvider";

const ViewTeam = () => {
	const { slug } = useParams<{ slug: string }>();

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [team, setTeam] = useState<AnyTeamInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchTeam = async () => {
		try {
			setIsLoading(true);
			setError(null);
			setSuccess(null);
			const response = await apiClient.get(`/admin/teams/${slug}`);
			setTeam(response.data.data);
			// console.log(response.data.user);
		} catch (error) {
			console.error("Error fetching user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!slug) {
			setError("Invalid user ID");
			setIsLoading(false);
			return;
		}
		fetchTeam();
	}, [slug]);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Team Details</h1>
				</div>
				<StatusMessage success={success} error={error} />
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
												src={team.logo}
												alt={team.abbr}
												className="w-8 h-8 object-contain"
											/>
										) : (
											<span>--</span>
										)}
									</p>
								</div>
							</div>
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
