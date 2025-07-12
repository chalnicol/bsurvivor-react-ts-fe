import NBAChampionships from "./nbaChampionship";
import NBAConference from "./nbaConference";

import { useContext } from "react";
import { NBAPlayoffsContext } from "../../context/nba/NBAPlayoffsContext";
const NBABracket = () => {
	const { resetBrackets } = useContext(NBAPlayoffsContext);

	return (
		<>
			<div className="max-w-7xl mx-auto mt-3 bg-gray-200 rounded-xl shadow-lg p-4 border border-gray-300">
				<div className="w-full overflow-x-auto">
					<div className="min-w-6xl mx-auto flex items-center gap-x-6 ">
						{/* east bracket */}
						<NBAConference conference="EAST" className="flex-1" />

						{/* championship */}
						<NBAChampionships />

						{/* east bracket */}
						<NBAConference conference="WEST" className="flex-1" />
					</div>
				</div>
			</div>
			<div className="mt-5 space-x-2 flex justify-center">
				<button
					className="px-4 py-2 bg-red-500 rounded min-w-32 text-white hover:bg-red-400 cursor-pointer font-semibold"
					onClick={resetBrackets}
				>
					RESET
				</button>

				<button
					className="px-4 py-2 bg-gray-800 rounded min-w-32 text-white hover:bg-gray-700 cursor-pointer font-semibold"
					disabled={true}
				>
					SUBMIT
				</button>
			</div>
		</>
	);
};

export default NBABracket;
