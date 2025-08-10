export interface TeamInfo {
	id: number;
	fname: string;
	lname: string;
	logo?: string | null;
	abbr: string;
	slug?: string;
	league_id?: number;
}

export interface NBATeamInfo extends TeamInfo {
	league: "NBA"; // Specify the league as NBA
	conference: "EAST" | "WEST"; // Optional conference affiliation
}

export interface PBATeamInfo extends TeamInfo {
	league: "PBA"; // Specify the league as PBA
}

export type AnyTeamInfo = NBATeamInfo | PBATeamInfo;

//--
export interface PlayoffsTeamInfo extends TeamInfo {
	seed: number;
	slot: number;
}

export interface NBAPlayoffsTeamInfo extends PlayoffsTeamInfo {
	league: "NBA"; // Specify the league as NBA
	conference: "EAST" | "WEST";
}

export interface PBAPlayoffsTeamInfo extends PlayoffsTeamInfo {
	league: "PBA";
}

export type AnyPlayoffsTeamInfo = NBAPlayoffsTeamInfo | PBAPlayoffsTeamInfo;

//--
export interface nbaTeamData {
	league: "NBA";
	teams: {
		east: number[];
		west: number[];
	};
}

export interface pbaTeamData {
	league: "PBA";
	teams: number[];
}

export type AnyTeamData = nbaTeamData | pbaTeamData;

//--
export interface PlayoffsMatchupInfo {
	id: number;
	name: string;
	matchup_index: number;
	wins_teams_1: number;
	wins_teams_2: number;
	winner_team_id: number;
	teams: AnyPlayoffsTeamInfo[];
}

export interface PlayoffsRoundInfo {
	id: number;
	order_index: number;
	name: string;
	conference?: "EAST" | "WEST";
	matchups: PlayoffsMatchupInfo[];
}

export interface BracketChallengeEntryPredictionsInfo {
	predicted_winner_team_id: number;
	matchup_id: number;
	teams: number[];
}

export interface BracketChallengeEntryData {
	bracket_challenge_id: number;
	predictions: BracketChallengeEntryPredictionsInfo[];
}

// export type AnyEntryData = NBAEntryData | PBAEntryData;

export interface BracketChallengeInfo {
	id: number;
	name: string;
	league_id: number;
	league: string;
	description?: string;
	slug: string;
	start_date: string;
	end_date: string;
	is_public: boolean;
	bracket_data: AnyTeamData;
	rounds: PlayoffsRoundInfo[];
}

export interface BracketChallengeEntryInfo {
	id: number;
	name: string;
	user_id: number;
	user: UserInfo;
	bracket_challenge_id: number;
	bracket_challenge: BracketChallengeInfo;
	last_round_survive: number;
	status: "active" | "failed" | "success";
	predictions: BracketChallengeEntryPredictionsInfo[];
}

//...
export interface LeagueInfo {
	id: number;
	name: string;
	abbr: string;
	logo?: string;
	slug: string;
	teams?: AnyTeamInfo[];
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

export interface PageLink {
	url: string | null;
	label: string;
	active: boolean;
}

export interface MetaInfo {
	current_page: number;
	from: number;
	last_page: number;
	to: number;
	total: number;
	per_page: number;
	path: string;
	links: PageLink[];
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: MetaInfo;
	link: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
}

export interface TotalsInfo {
	leagueTotal: number;
	userTotal: number;
	bracketChallengeTotal: number;
	bracketChallengeEntryTotal: number;
	teamTotal: number;
}

export interface ResourcesResponseInfo {
	message: string;
	totals: TotalsInfo;
}

// export interface GeneralApiErrorResponse {
// 	message: string;
// }

// // Interface for Laravel's default validation errors
// export interface LaravelValidationErrorsResponse {
// 	message: string; // "The given data was invalid."
// 	errors: {
// 		[field: string]: string[]; // Keys are field names, values are arrays of error strings
// 	};
// }

// // Union type to cover both possibilities for error.response.data
// export type ServerErrorData =
// 	| GeneralApiErrorResponse
// 	| LaravelValidationErrorsResponse;
