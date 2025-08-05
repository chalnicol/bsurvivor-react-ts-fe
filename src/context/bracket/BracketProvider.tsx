import React, { useCallback, useContext, useEffect, useState } from "react";
import { BracketContext } from "./BracketContext";
import type {
	AnyEntryData,
	AnyPlayoffsTeamInfo,
	BracketChallengeInfo,
	PlayoffsRoundInfo,
} from "../../data/adminData";
import apiClient from "../../utils/axiosConfig";

interface BracketProviderProps {
	// data: PlayoffsRoundInfo[];
	bracketChallenge: BracketChallengeInfo;
	entryData?: AnyEntryData | null;
	activeControls: boolean;
	children: React.ReactNode;
}

export const BracketProvider: React.FC<BracketProviderProps> = ({
	bracketChallenge,
	entryData,
	activeControls,
	children,
}) => {
	const [rounds, setRounds] = useState<PlayoffsRoundInfo[] | null>(
		bracketChallenge.rounds
	);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const getWinnerPerRounds = (
		rounds: PlayoffsRoundInfo[] | null
	): number[][] => {
		if (!rounds) return [];

		const winnerIdsPerRound = rounds.map((r) => {
			const winnerId = r.matchups.flatMap((m) => m.winner_team_id);
			return winnerId;
		});
		return winnerIdsPerRound;
	};

	const submitData = async (id: number, entryData: AnyEntryData) => {
		try {
			setIsLoading(true);
			const response = await apiClient.post(
				`/user/bracket-challenge-entries/`,
				{
					bracket_challenge_id: id,
					entry_data: entryData,
				}
			);
			setSuccess(response.data.message);
		} catch (error: any) {
			if (error.type === "validation") {
				setError(error.message);
			} else {
				setError("Failed to submit picks. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getTeam = useCallback(
		(
			roundIndex: number,
			matchupIndex: number,
			teamId: number
		): AnyPlayoffsTeamInfo | null => {
			if (!rounds) {
				return null;
			}

			const round = rounds.find((r) => r.order_index === roundIndex);
			if (!round) {
				return null;
			}

			const matchup = round.matchups.find(
				(m) => m.matchup_index === matchupIndex
			);
			if (!matchup) {
				return null;
			}

			const team = matchup.teams.find((t) => t.id === teamId);
			return team || null;
		},
		[rounds]
	);

	const resetMessage = useCallback(() => {
		setError(null);
		setSuccess(null);
	}, []);

	const picksCompleted = useCallback(() => {
		if (!rounds) return false;
		// Check if all matchups in all rounds have a winner_team_id
		for (const round of rounds) {
			for (const matchup of round.matchups) {
				if (matchup.winner_team_id === null) {
					return false; // Found a matchup without a winner
				}
			}
		}
		return true; // All matchups have a winner
	}, [rounds]);

	useEffect(() => {
		if (!rounds) return;
		if (entryData) {
			//..
			if (entryData.league == "NBA") {
				//..
			} else if (entryData.league == "PBA") {
				//..
				let newRounds = rounds.map((r) => {
					const roundIndex = r.order_index;
					const newMatchups = r.matchups.map((m) => {
						const matchupIndex = m.matchup_index;
						return {
							...m,
							winner_team_id:
								entryData.rounds[roundIndex - 1][matchupIndex - 1],
						};
					});
					return {
						...r,
						matchups: newMatchups,
					};
				});

				newRounds = newRounds.map((r) => {
					if (r.order_index !== 1) {
						const prevRoundIndex = r.order_index - 1;
						const newMatchups = r.matchups.map((m) => {
							const team1 = getTeam(
								prevRoundIndex,
								m.matchup_index == 1 ? 1 : 3,
								entryData.rounds[prevRoundIndex - 1][
									m.matchup_index == 1 ? 0 : 2
								]
							);
							const team2 = getTeam(
								prevRoundIndex,
								m.matchup_index == 1 ? 2 : 4,
								entryData.rounds[prevRoundIndex - 1][
									m.matchup_index == 1 ? 1 : 3
								]
							);

							const teamSlot1 = team1 ? { ...team1, slot: 1 } : null;
							const teamSlot2 = team2 ? { ...team2, slot: 2 } : null;

							const teams =
								teamSlot1 && teamSlot2 ? [teamSlot1, teamSlot2] : [];

							return {
								...m,
								teams: teams,
							};
							// return m;
						});
						return {
							...r,
							matchups: newMatchups,
						};
					}
					return r;
				});

				setRounds(newRounds);
			}
		}
	}, [entryData, bracketChallenge]);

	const resetPicks = () => {
		setRounds(bracketChallenge.rounds);
	};

	const updatePick = useCallback(
		(
			conference: "EAST" | "WEST" | null,
			roundIndex: number,
			matchupIndex: number,
			team: AnyPlayoffsTeamInfo
		) => {
			setRounds((prev) => {
				if (prev) {
					let newRounds = prev.map((r) => {
						if (
							r.conference === conference &&
							r.order_index === roundIndex
						) {
							const newMatchups = r.matchups.map((m) => {
								if (m.matchup_index === matchupIndex) {
									return {
										...m,
										winner_team_id: team.id,
									};
								}
								return m;
							});
							return {
								...r,
								matchups: newMatchups,
							};
						}
						return r;
					});

					if (roundIndex < 3) {
						const nextRoundIndex = roundIndex + 1;
						const nextMatchupIndex = matchupIndex <= 2 ? 1 : 2;
						const nextTeamSlot = matchupIndex % 2 == 0 ? 2 : 1;

						newRounds = newRounds.map((r) => {
							if (
								r.conference === conference &&
								r.order_index === nextRoundIndex
							) {
								const newMatchups = r.matchups.map((m) => {
									if (m.matchup_index === nextMatchupIndex) {
										const newTeam = { ...team, slot: nextTeamSlot };
										return {
											...m,
											teams: [...m.teams, newTeam],
										};
									}
									return m;
								});
								return {
									...r,
									matchups: newMatchups,
								};
							}
							return r;
						});
					} else {
						const finalSlot = conference === "EAST" ? 1 : 2;

						newRounds = newRounds.map((r) => {
							if (r.name === "Finals") {
								const newMatchups = r.matchups.map((m) => {
									if (m.matchup_index === 1) {
										const newTeam = { ...team, slot: finalSlot };
										return {
											...m,
											teams: [...m.teams, newTeam],
										};
									}
									return m;
								});
								return {
									...r,
									matchups: newMatchups,
								};
							}
							return r;
						});
					}
					return newRounds;
				}
				return prev;
			});
		},
		[rounds]
	);

	const updateFinalsPick = useCallback(
		(team: AnyPlayoffsTeamInfo) => {
			//..
			setRounds((prev) => {
				if (prev) {
					const newRounds = prev.map((r) => {
						if (r.name === "Finals") {
							const matchup = r.matchups[0];
							matchup.winner_team_id = team.id;
							return {
								...r,
								matchups: [matchup],
							};
						}
						return r;
					});
					return newRounds;
				}
				return prev;
			});
		},
		[rounds]
	);

	const submitPicks = useCallback(
		(league: string) => {
			//get all matchup picks..
			if (!rounds) {
				setError("No rounds found");
				return;
			}
			if (!picksCompleted()) {
				setError("All picks must be completed");
				return;
			}
			let entryData: AnyEntryData;

			if (league === "NBA") {
				const eastRounds =
					rounds.filter((r) => r.conference === "EAST") || null;
				const westRounds =
					rounds.filter((r) => r.conference === "WEST") || null;
				const finalRound =
					rounds.filter((r) => r.name === "Finals") || null;

				entryData = {
					league: "NBA",
					east: getWinnerPerRounds(eastRounds),
					west: getWinnerPerRounds(westRounds),
					final: getWinnerPerRounds(finalRound),
				};
				submitData(bracketChallenge.id, entryData);
			} else if (league === "PBA") {
				//

				entryData = {
					league: "PBA",
					rounds: getWinnerPerRounds(rounds),
				};
				submitData(bracketChallenge.id, entryData);
			} else {
				setError("Invalid league");
				return;
			}
		},
		[rounds]
	);

	return (
		<BracketContext.Provider
			value={{
				rounds,
				error,
				success,
				isLoading,
				activeControls,
				resetMessage,
				updatePick,
				updateFinalsPick,
				resetPicks,
				submitPicks,
			}}
		>
			{children}
		</BracketContext.Provider>
	);
};

export const useBracket = () => {
	const context = useContext(BracketContext);
	if (context === undefined) {
		throw new Error("useBracket must be used within an AdminProvider");
	}
	return context;
};
