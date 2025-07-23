export interface TeamInfo {
	id: number;
	name: string;
	logo?: string;
	abbr: string;
	slug?: string;
}

export interface LeagueInfo {
	id: number;
	name: string;
	abbr: string;
	logo?: string;
	slug: string;
}

export interface nbaTeamData {
	east: number[];
	west: number[];
}

export interface pbaTeamData {
	teams: number[];
}

export interface UserInfo {
	id: number;
	username: string;
	email: string;
	roles: string[];
	is_blocked: boolean;
}

export interface RoleInfo {
	id: number;
	name: string;
}
