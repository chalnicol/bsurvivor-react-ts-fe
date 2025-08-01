import TeamSlot from "./teamSlot";
import { useCallback, useEffect, useState } from "react";

import pbaThrophy from "../../assets/pba_trophy.png";
import pbaLogo from "../../assets/pba.png";
import nbaThrophy from "../../assets/nba_trophy.png";
import nbaLogo from "../../assets/nba.png";

import { useBracket } from "../../context/bracket/BracketProvider";

import type {
	AnyPlayoffsTeamInfo,
	PlayoffsMatchupInfo,
} from "../../data/adminData";
import { getTeamLogoSrc } from "../../utils/imageService";

interface PBAFinalsProps {
	league: "NBA" | "PBA";
	className?: string;
}
const Finals = ({ league, className }: PBAFinalsProps) => {
	const { rounds } = useBracket();

	const [matchup, setMatchup] = useState<PlayoffsMatchupInfo | null>(null);

	const [teamA, setTeamA] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [teamB, setTeamB] = useState<AnyPlayoffsTeamInfo | null>(null);

	const [winningTeam, setWinningTeam] = useState<AnyPlayoffsTeamInfo | null>(
		null
	);

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
			<div
				className={`text-center space-y-10 select-none w-44 ${className}`}
			>
				<div>
					<div className="font-bold text-lg mb-1 flex items-center gap-x-2 justify-center">
						<img
							src={league == "NBA" ? nbaLogo : pbaLogo}
							alt="finals"
							className={`${league == "NBA" ? "h-7" : "h-5"}`}
						/>
						<span>FINALS</span>
					</div>
					<div className="space-y-2 w-full">
						<TeamSlot
							team={teamA}
							slot={1}
							alignment="center"
							isSelected={isSelected(teamA?.id || 0)}
							isClickable={isClickable()}
							placeholderText={
								league == "NBA" ? "EAST WINNER" : "R2M1 WINNER"
							}
						/>

						<TeamSlot
							team={teamB}
							slot={2}
							alignment="center"
							isSelected={isSelected(teamB?.id || 0)}
							isClickable={isClickable()}
							placeholderText={
								league == "NBA" ? "WEST WINNER" : "R2M2 WINNER"
							}
						/>
						{/* winning team */}
						<div className="mt-8">
							<div className="flex items-center justify-center gap-x-1 mb-1 font-bold">
								<span className="">{league}</span>
								<img
									src={league == "NBA" ? nbaThrophy : pbaThrophy}
									alt="finals"
									className="h-9"
								/>
								<span>CHAMPION</span>
							</div>
							<div className="border border-gray-400 rounded shadow bg-white px-3 py-2 space-y-2">
								{winningTeam ? (
									<div className="flex items-center justify-center gap-x-2">
										<img
											src={getTeamLogoSrc(winningTeam.logo || "")}
											alt={winningTeam.abbr}
											className="h-8 object-contain"
										/>
										<p className="text-2xl font-bold">
											{winningTeam.abbr}
										</p>
									</div>
								) : (
									<p className=" font-semibold h-8 flex items-center justify-center">
										- CHAMPION -
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Finals;
