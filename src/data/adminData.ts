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
	winner_team_id: number | null;
	teams: AnyPlayoffsTeamInfo[];
	// isPredicted: boolean | null;
	predicted_winner_team_id: number | null;
	isCorrect: boolean | null;
}

export interface PlayoffsRoundInfo {
	id: number;
	order_index: number;
	name: string;
	conference?: "EAST" | "WEST";
	matchups: PlayoffsMatchupInfo[];
}

export interface BracketChallengeMatchupsDataInfo {
	matchup_id: number;
	teams: {
		id: number;
		slot?: number;
		seed?: number;
	}[];
}

export interface BracketChallengeEntryPredictionsInfo
	extends BracketChallengeMatchupsDataInfo {
	predicted_winner_team_id: number;
}
export interface BracketUpdateMatchupsData
	extends BracketChallengeMatchupsDataInfo {
	winner_team_id: number | null;
}

export interface BracketChallengeEntryData {
	bracket_challenge_id: number;
	predictions: BracketChallengeEntryPredictionsInfo[];
}

export interface BracketUpdateData {
	bracket_challenge_id: number;
	matchups: BracketUpdateMatchupsData[];
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
	comments: CommentInfo[];
	created_at: string;
	updated_at: string;
	entries: BracketChallengeEntryInfo[];
	entries_count?: number;
	votes: VotesInfo;
	user_vote: "like" | "dislike" | null;
}

export interface BracketChallengeEntryInfo {
	id: number;
	name: string;
	user_id: number;
	user: UserInfo;
	bracket_challenge_id: number;
	bracket_challenge: BracketChallengeInfo;
	correct_predictions_count: number;
	status: "active" | "eliminated" | "won";
	slug: string;
	predictions: BracketChallengeEntryPredictionsInfo[];
	created_at: string;
	updated_at: string;
	rank?: number;
	is_current_user_entry?: boolean;
	votes: VotesInfo;
	user_vote: "like" | "dislike" | null;
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

export interface UserMiniInfo {
	id: number;
	username: string;
	fullname: string;
}

export interface UserInfo extends UserMiniInfo {
	email: string;
	email_verified_at: string | null;
	created_at: string;
	updated_at: string;
	roles: string[]; // Array of role names
	permissions: string[]; // Array of permission names
	is_blocked: boolean;
}

export interface SearchedUserInfo extends UserMiniInfo {
	status: "friends" | "request_sent" | "request_received" | "not_friends";
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

export type SlotModeType =
	| "correct"
	| "incorrect"
	| "idle"
	| "selected"
	| "void";

export type ProfileWindow = "details" | "password" | "delete" | null;

export interface NotificationDataInfo {
	sender_id?: number;
	sender_name?: string;
	message: string;
	url: string;
}

export interface FriendsInfo {
	active_friends: UserMiniInfo[];
	pending_friends: UserMiniInfo[];
	to_accept_friends: UserMiniInfo[];
	blocked_friends: UserMiniInfo[];
}

export interface NotificationInfo {
	id: string;
	type: string;
	data: {
		sender_id: number;
		sender_name: string;
		message: string;
		url: string;
	};
	read_at: string | null;
	created_at: string;
	is_read: boolean;
}

export interface CommentInfo {
	id: number;
	type: string;
	body: string;
	user_id: number;
	parent_id: number | null;
	user: UserMiniInfo;
	created_at: string;
	updated_at: string;
	replies: CommentInfo[];
	parent: CommentInfo;
	replies_count: number;
	last_page?: number;
	current_page?: number;
	votes: VotesInfo;
	user_vote: "like" | "dislike" | null;
}

export interface VotesInfo {
	likes: number;
	dislikes: number;
}

export type ColorType =
	| "red"
	| "yellow"
	| "green"
	| "teal"
	| "blue"
	| "amber"
	| "sky";

export interface TabInfo<T> {
	id: number;
	label: string;
	tab: T;
	type: "button" | "link";
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
