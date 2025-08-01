import { createContext } from "react";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsRoundInfo,
} from "../../data/adminData";

interface BracketContextType {
	rounds: PlayoffsRoundInfo[] | null;
	isPreview: boolean;
	updatePick: (
		conference: "EAST" | "WEST" | null,
		roundIndex: number,
		matchupIndex: number,
		team: AnyPlayoffsTeamInfo
	) => void;
	updateFinalsPick: (team: AnyPlayoffsTeamInfo) => void;
	resetPicks: () => void;
}

export const BracketContext = createContext<BracketContextType | undefined>(
	undefined
);
