import { useParams } from "react-router-dom";
import apiClient from "../../utils/axiosConfig";
import type {
	BracketChallengeEntryInfo,
	UserMiniInfo,
} from "../../data/adminData";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import ContentBase from "../../components/contentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Detail from "../../components/detail";
import { Link } from "react-router-dom";
import EndOfPage from "../../components/endOfPage";

const PublicProfile = () => {
	const { username } = useParams<{ username: string }>();

	const [user, setUser] = useState<UserMiniInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [entries, setEntries] = useState<BracketChallengeEntryInfo[]>([]);

	const fetchUser = async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get(`/users/${username}`);
			setUser(response.data.user);
			setEntries(response.data.entries);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

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

	useEffect(() => {
		fetchUser();
	}, [username]);

	return (
		<ContentBase className="px-4 py-7">
			<div className="p-3 bg-gray-100 border rounded-lg shadow-sm border-gray-400 overflow-x-hidden">
				<h1 className="text-xl font-bold flex-1">
					<FontAwesomeIcon icon="caret-right" /> User Profile
				</h1>
				<p className="text-sm font-medium my-1">
					View user profile information.
				</p>
				{user ? (
					<div className="mt-4 bg-gray-800 text-white p-4 pb-6 rounded">
						<div className="sm:flex gap-x-3">
							<div className="flex-none">
								<div className="w-18 mx-auto aspect-square border-2 border-gray-400 text-gray-400 rounded-full shadow-lg overflow-hidden flex items-center justify-center">
									<FontAwesomeIcon icon="user" size="2xl" />
								</div>
							</div>
							<div className="flex-1 space-y-2">
								<div>
									<p className="font-semibold text-sm border-b py-1">
										Full Name
									</p>
									<p className="py-1.5 px-2 rounded bg-gray-700 mt-2">
										{user.fullname}
									</p>
								</div>
								<div>
									<p className="font-semibold text-sm border-b py-1">
										Username
									</p>
									<p className="py-1.5 px-2 rounded bg-gray-700 mt-2">
										{user.username}
									</p>
								</div>
								<div>
									<p className="font-semibold text-sm border-b py-1">
										Top Recent Bracket Entries Submitted
									</p>
									<div className="space-y-1 mt-2 mb-4">
										{entries.length > 0 ? (
											<>
												{entries.map((entry) => (
													<Link
														key={entry.id}
														to={`/bracket-challenge-entries/${entry.slug}`}
														className="border border-gray-600 hover:border-gray-400 rounded py-2 px-2 grid lg:grid-cols-2 bg-gray-700 text-sm space-y-1"
													>
														<Detail label="Entry ID">
															{entry.name}
														</Detail>

														<Detail label="Bracket Challenge">
															{entry.bracket_challenge.name}
														</Detail>

														<Detail label="Correct Predictions">
															{entry.correct_predictions_count}
														</Detail>

														<Detail label="Status">
															<span
																className={`${getStatusBgColorClass(
																	entry.status
																)} text-white font-bold px-3 rounded text-sm select-none`}
															>
																{entry.status.toLocaleUpperCase()}
															</span>
														</Detail>
													</Link>
												))}
											</>
										) : (
											<p className="py-1.5 px-2 rounded bg-gray-700 mt-2">
												No entries data found
											</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<p className="mt-4 bg-gray-300 px-3 py-2 rounded">
						{isLoading ? "Fetching user information." : "User not found."}
					</p>
				)}
			</div>
			{isLoading && <Loader />}
			<EndOfPage />
		</ContentBase>
	);
};

export default PublicProfile;
