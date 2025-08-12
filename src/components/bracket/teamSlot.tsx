import type { AnyPlayoffsTeamInfo } from "../../data/adminData";
import { useBracket } from "../../context/bracket/BracketProvider";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import TeamSlotCenter from "./teamSlotCenter";

interface TeamSlotProps {
	team: AnyPlayoffsTeamInfo | null;
	// slot: number;
	roundIndex?: number;
	matchupIndex?: number;
	conference?: "EAST" | "WEST";
	isClickable: boolean;
	isSelected: boolean;
	placeholderText: string;
	alignment?: "left" | "right" | "center";
}

const TeamSlot = ({
	team,
	// slot,
	roundIndex,
	matchupIndex,
	conference,
	isClickable,
	isSelected,
	alignment,
	placeholderText,
}: TeamSlotProps) => {
	const { updatePick, updateFinalsPick, mode } = useBracket();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (mode == "preview") return;
		if (team && roundIndex !== 1 && containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.5,
					ease: "elastic.out(1.1, 0.6)",
				}
			);
		}
		return () => {
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
		};
	}, [team]);

	const getImageURL = (logo: string) => {
		//get nba logo if team logo is undefined
		if (logo == "") return "/images/generic_logo.png";

		return logo;
	};

	const handleClick = () => {
		if (!team) return;
		if (isClickable) {
			if (roundIndex && matchupIndex) {
				updatePick(
					conference || null,
					roundIndex || 0,
					matchupIndex || 0,
					team
				);
			} else {
				console.log("finals pick");
				updateFinalsPick(team);
			}
		}
	};

	const hoverClass =
		isClickable && !isSelected ? "cursor-pointer hover:bg-gray-500" : "";

	const bgClass = isSelected ? "bg-yellow-700" : "bg-gray-600";

	const flexDirectionClass =
		alignment == "right" ? "flex-row-reverse" : "flex-row";

	const flexAlignment = alignment == "center" ? "justify-center" : "";

	const borderClass = isSelected ? "border-yellow-600" : "border-gray-300";

	return (
		<div
			ref={containerRef}
			className={`border rounded shadow text-white select-none h-10 overflow-hidden flex items-center gap-x-1.5 ${flexDirectionClass} ${flexAlignment} ${hoverClass} ${bgClass} ${borderClass}`}
			onClick={handleClick}
		>
			{team ? (
				<>
					{alignment !== "center" ? (
						<>
							<div className="h-full px-0.5 bg-gray-300">
								<img
									src={getImageURL(team.logo || "")}
									alt={team.abbr}
									className={`h-full w-auto aspect-square object-contain`}
								/>
							</div>
							<div
								className={`flex gap-x-[0.1rem] items-baseline ${flexDirectionClass}`}
							>
								<span className="text-[0.6rem] font-semibold">
									{team.seed}
								</span>
								<span className="text-2xl font-bold">{team.abbr}</span>
							</div>
						</>
					) : (
						<TeamSlotCenter team={team} isSelected={isSelected} />
					)}
				</>
			) : (
				<span className="text-xs px-2 font-semibold text-gray-400">
					{placeholderText}
				</span>
			)}
		</div>
	);
};
export default TeamSlot;
