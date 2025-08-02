import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import { useParams } from "react-router-dom";
import { apiClient } from "../../../utils/api";
import Loader from "../../../components/loader";
import { Link } from "react-router-dom";
import type { BracketChallengeInfo } from "../../../data/adminData";
import Bracket from "../../../components/bracket/bracket";
import { BracketProvider } from "../../../context/bracket/BracketProvider";
import { displayLocalDate } from "../../../utils/dateToLocal";
import ContentBase from "../../../components/ContentBase";

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
		<ContentBase className="py-7 px-4">
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">
						Bracket Challenge Details
					</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-6">
					{bracketChallenge ? (
						<>
							<div>
								<h1 className="text-2xl font-bold text-gray-600">
									{bracketChallenge.name}
								</h1>
								<p className="text-sm text-gray-500">
									{bracketChallenge.description ||
										"No description provided."}
								</p>
							</div>
							<hr className="my-3 border-gray-300 shadow" />

							<div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-x-4 gap-y-2 mb-2">
								<div>
									<p className="text-sm">League</p>
									<p className="px-3 py-2 border border-gray-200 bg-gray-200 font-semibold rounded mt-1">
										{bracketChallenge.league}
									</p>
								</div>
								<div>
									<p className="text-sm">Is Public</p>
									<p
										className={`px-3 py-2 border border-gray-200 bg-gray-200 font-semibold rounded mt-1 ${
											bracketChallenge.is_public
												? "text-green-700"
												: "text-red-600"
										}`}
									>
										{bracketChallenge.is_public ? "Yes" : "No"}
									</p>
								</div>
								<div>
									<p className="text-sm">Start Date</p>
									<p className="px-3 py-2 border border-gray-200 bg-gray-200 font-semibold rounded mt-1">
										{displayLocalDate(bracketChallenge.start_date)}
									</p>
								</div>
								<div>
									<p className="text-sm">End Date</p>
									<p className="px-3 py-2 border border-gray-200 bg-gray-200 font-semibold rounded mt-1">
										{displayLocalDate(bracketChallenge.end_date)}
									</p>
								</div>
							</div>
							{/* preview */}
							<div>
								<p className="text-sm">Preview</p>
								<div className="mt-1">
									<BracketProvider
										data={bracketChallenge.rounds}
										isPreview={true}
									>
										<Bracket league={bracketChallenge.league} />
									</BracketProvider>
								</div>
							</div>

							<div className="flex space-x-3">
								<Link
									to={`/admin/bracket-challenges/${bracketChallenge.id}/edit`}
									className="block w-full md:w-50 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-center font-bold py-1 px-4 rounded"
								>
									EDIT DETAILS
								</Link>
								<Link
									to={`/admin/bracket-challenges/${bracketChallenge.id}/edit`}
									className="block w-full md:w-50 mt-4 bg-amber-600 hover:bg-amber-500 text-white text-center font-bold py-1 px-4 rounded"
								>
									UPDATE MATCHUPS
								</Link>
							</div>
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
		</ContentBase>
	);
};

export default ViewBracketChallenge;
