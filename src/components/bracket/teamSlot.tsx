import type { AnyPlayoffsTeamInfo } from "../../data/adminData";
import { useBracket } from "../../context/bracket/BracketProvider";
import gsap from "gsap";
import { useEffect, useRef } from "react";

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
	const { updatePick, updateFinalsPick, activeControls } = useBracket();

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!activeControls) return;
		if (team && containerRef.current) {
			if (roundIndex !== 1) {
				gsap.fromTo(
					containerRef.current,
					{ scale: 0 },
					{ scale: 1, duration: 0.5, ease: "elastic.out(1.1, 0.6)" }
				);
			}
		}
		return () => {
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
		};
	}, [roundIndex, team, containerRef.current]);

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
		if (isClickable) {
			if (!team) return;

			if (roundIndex && matchupIndex) {
				// console.log("hey", slot, roundIndex, matchupIndex, conference);

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
		isClickable && !isSelected ? "cursor-pointer hover:bg-yellow-50" : "";

	const selectClass = isSelected ? "bg-yellow-100" : "";

	const flexDirectionClass = alignment == "right" ? "flex-row-reverse" : "";

	return (
		<div
			ref={containerRef}
			className={`border rounded shadow select-none h-10 flex items-center overflow-hidden bg-white ${
				isSelected ? "border-red-600" : "border-gray-300"
			} ${getAlignment()}`}
		>
			{team ? (
				<div
					className={`flex items-center gap-x-2 w-full h-full px-2 ${flexDirectionClass} ${selectClass} ${getAlignment()} ${hoverClass}`}
					title={`${team.fname} ${team.lname}`}
					onClick={handleClick}
				>
					<img
						src={getImageURL(team.logo || "")}
						alt={team.abbr}
						className="h-6"
					/>
					<p className="text-lg font-bold">{team.abbr}</p>
					{alignment !== "center" && team.seed && (
						<p
							className={`text-xs px-1 font-bold text-[0.6rem] leading-4 w-4 h-4 text-center rounded-full bg-gray-600 text-white ${
								alignment == "right" ? "me-auto" : "ms-auto"
							}`}
						>
							{team.seed}
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
