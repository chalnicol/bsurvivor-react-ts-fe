import TeamSlot from "./teamSlot";
import { useCallback, useEffect, useRef, useState } from "react";
import pbaThrophy from "../../assets/pba_trophy.png";
import nbaThrophy from "../../assets/nba_trophy.png";
import { useBracket } from "../../context/bracket/BracketProvider";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsMatchupInfo,
} from "../../data/adminData";
import gsap from "gsap";
import TeamSlotCenter from "./teamSlotCenter";

interface PBAFinalsProps {
	league: "NBA" | "PBA";
	className?: string;
}

const Finals = ({ league, className }: PBAFinalsProps) => {
	const { rounds, mode } = useBracket();

	const [matchup, setMatchup] = useState<PlayoffsMatchupInfo | null>(null);

	const [teamA, setTeamA] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [teamB, setTeamB] = useState<AnyPlayoffsTeamInfo | null>(null);

	const [winningTeam, setWinningTeam] = useState<AnyPlayoffsTeamInfo | null>(
		null
	);

	const winningTeamRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!rounds) return;

		const finalRound =
			rounds.find((round) => round.name === "Finals") || null;

		if (finalRound && finalRound.matchups.length > 0) {
			setMatchup(finalRound.matchups[0]);
			setTeamA(
				finalRound.matchups[0].teams.find((t) => t.slot == 1) || null
			);
			setTeamB(
				finalRound.matchups[0].teams.find((t) => t.slot == 2) || null
			);

			setWinningTeam(
				finalRound.matchups[0].teams.find(
					(t) => t.id == matchup?.winner_team_id
				) || null
			);
		}
	}, [rounds]);

	useEffect(() => {
		if (mode === "preview") return;
		if (winningTeam && winningTeamRef.current) {
			gsap.fromTo(
				winningTeamRef.current,
				{ scale: 0 },
				{ scale: 1, duration: 0.5, ease: "elastic.out(1.1, 0.6)" }
			);
		}
	}, [winningTeam, winningTeamRef.current]);

	const isClickable = useCallback(() => {
		if (matchup) {
			return matchup.teams.length >= 2 && matchup.winner_team_id == null;
		}
		return false;
	}, [matchup]);

	const isSelected = useCallback(
		(teamId: number): boolean => {
			if (matchup) {
				return matchup.winner_team_id == teamId;
			}
			return false;
		},
		[matchup]
	);

	return (
		<>
			<div className={`select-none w-48 ${className}`}>
				<div>
					<div className="font-bold text-white text-base mb-0.5 text-center">
						{league} FINALS
					</div>
					<div className="space-y-2 w-full">
						<TeamSlot
							team={teamA}
							alignment="center"
							isSelected={isSelected(teamA?.id || 0)}
							isClickable={isClickable()}
							placeholderText={
								league == "NBA" ? "EAST WINNER" : "R2M1 WINNER"
							}
						/>
						<TeamSlot
							team={teamB}
							alignment="center"
							isSelected={isSelected(teamB?.id || 0)}
							isClickable={isClickable()}
							placeholderText={
								league == "NBA" ? "WEST WINNER" : "R2M2 WINNER"
							}
						/>
					</div>
				</div>
				{/* winning team */}
				<div className="mt-6 text-white">
					<div className="flex items-center justify-center gap-x-1 mb-2 font-bold text-xl">
						<span className="">{league}</span>
						<img
							src={league == "NBA" ? nbaThrophy : pbaThrophy}
							alt="finals"
							className="h-9"
						/>
						<span>CHAMPION</span>
					</div>
					<div
						ref={winningTeamRef}
						className={`border-2 rounded shadow relative whitespace-nowrap h-12 overflow-hidden ${
							winningTeam
								? "border-yellow-600 bg-yellow-700"
								: "border-gray-300 bg-gray-600"
						}`}
					>
						{winningTeam ? (
							<TeamSlotCenter team={winningTeam} isSelected={true} />
						) : (
							<p className=" font-semibold text-gray-400 h-full flex items-center justify-center">
								FINALS WINNER
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Finals;
