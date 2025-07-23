import { createContext } from "react";
import { type RoleInfo } from "../../data/adminData";

interface AdminContextType {
	roles: RoleInfo[];
	isLoading: boolean;
	error: string | null;
	fetchRoles: () => Promise<void>;
	isRolesPopulated: boolean;
}

export const AdminContext = createContext<AdminContextType | undefined>(
	undefined
);
