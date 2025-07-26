import React, { useCallback, useContext, useState } from "react";
import { AdminContext } from "./AdminContext";
import { apiClient } from "../../utils/api";
import type { RoleInfo, AnyTeamInfo, LeagueInfo } from "../../data/adminData";

interface TeamsAndLeaguesResponse {
	teams: AnyTeamInfo[];
	leagues: LeagueInfo[];
	message: string;
}

interface RolesResponse {
	roles: RoleInfo[];
	message: string;
}

interface AdminProviderProps {
	children: React.ReactNode;
}
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
	const [roles, setRoles] = useState<RoleInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	// const [teams, setTeams] = useState<AnyTeamInfo[]>([]);
	const [nbaTeams, setNbaTeams] = useState<AnyTeamInfo[]>([]);
	const [pbaTeams, setPbaTeams] = useState<AnyTeamInfo[]>([]);
	const [leagues, setLeague] = useState<LeagueInfo[]>([]);

	const isRolesPopulated = roles.length > 0;

	const areTeamsAndLeaguesPopulated =
		nbaTeams.length > 0 && pbaTeams.length > 0 && leagues.length > 0;

	const fetchRoles = useCallback(async () => {
		if (isRolesPopulated) return;
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiClient.get<RolesResponse>("/admin/roles");
			setRoles(response.data.roles);
		} catch (errors: any) {
			console.log(error);
			setError("Failed to fetch roles.");
			console.log("error", error);
		} finally {
			setIsLoading(false);
		}
	}, [isRolesPopulated]);

	const fetchTeamsAndLeagues = useCallback(async () => {
		if (areTeamsAndLeaguesPopulated) return;
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiClient.get<TeamsAndLeaguesResponse>(
				"/admin/teams_and_leagues"
			);
			setNbaTeams(
				response.data.teams.filter((team) => team.league === "NBA")
			);
			setPbaTeams(
				response.data.teams.filter((team) => team.league === "PBA")
			);
			setLeague(response.data.leagues);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}, [areTeamsAndLeaguesPopulated]);

	return (
		<AdminContext.Provider
			value={{
				roles,
				nbaTeams,
				pbaTeams,
				leagues,
				isLoading,
				error,
				fetchRoles,
				fetchTeamsAndLeagues,
				isRolesPopulated,
				areTeamsAndLeaguesPopulated,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdmin = () => {
	const context = useContext(AdminContext);
	if (context === undefined) {
		throw new Error("useAdmin must be used within an AdminProvider");
	}
	return context;
};
