import React, { useReducer, useCallback, useMemo, useContext } from "react";
import {
	NBAPlayoffsContext,
	type NBAPlayoffsContextType,
} from "./_NBAPlayoffsContext";
import type {
	NBAPlayoffsConferenceInfo,
	NBAPlayoffsMatchupInfo,
	NBAPlayoffsRoundsInfo,
	NBAPlayoffsTeamInfo,
} from "../../data/nbaData";

import { nbaPlayoffSeeding } from "../../data/nbaData";

// Define action types for the reducer
type PlayoffsAction =
	| {
			type: "UPDATE_PICKED_TEAM";
			payload: {
				bracket: "EAST" | "WEST" | "FINALS";
				round: number;
				matchup: number;
				team: NBAPlayoffsTeamInfo;
			};
	  }
	| {
			type: "RESET_BRACKETS";
	  }
	| {
			type: "UPDATE_FINALS_PICK";
			payload: {
				team: NBAPlayoffsTeamInfo;
			};
	  };

const createEmptyMatchups = (count: number): NBAPlayoffsMatchupInfo[] => {
	const emptyMatchups: NBAPlayoffsMatchupInfo[] = [];

	for (let i = 0; i < count; i++) {
		const newEmptyMatchup: NBAPlayoffsMatchupInfo = {
			id: i + 1,
			teams: Array.from({ length: 2 }),
		};
		emptyMatchups.push(newEmptyMatchup);
	}
	return emptyMatchups;
};

const getTargetNextRoundMatchupIndex = (
	bracket: string,
	round: number,
	matchup: number
): number => {
	if (bracket !== "FINALS" && round < 3 && (matchup == 2 || matchup == 4))
		return 1;

	if (bracket == "WEST" && round >= 3) return 1;

	return 0;
};

const createInitialBracket = (): NBAPlayoffsConferenceInfo[] => {
	const initialBracketData: NBAPlayoffsConferenceInfo[] = [];

	for (const { conference, teams } of nbaPlayoffSeeding) {
		//create initial matchups..
		const initialMatchups: NBAPlayoffsMatchupInfo[] = [];

		const pairings = [
			{ seed1: 1, seed2: 8 }, // teams[0] vs teams[7]
			{ seed1: 4, seed2: 5 }, // teams[3] vs teams[4]
			{ seed1: 3, seed2: 6 }, // teams[2] vs teams[5]
			{ seed1: 2, seed2: 7 }, // teams[1] vs teams[6]
		];

		pairings.forEach((pair, index) => {
			const team1Id = teams[pair.seed1 - 1]; // -1 because seeds are 1-based, array is 0-based
			const team2Id = teams[pair.seed2 - 1];

			// Basic check for valid teams (optional, but good for robustness)
			if (team1Id === undefined || team2Id === undefined) {
				console.warn(
					`Could not find teams for matchup ${pair.seed1} vs ${pair.seed2} in ${conference}`
				);
				return; // Skip this matchup if teams aren't found
			}

			initialMatchups.push({
				id: index + 1,
				teams: [
					{ id: team1Id, seed: pair.seed1 },
					{ id: team2Id, seed: pair.seed2 },
				],
				// picked: undefined, // You might explicitly set this if your interface requires it
			});
		});

		const initialRounds: NBAPlayoffsRoundsInfo[] = [];

		//create rounds..
		for (let i = 0; i < 3; i++) {
			const newRound: NBAPlayoffsRoundsInfo = {
				id: i + 1,
				matchups:
					i == 0
						? initialMatchups
						: createEmptyMatchups(4 / Math.pow(2, i)),
			};
			initialRounds.push(newRound);
		}

		//push rounds created to brackets data..
		initialBracketData.push({
			conference: conference,
			rounds: initialRounds,
		});
	}

	initialBracketData.push({
		conference: "FINALS",
		rounds: [
			{
				id: 1,
				matchups: createEmptyMatchups(1),
			},
		],
	});

	return initialBracketData;
};

