import type { AnyPlayoffsTeamInfo } from "../../data/adminData";
import { useBracket } from "../../context/bracket/BracketProvider";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { getTeamLogoSrc } from "../../utils/imageService";

interface TeamSlotProps {
	team: AnyPlayoffsTeamInfo | null;
	// slot: number;
	roundIndex?: number;
	matchupIndex?: number;
	conference?: "EAST" | "WEST";
	isClickable: boolean;
	placeholderText: string;
	alignment?: "left" | "right" | "center";
	slotMode: "predicted" | "mistaken" | "selected" | "active";
}

const TeamSlot = ({
	team,
	// slot,
	roundIndex,
	matchupIndex,
	conference,
	isClickable,
	slotMode,
	alignment,
	placeholderText,
}: TeamSlotProps) => {
	const { updatePick, mode } = useBracket();

	const containerRef = useRef<HTMLDivElement>(null);
	const hasAnimated = useRef<boolean>(false);

	useEffect(() => {
		if (mode == "preview") return;

		if (team) {
			if (hasAnimated.current) {
				//..
				if (containerRef.current) {
					// gsap.killTweensOf(containerRef.current);
					gsap.set(containerRef.current, { scale: 1 });
				}
			} else {
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
					hasAnimated.current = true;
				}
			}
		} else {
			hasAnimated.current = false;
		}
		return () => {
			if (containerRef.current) {
				gsap.killTweensOf(containerRef.current);
			}
		};
	}, [team]);

	const handleClick = () => {
		if (!team) return;
		if (isClickable) {
			updatePick(
				conference || null,
				roundIndex || 0,
				matchupIndex || 0,
				team
			);
		}
	};

	const hoverClass =
		isClickable && slotMode == "active"
			? "cursor-pointer hover:bg-gray-500"
			: "";

	const flexDirectionClass =
		alignment == "right" ? "flex-row-reverse" : "flex-row";

	const flexAlignment = alignment == "center" ? "justify-center" : "";

	const getstyle = () => {
		switch (slotMode) {
			case "predicted":
				return "bg-green-700 border-green-400";
			case "mistaken":
				return "bg-red-800 border-red-500";
			case "selected":
				return "bg-yellow-700 border-yellow-600";
			case "active":
				return "bg-gray-600 border-gray-500";
			default:
				return "";
		}
	};

	return (
		<div
			ref={containerRef}
			className={`border rounded shadow text-white select-none h-10 overflow-hidden flex items-center gap-x-1.5 ${flexDirectionClass} ${flexAlignment} ${hoverClass} ${getstyle()}`}
			onClick={handleClick}
		>
			{team ? (
				<>
					<div className="h-full px-0.5 bg-gray-300">
						<img
							src={getTeamLogoSrc(team.logo || "")}
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
				<span className="text-xs px-2 font-semibold text-gray-400">
					{placeholderText}
				</span>
			)}
		</div>
	);
};
export default TeamSlot;
