import { useMemo, useContext } from "react";
import { NBAPlayoffsContext } from "../../context/nba/NBAPlayoffsContext";
import NBAMatchup from "./nbaMatchup";

interface NBAConferenceProps {
	// Define any props if needed
	conference: "EAST" | "WEST";
	className?: string;
}

const NBAConference = ({ conference, className }: NBAConferenceProps) => {
	const { data } = useContext(NBAPlayoffsContext);

	const rounds = useMemo(() => {
		const conferenceBracket = data.find((b) => b.conference === conference);
		return conferenceBracket ? conferenceBracket.rounds : [];
	}, [data, conference]);

	const alignment = conference === "EAST" ? "left" : "right";

	return (
		<div className={className}>
			<p
				className={`font-bold ${
					alignment == "left" ? "text-left" : "text-right"
				}`}
			>
				{conference}
			</p>
			<div
				className={`flex gap-x-4 min-h-[480px] ${
					alignment == "left" ? "flex-row" : "flex-row-reverse"
				}`}
			>
				{rounds.map((round) => (
					<div
						key={round.id}
						className="flex-1 flex flex-col justify-around"
					>
						{round.matchups.map((matchup) => (
							<NBAMatchup
								key={matchup.id}
								conference={conference}
								round={round.id}
								matchup={matchup}
								alignment={alignment}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
export default NBAConference;
