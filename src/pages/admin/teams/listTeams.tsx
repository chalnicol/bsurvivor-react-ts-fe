import { Link } from "react-router-dom";
import BreadCrumbs from "../../../components/breadCrumbs";
import { type AnyTeamInfo } from "../../../data/adminData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { type PaginatedResponse, type MetaInfo } from "../../../data/adminData";
import Pagination from "../../../components/pagination";
import StatusMessage from "../../../components/statusMessage";
import ToDelete from "../../../components/toDelete";

// Import the custom debounce hook
import useDebounce from "../../../hooks/useDebounce"; // Adjust path if needed
//
import { getTeamLogoSrc } from "../../../utils/imageService";
import ContentBase from "../../../components/ContentBase";

const ListTeams = () => {
	const [teams, setTeams] = useState<AnyTeamInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [toDelete, setToDelete] = useState<AnyTeamInfo | null>(null);

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchTeams = async (page: number, term: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<PaginatedResponse<AnyTeamInfo>>(
				`/admin/teams?page=${page}${term ? `&search=${term}` : ""}`
			);
			setTeams(response.data.data);
			setMeta(response.data.meta);
			setCurrentPage(page);
		} catch (error) {
			console.error("Error fetching teams:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Only fetch teams when debouncedSearchTerm or currentPage changes
		// This effect will run only after the user stops typing for 500ms
		fetchTeams(currentPage, debouncedSearchTerm);
	}, [currentPage, debouncedSearchTerm]); // Listen to debouncedSearchTerm

	//delete bracket challenge
	const deleteTeam = async (): Promise<void> => {
		if (!toDelete) return;

		setIsLoading(true);
		try {
			await apiClient.delete(`/admin/teams/${toDelete.id}`);
			setToDelete(null);
			setSuccess("Team deleted successfully!");
			if (meta) {
				const newTotal = teams.length - 1;
				if (newTotal === 0 && meta.current_page > 1) {
					setCurrentPage((prev) => prev - 1);
				} else {
					fetchTeams(currentPage, debouncedSearchTerm);
				}
			}
		} catch (error) {
			console.error("Error deleting Bracket Challenge:", error);
			setError("Error deleting Bracket Challenge.");
		}
	};

	const clearMessaging = () => {
		setSuccess(null);
		setError(null);
		setToDelete(null);
	};

	// Handler for react-paginate page clicks
	// const handlePageClick = (event: { selected: number }) => {
	// 	setCurrentPage(event.selected);
	// };
	const handlePageClick = (page: number) => {
		setCurrentPage(page);
		clearMessaging();
	};

	const handleDelete = (team: AnyTeamInfo) => {
		setError(null);
		setSuccess(null);
		setToDelete(team);
	};

	// Update searchTerm immediately on input change
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		clearMessaging();
		// Do NOT reset currentPage here. Reset it when the debounced search term actually triggers a fetch.
		// If you reset currentPage here, it would reset on every keystroke, which is not what we want.
	};

	// We need a separate effect to reset the page when the debounced search term changes
	// and it's different from the initial empty string (i.e., user actually typed something).
	useEffect(() => {
		// Only reset page to 1 if the debounced search term has changed
		// and is not the initial empty string (unless you want to reset on initial load too)
		if (debouncedSearchTerm !== searchTerm && debouncedSearchTerm !== "") {
			setCurrentPage(1);
		}
		// Alternatively, just always reset to page 1 when the debounced search term changes
		// setCurrentPage(1);
	}, [debouncedSearchTerm]);

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Teams</h1>
					<Link
						to="/admin/teams/create"
						className="text-sm bg-gray-700 hover:bg-gray-600 text-center text-white rounded p-2 text-xs font-bold"
					>
						<FontAwesomeIcon icon="plus" className="me-1" />
						NEW TEAM
					</Link>
				</div>

				<input
					type="search"
					value={searchTerm}
					onChange={handleSearchInputChange}
					className="px-1 py-0.5 border-b border-gray-400 w-full mt-3 focus:outline-none"
					placeholder="Search teams here..."
				/>

				{success && (
					<StatusMessage
						type="success"
						message={success}
						onClose={() => setSuccess(null)}
					/>
				)}
				{error && (
					<StatusMessage
						type="error"
						message={error}
						onClose={() => setError(null)}
					/>
				)}

				{toDelete && (
					<ToDelete
						name={`${toDelete.fname} ${toDelete.lname}`}
						onConfirm={deleteTeam}
						onCancel={() => setToDelete(null)}
					/>
				)}

				<div className="mt-3 overflow-x-auto">
					{teams.length > 0 ? (
						<>
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
											<td className="px-2 py-1">{`${team.fname} ${team.lname}`}</td>
											<td className="px-2 py-1">
												{team.logo ? (
													<img
														src={getTeamLogoSrc(team.logo)}
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
													to={`/admin/teams/${team.id}`}
													className="block shadow cursor-pointer hover:bg-teal-500 bg-teal-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
												>
													view
												</Link>
												<Link
													to={`/admin/teams/${team.id}/edit`}
													className="block shadow cursor-pointer hover:bg-cyan-500 bg-cyan-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
												>
													edit
												</Link>
												<button
													className="shadow cursor-pointer hover:bg-red-500 bg-red-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
													onClick={() => {
														handleDelete(team);
													}}
												>
													delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					) : (
						<p>
							{isLoading ? "Fetching teams..." : "No teams data found."}
						</p>
					)}
				</div>
				<Pagination
					meta={meta}
					onPageChange={handlePageClick}
					className="mt-6"
				/>
			</div>
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default ListTeams;
