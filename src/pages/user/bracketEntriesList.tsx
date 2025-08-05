import { Link } from "react-router-dom";
import ContentBase from "../../components/ContentBase";
import { apiClient } from "../../utils/api";
import {
	type BracketChallengeEntryInfo,
	type MetaInfo,
	type PaginatedResponse,
} from "../../data/adminData";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination";
import Loader from "../../components/loader";

const BracketEntriesList = () => {
	const [bracketChallengeEntries, setBracketChallengeEntries] = useState<
		BracketChallengeEntryInfo[]
	>([]);
	const [meta, setMeta] = useState<MetaInfo | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchBracketChallengeEntries = async (page: number) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<
				PaginatedResponse<BracketChallengeEntryInfo>
			>(`/user/bracket-challenge-entries/?page=${page}`);
			setBracketChallengeEntries(response.data.data);
			setMeta(response.data.meta);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBracketChallengeEntries(currentPage);
	}, [currentPage]);

	const handlePageClick = (page: number) => {
		// fetchBracketChallengeEntries(page);
		setCurrentPage(page);
	};

	return (
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold px-1">My Bracket Entries</h1>

				<div className="mt-3 mb-4">
					{bracketChallengeEntries.length > 0 ? (
						<>
							{bracketChallengeEntries.map((entry) => (
								<div
									key={entry.id}
									className="group border-b border-gray-400 bg-gray-100 hover:bg-gray-50 mb-1"
								>
									<div className="px-3 py-1 bg-gray-300 text-gray-600 font-semibold group-hover:bg-gray-200">
										{entry.name}
									</div>
									<div className="sm:grid grid-cols-2 lg:grid-cols-4 pt-0.5 px-3 pb-2 transition duration-300 space-y-2 lg:space-y-0 ">
										<div className="space-y-0.5">
											<div className="text-sm font-semibold text-gray-500">
												League
											</div>

											<div className="font-semibold">
												{entry.bracket_challenge.league}
											</div>
										</div>
										<div className="space-y-0.5">
											<div className="text-sm font-semibold text-gray-500">
												Name
											</div>
											<div className="font-semibold">
												{entry.bracket_challenge.name}
											</div>
										</div>

										<div className="space-y-0.5">
											<div className="text-sm font-semibold text-gray-500">
												Status
											</div>
											{entry.status == "success" && (
												<span className="bg-green-600 text-white font-bold px-4 rounded text-sm select-none">
													SUCCESS
												</span>
											)}
											{entry.status == "failed" && (
												<span className="bg-red-600 text-white font-bold px-4 rounded text-sm select-none">
													FAILED
												</span>
											)}
											{entry.status == "pending" && (
												<span className="bg-blue-700 text-white font-bold px-4 rounded text-sm select-none">
													PENDING
												</span>
											)}
										</div>

										<div className="space-y-0.5">
											<div className="text-sm font-semibold text-gray-500">
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
										</div>
									</div>
								</div>
							))}
							<Pagination
								meta={meta}
								onPageChange={handlePageClick}
								className="mt-6"
							/>
						</>
					) : (
						<p className="py-2 px-3 bg-gray-200">
							{isLoading
								? "Loading..."
								: "No bracket challenge entries found"}
						</p>
					)}
				</div>
			</div>
			{isLoading && <Loader />}
		</ContentBase>
	);
};

export default BracketEntriesList;