// The core reducer function
const playoffsReducer = (
	state: NBAPlayoffsConferenceInfo[],
	action: PlayoffsAction
): NBAPlayoffsConferenceInfo[] => {
	switch (action.type) {
		case "UPDATE_PICKED_TEAM":
			const { bracket, round, matchup, team } = action.payload;

			let newState = state.map((b) => {
				if (b.conference === bracket) {
					return {
						...b,
						rounds: b.rounds.map((r) => {
							if (r.id === round) {
								return {
									...r,
									matchups: r.matchups.map((m) => {
										if (m.id === matchup) {
											const isValidPick = m.teams.some(
												(t) => t.id === team.id
											);
											if (!isValidPick) {
												console.warn(
													`Invalid pick: Team ID ${team.id} is not in matchup ${matchup}.`
												);
												return m; // Return original matchup if pick is invalid
											}
											console.log(
												`Picked team ${team.id} for matchup ${matchup} in Round ${round} (${bracket}).`
											);
											return { ...m, picked: team.id };
										}
										return m;
									}),
								};
							}
							return r;
						}),
					};
				}
				return b;
			});

			if (bracket !== "FINALS") {
				const targetBracket: string = round >= 3 ? "FINALS" : bracket;
				const targetNextRound: number = round >= 3 ? 1 : round + 1;
				const targetNextRoundMatchup: number = matchup >= 3 ? 2 : 1;

				let targetNextRoundMatchupIndex: number =
					getTargetNextRoundMatchupIndex(bracket, round, matchup);
				// if (matchup == 2 || matchup == 4) targetNextRoundMatchupIndex = 1;

				// console.log("m", targetNextRoundMatchup);
				newState = newState.map((b) => {
					if (b.conference === targetBracket) {
						return {
							...b,
							rounds: b.rounds.map((r) => {
								if (r.id === targetNextRound) {
									return {
										...r,
										matchups: r.matchups.map((m) => {
											if (m.id === targetNextRoundMatchup) {
												//
												const toChange = m.teams;
												toChange[targetNextRoundMatchupIndex] =
													team;
												return {
													...m,
													teams: toChange,
												};
											}
											return m;
										}),
									};
								}
								return r;
							}),
						};
					}
					return b;
				});
			}
			return newState;

		case "UPDATE_FINALS_PICK":
			const { team: newTeam } = action.payload;

			const finalsState = state.map((b) => {
				if (b.conference === "FINALS") {
					return {
						...b,
						rounds: b.rounds.map((r) => {
							if (r.id === 1) {
								return {
									...r,
									matchups: r.matchups.map((m) => {
										if (m.id === 1) {
											return {
												...m,
												picked: newTeam.id,
											};
										}
										return m;
									}),
								};
							}
							return r;
						}),
					};
				}
				return b;
			});

			return finalsState;

		case "RESET_BRACKETS":
			return createInitialBracket();
		default:
			return state;
	}
};

interface NBAPlayoffsProviderProps {
	children: React.ReactNode;
}

export const NBAPlayoffsProvider: React.FC<NBAPlayoffsProviderProps> = ({
	children,
}) => {
	const [data, dispatch] = useReducer(playoffsReducer, createInitialBracket());

	// Memoized action dispatchers
	const updatePickedTeam = useCallback(
		(
			bracket: "EAST" | "WEST" | "FINALS",
			round: number,
			matchup: number,
			team: NBAPlayoffsTeamInfo
		) => {
			dispatch({
				type: "UPDATE_PICKED_TEAM",
				payload: { bracket, round, matchup, team },
			});
		},
		[dispatch]
	); // No dependencies, as dispatch is stable

	const updateFinalsPick = useCallback(
		(team: NBAPlayoffsTeamInfo) => {
			dispatch({
				type: "UPDATE_FINALS_PICK",
				payload: { team },
			});
		},
		[dispatch]
	);

	const resetBrackets = useCallback(() => {
		dispatch({
			type: "RESET_BRACKETS",
		});
	}, [dispatch]);

	// Memoize the context value
	const contextValue: NBAPlayoffsContextType = useMemo(
		() => ({
			data,
			updatePickedTeam,
			updateFinalsPick,
			resetBrackets,
		}),
		[data, updatePickedTeam, updateFinalsPick, resetBrackets]
	); // Dependencies

	return (
		<NBAPlayoffsContext.Provider value={contextValue}>
			{children}
		</NBAPlayoffsContext.Provider>
	);
};

export const useNBABracket = () => {
	const context = useContext(NBAPlayoffsContext);
	if (context === undefined) {
		throw new Error("useNBABracket must be used within an AdminProvider");
	}
	return context;
};
