import { createContext } from "react";
import type {
	AnyPlayoffsTeamInfo,
	PlayoffsRoundInfo,
} from "../../data/adminData";

interface BracketContextType {
	rounds: PlayoffsRoundInfo[] | null;
	error: string | null;
	success: string | null;
	isLoading: boolean;
	// isActive: boolean;
	mode: "update" | "submit" | "preview";
	league: string;
	updatePick: (
		conference: "EAST" | "WEST" | null,
		roundIndex: number,
		matchupIndex: number,
		team: AnyPlayoffsTeamInfo
	) => void;
	isActive: boolean;
	hasProgressed: boolean;
	updateFinalsPick: (team: AnyPlayoffsTeamInfo) => void;
	resetBracket: () => void;
	updateBracket: () => void;
	submitPicks: () => void;
	resetMessage: () => void;
	clearMatchup: (
		conference: "EAST" | "WEST" | null,
		roundIndex: number,
		matchupIndex: number
	) => void;
	clearFinalsMatchup: () => void;
	refreshBracket: () => void;
}

export const BracketContext = createContext<BracketContextType | undefined>(
	undefined
);
