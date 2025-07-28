import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import AdminThumbs from "../../components/adminThumbnails";
import { apiClient } from "../../utils/api";
import {
	type TotalsInfo,
	type ResourcesResponseInfo,
} from "../../data/adminData";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";

const AdminDashboard = () => {
	const [totals, setTotals] = useState<TotalsInfo | null>(null);
	// const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchResourcesTotals = async () => {
		try {
			setTotals(null);
			// setIsLoading(true);
			const response = await apiClient.get<ResourcesResponseInfo>(
				"/admin/totals"
			);
			setTotals(response.data.totals);
		} catch (error) {
			console.log(error);
		} finally {
			// setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchResourcesTotals();
	}, []);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
			<p className="text-sm">Welcome to the admin dashboard!</p>
			{totals ? (
				<div className="md:grid grid-cols-2 xl:grid-cols-3 space-y-3 md:space-y-0 mt-6 gap-3">
					{/* users */}
					<AdminThumbs
						title={`Users (${totals.userTotal})`}
						description="View and manage basketball leagues"
						bgColor="green"
					>
						<Link
							to="/admin/users"
							className="mt-2 cursor-pointer hover:bg-gray-600 bg-gray-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							VIEW USERS
						</Link>
					</AdminThumbs>

					{/* challenges */}
					<AdminThumbs
						title={`Challenges (${totals.bracketChallengeTotal})`}
						description="View and manage basketball leagues"
						bgColor="orange"
					>
						<Link
							to="/admin/bracket-challenges"
							className="mt-2 cursor-pointer hover:bg-gray-600 bg-gray-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							VIEW CHALLENGES
						</Link>
						<Link
							to="/admin/bracket-challenges/create"
							className="mt-2 cursor-pointer hover:bg-orange-600 bg-orange-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							<FontAwesomeIcon icon="plus" className="me-1" />
							NEW CHALLENGE
						</Link>
					</AdminThumbs>

					{/* leagues */}
					<AdminThumbs
						title={`Leagues (${totals.leagueTotal})`}
						description="View and manage basketball leagues"
						bgColor="yellow"
					>
						<Link
							to="/admin/leagues"
							className="mt-2 cursor-pointer hover:bg-gray-600 bg-gray-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							VIEW LEAGUES
						</Link>
						<Link
							to="/admin/leagues/create"
							className="mt-2 cursor-pointer hover:bg-orange-600 bg-orange-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							<FontAwesomeIcon icon="plus" className="me-1" />
							NEW LEAGUE
						</Link>
					</AdminThumbs>

					{/* teams */}
					<AdminThumbs
						title={`Teams (${totals.teamTotal})`}
						description="View and manage basketball teams"
						bgColor="blue"
					>
						<Link
							to="/admin/teams"
							className="mt-2 cursor-pointer hover:bg-gray-600 bg-gray-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							VIEW TEAMS
						</Link>
						<Link
							to="/admin/teams/create"
							className="mt-2 cursor-pointer hover:bg-orange-600 bg-orange-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							<FontAwesomeIcon icon="plus" className="me-1" />
							NEW TEAM
						</Link>
					</AdminThumbs>
				</div>
			) : (
				<div className="mt-6 flex border border-gray-300 text-gray-400 rounded bg-gray-100 shadow justify-center items-center h-42">
					<p className="font-semibold">Loading admin resources..</p>
				</div>
			)}
			{!totals && <Loader />}
		</div>
	);
};

export default AdminDashboard;
