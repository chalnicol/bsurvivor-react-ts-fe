import type { AnyPlayoffsTeamInfo } from "../../data/adminData";
import { getTeamLogoSrc } from "../../utils/imageService";

interface TeamSlotCenterProps {
	team: AnyPlayoffsTeamInfo;
	isSelected: boolean;
}

const TeamSlotCenter = ({ team, isSelected }: TeamSlotCenterProps) => {
	const getTextClass = (): string => {
		if (team) {
			const fullName = `${team.fname} ${team.lname}`;
			if (fullName.length >= 24) return "text-sm";
		}
		return "text-lg";
	};

	const bgClass = !isSelected ? "bg-gray-400" : "";
	return (
		<div className={`w-full h-full relative ${bgClass}`}>
			<img
				src={getTeamLogoSrc(team.logo || "")}
				alt={team.abbr}
				className="h-20 w-auto aspect-square object-contain absolute top-1/2 left-[30%] -translate-y-1/2 -translate-x-1/2"
			/>
			<div
				className={`absolute font-bold leading-[1.1rem] text-wrap text-white text-shadow-sm w-[60%] text-shadow-black right-[5%] top-1/2 -translate-y-1/2 ${getTextClass()}`}
			>
				{team.fname} {team.lname}
			</div>
		</div>
	);
};

export default TeamSlotCenter;
