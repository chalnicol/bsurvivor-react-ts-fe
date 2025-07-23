import React, { useCallback, useContext, useState } from "react";
import { AdminContext } from "./AdminContext";
import { apiClient } from "../../utils/api";
import { type RoleInfo } from "../../data/adminData";

interface AdminProviderProps {
	children: React.ReactNode;
}
export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
	const [roles, setRoles] = useState<RoleInfo[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const isRolesPopulated = roles.length > 0;

	const fetchRoles = useCallback(async () => {
		if (isRolesPopulated) return;
		setIsLoading(true);
		setError(null);
		try {
			const response = await apiClient.get("/admin/roles");
			setRoles(response.data.roles);
		} catch (errors: any) {
			console.log(error);
			setError("Failed to fetch roles.");
			console.log("error", error);
		} finally {
			setIsLoading(false);
		}
	}, [isRolesPopulated]);

	return (
		<AdminContext.Provider
			value={{ roles, isLoading, error, fetchRoles, isRolesPopulated }}
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
