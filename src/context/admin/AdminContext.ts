import { createContext } from "react";
import {
	type AnyTeamInfo,
	type BracketChallengeInfo,
	type LeagueInfo,
	type RoleInfo,
} from "../../data/adminData";

interface AdminContextType {
	roles: RoleInfo[];
	nbaTeams: AnyTeamInfo[];
	pbaTeams: AnyTeamInfo[];
	leagues: LeagueInfo[];
	bracketChallenges: BracketChallengeInfo[];
	isLoading: boolean;
	error: string | null;
	fetchRoles: () => Promise<void>;
	fetchTeamsAndLeagues: () => Promise<void>;
	isRolesPopulated: boolean;
	areTeamsAndLeaguesPopulated: boolean;
	fetchBracketChallenges: () => Promise<void>;
	isBracketChallengesPopulated: boolean;
}

export const AdminContext = createContext<AdminContextType | undefined>(
	undefined
);
