import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalBase from "./modalBase";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type {
	BracketChallengeEntryInfo,
	PaginatedResponse,
} from "../data/adminData";
import apiClient from "../utils/axiosConfig";
import Spinner from "./spinner";
import { Link } from "react-router-dom";
import Detail from "./detail";
import StatusPills from "./statusPills";
import { useAuth } from "../context/auth/AuthProvider";
import useDebounce from "../hooks/useDebounce";

interface EntriesProps {
	bracketChallengeId: number;
	onClose: () => void;
}

const EntriesModal = ({ bracketChallengeId, onClose }: EntriesProps) => {
	const { isAuthenticated, user } = useAuth();

	const [entries, setEntries] = useState<BracketChallengeEntryInfo[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [searchTerm, setSearchTerm] = useState<string>("");

	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const contRef = useRef<HTMLDivElement>(null);

	const fetchEntries = async (page: number, term: string) => {
		if (!bracketChallengeId) return;
		try {
			setIsLoading(true);
			const response = await apiClient.get<
				PaginatedResponse<BracketChallengeEntryInfo>
			>(
				`/bracket-challenges/${bracketChallengeId}/entries?page=${page}${
					term ? `&search=${term}` : ""
				}`
			);

			const { data, meta } = response.data;

			setEntries((prevEntries) => {
				if (page === 1) {
					return data;
				}
				// Create a Set of all existing comment IDs for quick lookup
				const existingIds = new Set(
					prevEntries.map((entries) => entries.id)
				);

				// Filter the new data to only include comments that are not already in our state
				const newUniqueEntries = data.filter(
					(entries) => !existingIds.has(entries.id)
				);

				// Combine the old and new comments
				return [...prevEntries, ...newUniqueEntries];
			});
			setCurrentPage(meta.current_page);
			setLastPage(meta.last_page);
			setTotalCount(meta.total);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const openAnim = () => {
		if (contRef.current) {
			gsap.fromTo(
				contRef.current,
				{ scaleY: 0 },
				{ scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.8)" }
			);
		}
	};

	const closeAnim = () => {
		if (contRef.current) {
			gsap.to(contRef.current, {
				scaleY: 0,
				duration: 0.6,
				ease: "elastic.in(1, 0.8)",
				onComplete: onClose,
			});
		}
	};

	const loadMoreEntries = () => {
		if (currentPage < lastPage) {
			fetchEntries(currentPage + 1, debouncedSearchTerm);
		}
	};

	useEffect(() => {
		fetchEntries(1, debouncedSearchTerm);
	}, [bracketChallengeId, debouncedSearchTerm]);

	useEffect(() => {
		openAnim();

		return () => {
			if (contRef.current) {
				gsap.killTweensOf(contRef.current);
			}
		};
	}, []);

	return (
		<ModalBase>
			<div ref={contRef} className={`w-full max-w-6xl m-auto h-140`}>
				<div className="relative w-full h-full flex flex-col space-y-4 px-4 py-3 bg-gray-900 text-white rounded border-2 border-white">
					<button
						className="z-10 absolute -top-3.5 -right-3.5 w-6 aspect-square flex items-center justify-center text-black bg-white rounded-full hover:bg-gray-300 cursor-pointer "
						onClick={closeAnim}
					>
						<FontAwesomeIcon icon="xmark" />
					</button>
					<div>
						<h1 className="font-semibold text-lg">
							Entries Submitted {totalCount > 0 ? `(${totalCount})` : ""}
						</h1>
						<p className="text-sm">
							View all entries submitted for this challenge.
						</p>
					</div>
					<div>
						<input
							type="search"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="px-1 py-0.5 border-b border-gray-400 w-full mt-2 focus:outline-none"
							placeholder="Filter search by user or status here..."
						/>
					</div>
					<div className="flex-1 overflow-y-auto">
						<div>
							{entries.length > 0 ? (
								<>
									<div>
										{entries.map((entry) => (
											<Link
												to={`/bracket-challenge-entries/${entry.slug}`}
												key={entry.id}
												className=" text-sm border-t border-gray-600 last:border-b block flex items-center justify-center gap-x-3 hover:bg-gray-700/30 even:bg-gray-600/40"
											>
												<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 px-1 py-2 space-y-1 font-semibold">
													<Detail label="User" size="xs">
														<span
															className={`${
																isAuthenticated &&
																user &&
																user.id == entry.user.id &&
																"text-yellow-400 font-semibold"
															}`}
														>
															{entry.user.username}
														</span>
													</Detail>
													<Detail label="Likes" size="xs">
														{entry.votes.likes}
													</Detail>
													<Detail label="Dislikes" size="xs">
														{entry.votes.dislikes}
													</Detail>
													<Detail label="Comments" size="xs">
														{entry.comments_count}
													</Detail>

													<Detail label="Status" size="xs">
														<StatusPills status={entry.status} />
													</Detail>
												</div>
											</Link>
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
								</>
							) : (
								<>
									{!isLoading && (
										<p className="bg-gray-600 px-3 py-2 rounded text-white">
											No entries found.
										</p>
									)}
								</>
							)}
						</div>
					</div>
					{isLoading && (
						<div className="absolute w-full h-full top-0 left-0 bg-gray-900/50">
							<Spinner size="sm" />
						</div>
					)}
				</div>
			</div>
		</ModalBase>
	);
};

export default EntriesModal;
