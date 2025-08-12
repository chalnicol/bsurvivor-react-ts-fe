import { useCallback, useEffect, useState } from "react";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsMatchupInfo,
} from "../../data/adminData";
import TeamSlot from "./teamSlot";
import { useBracket } from "../../context/bracket/BracketProvider";

interface MatchupProps {
	roundIndex: number;
	matchup: PlayoffsMatchupInfo | null;
	conference?: "EAST" | "WEST";
}
const Matchup = ({ matchup, roundIndex, conference }: MatchupProps) => {
	const { mode } = useBracket();
	const alignment = conference === "WEST" ? "right" : "left";
	const textAlignment = conference === "WEST" ? "text-right" : "text-left";

	const [team1, setTeam1] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [team2, setTeam2] = useState<AnyPlayoffsTeamInfo | null>(null);

	useEffect(() => {
		if (!matchup) return;
		setTeam1(matchup.teams.find((t) => t.slot == 1) || null);
		setTeam2(matchup.teams.find((t) => t.slot == 2) || null);
	}, [matchup]);

	const getPlaceHolderText = useCallback(
		(slot: number) => {
			if (matchup) {
				const { matchup_index } = matchup;
				const originIndex = 2 * (matchup_index - 1) + slot;

				if (conference) {
					const conferenceFirstLetter = conference.charAt(0).toUpperCase();
					return `${conferenceFirstLetter}_R${
						roundIndex - 1
					}M${originIndex} WINNER`;
					//..
				} else {
					return `R${roundIndex - 1}M${originIndex} WINNER`;
				}
			}
			return "TEAM";
		},
		[roundIndex, matchup]
	);

	if (!matchup) return;

	const isClickable = useCallback(() => {
		if (mode !== "preview" && matchup) {
			return matchup.teams.length >= 2 && matchup.winner_team_id === null;
		}
		return false;
	}, [matchup]);

	const isSelected = useCallback(
		(teamId: number) => {
			if (matchup) {
				return matchup.winner_team_id === teamId;
			}
			return false;
		},
		[matchup]
	);

	return (
		<>
			<div>
				<div className="space-y-1.5">
					<TeamSlot
						team={team1}
						// slot={1}
						roundIndex={roundIndex}
						matchupIndex={matchup.matchup_index}
						conference={conference}
						isClickable={isClickable()}
						isSelected={isSelected(team1?.id || 0)}
						alignment={alignment}
						placeholderText={getPlaceHolderText(1)}
					/>
					<TeamSlot
						team={team2}
						// slot={2}
						roundIndex={roundIndex}
						matchupIndex={matchup.matchup_index}
						conference={conference}
						isClickable={isClickable()}
						isSelected={isSelected(team2?.id || 0)}
						alignment={alignment}
						placeholderText={getPlaceHolderText(2)}
					/>
				</div>

				<div
					className={`select-none text-[10px] mt-0.5 px-0.5 text-white font-semibold ${textAlignment}`}
				>
					Match ID : <span className="text-red-400">{matchup.name}</span>
				</div>
			</div>
		</>
	);
};
export default Matchup;
