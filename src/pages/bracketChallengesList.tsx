import { Link, useSearchParams } from "react-router-dom";
import ContentBase from "../components/contentBase";
import { apiClient } from "../utils/api";
import {
	type BracketChallengeInfo,
	type PaginatedResponse,
} from "../data/adminData";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import Detail from "../components/detail";

// Import the custom debounce hook
import useDebounce from "../hooks/useDebounce"; // Adjust path if needed
import { displayLocalDate } from "../utils/dateTime";
import EndOfPage from "../components/endOfPage";
import FailPrompt from "../components/failPrompt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BracketChallengesList = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [bracketChallenges, setBracketChallenges] = useState<
		BracketChallengeInfo[]
	>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const searchTerm = searchParams.get("search") || "";

	// Use the debounced value of searchTerm
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchBracketChallenges = async (page: number, term: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<
				PaginatedResponse<BracketChallengeInfo>
			>(`/bracket-challenges?page=${page}${term ? `&search=${term}` : ""}`);

			const { data, meta } = response.data;

			setBracketChallenges((prevChallenges) => {
				if (page === 1) {
					return data;
				}

				// Create a Set of all existing comment IDs for quick lookup
				const existingIds = new Set(
					prevChallenges.map((challenge) => challenge.id)
				);

				// Filter the new data to only include comments that are not already in our state
				const newEChallenges = data.filter(
					(challenge) => !existingIds.has(challenge.id)
				);

				// Combine the old and new comments
				return [...prevChallenges, ...newEChallenges];
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
		fetchBracketChallenges(1, debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	const loadModeChallenges = () => {
		if (currentPage < lastPage) {
			fetchBracketChallenges(currentPage + 1, debouncedSearchTerm);
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			<title>{`BRACKET CHALLENGES | ${
				import.meta.env.VITE_APP_NAME
			}`}</title>
			<ContentBase className="py-7 px-4">
				<div className="p-3 lg:p-5 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
					<h1 className="text-xl font-bold px-1">
						<FontAwesomeIcon icon="caret-right" /> Bracket Challenges
					</h1>
					<p className="font-medium text-sm my-1">
						View all bracket challenges here.
					</p>

					<input
						type="search"
						value={searchTerm}
						onChange={handleSearchInputChange}
						className="px-1 py-0.5 border-b border-gray-400 w-full mt-4 focus:outline-none"
						placeholder="Filter search here..."
					/>

					<div className="mt-3">
						{bracketChallenges.length > 0 ? (
							<>
								<div className="overflow-x-hidden">
									<div className="min-w-xl">
										{bracketChallenges.map((challenge) => (
											<Link
												to={`/bracket-challenges/${challenge.slug}`}
												key={challenge.id}
											>
												<div className="sm:grid md:grid-cols-2 px-3 py-2 space-y-1 border hover:bg-gray-700 mb-1 text-sm bg-gray-800 text-white rounded">
													<Detail label="Challenge Name">
														{challenge.name}
													</Detail>
													<Detail label="League">
														{challenge.league}
													</Detail>
													<Detail label="Submission Opens">
														{displayLocalDate(
															challenge.start_date
														)}
													</Detail>
													<Detail label="Submission Closes">
														{displayLocalDate(challenge.end_date)}
													</Detail>
												</div>
											</Link>
										))}
									</div>
									<div className="mt-3 text-center">
										{currentPage < lastPage ? (
											<button
												className="bg-gray-700 hover:bg-gray-600 cursor-pointer text-white text-sm font-semibold px-4 py-1 rounded space-x-2"
												onClick={loadModeChallenges}
											>
												<FontAwesomeIcon
													icon="arrow-alt-circle-down"
													size="sm"
												/>
												<span>LOAD MORE</span>
											</button>
										) : (
											<span className="text-gray-400 text-sm font-bold rounded mx-auto px-4 select-none">
												- END OF BRACKET CHALLENGES -
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
									<FailPrompt message="No bracket challenges found." />
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

export default BracketChallengesList;
