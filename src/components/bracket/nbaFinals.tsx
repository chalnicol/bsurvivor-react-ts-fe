import TeamSlot from "./teamSlot";
import { useEffect, useState } from "react";
import nbaThrophy from "../../assets/nba_trophy.png";
import nbaLogo from "../../assets/nba.png";
import type { AnyPlayoffsTeamInfo } from "../../data/adminData";
import { useBracket } from "../../context/bracket/BracketProvider";

const NBAFinals = () => {
	const { rounds } = useBracket();

	const [team1, setTeam1] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [team2, setTeam2] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [winningTeam, setWinningTeam] = useState<AnyPlayoffsTeamInfo | null>(
		null
	);

	useEffect(() => {
		if (!rounds) return;

		const finalRound =
			rounds.find((round) => round.name === "Finals") || null;

		if (finalRound && finalRound.matchups.length > 0) {
			setTeam1(
				finalRound.matchups[0].teams.find((t) => t.slot == 1) || null
			);
			setTeam2(
				finalRound.matchups[0].teams.find((t) => t.slot == 2) || null
			);
		}
	}, [rounds]);

	return (
		<>
			<div className="text-center space-y-10 select-none min-w-44">
				<div>
					<div className="font-bold text-lg mb-1 flex items-center gap-x-2 justify-center">
						<span>NBA </span>
						<img src={nbaLogo} alt="finals" className="h-8" />
						<span>FINALS</span>
					</div>
					<div className="space-y-2 w-full">
						<TeamSlot
							team={team1}
							slot={1}
							alignment="center"
							isSelected={false}
							isActive={false}
							placeholderText="EAST WINNER"
						/>
						<TeamSlot
							team={team2}
							slot={2}
							alignment="center"
							isSelected={false}
							isActive={false}
							placeholderText="WEST WINNER"
						/>
						{/* <p>NBA FINALS MATCHUP</p> */}
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-center gap-x-1 font-bold text-lg">
						<span className="">NBA</span>
						<img src={nbaThrophy} alt="finals" className="h-8" />
						<span>CHAMPION</span>
					</div>
					<div className="border border-gray-500 rounded bg-white shadow h-16 flex items-center justify-center overflow-hidden">
						{winningTeam ? (
							// <span>{winningTeam.name}</span>
							<div>
								<div
									className="flex items-center"
									title={winningTeam.name}
								>
									<img
										src={winningTeam.logo ?? ""}
										alt={winningTeam.abbr}
										className="h-10"
									/>
									<p className="font-bold text-2xl">
										{winningTeam.abbr}
									</p>
								</div>
							</div>
						) : (
							//insert nba logo image
							<p className="text-sm font-bold text-gray-500">
								EAST VS WEST WINNER
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default NBAFinals;
