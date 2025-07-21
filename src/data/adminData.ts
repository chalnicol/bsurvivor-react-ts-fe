export interface TeamInfo {
	id: number;
	name: string;
	logo?: string;
	abbr: string;
}

export interface nbaTeamData {
	east: number[];
	west: number[];
}

export interface pbaTeamData {
	teams: number[];
}
