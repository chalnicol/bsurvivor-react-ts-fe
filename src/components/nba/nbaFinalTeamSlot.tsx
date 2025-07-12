import { nbaTeams, type NBAPlayoffsTeamInfo } from "../../data/nbaData";
import { useContext } from "react";
import { NBAPlayoffsContext } from "../../context/nba/NBAPlayoffsContext";

interface NBAFinalsTeamSlotProps {
	team?: NBAPlayoffsTeamInfo | undefined;
	active?: boolean | false; // Optional prop to enable/disable the slot
	isSelected?: boolean | false;
	placeholderText: string | "-empty-";
}

const NBAFinalsTeamSlot = ({
	team,
	isSelected,
	active,
	placeholderText,
}: NBAFinalsTeamSlotProps) => {
	const { updateFinalsPick } = useContext(NBAPlayoffsContext);

	const getImageURL = (logo: string | undefined) => {
		//get nba logo if team logo is undefined
		if (!logo)
			return "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg";
		return logo;
	};

	const teamInfo = team ? nbaTeams.find((t) => t.id === team.id) : undefined;

	return (
		<div
			className={`border border-gray-400 rounded shadow select-none h-12 flex justify-center items-center overflow-hidden bg-white`}
		>
			{teamInfo ? (
				<div
					className={`flex items-center justify-center w-full h-full px-2 ${
						isSelected ? "bg-yellow-100" : "bg-white "
					}  ${
						active && !isSelected
							? "cursor-pointer hover:bg-yellow-50"
							: ""
					}`}
					title={teamInfo.name}
					onClick={() => {
						if (active && team) {
							console.log("finals picked", team.id);
							updateFinalsPick(team);
						}
					}}
				>
					<img
						src={getImageURL(teamInfo.logo)}
						alt={teamInfo.abbr}
						className="h-9"
					/>
					<p className="text-lg font-bold">{teamInfo.abbr}</p>
				</div>
			) : (
				<span className="text-xs font-bold px-2 text-gray-500">
					{placeholderText}
				</span>
			)}
		</div>
	);
};
export default NBAFinalsTeamSlot;
