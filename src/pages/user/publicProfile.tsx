import { useParams } from "react-router-dom";

import ContentBase from "../../components/contentBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EndOfPage from "../../components/endOfPage";
import { useEffect, useState } from "react";
import type {
	BracketChallengeEntryInfo,
	UserMiniInfo,
} from "../../data/adminData";
import apiClient from "../../utils/axiosConfig";
import { Link } from "react-router-dom";
import Detail from "../../components/detail";
import StatusPills from "../../components/statusPills";
import Loader from "../../components/loader";

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
					<div className="bg-gray-800 text-white p-4 rounded mt-4">
						<div className="sm:flex gap-x-3">
							<div className="flex-none">
								<div className="w-18 mx-auto aspect-square border-2 border-gray-400 text-gray-400 rounded-full shadow-lg overflow-hidden flex items-center justify-center">
									<FontAwesomeIcon icon="user" size="2xl" />
								</div>
							</div>
							<div className="flex-1 space-y-2">
								<div>
									<p className="font-semibold text-xs border-gray-300 py-1">
										Full Name
									</p>
									<p className="py-1.5 px-3 rounded bg-gray-600">
										{user.fullname}
									</p>
								</div>
								<div>
									<p className="font-semibold text-xs border-gray-300 py-1">
										Username
									</p>
									<p className="py-1.5 px-3 rounded bg-gray-600">
										{user.username}
									</p>
								</div>
								{/* <hr className="my-4 border-gray-500" /> */}

								<div className="my-4">
									<p className="font-semibold text-sm py-1">
										Top Bracket Challenge Entries
									</p>

									{entries.length > 0 ? (
										<div className="space-y-1 mt-2">
											{entries.map((entry, index) => (
												<Link
													key={entry.id}
													to={`/bracket-challenge-entries/${entry.slug}`}
													className="border-t last:border-b border-gray-500 hover:bg-gray-700  block flex items-center gap-x-3 py-1"
												>
													<p className="text-2xl md:text-xl font-bold w-10 text-center">
														0{index + 1}
													</p>
													<div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 text-sm gap-y-1">
														<Detail label="Bracket Challenge">
															{entry.bracket_challenge.name}
														</Detail>

														<Detail label="Correct Picks Count">
															{entry.correct_predictions_count}
														</Detail>

														<Detail label="Status">
															<StatusPills
																status={entry.status}
															/>
														</Detail>
													</div>
												</Link>
											))}
										</div>
									) : (
										<p className="py-1.5 px-3 mt-0.5 rounded bg-gray-600">
											No entries data found
										</p>
									)}
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
