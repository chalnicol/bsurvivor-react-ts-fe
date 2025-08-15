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
	isLoading: boolean;
	isOngoingLoading: boolean;
	error: string | null;
	isRolesPopulated: boolean;
	areTeamsAndLeaguesPopulated: boolean;
	isActiveChallengesPopulated: boolean;
	isOngoingChallengesPopulated: boolean;
	activeChallenges: BracketChallengeInfo[];
	ongoingChallenges: BracketChallengeInfo[];
	fetchRoles: () => Promise<void>;
	fetchTeamsAndLeagues: () => Promise<void>;
	fetchBracketChallenges: (type: "active" | "ongoing") => Promise<void>;
	fetchTopEntries: (id: number) => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(
	undefined
);
