import React, { useCallback, useContext, useState } from "react";
import { BracketContext } from "./BracketContext";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsRoundInfo,
} from "../../data/adminData";

interface BracketProviderProps {
	data: PlayoffsRoundInfo[];
	isPreview: boolean;
	children: React.ReactNode;
}

export const BracketProvider: React.FC<BracketProviderProps> = ({
	data,
	isPreview,
	children,
}) => {
	const [rounds, setRounds] = useState<PlayoffsRoundInfo[] | null>(data);

	const resetPicks = () => {
		setRounds(data);
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

	return (
		<BracketContext.Provider
			value={{
				rounds,
				isPreview,
				updatePick,
				updateFinalsPick,
				resetPicks,
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
