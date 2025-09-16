import ContentBase from "../../components/contentBase";
import { apiClient } from "../../utils/api";
import {
	type BracketChallengeEntryInfo,
	type PaginatedResponse,
} from "../../data/adminData";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import EndOfPage from "../../components/endOfPage";
import FailPrompt from "../../components/failPrompt";
import { useAuth } from "../../context/auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BracketEntrySlot from "../../components/bracket/bracketEntrySlot";
import { useSearchParams } from "react-router-dom";

const BracketEntriesList = () => {
	const { isAuthenticated } = useAuth();

	const [searchParams, setSearchParams] = useSearchParams();

	const [bracketChallengeEntries, setBracketChallengeEntries] = useState<
		BracketChallengeEntryInfo[]
	>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);

	// const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const searchTerm = searchParams.get("search") || "";

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

			const { data, meta } = response.data;

			setBracketChallengeEntries((prevEntries) => {
				if (page === 1) {
					return data;
				}

				// Create a Set of all existing comment IDs for quick lookup
				const existingIds = new Set(prevEntries.map((entry) => entry.id));

				// Filter the new data to only include comments that are not already in our state
				const newEntries = data.filter(
					(entry) => !existingIds.has(entry.id)
				);

				// Combine the old and new comments
				return [...prevEntries, ...newEntries];
			});
			setCurrentPage(meta.current_page);
			setLastPage(meta.last_page);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		// Only fetch data when debouncedSearchTerm changes (user stopped typing)
		if (isAuthenticated) {
			fetchBracketChallengeEntries(1, debouncedSearchTerm);
		}
	}, [debouncedSearchTerm, isAuthenticated]);

	const loadMoreEntries = () => {
		if (currentPage < lastPage) {
			fetchBracketChallengeEntries(currentPage + 1, debouncedSearchTerm);
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// setSearchTerm(e.target.value);
		// setSearchParams({ search: e.target.value }, { replace: true });
		const newSearchParams = new URLSearchParams(searchParams.toString());
		if (e.target.value) {
			newSearchParams.set("search", e.target.value);
		} else {
			newSearchParams.delete("search");
		}
		// Use replace: true to avoid creating new history entries for every keystroke
		setSearchParams(newSearchParams, { replace: true });
	};

	return (
		<>
			<title>{`BRACKET CHALLENGE ENTRIES | ${
				import.meta.env.VITE_APP_NAME
			}`}</title>

			<ContentBase className="py-7 px-4">
				<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
					<h1 className="text-xl font-bold px-1">
						<FontAwesomeIcon icon="caret-right" /> My Bracket Challenge
						Entries
					</h1>
					<p className="font-medium text-sm my-1">
						View all your submitted bracket challenge entries here.
					</p>

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
											<BracketEntrySlot
												key={entry.id}
												entry={entry}
											/>
										))}
									</div>
									<div className="mt-3 text-center">
										{currentPage < lastPage ? (
											<button
												className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white text-sm font-semibold px-4 py-1 rounded space-x-2"
												onClick={loadMoreEntries}
											>
												<FontAwesomeIcon
													icon="arrow-alt-circle-down"
													size="sm"
												/>
												<span>LOAD MORE</span>
											</button>
										) : (
											<span className="text-gray-400 text-sm font-bold rounded mx-auto px-4 select-none">
												- END OF ENTRIES -
											</span>
										)}
									</div>
								</div>
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
		</>
	);
};

export default BracketEntriesList;
