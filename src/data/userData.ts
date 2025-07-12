export interface ChallengeEntryInfo {
	id: number;
	name: string;
	league: "PBA" | "NBA";
	result: "LIVE" | "FAIL" | "SUCCESS";
}

export const userChallengesEntries: ChallengeEntryInfo[] = [
	{ id: 1, name: "NBA 2025", league: "NBA", result: "LIVE" },
	{ id: 2, name: "NBA 2024", league: "NBA", result: "FAIL" },
	{ id: 3, name: "NBA 2023", league: "NBA", result: "SUCCESS" },
	{ id: 4, name: "PBA GOVERNOR'S CUP 2025", league: "NBA", result: "LIVE" },
	{ id: 5, name: "PBA ALL-FILIPINO CUP 2025", league: "NBA", result: "FAIL" },
];
