import React, { useCallback, useContext, useEffect, useState } from "react";
import { BracketContext } from "./BracketContext";
import type {
	AnyPlayoffsTeamInfo,
	BracketChallengeEntryData,
	BracketChallengeEntryPredictionsInfo,
	BracketChallengeInfo,
	BracketUpdateData,
	BracketUpdateMatchupsData,
	// NBAEntryData,
	PlayoffsRoundInfo,
} from "../../data/adminData";
import { apiClient } from "../../utils/api";

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
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [mode, setMode] = useState<"update" | "submit" | "preview">(
		bracketMode
	);

	const league = bracketChallenge.league;

	useEffect(() => {
		const allTeams = bracketChallenge.rounds.flatMap((round) =>
			round.matchups.flatMap((matchup) => matchup.teams)
		);

		if (predictions) {
			const newRounds = bracketChallenge.rounds.map((round) => {
				const newMatchups = round.matchups.map((matchup) => {
					const prediction = predictions.find(
						(p) => p.matchup_id === matchup.id
					);
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
						return {
							...matchup,
							winner_team_id: prediction.predicted_winner_team_id,
							teams: newTeams.length > 0 ? newTeams : matchup.teams,
						};
					}
					return matchup;
				});
				return {
					...round,
					matchups: newMatchups,
				};
			});
			setRounds(newRounds);
		} else {
			setRounds(bracketChallenge.rounds);
		}
	}, [bracketChallenge, predictions]);

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
			// setRounds(response.data.rounds);
			// setMode("preview");
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

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
					predicted_winner_team_id: matchup.winner_team_id,
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

	const resetPicks = useCallback(() => {
		setRounds(bracketChallenge.rounds);
	}, [rounds]);

	const updateBracket = useCallback(() => {
		if (!rounds) return;
		const matchups: BracketUpdateMatchupsData[] = rounds.flatMap((round) =>
			round.matchups
				.filter(
					(matchup) =>
						matchup.winner_team_id !== null || matchup.teams.length > 0
				)
				.map((matchup) => ({
					winner_team_id: matchup.winner_team_id,
					matchup_id: matchup.id,
					teams: matchup.teams.map((team) => ({
						id: team.id,
						slot: team.slot,
						seed: team.seed,
					})),
				}))
		);
		submitUpdateData({
			bracket_challenge_id: bracketChallenge.id,
			matchups: matchups,
		});
	}, [rounds, bracketChallenge.id]);

	const resetBracket = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.put(
				`/admin/bracket-challenges/${bracketChallenge.id}/reset`
			);
			setRounds(response.data.rounds);
			setSuccess(response.data.message);
		} catch (error: any) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<BracketContext.Provider
			value={{
				rounds,
				error,
				success,
				isLoading,
				mode,
				league,
				resetMessage,
				updatePick,
				updateFinalsPick,
				resetPicks,
				updateBracket,
				resetBracket,
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
