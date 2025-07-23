import { useCallback, useEffect, useMemo, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import api from "../../api/axiosConfig";
import type { nbaTeamData, pbaTeamData } from "../../../data/adminData";
import {
	type NBATeamInfo,
	nbaTeams as defaultNbaTeams,
} from "../../../data/nbaData";
import {
	type PBATeamInfo,
	pbaTeams as defaulPbaTeams,
} from "../../../data/pbaData";
import BreadCrumbs from "../../../components/breadCrumbs";

type AnyTeamInfo = NBATeamInfo | PBATeamInfo;

const CreateBracketChallenge = () => {
	const [league, setLeague] = useState<string>("NBA");
	const [challengeName, setChallengeName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [isPublic, setIsPublic] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [conference, setConference] = useState<"EAST" | "WEST">("EAST");
	const [showAddTeamModal, setShowAddTeamModal] = useState<boolean>(false);
	const [pbaTeams, setPbaTeams] = useState<AnyTeamInfo[]>([]);
	const [nbaTeams, setNbaTeams] = useState<AnyTeamInfo[]>([]);
	const [selectedNbaTeamsData, setSelectedNbaTeamsData] =
		useState<nbaTeamData>({
			east: [],
			west: [],
		});
	const [selectedPbaTeamsData, setSelectedPbaTeamsData] =
		useState<pbaTeamData>({
			teams: [],
		});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission logic here
		setIsLoading(true);

		// console.log({
		// 	league,
		// 	challengeName,
		// 	description,
		// 	startDate,
		// 	endDate,
		// 	isPublic,
		// });
	};

	const handleTeamSelect = (team: AnyTeamInfo) => {
		if (league === "NBA") {
			//push to nbaTeamsData.. limit to 8 teams
			if (conference === "EAST") {
				// setSelectedNbaTeamsData((prevData) => ({
				// 	...prevData,
				// 	east: prevData.east.includes(team.id)
				// 		? prevData.east.filter((id) => id !== team.id)
				// 		: [...prevData.east, team.id],
				// }));
				setSelectedNbaTeamsData((prevData) => {
					const selected = prevData.east.includes(team.id);

					if (selected) {
						// If the team is already selected in EAST, unselect it
						return {
							...prevData,
							east: prevData.east.filter((id) => id !== team.id),
						};
					} else {
						// If the team is not selected in EAST, check if we can add it
						if (prevData.east.length < 8) {
							// If less than 8 teams in EAST, add the new team
							return {
								...prevData,
								east: [...prevData.east, team.id],
							};
						} else {
							// If 8 teams already in EAST, do not add the new team
							console.warn(
								"Cannot add more than 8 teams to the East conference."
							);
							return prevData; // Return the previous state to prevent adding
						}
					}
				});
			} else if (conference === "WEST") {
				setSelectedNbaTeamsData((prevData) => {
					const selected = prevData.west.includes(team.id);

					if (selected) {
						// If the team is already selected in WEST, unselect it
						return {
							...prevData,
							west: prevData.west.filter((id) => id !== team.id),
						};
					} else {
						// If the team is not selected in WEST, check if we can add it
						if (prevData.west.length < 8) {
							// If less than 8 teams in WEST, add the new team
							return {
								...prevData,
								west: [...prevData.west, team.id],
							};
						} else {
							// If 8 teams already in WEST, do not add the new team
							console.warn(
								"Cannot add more than 8 teams to the West conference."
							);
							return prevData; // Return the previous state to prevent adding
						}
					}
				});
			}
		} else if (league === "PBA") {
			setSelectedPbaTeamsData((prevData) => ({
				teams: prevData.teams.includes(team.id)
					? prevData.teams.filter((id) => id !== team.id)
					: [...prevData.teams, team.id],
			}));
		}
	};

	const handleCloseModalClick = () => {
		setShowAddTeamModal(false);
		setSearchTerm("");
	};

	const handleClearClick = () => {
		if (league === "NBA") {
			// setSelectedNbaTeamsData({
			// 	east: [],
			// 	west: [],
			// });
			if (conference === "EAST") {
				setSelectedNbaTeamsData((prev) => {
					return { ...prev, east: [] };
				});
			} else if (conference === "WEST") {
				setSelectedNbaTeamsData((prev) => {
					return { ...prev, west: [] };
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

	useEffect(() => {
		setPbaTeams(defaulPbaTeams);
		setNbaTeams(defaultNbaTeams);
	}, []);

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
		const eastTeams = nbaTeams
			.filter((team) => selectedNbaTeamsData.east.includes(team.id))
			.sort(
				(a, b) =>
					selectedNbaTeamsData.east.indexOf(a.id) -
					selectedNbaTeamsData.east.indexOf(b.id)
			);
		const westTeams = nbaTeams
			.filter((team) => selectedNbaTeamsData.west.includes(team.id))
			.sort(
				(a, b) =>
					selectedNbaTeamsData.west.indexOf(a.id) -
					selectedNbaTeamsData.west.indexOf(b.id)
			);

		return {
			east: eastTeams,
			west: westTeams,
		};
	}, [nbaTeams, selectedNbaTeamsData]);

	const selectedPBATeams = useMemo(() => {
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
					const eastIndex = selectedNbaTeamsData.east.indexOf(team.id);
					return eastIndex !== -1 ? eastIndex + 1 : null;
				}
				if (team.conference === "WEST") {
					const westIndex = selectedNbaTeamsData.west.indexOf(team.id);
					return westIndex !== -1 ? westIndex + 1 : null;
				}
			} else if (team.league === "PBA") {
				const teamIndex = selectedPbaTeamsData.teams.indexOf(team.id);
				return teamIndex !== -1 ? teamIndex + 1 : null;
			}
			return null;
		},
		[league, selectedNbaTeamsData, selectedPbaTeamsData]
	);

	return (
		<>
			<div className="py-7 min-h-[calc(100dvh-57px)]">
				<div className="p-4 md:p-6 rounded-lg shadow border border-gray-400">
					<BreadCrumbs />

					<h1 className="text-lg font-bold mb-4">
						Create Bracket Challenge
					</h1>
					{/* <hr className="mt-2 mb-4 border-gray-400 shadow-lg" /> */}

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
										{/* <option value="">Select a league</option> */}
										<option value="NBA">NBA</option>
										<option value="PBA">PBA</option>
										{/* Add more leagues as needed */}
									</select>
								</div>
								<div className="mb-2">
									<label htmlFor="challengeName" className="text-xs">
										Challenge Name
									</label>
									<input
										type="text"
										id="challengeName"
										value={challengeName}
										onChange={(e) => setChallengeName(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
										placeholder="Enter challenge name"
										required
									/>
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
											<div className="mt-1 lg:flex gap-x-4">
												<div className="border border-gray-300 shadow-sm mt-2 flex-1">
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
														{selectedNBATeams?.east.length > 0 ? (
															selectedNBATeams?.east.map(
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
												<div className="border border-gray-300 shadow-sm mt-2 flex-1">
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
														{selectedNBATeams?.west.length > 0 ? (
															selectedNBATeams?.west.map(
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
													<div className="h-37 overflow-y-auto">
														{selectedPBATeams.length > 0 ? (
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
											</div>
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
				<div className="fixed left-0 bottom-0 w-full h-full z-10">
					<div className="absolute top-0 left-0 bg-[#0a0a0a66] w-full h-full pointer-events-auto"></div>
					<div className="absolute top-0 left-0 flex items-center justify-center h-full w-full">
						<div className="w-11/12 max-w-xl bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
							<h4 className="font-semibold text-lg">Select Teams</h4>
							<div>
								<input
									type="search"
									id="search"
									className="border rounded border-gray-400 w-full px-3 py-2 mt-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
									placeholder="Search team..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									autoComplete="off"
								/>
							</div>
							<div className="border border-gray-400 h-50 mt-2 overflow-y-scroll">
								{/* <p className="p-2">this is the content...</p> */}
								{league === "NBA" &&
									filteredNbaTeams.map((team) => (
										<div
											key={team.id}
											className="p-2 border-b border-gray-300 last:border-b-0 even:bg-gray-100 hover:bg-blue-100 cursor-pointer text-sm flex items-center"
											onClick={() => handleTeamSelect(team)}
										>
											<span className="flex-1">{team.name}</span>

											{getCurrenTeamDataIndex(team) && (
												<div className="w-7 h-4 rounded-full bg-gray-600 text-xs text-white font-semibold text-center leading-4">
													{getCurrenTeamDataIndex(team)}
												</div>
											)}
										</div>
									))}
								{league === "PBA" &&
									filteredPbaTeams.map((team) => (
										<div
											key={team.id}
											className="p-2 border-b border-gray-300 last:border-b-0 even:bg-gray-100 hover:bg-blue-100 cursor-pointer text-sm flex items-center"
											onClick={() => handleTeamSelect(team)}
										>
											<span className="flex-1">{team.name}</span>

											{getCurrenTeamDataIndex(team) && (
												<div className="w-7 h-4 rounded-full bg-gray-600 text-xs text-white font-semibold text-center leading-4">
													{getCurrenTeamDataIndex(team)}
												</div>
											)}
										</div>
									))}
							</div>
							<div className="space-x-2">
								<button
									className="p-2 bg-red-600 text-white text-sm mt-3 w-26 rounded cursor-pointer font-bold hover:bg-red-600 transition duration-200"
									onClick={handleClearClick}
								>
									CLEAR
								</button>

								<button
									className="p-2 bg-gray-700 text-white text-sm mt-3 w-26 rounded cursor-pointer font-bold hover:bg-gray-600 transition duration-200"
									onClick={handleCloseModalClick}
								>
									CLOSE
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CreateBracketChallenge;
