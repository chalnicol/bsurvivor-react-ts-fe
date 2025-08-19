import { Link } from "react-router-dom";
import ContentBase from "../../components/contentBase";
import { apiClient } from "../../utils/api";
import {
	type BracketChallengeEntryInfo,
	type MetaInfo,
	type PaginatedResponse,
} from "../../data/adminData";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination";
import Loader from "../../components/loader";
import Detail from "../../components/detail";

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import { displayLocalDate } from "../../utils/dateTime";
import EndOfPage from "../../components/endOfPage";
import FailPrompt from "../../components/failPrompt";
import { useAuth } from "../../context/auth/AuthProvider";

const BracketEntriesList = () => {
	const { isAuthenticated } = useAuth();

	const [bracketChallengeEntries, setBracketChallengeEntries] = useState<
		BracketChallengeEntryInfo[]
	>([]);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchBracketChallengeEntries = async (page: number, term: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<
				PaginatedResponse<BracketChallengeEntryInfo>
			>(
				`/user/bracket-challenge-entries?page=${page}${
					term ? `&search=${term}` : ""
				}`
			);

			setBracketChallengeEntries(response.data.data);
			setMeta(response.data.meta);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			fetchBracketChallengeEntries(currentPage, debouncedSearchTerm);
		}
	}, [currentPage, debouncedSearchTerm, isAuthenticated]);

	const handlePageClick = (page: number) => {
		// fetchBracketChallengeEntries(page);
		setCurrentPage(page);
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
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

	const getStatusBgColorClass = (status: string) => {
		switch (status) {
			case "won":
				return "bg-green-600";
			case "eliminated":
				return "bg-red-600";
			case "active":
				return "bg-blue-600";
			default:
				return "bg-gray-600";
		}
	};

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold px-1">
					My Bracket Challenge Entries
				</h1>

				<input
					type="search"
					value={searchTerm}
					onChange={handleSearchInputChange}
					className="px-1 py-0.5 border-b border-gray-400 w-full mt-4 focus:outline-none"
					placeholder="Filter search here..."
				/>

				<div className="mt-3">
					{bracketChallengeEntries.length > 0 ? (
						<>
							<div className="overflow-x-hidden">
								<div className="min-w-xl">
									{bracketChallengeEntries.map((entry) => (
										<Link
											to={`/bracket-challenge-entries/${entry.name}`}
											key={entry.id}
										>
											<div className="sm:grid md:grid-cols-2 xl:grid-cols-3 px-4 py-3 space-y-1 border hover:bg-gray-700 mb-1 text-sm bg-gray-800 text-white rounded">
												<Detail label="Entry Name">
													{entry.name}
												</Detail>
												<Detail label="League">
													{entry.bracket_challenge.league}
												</Detail>
												<Detail label="Bracket Challenge">
													{entry.bracket_challenge.name}
												</Detail>

												<Detail label="Date Submitted">
													{displayLocalDate(entry.created_at)}
												</Detail>
												<Detail label="Status">
													<span
														className={`${getStatusBgColorClass(
															entry.status
														)} text-white font-bold px-3 rounded text-xs select-none`}
													>
														{entry.status.toLocaleUpperCase()}
													</span>
												</Detail>

												{/* <div className="space-y-0.5">
											<div className="text-xs font-semibold text-gray-500">
												Actions
											</div>
											<div className="space-x-2">
												<Link
													to={`/bracket-challenge-entries/${entry.name}`}
													className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 rounded text-sm"
												>
													VIEW
												</Link>
											</div>
										</div> */}
											</div>
										</Link>
									))}
								</div>
							</div>
							<Pagination
								meta={meta}
								onPageChange={handlePageClick}
								className="mt-6"
							/>
						</>
					) : (
						<div className="mt-3">
							{isLoading ? (
								<p className="p-3 bg-gray-300 rounded">Loading..</p>
							) : (
								<FailPrompt message="You have not submitted any entries yet." />
							)}
						</div>
					)}
				</div>
			</div>
			<EndOfPage />
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketEntriesList;
