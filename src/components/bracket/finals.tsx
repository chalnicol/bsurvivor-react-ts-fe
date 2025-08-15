import { useEffect, useState } from "react";
import pbaThrophy from "../../assets/pba_trophy.png";
import nbaThrophy from "../../assets/nba_trophy.png";
import { useBracket } from "../../context/bracket/BracketProvider";
import type { AnyPlayoffsTeamInfo } from "../../data/adminData";
import TeamSlotCenter from "./teamSlotCenter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface PBAFinalsProps {
	league: "NBA" | "PBA";
	className?: string;
}

const Finals = ({ league, className }: PBAFinalsProps) => {
	const { rounds, mode, clearFinalsMatchup } = useBracket();

	// const [matchup, setMatchup] = useState<PlayoffsMatchupInfo | null>(null);
	const [teamA, setTeamA] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [teamB, setTeamB] = useState<AnyPlayoffsTeamInfo | null>(null);
	const [winningTeam, setWinningTeam] = useState<AnyPlayoffsTeamInfo | null>(
		null
	);
	const [showClearButton, setShowClearButton] = useState<boolean>(false);

	const [isClickable, setIsClickable] = useState<boolean>(false);

	useEffect(() => {
		if (!rounds) return;

		const finalRounds = rounds.find((r) => r.name === "Finals");

		if (finalRounds) {
			const finalMatchup = finalRounds.matchups[0];

			// setMatchup(finalMatchup);
			setTeamA(finalMatchup.teams.find((t) => t.slot == 1) || null);
			setTeamB(finalMatchup.teams.find((t) => t.slot == 2) || null);
			setWinningTeam(
				finalMatchup.teams.find(
					(t) => t.id == finalMatchup.winner_team_id
				) || null
			);
			setIsClickable(
				mode !== "preview" &&
					finalMatchup.teams.length >= 2 &&
					finalMatchup.winner_team_id === null
			);
			setShowClearButton(
				mode !== "preview" && finalMatchup.teams.length >= 1
			);
		}
	}, [rounds]);

	const getTeamMode = (
		team: AnyPlayoffsTeamInfo | null
	): "active" | "mistaken" | "predicted" | "selected" => {
		if (!team || !rounds) {
			return "active";
		}

		const finalRounds = rounds.find((r) => r.name === "Finals");
		if (!finalRounds) {
			return "active";
		}

		const finalMatchup = finalRounds.matchups[0];
		if (!finalMatchup) {
			return "active";
		}

		// Use a temporary variable for clarity
		const isPredictedDefined =
			finalMatchup.isPredicted !== null &&
			finalMatchup.isPredicted !== undefined;

		if (isPredictedDefined) {
			if (
				finalMatchup.isPredicted &&
				finalMatchup.winner_team_id === team.id
			) {
				return "predicted";
			}
			if (
				finalMatchup.isPredicted &&
				finalMatchup.winner_team_id !== team.id
			) {
				return "mistaken";
			}
		} else {
			if (finalMatchup.winner_team_id === team.id) {
				return "selected";
			}
		}

		return "active";
	};

	return (
		<>
			<div className={`select-none w-48 ${className}`}>
				<div>
					<div className="my-1 text-xs text-white flex justify-center items-center gap-x-2">
						<div className="font-bold text-lg text-center">
							{league} FINALS
						</div>
						{showClearButton && (
							<button
								className="cursor-pointer hover:text-gray-400 bg-gray-500 leading-0 px-1"
								onClick={clearFinalsMatchup}
								title="CLEAR TEAMS"
							>
								<FontAwesomeIcon icon="xmark" />
							</button>
						)}
					</div>

					<div className="space-y-2 w-full">
						<TeamSlotCenter
							team={teamA}
							mode={getTeamMode(teamA)}
							isClickable={isClickable}
							placeholderText="R2M1 WINNER"
						/>
						<TeamSlotCenter
							team={teamB}
							mode={getTeamMode(teamB)}
							isClickable={isClickable}
							placeholderText="R2M2 WINNER"
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
					<TeamSlotCenter
						team={winningTeam}
						isClickable={false}
						placeholderText="FINALS WINNER"
						mode={getTeamMode(winningTeam)}
						size="lg"
					/>
				</div>
			</div>
		</>
	);
};

export default Finals;
