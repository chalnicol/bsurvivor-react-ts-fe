import { createContext } from "react";
import {
	type AnyTeamInfo,
	type LeagueInfo,
	type RoleInfo,
} from "../../data/adminData";

interface AdminContextType {
	roles: RoleInfo[];
	nbaTeams: AnyTeamInfo[];
	pbaTeams: AnyTeamInfo[];
	leagues: LeagueInfo[];
	isLoading: boolean;
	error: string | null;
	fetchRoles: () => Promise<void>;
	fetchTeamsAndLeagues: () => Promise<void>;
	isRolesPopulated: boolean;
	areTeamsAndLeaguesPopulated: boolean;
}

export const AdminContext = createContext<AdminContextType | undefined>(
	undefined
);
