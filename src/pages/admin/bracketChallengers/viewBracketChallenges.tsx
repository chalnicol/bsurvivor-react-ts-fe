import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import type { BracketChallengeInfo } from "../../../data/adminData";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { Link } from "react-router-dom";
// import { useAdmin } from "../../../context/admin/AdminProvider";

const ViewBracketChallenge = () => {
	const { id } = useParams<{ id: string }>();

	const [bracketChallenge, setBracketChallenge] =
		useState<BracketChallengeInfo | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchBracketChallenge = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get(
				`/admin/bracket-challenges/${id}`
			);
			setBracketChallenge(response.data.data);
			// console.log(response.data.user);
		} catch (error) {
			console.error("Error fetching bracket challenge:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			return;
		}
		fetchBracketChallenge();
	}, [id]);

	return (
		<div className="py-7 min-h-[calc(100dvh-57px)] relative">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">
						Bracket Challenge Details
					</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-3 max-w-lg">
					{bracketChallenge ? (
						<>
							<div className="space-y-3 text-sm">
								<div>
									<p className="bg-gray-300 px-2 py-1">Name</p>
									<p className="p-2 bg-gray-200">
										{bracketChallenge.name}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Description</p>
									<p className="p-2 bg-gray-200">
										{bracketChallenge.description}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">League</p>
									<p className="p-2 bg-gray-200">
										{bracketChallenge.league}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Is_Public</p>
									<p
										className={`p-2 bg-gray-200 font-bold ${
											bracketChallenge.is_public
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{bracketChallenge.is_public ? "Yes" : "No"}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">Start Date</p>
									<p className="p-2 bg-gray-200">
										{bracketChallenge.start_date}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">End Date</p>
									<p className="p-2 bg-gray-200">
										{bracketChallenge.end_date}
									</p>
								</div>
								<div>
									<p className="bg-gray-300 px-2 py-1">End Date</p>
									<p className="p-2 bg-gray-200">
										<code>
											{JSON.stringify(bracketChallenge.bracket_data)}
										</code>
									</p>
								</div>
							</div>
							<Link
								to={`/admin/bracket-challenges/${bracketChallenge.id}/edit`}
								className="block w-full md:w-50 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-center font-bold py-1 px-4 rounded"
							>
								EDIT THIS CHALLENGE
							</Link>
						</>
					) : (
						<p>
							{isLoading
								? "Loading bracket challenge details..."
								: "No bracket challenge data found."}
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</div>
	);
};

export default ViewBracketChallenge;
