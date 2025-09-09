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

// Import the custom debounce hook
import useDebounce from "../../hooks/useDebounce"; // Adjust path if needed
import EndOfPage from "../../components/endOfPage";
import FailPrompt from "../../components/failPrompt";
import { useAuth } from "../../context/auth/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BracketEntrySlot from "../../components/bracket/backetEntrySlot";
import { useSearchParams } from "react-router-dom";

const BracketEntriesList = () => {
	const { isAuthenticated } = useAuth();

	const [searchParams, setSearchParams] = useSearchParams();

	const [bracketChallengeEntries, setBracketChallengeEntries] = useState<
		BracketChallengeEntryInfo[]
	>([]);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const currentPage = searchParams.get("page")
		? parseInt(searchParams.get("page") as string)
		: 1;
	const searchTerm = searchParams.get("search") || "";

	// const [currentPage, setCurrentPage] = useState<number>(1);
	// const [searchTerm, setSearchTerm] = useState<string>("");

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
		// setCurrentPage(page);
		const newSearchParams = new URLSearchParams(searchParams.toString());

		newSearchParams.set("page", page.toString());
		// Use replace: true to avoid creating new history entries for every keystroke
		setSearchParams(newSearchParams);
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
		newSearchParams.set("page", "1");
		// Use replace: true to avoid creating new history entries for every keystroke
		setSearchParams(newSearchParams, { replace: true });
	};

	// We need a separate effect to reset the page when the debounced search term changes
	// and it's different from the initial empty string (i.e., user actually typed something).
	useEffect(() => {
		// Only reset page to 1 if the debounced search term has changed
		// and is not the initial empty string (unless you want to reset on initial load too)
		if (
			debouncedSearchTerm !== searchTerm &&
			debouncedSearchTerm !== "" &&
			currentPage > 1
		) {
			// setCurrentPage(1);
			setSearchParams({ page: "1" }, { replace: true });
		}
		// Alternatively, just always reset to page 1 when the debounced search term changes
		// setCurrentPage(1);
	}, [debouncedSearchTerm]);

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
		</>
	);
};

export default BracketEntriesList;
