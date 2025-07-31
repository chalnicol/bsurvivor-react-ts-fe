import React, { useContext } from "react";
import { BracketContext } from "./BracketContext";
import type { PlayoffsRoundInfo } from "../../data/adminData";

interface BracketProviderProps {
	rounds: PlayoffsRoundInfo[];
	children: React.ReactNode;
}

export const BracketProvider: React.FC<BracketProviderProps> = ({
	rounds,
	children,
}) => {
	const resetRounds = () => {
		console.log("hey");
	};

	// const updatePick = useCallback(
	// 	(
	// 		conference: "east" | "west",
	// 		roundIndex: number,
	// 		matchupIndex: number,
	// 		team: NBAPlayoffsTeamsInfo
	// 	) => {
	// 		setBracketData((prev) => {
	// 			if (prev) {
	// 				const nextRoundIndex = roundIndex + 1;
	// 				const nextMatchupIndex = matchupIndex <= 2 ? 1 : 2;
	// 				const teamSlot = matchupIndex % 2 === 0 ? "team1" : "team2";

	// 				let newConference = prev[conference];

	// 				newConference.rounds.map((r) => {
	// 					if (r.roundIndex === roundIndex) {
	// 						const newMatchup = r.matchups.map((m) => {
	// 							if (m.matchupIndex === matchupIndex) {
	// 								return { ...m, picked: team.id };
	// 							}
	// 							return m;
	// 						});
	// 						return { ...r, matchups: newMatchup };
	// 					}
	// 					return r;
	// 				});

	// 				newConference.rounds.map((r) => {
	// 					if (r.roundIndex === nextRoundIndex) {
	// 						const newMatchup = r.matchups.map((m) => {
	// 							if (m.matchupIndex === nextMatchupIndex) {
	// 								return { ...m, [teamSlot]: team };
	// 							}
	// 							return m;
	// 						});
	// 						return { ...r, matchups: newMatchup };
	// 					}
	// 					return r;
	// 				});

	// 				return { ...prev, [conference]: newConference };
	// 			}
	// 			return prev;
	// 		});
	// 	},
	// 	[]
	// );

	// const updateFinalsPick = useCallback((team: NBAPlayoffsTeamInfo) => {
	// 	//..
	// 	setBracketData((prev) => {
	// 		if (prev) {
	// 			let newFinals = prev.finals;
	// 			newFinals.matchup.winner_team_id = team.id;
	// 			newFinals.champion = team;
	// 			return { ...prev, finals: newFinals };
	// 		}
	// 		return prev;
	// 	});
	// }, []);

	return (
		<BracketContext.Provider
			value={{
				rounds,
				resetRounds,
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
