import { nbaTeams, type NBAPlayoffsTeamInfo } from "../../data/nbaData";
import { useContext } from "react";
import { NBAPlayoffsContext } from "../../context/nba/NBAPlayoffsContext";

interface NBATeamSlotProps {
	bracket: "EAST" | "WEST" | "FINALS";
	round: number;
	matchup: number;
	team?: NBAPlayoffsTeamInfo | undefined;
	alignment: "left" | "right" | "center";
	active?: boolean | false; // Optional prop to enable/disable the slot
	isSelected?: boolean | false;
	placeholderText: string | "-empty-";
}

const NBATeamSlot = ({
	bracket,
	round,
	matchup,
	team,
	alignment,
	active,
	isSelected,
	placeholderText,
}: NBATeamSlotProps) => {
	const { updatePickedTeam } = useContext(NBAPlayoffsContext);

	const getImageURL = (logo: string | undefined) => {
		//get nba logo if team logo is undefined
		if (!logo)
			return "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg";
		return logo;
	};

	const teamInfo = team ? nbaTeams.find((t) => t.id === team.id) : undefined;

	const getAlignment = (): string => {
		switch (alignment) {
			case "right":
				return "justify-end";
			case "center":
				return "justify-center";
			default:
				return "";
		}
	};

	const getFlexPosition = (): string => {
		switch (alignment) {
			case "right":
				return "flex-row-reverse";
			default:
				return "";
		}
	};

	// console.log(alignment, "asdf");

	return (
		<div
			className={`border border-gray-400 rounded shadow select-none min-h-10 flex items-center overflow-hidden bg-white ${getAlignment()}`}
		>
			{teamInfo ? (
				<div
					className={`flex items-center gap-x-2 w-full h-full px-2 ${getFlexPosition()} ${getAlignment()} ${
						isSelected ? "bg-yellow-100" : "bg-white "
					}  ${
						active && !isSelected
							? "cursor-pointer hover:bg-yellow-50"
							: ""
					}`}
					title={teamInfo.name}
					onClick={() => {
						if (active && team) {
							// console.log("picked", team.id);
							updatePickedTeam(bracket, round, matchup, team);
						}
					}}
				>
					<img
						src={getImageURL(teamInfo.logo)}
						alt={teamInfo.abbr}
						className="h-6"
					/>
					<p className="text-lg font-bold">{teamInfo.abbr}</p>
					{bracket !== "FINALS" && team?.seed && (
						<p
							className={`text-xs px-1 font-bold text-[0.6rem] leading-4 w-4 h-4 text-center rounded-full bg-gray-600 text-white ${
								alignment == "left" ? "ms-auto" : "me-auto"
							}`}
						>
							{team?.seed}
						</p>
					)}
				</div>
			) : (
				<span className="text-xs px-2 font-semibold text-gray-600">
					{placeholderText}
				</span>
			)}
		</div>
	);
};
export default NBATeamSlot;
