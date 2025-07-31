import { createContext } from "react";
import type { PlayoffsRoundInfo } from "../../data/adminData";

interface BracketContextType {
	rounds: PlayoffsRoundInfo[] | null;
	resetRounds: () => void;
}

export const BracketContext = createContext<BracketContextType | undefined>(
	undefined
);
