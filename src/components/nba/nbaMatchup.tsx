import type { NBAPlayoffsMatchupInfo } from "../../data/nbaData";
import NBATeamSlot from "../nba/nbaTeamSlot";

interface NBAMatchupProps {
	round: number;
	conference: "EAST" | "WEST";
	matchup: NBAPlayoffsMatchupInfo;
	alignment: "left" | "right";
}
const NBAMatchup = ({
	conference,
	round,
	matchup,
	alignment,
}: NBAMatchupProps) => {
	// console.log(matchup.picked);

	const getPlaceholderText = (
		conference: "EAST" | "WEST",
		round: number,
		matchupId: number,
		index: number
	): string => {
		const conferenceTxt = conference === "EAST" ? "E" : "W";

		const originMatchup =
			matchupId == 2 ? matchupId + index + 1 : matchupId + index;

		const originRound = round > 1 ? round - 1 : round;

		return `${conferenceTxt}-R${originRound}-M${originMatchup} Winner`;
	};

	return (
		<div className="flex flex-col gap-y-1 select-none">
			{matchup.teams.map((team, index) => (
				<NBATeamSlot
					key={index}
					bracket={conference}
					round={round}
					matchup={matchup.id}
					team={team}
					alignment={alignment}
					active={
						matchup.teams.every((t) => t != undefined) &&
						matchup.picked == undefined
					}
					isSelected={
						matchup.picked !== undefined &&
						matchup.picked === matchup.teams[index].id
					}
					placeholderText={getPlaceholderText(
						conference,
						round,
						matchup.id,
						index
					)}
				/>
			))}

			<p
				className={`text-[10px] text-gray-600 font-semibold ${
					alignment == "left" ? "text-left" : "text-right"
				}`}
			>
				Match ID :{" "}
				<span className="text-red-800">{`${
					conference == "EAST" ? "E" : "W"
				}-R${round}-M${matchup.id}`}</span>
			</p>
		</div>
	);
};
export default NBAMatchup;
