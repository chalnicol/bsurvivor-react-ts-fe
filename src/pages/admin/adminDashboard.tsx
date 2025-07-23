import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
	return (
		<div className="py-7 min-h-[calc(100dvh-57px)]">
			<h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
			<p className="text-sm">Welcome to the admin dashboard!</p>

			<div className="md:grid grid-cols-2 xl:grid-cols-3 space-y-3 md:space-y-0 mt-6 gap-3">
				{/* users */}
				<div className="p-3 border rounded-lg shadow-lg border-gray-400 bg-green-100 flex flex-col">
					<div>
						<h2 className="font-semibold">Users (0)</h2>
						<p className="text-sm text-gray-500">
							View and manage user accounts
						</p>
					</div>

					<div className="flex-1"></div>
					<div className="mt-5">
						<Link
							to="/admin/users"
							className="mt-2 cursor-pointer hover:bg-gray-600 bg-gray-700 text-white rounded px-3 py-1 text-xs font-bold"
						>
							VIEW USERS
						</Link>
					</div>
				</div>
				{/* challenges */}
				<div className="p-3 border rounded-lg shadow-lg border-gray-400 bg-orange-100 flex flex-col">
					<div>
						<h2 className="font-semibold">Active Challenges (0)</h2>
						<p className="text-sm text-gray-500">
							View and manage bracket challenges
						</p>
					</div>

					<div className="flex-1"></div>
					<div className="mt-5 space-x-2">
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
					</div>
				</div>
				{/* leagues */}
				<div className="p-3 border rounded-lg shadow-lg border-gray-400 bg-yellow-100 flex flex-col">
					<div>
						<h2 className="font-semibold">Leagues (0)</h2>
						<p className="text-sm text-gray-500">
							View and manage basketball leagues
						</p>
					</div>

					<div className="flex-1"></div>
					<div className="mt-5 space-x-2">
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
					</div>
				</div>
				{/* teams */}
				<div className="p-3 border rounded-lg shadow-lg border-gray-400 bg-blue-100 flex flex-col">
					<div>
						<h2 className="font-semibold">TEAMS (0)</h2>
						<p className="text-sm text-gray-500">
							View and manage basketball teams
						</p>
					</div>

					<div className="flex-1"></div>
					<div className="mt-5 space-x-2">
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
