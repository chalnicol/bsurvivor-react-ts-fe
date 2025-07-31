import React from "react";
import {
	type NBAPlayoffsConferenceInfo,
	type NBAPlayoffsTeamInfo,
} from "../../data/nbaData"; // Import types and initial data

// Define the shape of the Context value: the data itself and the update/generation methods
export interface NBAPlayoffsContextType {
	data: NBAPlayoffsConferenceInfo[];
	// Method to update the 'picked' team for a specific matchup
	updatePickedTeam: (
		bracket: "EAST" | "WEST" | "FINALS",
		round: number,
		matchup: number,
		team: NBAPlayoffsTeamInfo // The ID of the team that was picked
	) => void;
	updateFinalsPick: (team: NBAPlayoffsTeamInfo) => void;
	resetBrackets: () => void;
}

// Create the Context object with a default value
export const NBAPlayoffsContext = React.createContext<NBAPlayoffsContextType>({
	data: [], // Use the initial data as default
	updatePickedTeam: () => {
		console.warn(
			"updatePickedTeam was called without an NBAPlayoffsProvider"
		);
	},
	updateFinalsPick: () => {
		console.warn(
			"updateFinalsPick was called without an NBAPlayoffsProvider"
		);
	},
	resetBrackets: () => {
		console.warn("resetBrackets was called without an NBAPlayoffsProvider");
	},
});
