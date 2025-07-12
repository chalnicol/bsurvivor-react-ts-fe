import {
	nbaTeams,
	type NBAPlayoffsMatchupInfo,
	type NBATeamInfo,
} from "../../data/nbaData";
import NBAFinalsTeamSlot from "./nbaFinalTeamSlot";
import { useContext, useMemo } from "react";
import { NBAPlayoffsContext } from "../../context/nba/NBAPlayoffsContext";

const NBAChampionships = () => {
	// const [winningTeam, setWinningTeam] = useState<NBATeamInfo | null>(null);

	const { data } = useContext(NBAPlayoffsContext);

	const EMPTY_FINALS_MATCHUP: NBAPlayoffsMatchupInfo = {
		id: 1,
		teams: Array.from({ length: 2 }),
		picked: undefined,
	};

	const finalsMatchup = useMemo((): NBAPlayoffsMatchupInfo => {
		const finalsBracket = data.find(
			(bracket) => bracket.conference === "FINALS"
		);
		if (finalsBracket?.rounds[0].matchups[0]) {
			return finalsBracket.rounds[0].matchups[0];
		}
		return EMPTY_FINALS_MATCHUP;
	}, [data]);
	// const isSelected = matchups[0].picked !== 0 && matchups[0].teams[index].id

	const winningTeam = useMemo((): NBATeamInfo | undefined => {
		const finalsBracket = data.find(
			(bracket) => bracket.conference == "FINALS"
		);

		const finalsPicked = finalsBracket?.rounds[0].matchups[0].picked;
		if (finalsPicked) {
			return nbaTeams.find((t) => t.id === finalsPicked) || undefined;
		}
		return undefined;
	}, [data]);

	return (
		<div className="w-1/6 text-center space-y-10 select-none">
			<div>
				<p className="font-bold text-lg mb-1">NBA FINALS</p>
				<div className="space-y-2 w-full">
					{finalsMatchup.teams.map((team, index) => (
						<div key={index} className="flex-1">
							<NBAFinalsTeamSlot
								team={team}
								active={
									finalsMatchup.teams.every((t) => t != undefined) &&
									finalsMatchup.picked == undefined
								}
								isSelected={
									finalsMatchup.picked !== undefined &&
									finalsMatchup.picked ===
										finalsMatchup.teams[index].id
								}
								placeholderText={`${
									index == 0 ? "EAST" : "WEST"
								} CHAMPION`}
							/>
						</div>
					))}
					{/* <p>NBA FINALS MATCHUP</p> */}
				</div>
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-center gap-x-1">
					<img src="/finals.png" alt="finals" className="h-8" />
					<p className="font-bold text-xl">NBA CHAMPION</p>
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
									src={winningTeam.logo}
									alt={winningTeam.abbr}
									className="h-10"
								/>
								<p className="font-bold text-2xl">{winningTeam.abbr}</p>
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
	);
};

export default NBAChampionships;
