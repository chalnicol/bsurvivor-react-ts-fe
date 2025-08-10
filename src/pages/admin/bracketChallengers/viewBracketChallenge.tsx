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
import ContentBase from "../../../components/contentBase";
import Detail from "../../../components/detail";

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
			<div className="p-3 lg:p-5 border rounded-lg shadow-sm border-gray-400 bg-gray-100 overflow-x-hidden">
				<BreadCrumbs />
				<div className="md:flex items-center space-y-2 md:space-y-0">
					<h1 className="text-xl font-bold flex-1">
						Bracket Challenge Details
					</h1>
				</div>
				{/* inset content here.. */}
				<div className="mt-4">
					{bracketChallenge ? (
						<>
							<div className="bg-gray-800 text-white p-4 rounded border text-sm border border-gray-300">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
									<Detail label="Challenge Name">
										{bracketChallenge.name}
									</Detail>
									<Detail label="Description">
										{bracketChallenge.description ||
											"No description provided."}
									</Detail>
									<Detail label="League">
										{bracketChallenge.league}
									</Detail>
									<Detail label="Start Date">
										{displayLocalDate(bracketChallenge.start_date)}
									</Detail>
									<Detail label="End Date">
										{displayLocalDate(bracketChallenge.end_date)}
									</Detail>

									<Detail label="Is Public">
										{bracketChallenge.is_public ? (
											<span className="text-green-500">Yes</span>
										) : (
											<span className="text-red-500">No</span>
										)}
									</Detail>
								</div>
								<hr className="my-2 border-gray-400" />
								{/* preview */}
								<div>
									<BracketProvider
										bracketChallenge={bracketChallenge}
										isPreview={true}
									>
										<Bracket />
									</BracketProvider>
								</div>

								<hr className="my-2 border-gray-400" />
								<div className="flex space-x-3 mt-3">
									<Link
										to={`/admin/bracket-challenges/${bracketChallenge.id}/edit`}
										className="block w-full md:w-50 bg-amber-500 hover:bg-amber-400 text-white text-center font-bold py-2 px-4 rounded"
									>
										EDIT DETAILS
									</Link>
									<Link
										to={`/admin/bracket-challenges/${bracketChallenge.id}/edit`}
										className="block w-full md:w-50 bg-teal-500 hover:bg-teal-400 text-white text-center font-bold py-2 px-4 rounded"
									>
										UPDATE MATCHUPS
									</Link>
								</div>
							</div>
						</>
					) : (
						<p className="bg-gray-200 px-3 py-2">
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
