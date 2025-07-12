export interface NBATeamInfo {
	id: number;
	name: string;
	abbr: string;
	logo?: string; // Optional logo URL
	conference: "EAST" | "WEST"; // Optional conference affiliation
}

export interface NBAPlayoffsTeamInfo {
	id: number; //team id
	seed: number;
	wins?: number;
	losses?: number;
}

export interface NBAPlayoffsMatchupInfo {
	id: number;
	teams: NBAPlayoffsTeamInfo[];
	picked?: number; // Optional field to indicate if the matchup has been picked
	winner?: number;
}

export interface NBAPlayoffsRoundsInfo {
	id: number;
	matchups: NBAPlayoffsMatchupInfo[];
}

export interface NBAPlayoffsConferenceInfo {
	conference: "EAST" | "WEST" | "FINALS";
	rounds: NBAPlayoffsRoundsInfo[];
}

//--- list all NBA teams	with their info
export const nbaTeams: NBATeamInfo[] = [
	{
		id: 1,
		name: "Atlanta Hawks",
		abbr: "ATL",
		logo: "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 2,
		name: "Boston Celtics",
		abbr: "BOS",
		logo: "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 3,
		name: "Brooklyn Nets",
		abbr: "BKN",
		logo: "https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 4,
		name: "Charlotte Hornets",
		abbr: "CHA",
		logo: "https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 5,
		name: "Chicago Bulls",
		abbr: "CHI",
		logo: "https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 6,
		name: "Cleveland Cavaliers",
		abbr: "CLE",
		logo: "https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 7,
		name: "Dallas Mavericks",
		abbr: "DAL",
		logo: "https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 8,
		name: "Denver Nuggets",
		abbr: "DEN",
		logo: "https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 9,
		name: "Detroit Pistons",
		abbr: "DET",
		logo: "https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 10,
		name: "Golden State Warriors",
		abbr: "GSW",
		logo: "https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 11,
		name: "Houston Rockets",
		abbr: "HOU",
		logo: "https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 12,
		name: "Indiana Pacers",
		abbr: "IND",
		logo: "https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 13,
		name: "Los Angeles Clippers",
		abbr: "LAC",
		logo: "https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 14,
		name: "Los Angeles Lakers",
		abbr: "LAL",
		logo: "https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 15,
		name: "Memphis Grizzlies",
		abbr: "MEM",
		logo: "https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 16,
		name: "Miami Heat",
		abbr: "MIA",
		logo: "https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 17,
		name: "Milwaukee Bucks",
		abbr: "MIL",
		logo: "https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 18,
		name: "Minnesota Timberwolves",
		abbr: "MIN",
		logo: "https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 19,
		name: "New Orleans Pelicans",
		abbr: "NOP",
		logo: "https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 20,
		name: "New York Knicks",
		abbr: "NYK",
		logo: "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 21,
		name: "Oklahoma City Thunder",
		abbr: "OKC",
		logo: "https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 22,
		name: "Orlando Magic",
		abbr: "ORL",
		logo: "https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 23,
		name: "Philadelphia 76ers",
		abbr: "PHI",
		logo: "https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 24,
		name: "Phoenix Suns",
		abbr: "PHX",
		logo: "https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 25,
		name: "Portland Trail Blazers",
		abbr: "POR",
		logo: "https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 26,
		name: "Sacramento Kings",
		abbr: "SAC",
		logo: "https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 27,
		name: "San Antonio Spurs",
		abbr: "SAS",
		logo: "https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 28,
		name: "Toronto Raptors",
		abbr: "TOR",
		logo: "https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg",
		conference: "EAST",
	},
	{
		id: 29,
		name: "Utah Jazz",
		abbr: "UTA",
		logo: "https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg",
		conference: "WEST",
	},
	{
		id: 30,
		name: "Washington Wizards",
		abbr: "WAS",
		logo: "https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg",
		conference: "EAST",
	},
];

//--- initial data.. --------

export interface NBAPlayoffsSeedingInfo {
	conference: "EAST" | "WEST";
	teams: number[];
}
//	Example NBA Playoffs Info for 2025
export const nbaPlayoffSeeding: NBAPlayoffsSeedingInfo[] = [
	{
		conference: "EAST",
		teams: [1, 2, 3, 4, 5, 6, 12, 17], // Example seeds
	},
	{
		conference: "WEST",
		teams: [7, 8, 10, 11, 13, 14, 15, 18], // Example seeds
	},
];
