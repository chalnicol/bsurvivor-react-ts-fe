import { useCallback, useEffect, useState } from "react";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsMatchupInfo,
} from "../../data/adminData";
import TeamSlot from "./teamSlot";

interface MatchupProps {
	roundIndex: number;
	matchup: PlayoffsMatchupInfo | null;
	conference?: "EAST" | "WEST";
}
const Matchup = ({ matchup, roundIndex, conference }: MatchupProps) => {
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

	return (
		<>
			<div>
				<div className="space-y-1">
					<TeamSlot
						team={team1}
						slot={1}
						roundIndex={roundIndex}
						matchupIndex={matchup.matchup_index}
						conference={conference}
						isActive={false}
						isSelected={false}
						alignment={alignment}
						placeholderText={getPlaceHolderText(1)}
					/>
					<TeamSlot
						team={team2}
						slot={2}
						roundIndex={roundIndex}
						matchupIndex={matchup.matchup_index}
						conference={conference}
						isActive={false}
						isSelected={false}
						alignment={alignment}
						placeholderText={getPlaceHolderText(2)}
					/>
				</div>

				<p
					className={`text-[10px] mt-0.5 px-0.5 text-gray-600 font-semibold ${textAlignment}`}
				>
					Match ID : <span className="text-red-800">{matchup.name}</span>
				</p>
			</div>
		</>
	);
};
export default Matchup;
