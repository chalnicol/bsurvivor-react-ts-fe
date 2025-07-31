import TeamSlot from "./teamSlot";
import { useEffect, useState } from "react";

import pbaThrophy from "../../assets/pba_trophy.png";
import pbaLogo from "../../assets/pba.png";
import { useBracket } from "../../context/bracket/BracketProvider";

import type { AnyPlayoffsTeamInfo } from "../../data/adminData";

interface PBAFinalsProps {
	className?: string;
}
const PBAFinals = ({ className }: PBAFinalsProps) => {
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
			<div className={`text-center space-y-10 select-none ${className}`}>
				<div>
					<div className="font-bold text-lg mb-1 flex items-center gap-x-2 justify-center">
						<img src={pbaLogo} alt="finals" className="h-5" />
						<span>FINALS</span>
					</div>
					<div className="space-y-2 w-full">
						<TeamSlot
							team={team1}
							slot={1}
							alignment="center"
							isSelected={false}
							isActive={false}
							placeholderText="R2M1 WINNER"
						/>
						<div className="my-6 border border-gray-400 rounded shadow bg-white px-3 py-2 space-y-2">
							<div className="flex items-center justify-center gap-x-1 font-bold text-lg">
								<span className="">PBA</span>
								<img src={pbaThrophy} alt="finals" className="h-8" />
								<span>CHAMPION</span>
							</div>
							<hr className="border-gray-400" />
							<p className="">WINNER</p>
						</div>

						<TeamSlot
							team={team2}
							slot={2}
							alignment="center"
							isSelected={false}
							isActive={false}
							placeholderText="R2M2 WINNER"
						/>
						{/* <p>NBA FINALS MATCHUP</p> */}
					</div>
				</div>
			</div>
		</>
	);
};

export default PBAFinals;
