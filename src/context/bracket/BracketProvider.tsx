import React, { useCallback, useContext, useEffect, useState } from "react";
import { BracketContext } from "./BracketContext";
import type {
	AnyPlayoffsTeamInfo,
	BracketChallengeEntryData,
	BracketChallengeEntryPredictionsInfo,
	BracketChallengeInfo,
	BracketUpdateData,
	BracketUpdateMatchupsData,
	PlayoffsMatchupInfo,
	// NBAEntryData,
	PlayoffsRoundInfo,
} from "../../data/adminData";
import { apiClient } from "../../utils/api";
import { checkIsActive } from "../../utils/dateTime";

interface BracketProviderProps {
	// data: PlayoffsRoundInfo[];
	bracketChallenge: BracketChallengeInfo;
	predictions?: BracketChallengeEntryPredictionsInfo[];
	children: React.ReactNode;
	bracketMode: "update" | "submit" | "preview";
}

export const BracketProvider: React.FC<BracketProviderProps> = ({
	bracketChallenge,
	bracketMode,
	children,
	predictions,
}) => {
	const [rounds, setRounds] = useState<PlayoffsRoundInfo[] | null>(null);
	const [currentRounds, setCurrentRounds] = useState<
		PlayoffsRoundInfo[] | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [mode, setMode] = useState<"update" | "submit" | "preview">(
		bracketMode
	);
	const [hasProgressed, setHasProgressed] = useState<boolean>(false);

	const league = bracketChallenge.league;

	const isActive = checkIsActive(
		bracketChallenge.start_date,
		bracketChallenge.end_date
	);

	useEffect(() => {
		if (predictions) {
			const allTeams = bracketChallenge.rounds.flatMap((round) =>
				round.matchups.flatMap((matchup) => matchup.teams)
			);
			const newRounds: PlayoffsRoundInfo[] = bracketChallenge.rounds.map(
				(round) => {
					const newMatchups: PlayoffsMatchupInfo[] = round.matchups.map(
						(matchup) => {
							const prediction = predictions.find(
								(p) => p.matchup_id === matchup.id
							);
							console.log(prediction);
							if (prediction) {
								//get teams based from the predictions teams and update winner_team_id
								const newTeams: AnyPlayoffsTeamInfo[] = [];

								if (round.order_index !== 1) {
									//get team slot 1
									const team1 = allTeams.find(
										(t) => t.id === prediction.teams[0].id
									);
									const team2 = allTeams.find(
										(t) => t.id === prediction.teams[1].id
									);
									if (team1 && team2) {
										newTeams.push({ ...team1, slot: 1 });
										newTeams.push({ ...team2, slot: 2 });
									}
								}

								const isPredicted =
									matchup.winner_team_id !== null
										? prediction.predicted_winner_team_id ===
										  matchup.winner_team_id
										: null;

								return {
									...matchup,
									winner_team_id: prediction.predicted_winner_team_id,
									teams:
										newTeams.length > 0 ? newTeams : matchup.teams,
									isPredicted: isPredicted,
								};
							}
							return matchup;
						}
					);
					return {
						...round,
						matchups: newMatchups,
					};
				}
			);
			setRounds(newRounds);
		} else {
			setRounds(bracketChallenge.rounds);
		}
		setCurrentRounds(bracketChallenge.rounds);
	}, [bracketChallenge.rounds, predictions]);

	useEffect(() => {
		if (!currentRounds) return;
		const matchups = currentRounds.flatMap((round) => {
			return round.matchups.filter(
				(matchup) => matchup.winner_team_id !== null
			);
		});
		setHasProgressed(matchups.length > 0);
	}, [currentRounds]);

	const submitData = async (data: BracketChallengeEntryData) => {
		try {
			setIsLoading(true);
			const response = await apiClient.post(
				`/user/bracket-challenge-entries/`,
				data
			);
			setSuccess(response.data.message);
			setMode("preview");
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

	const submitUpdateData = async (data: BracketUpdateData) => {
		setIsLoading(true);
		try {
			const response = await apiClient.put(
				`/admin/bracket-challenges/${bracketChallenge.id}/update`,
				data
			);
			setSuccess(response.data.message);
			setCurrentRounds(response.data.rounds);
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const resetMessage = () => {
		setError(null);
		setSuccess(null);
	};

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

	const updatePick = useCallback(
		(
			conference: "EAST" | "WEST" | null,
			roundIndex: number,
			matchupIndex: number,
			team: AnyPlayoffsTeamInfo
		) => {
			setRounds((prev) => {
				if (!prev) return prev;
				let newRounds = prev.map((r) => {
					if (r.conference == conference && r.order_index == roundIndex) {
						const newMatchups = r.matchups.map((m) => {
							if (m.matchup_index == matchupIndex) {
								return {
									...m,
									winner_team_id: team.id,
								};
							}
							return m;
						});
						return { ...r, matchups: newMatchups };
					}
					return r;
				});

				//advance team to next round.
				if (roundIndex && roundIndex < 3) {
					// if not advancing to finals..
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
					//now advancing to finals..
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
			});
		},
		[]
	);

	const updateFinalsPick = useCallback((team: AnyPlayoffsTeamInfo) => {
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
	}, []);

	const submitPicks = useCallback(() => {
		//get all matchup picks..
		if (!rounds) {
			setError("No rounds found");
			return;
		}
		if (!picksCompleted()) {
			setError("All picks must be completed");
			return;
		}
		// console.log("asdf", league);

		const predictions: BracketChallengeEntryPredictionsInfo[] =
			rounds.flatMap((round) =>
				round.matchups.map((matchup) => ({
					predicted_winner_team_id: matchup.winner_team_id || 0,
					matchup_id: matchup.id,
					teams: matchup.teams
						.sort((a, b) => a.slot - b.slot)
						.map((team) => ({
							id: team.id,
							// slot: team.slot,
							// seed: team.seed,
						})),
				}))
			);

		// console.log(predictions);

		submitData({
			bracket_challenge_id: bracketChallenge.id,
			predictions: predictions,
		});
	}, [rounds, bracketChallenge.id]);

	const resetBracket = useCallback(() => {
		setRounds((prev) => {
			if (!prev) return prev;
			let newRounds = prev.map((r) => {
				let newMatchups = r.matchups.map((m) => {
					if (r.order_index !== 1 || r.name === "Finals") {
						return {
							...m,
							winner_team_id: null,
							teams: [],
						};
					}
					if (r.order_index === 1) {
						return {
							...m,
							winner_team_id: null,
						};
					}
					return m;
				});
				return {
					...r,
					matchups: newMatchups,
				};
			});
			return newRounds;
		});
	}, []);

	const updateBracket = useCallback(() => {
		if (!rounds) return;
		const matchups: BracketUpdateMatchupsData[] = rounds.flatMap((round) =>
			// round.matchups
			// 	.filter(
			// 		(matchup) =>
			// 			matchup.winner_team_id !== null || matchup.teams.length > 0
			// 	)
			round.matchups.map((matchup) => ({
				winner_team_id: matchup.winner_team_id,
				matchup_id: matchup.id,
				teams: matchup.teams.map((team) => ({
					id: team.id,
					slot: team.slot,
					seed: team.seed,
				})),
			}))
		);
		// console.log(matchups);

		submitUpdateData({
			bracket_challenge_id: bracketChallenge.id,
			matchups: matchups,
		});
	}, [rounds, bracketChallenge.id]);

	const refreshBracket = useCallback(() => {
		if (!currentRounds) return;
		setRounds(currentRounds);
	}, [currentRounds]);

	const clearMatchup = useCallback(
		(
			conference: "EAST" | "WEST" | null,
			roundIndex: number,
			matchupIndex: number
		) => {
			// We now use the functional update form of setRounds
			setRounds((prevRounds) => {
				// Safely handle the case where prevRounds is null
				if (!prevRounds) {
					return prevRounds;
				}
				const prevRoundIndex = roundIndex - 1;
				const originMatchupIndexes: number[] = [
					2 * (matchupIndex - 1) + 1,
					2 * (matchupIndex - 1) + 2,
				];

				const newRounds = prevRounds.map((r) => {
					if (
						r.conference === conference &&
						(r.order_index === roundIndex ||
							r.order_index === prevRoundIndex)
					) {
						const newMatchups = r.matchups.map((m) => {
							if (
								r.order_index === roundIndex &&
								m.matchup_index === matchupIndex
							) {
								return {
									...m,
									teams: [],
									winner_team_id: null,
								};
							}
							if (
								r.order_index === prevRoundIndex &&
								originMatchupIndexes.includes(m.matchup_index)
							) {
								return {
									...m,
									winner_team_id: null,
								};
							}
							return m;
						});
						return { ...r, matchups: newMatchups };
					}
					return r;
				});
				return newRounds;
			});
		},
		[] // The dependency array can now be empty!
	);

	const clearFinalsMatchup = useCallback(() => {
		const prevRoundIndex = bracketChallenge.league === "NBA" ? 3 : 2;
		setRounds((prev) => {
			if (!prev) return prev;
			let newRounds = prev.map((r) => {
				if (r.name === "Finals" || r.order_index === prevRoundIndex) {
					const newMatchups = r.matchups.map((m) => {
						if (r.name === "Finals") {
							return {
								...m,
								teams: [],
								winner_team_id: null,
							};
						}

						if (r.order_index === prevRoundIndex) {
							return {
								...m,
								winner_team_id: null,
							};
						}
						return m;
					});
					return { ...r, matchups: newMatchups };
				}
				return r;
			});

			return newRounds;
		});
	}, [bracketChallenge.league]);

	// const hasProgressed = useCallback(() => {
	// 	const matchups = bracketChallenge.rounds.flatMap((round) => {
	// 		return round.matchups.filter(
	// 			(matchup) => matchup.winner_team_id !== null
	// 		);
	// 	});
	// 	return matchups.length > 0;
	// }, [bracketChallenge.rounds]);

	return (
		<BracketContext.Provider
			value={{
				rounds,
				error,
				success,
				isLoading,
				mode,
				league,
				isActive,
				hasProgressed,
				refreshBracket,
				resetMessage,
				updatePick,
				updateFinalsPick,
				updateBracket,
				resetBracket,
				submitPicks,
				clearMatchup,
				clearFinalsMatchup,
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
