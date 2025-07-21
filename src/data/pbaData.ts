import { type TeamInfo } from "./adminData";

export interface PBATeamInfo extends TeamInfo {
	league: "PBA"; // Specify the league as PBA
}

export const pbaTeams: PBATeamInfo[] = [
	{
		id: 1,
		name: "Barangay Ginebra San Miguel",
		abbr: "GIN",
		league: "PBA",
	},
	{
		id: 2,
		name: "San Miguel Beermen",
		abbr: "SMB",
		league: "PBA",
	},
	{
		id: 3,
		name: "TNT Tropang Giga",
		abbr: "TNT",
		league: "PBA",
	},
	{
		id: 4,
		name: "Meralco Bolts",
		abbr: "MER",
		league: "PBA",
	},
	{
		id: 5,
		name: "Magnolia Hotshots",
		abbr: "MAG",
		league: "PBA",
	},
	{
		id: 6,
		name: "Phoenix Super LPG Fuel Masters",
		abbr: "PHX",
		league: "PBA",
	},
	{
		id: 7,
		name: "NorthPort Batang Pier",
		abbr: "NORTH",
		league: "PBA",
	},
	{
		id: 8,
		name: "Rain or Shine Elasto Painters",
		abbr: "ROS",
		league: "PBA",
	},
	{
		id: 9,
		name: "Blackwater Bossing",
		abbr: "BLA",
		league: "PBA",
	},
	{
		id: 10,
		name: "Terrafirma Dyip",
		abbr: "TER",
		league: "PBA",
	},
	{
		id: 11,
		name: "Alaska Aces",
		abbr: "ALA",
		league: "PBA",
	},
	{
		id: 12,
		name: "Converge FiberXers",
		abbr: "CON",
		league: "PBA",
	},

	// Add more PBA teams as needed
];
