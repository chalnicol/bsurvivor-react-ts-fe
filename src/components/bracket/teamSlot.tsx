import type { AnyPlayoffsTeamInfo } from "../../data/adminData";

interface TeamSlotProps {
	team: AnyPlayoffsTeamInfo | null;
	slot: number;
	roundIndex?: number;
	matchupIndex?: number;
	conference?: "EAST" | "WEST";
	isActive: boolean;
	isSelected: boolean;
	placeholderText: string;
	alignment?: "left" | "right" | "center";
}

const TeamSlot = ({
	team,
	slot,
	roundIndex,
	matchupIndex,
	conference,
	isActive,
	isSelected,
	alignment,
	placeholderText,
}: TeamSlotProps) => {
	const getImageURL = (logo: string) => {
		//get nba logo if team logo is undefined
		if (logo == "") return "/images/generic_logo.png";

		return logo;
	};

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

	const handleClick = () => {
		if (isActive) {
			console.log("hey", slot, roundIndex, matchupIndex, conference);
		}
	};

	return (
		<div
			className={`border border-gray-400 rounded shadow select-none min-h-10 flex items-center overflow-hidden bg-white ${getAlignment()}`}
		>
			{team ? (
				<div
					className={`flex items-center gap-x-2 w-full h-full px-2 ${
						alignment == "right" ? "flex-row-reverse" : ""
					} ${getAlignment()} ${
						isSelected ? "bg-yellow-100" : "bg-white "
					}  ${
						isActive && !isSelected
							? "cursor-pointer hover:bg-yellow-50"
							: ""
					}`}
					title={team.name}
					onClick={handleClick}
				>
					<img
						src={getImageURL(team.logo || "")}
						alt={team.abbr}
						className="h-6"
					/>
					<p className="text-lg font-bold">{team.abbr}</p>
					{team.seed && (
						<p
							className={`text-xs px-1 font-bold text-[0.6rem] leading-4 w-4 h-4 text-center rounded-full bg-gray-600 text-white ${
								alignment == "right" ? "me-auto" : "ms-auto"
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
export default TeamSlot;
