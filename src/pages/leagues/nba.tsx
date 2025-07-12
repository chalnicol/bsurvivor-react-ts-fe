import NBAPlayoffsProvider from "../../context/nba/NBAPlayoffsProvider";
import NBABracket from "../../components/nba/nbaBracket";
const NBAPage = () => {
	return (
		<>
			<NBAPlayoffsProvider>
				<div className="w-full overflow-x-hidden py-7 min-h-[calc(100dvh-57px)]">
					<h1 className="text-4xl font-bold mb-2 text-center">
						NBA Bracket Challenge
					</h1>
					<p className="text-center text-sm">
						Make your picks wisely and outlast the competition. Choose
						your teams, make your predictions, and aim to be the last
						survivor in the league!
					</p>
					<NBABracket />
				</div>
			</NBAPlayoffsProvider>
		</>
	);
};
export default NBAPage;
