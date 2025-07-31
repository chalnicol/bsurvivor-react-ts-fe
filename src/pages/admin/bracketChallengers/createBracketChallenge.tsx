import { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumbs from "../../../components/breadCrumbs";
import ErrorDisplay from "../../../components/errorDisplay";
import type {
	nbaTeamData,
	// pbaTeamData,
	AnyTeamInfo,
	BracketChallengeInfo,
	pbaTeamData,
} from "../../../data/adminData";
import { useAdmin } from "../../../context/admin/AdminProvider";
import Loader from "../../../components/loader";
import apiClient from "../../../utils/axiosConfig";
import StatusMessage from "../../../components/statusMessage";
import SelectTeamModal from "../../../components/selectTeamModal";

const CreateBracketChallenge = () => {
	const {
		areTeamsAndLeaguesPopulated,
		fetchTeamsAndLeagues,
		nbaTeams,
		pbaTeams,
		leagues,
		isLoading: isLoadingTeamsAndLeagues,
	} = useAdmin();

	const [league, setLeague] = useState<string>("");
	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [conference, setConference] = useState<"EAST" | "WEST">("EAST");
	const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);
	// const [message, setMessage] = useState<string>("");

	const [success, setSuccess] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({}); // To hold validation errors

	const [selectedNbaTeamsData, setSelectedNbaTeamsData] =
		useState<nbaTeamData | null>(null);
	const [selectedPbaTeamsData, setSelectedPbaTeamsData] =
		useState<pbaTeamData | null>(null);

	useEffect(() => {
		if (!areTeamsAndLeaguesPopulated) {
			fetchTeamsAndLeagues();
		}
	}, [areTeamsAndLeaguesPopulated]);

	const clearForms = () => {
		setLeague("");
		setName("");
		setDescription("");
		setStartDate("");
		setEndDate("");
		setIsPublic(false);
		setSelectedNbaTeamsData(null);
		setSelectedPbaTeamsData(null);
		setSearchTerm("");
		setConference("EAST");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Handle form submission logic here
		if (league == "") return;
		//prepare to submit data..

		const toSubmitData = {
			name: name,
			description: description,
			start_date: startDate,
			end_date: endDate,
			is_public: isPublic,
			league: league,
			bracket_data:
				league === "NBA" ? selectedNbaTeamsData : selectedPbaTeamsData,
		};

		// console.log("tosubmit", toSubmitData);

		const storeBracketChallenge = async () => {
			try {
				setIsLoading(true);
				setError(null);
				setSuccess(null);
				setFieldErrors({}); // Clear validation errors)
				await apiClient.post<BracketChallengeInfo>(
					"/admin/bracket-challenges",
					toSubmitData
				);
				clearForms();
				setSuccess("Challenge created successfully!");
			} catch (error: any) {
				if (error.type === "validation") {
					setFieldErrors(error.errors);
					// setError(error.message); // Often 'The given data was invalid.'
				} else if (
					error.type === "server" ||
					error.type === "general" ||
					error.type === "network" ||
					error.type === "client"
				) {
					setError(error.message);
				} else {
					// Fallback for any other unexpected error type
					setError("An unknown error occurred.");
				}
			} finally {
				setIsLoading(false);
			}
		};
		storeBracketChallenge();
	};

	const handleTeamSelect = (team: AnyTeamInfo) => {
		if (league === "NBA") {
			//push to nbaTeamsData.. limit to 8 teams
			if (conference === "EAST") {
				setSelectedNbaTeamsData((prevData) => {
					if (!prevData) {
						return {
							teams: {
								east: [team.id],
								west: [],
							},
						};
					}
					//..
					const selected = prevData.teams.east.includes(team.id);
					if (selected) {
						// If the team is already selected in EAST, unselect it
						return {
							...prevData,
							teams: {
								east: prevData.teams.east.filter(
									(id) => id !== team.id
								),
								west: prevData.teams.west,
							},
						};
					} else {
						// If the team is not selected in EAST, check if we can add it
						if (prevData.teams.east.length < 8) {
							// If less than 8 teams in EAST, add the new team
							return {
								...prevData,
								teams: {
									east: [...prevData.teams.east, team.id],
									west: prevData.teams.west,
								},
							};
						} else {
							// If 8 teams already in EAST, do not add the new team
							console.log(
								"Cannot add more than 8 teams to the East conference."
							);
							return prevData; // Return the previous state to prevent adding
						}
					}
				});
			} else if (conference === "WEST") {
				setSelectedNbaTeamsData((prevData) => {
					if (!prevData) {
						return {
							teams: {
								east: [],
								west: [team.id],
							},
						};
					}
					const selected = prevData.teams.west.includes(team.id);

					if (selected) {
						// If the team is already selected in WEST, unselect it
						return {
							...prevData,
							teams: {
								east: prevData.teams.east,
								west: prevData.teams.west.filter(
									(id) => id !== team.id
								),
							},
						};
					} else {
						// If the team is not selected in WEST, check if we can add it
						if (prevData.teams.west.length < 8) {
							// If less than 8 teams in WEST, add the new team
							return {
								...prevData,
								teams: {
									east: prevData.teams.east,
									west: [...prevData.teams.west, team.id],
								},
							};
						} else {
							// If 8 teams already in WEST, do not add the new team
							console.log(
								"Cannot add more than 8 teams to the West conference."
							);
							return prevData; // Return the previous state to prevent adding
						}
					}
				});
			}
		} else if (league === "PBA") {
			setSelectedPbaTeamsData((prevData) => {
				if (!prevData) {
					return {
						teams: [team.id],
					};
				}

				const selected = prevData.teams.includes(team.id);

				if (selected) {
					// If the team is already selected, unselect it
					// return prevData.teams.filter((id) => id !== team.id);
					return {
						...prevData,
						teams: prevData.teams.filter((id) => id !== team.id),
					};
				} else {
					// If the team is not selected
					if (prevData.teams.length < 8) {
						// If less than 8 teams selected
						return {
							...prevData,
							teams: [...prevData.teams, team.id],
						};
					} else {
						// If 8 teams already selected
						console.log("Cannot add more than 8 teams.");
						return prevData;
					}
				}
			});
		}
	};

	const handleCloseModalClick = () => {
		setShowAddTeamModal(false);
		setSearchTerm("");
	};

	const handleClearClick = () => {
		if (league === "NBA") {
			if (conference === "EAST") {
				setSelectedNbaTeamsData((prev) => {
					if (prev) {
						return {
							...prev,
							teams: {
								east: [],
								west: prev.teams.west,
							},
						};
					}
					return prev;
				});
			} else if (conference === "WEST") {
				setSelectedNbaTeamsData((prev) => {
					if (prev) {
						return {
							...prev,
							teams: {
								east: prev.teams.east,
								west: [],
							},
						};
					}
					return prev;
				});
			}
		} else if (league === "PBA") {
			setSelectedPbaTeamsData({
				teams: [],
			});
		}
	};

	const handleOpenModalClick = (conference: "EAST" | "WEST" | null) => {
		setShowAddTeamModal(true);
		if (conference) {
			setConference(conference);
		}
		setSearchTerm("");
	};

	const handleSearchTermChange = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	const filteredNbaTeams = useMemo(() => {
		// return nbaTeams.filter(
		// 	(team) =>
		// 		team.conference === conference &&
		// 		team.name.toLowerCase().includes(searchTerm.toLowerCase())
		// );
		return nbaTeams.filter((team) => {
			// Type Guard: Check if 'team' is an NBATeamInfo
			if (team.league === "NBA") {
				// Inside this block, 'team' is now correctly inferred as NBATeamInfo
				return (
					team.conference === conference &&
					team.name.toLowerCase().includes(searchTerm.toLowerCase())
				);
			}
			// If it's not an NBA team, it shouldn't be included in filteredNbaTeams
			return false;
		});
	}, [nbaTeams, conference, searchTerm]);

	const filteredPbaTeams = useMemo(() => {
		return pbaTeams.filter((team) => {
			// Type Guard: Check if 'team' is an PBATeamInfo
			if (team.league === "PBA") {
				// Inside this block, 'team' is now correctly inferred as NBATeamInfo
				return team.name.toLowerCase().includes(searchTerm.toLowerCase());
			}
			// If it's not an PBA team, it shouldn't be included in filteredNbaTeams
			return false;
		});
	}, [pbaTeams, searchTerm]);

	const selectedNBATeams = useMemo(() => {
		//get teams from selectedNbaTeamsData and order by as per the selectedNbaTeamsData
		if (!selectedNbaTeamsData) return null;
		const eastTeams = nbaTeams
			.filter((team) => selectedNbaTeamsData.teams.east.includes(team.id))
			.sort(
				(a, b) =>
					selectedNbaTeamsData?.teams.east.indexOf(a.id) -
					selectedNbaTeamsData?.teams.east.indexOf(b.id)
			);
		const westTeams = nbaTeams
			.filter((team) => selectedNbaTeamsData?.teams.west.includes(team.id))
			.sort(
				(a, b) =>
					selectedNbaTeamsData?.teams.west.indexOf(a.id) -
					selectedNbaTeamsData?.teams.west.indexOf(b.id)
			);

		return {
			east: eastTeams,
			west: westTeams,
		};
	}, [nbaTeams, selectedNbaTeamsData]);

	const selectedPBATeams = useMemo(() => {
		if (!selectedPbaTeamsData) return null;
		return pbaTeams
			.filter((team) => selectedPbaTeamsData.teams.includes(team.id))
			.sort(
				(a, b) =>
					selectedPbaTeamsData.teams.indexOf(a.id) -
					selectedPbaTeamsData.teams.indexOf(b.id)
			);
	}, [pbaTeams, selectedPbaTeamsData]);

	const getCurrenTeamDataIndex = useCallback(
		(team: AnyTeamInfo) => {
			if (team.league === "NBA") {
				if (team.conference === "EAST") {
					if (!selectedNbaTeamsData) return null;
					const eastIndex = selectedNbaTeamsData.teams.east.indexOf(
						team.id
					);
					return eastIndex !== -1 ? eastIndex + 1 : null;
				}
				if (team.conference === "WEST") {
					if (!selectedNbaTeamsData) return null;
					const westIndex = selectedNbaTeamsData.teams.west.indexOf(
						team.id
					);
					return westIndex !== -1 ? westIndex + 1 : null;
				}
			} else if (team.league === "PBA") {
				if (!selectedPbaTeamsData) return null;
				const teamIndex = selectedPbaTeamsData.teams.indexOf(team.id);
				return teamIndex !== -1 ? teamIndex + 1 : null;
			}
			return null;
		},
		[league, selectedNbaTeamsData, selectedPbaTeamsData]
	);

	return (
		<>
			<div className="py-7 min-h-[calc(100dvh-57px)] relative">
				<div className="p-4 md:p-6 rounded-lg shadow border border-gray-400">
					<BreadCrumbs />

					<h1 className="text-lg font-bold mb-4">
						Create Bracket Challenge
					</h1>
					{/* <hr className="mt-2 mb-4 border-gray-400 shadow-lg" /> */}

					{success && (
						<StatusMessage
							type="success"
							message={success}
							onClose={() => setSuccess(null)}
						/>
					)}
					{error && (
						<StatusMessage
							type="error"
							message={error}
							onClose={() => setError(null)}
						/>
					)}

					<form onSubmit={handleSubmit}>
						<div className="md:flex gap-x-6 lg:gap-x-12 space-y-4 md:space-y-0">
							<div className="flex-1">
								{/* Example input fields */}
								<div className="mb-2">
									<label htmlFor="league" className="text-xs">
										Select League
									</label>
									<select
										id="league"
										value={league}
										onChange={(e) => setLeague(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										disabled={isLoading}
										required
									>
										<option value="">Select a league</option>
										{leagues.map((league) => (
											<option key={league.id} value={league.abbr}>
												{league.abbr}
											</option>
										))}
									</select>
									{fieldErrors.league && (
										<ErrorDisplay errors={fieldErrors.league} />
									)}
								</div>
								<div className="mb-2">
									<label htmlFor="challengeName" className="text-xs">
										Name
									</label>
									<input
										type="text"
										id="challengeName"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										placeholder="Enter challenge name"
										required
									/>
									{fieldErrors.name && (
										<ErrorDisplay errors={fieldErrors.name} />
									)}
								</div>
								<div className="mb-2">
									<label htmlFor="description" className="text-xs">
										Description
									</label>
									<textarea
										id="description"
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										placeholder="Enter challenge description"
										rows={3}
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									></textarea>
									{fieldErrors.description && (
										<ErrorDisplay errors={fieldErrors.description} />
									)}
								</div>
								<div className="mb-2">
									<label htmlFor="startDate" className="text-xs">
										Start Date
									</label>
									<input
										type="date"
										id="startDate"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										required
									/>
									{fieldErrors.start_date && (
										<ErrorDisplay errors={fieldErrors.start_date} />
									)}
								</div>
								<div className="mb-2">
									<label htmlFor="endDate" className="text-xs">
										End Date
									</label>
									<input
										type="date"
										id="endDate"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										required
									/>
									{fieldErrors.end_date && (
										<ErrorDisplay errors={fieldErrors.end_date} />
									)}
								</div>
								<div className="mb-6 flex items-center text-gray-600">
									<input
										type="checkbox"
										id="is_public"
										name="is_public"
										className="w-4 h-4 me-2"
										disabled={isLoading}
										checked={isPublic}
										onChange={(e) => setIsPublic(e.target.checked)}
									/>
									<label htmlFor="is_public">Is Public</label>
								</div>
							</div>
							<div className="flex-1 lg:flex-2">
								<div className="mb-6">
									<label htmlFor="league" className="text-xs">
										Select Teams <span>(in order)</span>
									</label>
									<hr className="border-gray-400" />
									{league === "NBA" && (
										<>
											<div className="mt-2 lg:flex gap-x-4 space-y-4 lg:space-y-0">
												<div className="flex-1">
													<div className="border border-gray-300 shadow-sm">
														<div className="flex items-center justify-between font-bold text-xs bg-gray-700 text-white p-2">
															<h3>East Teams</h3>
															<button
																type="button"
																className="px-2 py-0.5 border rounded cursor-pointer hover:bg-gray-600"
																onClick={() =>
																	handleOpenModalClick("EAST")
																}
															>
																Change
															</button>
														</div>
														<div className="h-37 lg:h-72 overflow-y-auto">
															{selectedNBATeams &&
															selectedNBATeams.east.length >
																0 ? (
																selectedNBATeams.east.map(
																	(team, index) => (
																		<div
																			key={index}
																			className="p-2 even:bg-gray-100 hover:bg-blue-100 cursor-pointer text-sm"
																		>
																			{index + 1}.{" "}
																			{team.name}
																		</div>
																	)
																)
															) : (
																<p className="p-3 text-sm text-gray-500">
																	No teams selected
																</p>
															)}
														</div>
													</div>
													{fieldErrors[
														"bracket_data.teams.east"
													] && (
														<ErrorDisplay
															errors={
																fieldErrors[
																	"bracket_data.teams.east"
																]
															}
														/>
													)}
												</div>
												<div className="flex-1">
													<div className="border border-gray-300 shadow-sm">
														<div className="flex items-center justify-between font-bold text-xs bg-gray-700 text-white p-2">
															<h3>West Teams</h3>
															<button
																type="button"
																className="px-2 py-0.5 border rounded cursor-pointer hover:bg-gray-600"
																onClick={() =>
																	handleOpenModalClick("WEST")
																}
															>
																Change
															</button>
														</div>
														<div className="h-37 lg:h-72 overflow-y-auto">
															{selectedNBATeams &&
															selectedNBATeams.west.length >
																0 ? (
																selectedNBATeams.west.map(
																	(team, index) => (
																		<div
																			key={index}
																			className="p-2 even:bg-gray-100 hover:bg-blue-100 cursor-pointer text-sm"
																		>
																			{index + 1}.{" "}
																			{team.name}
																		</div>
																	)
																)
															) : (
																<p className="p-3 text-sm text-gray-500">
																	No teams selected
																</p>
															)}
														</div>
													</div>
													{fieldErrors[
														"bracket_data.teams.west"
													] && (
														<ErrorDisplay
															errors={
																fieldErrors[
																	"bracket_data.teams.west"
																]
															}
														/>
													)}
												</div>
											</div>
										</>
									)}
									{league === "PBA" && (
										<div className="mt-1">
											<div className="">
												<div className="border border-gray-300 shadow-sm mt-2">
													<div className="flex items-center justify-between font-bold text-xs bg-gray-700 text-white p-2">
														<h3>Teams</h3>
														<button
															type="button"
															className="px-2 py-0.5 border rounded cursor-pointer hover:bg-gray-600"
															onClick={() =>
																handleOpenModalClick(null)
															}
														>
															Change
														</button>
													</div>
													<div className="h-37 lg:h-72 overflow-y-auto">
														{selectedPBATeams &&
														selectedPBATeams.length > 0 ? (
															selectedPBATeams.map(
																(team, index) => (
																	<div
																		key={index}
																		className="p-2 even:bg-gray-100 hover:bg-blue-100 cursor-pointer text-sm"
																	>
																		{index + 1}. {team.name}
																	</div>
																)
															)
														) : (
															<p className="p-3 text-sm text-gray-500">
																No teams selected
															</p>
														)}
													</div>
												</div>
												{fieldErrors["bracket_data.teams"] && (
													<ErrorDisplay
														errors={
															fieldErrors["bracket_data.teams"]
														}
													/>
												)}
											</div>
										</div>
									)}

									{league === "" && (
										<div className="w-full bg-gray-100 h-22 mt-2 flex items-center justify-center rounded border border-gray-400 shadow">
											Please select a league to set teams.
										</div>
									)}
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="bg-gray-700 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200 cursor-pointer"
						>
							CREATE CHALLENGE
						</button>
					</form>
				</div>
			</div>
			{/* Modal for selecting teams */}
			{showAddTeamModal && (
				<SelectTeamModal
					league={league}
					searchTerm={searchTerm}
					filteredNbaTeams={filteredNbaTeams}
					filteredPbaTeams={filteredPbaTeams}
					getCurrenTeamDataIndex={getCurrenTeamDataIndex}
					onSearchTermChange={handleSearchTermChange}
					onClearClick={handleClearClick}
					onClose={handleCloseModalClick}
					onTeamSelect={handleTeamSelect}
				/>
			)}
			{(isLoading || isLoadingTeamsAndLeagues) && <Loader />}
		</>
	);
};

export default CreateBracketChallenge;
