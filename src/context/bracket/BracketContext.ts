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
	isActive: boolean;
	league: string;
	updatePick: (
		conference: "EAST" | "WEST" | null,
		roundIndex: number,
		matchupIndex: number,
		team: AnyPlayoffsTeamInfo
	) => void;
	updateFinalsPick: (team: AnyPlayoffsTeamInfo) => void;
	resetPicks: () => void;
	submitPicks: (league: string) => void;
	resetMessage: () => void;
}

export const BracketContext = createContext<BracketContextType | undefined>(
	undefined
);
