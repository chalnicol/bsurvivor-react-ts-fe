import { Link } from "react-router-dom";
import BreadCrumbs from "../../../components/breadCrumbs";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../../utils/api";
import {
	type MetaInfo,
	type PaginatedResponse,
	type UserInfo,
} from "../../../data/adminData";
import Loader from "../../../components/loader";
import RolesPills from "../../../components/rolesPills";
import Pagination from "../../../components/pagination";

// Import the custom debounce hook
import useDebounce from "../../../hooks/useDebounce"; // Adjust path if needed
import ContentBase from "../../../components/ContentBase";

const ListUsers = () => {
	// const users: UserInfo[] = [
	// 	{
	// 		id: 1,
	// 		username: "John Doe",
	// 		email: "john.mckinley@examplepetstore.com",
	// 		roles: ["admin", "user"],
	// 	},
	// 	{
	// 		id: 2,
	// 		username: "Jane Smith",
	// 		email: "john.hessin.clarke@examplepetstore.com",
	// 		roles: ["editor", "user"],
	// 	},
	// 	{
	// 		id: 3,
	// 		username: "Bob Johnson",
	// 		email: "william.henry.moody@my-own-personal-domain.com",
	// 		roles: ["user"],
	// 	},
	// 	{
	// 		id: 4,
	// 		username: "Alice Brown",
	// 		email: "james.c.mcreynolds@example-pet-store.com",
	// 		roles: ["user"],
	// 	},
	// 	{
	// 		id: 5,
	// 		username: "Tom Wilson",
	// 		email: "william.henry.harrison@example-pet-store.com",
	// 		roles: ["user"],
	// 	},
	// ];

	const [users, setUsers] = useState<UserInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [searchTerm, setSearchTerm] = useState<string>("");

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchUsers = async (page: number, term: string) => {
		setIsLoading(true);
		// setUsers([]);
		try {
			// const response = await apiClient.get("/admin/users");
			const response = await apiClient.get<PaginatedResponse<UserInfo>>(
				`/admin/users?page=${page}${term ? `&search=${term}` : ""}`
			);
			setUsers(response.data.data);
			setMeta(response.data.meta);
			setCurrentPage(page);
			// console.log(response.data.data);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers(currentPage, debouncedSearchTerm);
	}, [currentPage, debouncedSearchTerm]);

	// Handler for react-paginate page clicks
	// const handlePageClick = (event: { selected: number }) => {
	// 	setCurrentPage(event.selected);
	// };
	const handlePageClick = (page: number) => {
		setCurrentPage(page);
	};

	// Update searchTerm immediately on input change
	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
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

	const truncateEmail = useCallback((email: string) => {
		if (email.length > 25) {
			return email.slice(0, 25) + "...";
		}
		return email;
	}, []);

	return (
		<ContentBase className="py-7">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">Users</h1>
				</div>

				<input
					type="search"
					value={searchTerm}
					onChange={handleSearchInputChange}
					className="px-1 py-0.5 border-b border-gray-400 w-full mt-3 focus:outline-none"
					placeholder="Search users here..."
				/>

				<div className="mt-3 overflow-x-auto">
					{users.length > 0 ? (
						<table className="w-full text-sm min-w-xl text-nowrap">
							<thead className="text-white bg-gray-700 font-semibold">
								<tr>
									<td className="px-2 py-1">ID</td>
									<td className="px-2 py-1">Name</td>
									<td className="px-2 py-1">Email</td>
									<td className="px-2 py-1">Roles</td>
									<td className="px-2 py-1">Account Status</td>
									<td className="px-2 py-1">Actions</td>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr key={user.id} className="even:bg-gray-200">
										<td className="px-2 py-1">{user.id}</td>
										<td className="px-2 py-1">{user.username}</td>
										<td className="px-2 py-1">
											{truncateEmail(user.email)}
										</td>
										<td className="px-2 py-1 space-x-1">
											<RolesPills roles={user.roles} />
										</td>
										<td className="px-2 py-1 ">
											<span
												className={`text-xs border font-bold rounded bg-white px-2 shadow ${
													user.is_blocked
														? "border-red-600 text-red-600"
														: "border-green-800 text-green-800"
												}`}
											>
												{user.is_blocked ? "blocked" : "active"}
											</span>
										</td>
										<td className="px-2 py-1 flex items-center space-x-1">
											<Link
												to={`/admin/users/${user.id}`}
												className="block shadow cursor-pointer hover:bg-teal-500 bg-teal-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												view
											</Link>
											{/* <Link
												to={`/admin/users/${user.id}/edit`}
												className="block shadow cursor-pointer hover:bg-cyan-500 bg-cyan-600 text-center text-white rounded px-2 py-0.5 text-xs font-bold"
											>
												edit
											</Link> */}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>
							{isLoading ? "Fetching users..." : "No users data found."}
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

export default ListUsers;
