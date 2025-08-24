import React from "react";
import type { ProfileWindow } from "../../data/adminData";

export interface User {
	id: number;
	username: string;
	email: string;
	email_verified_at: string | null;
	created_at: string;
	updated_at: string;
	roles: string[]; // Array of role names
	permissions: string[]; // Array of permission names
	// Add other user properties you expect from your API
}

export interface AuthContextType {
	user: User | null;
	// token: string | null;
	isAuthenticated: boolean;
	error: string | null;
	fieldErrors: Record<string, string[]> | null;
	message: string | null;
	isLoading: boolean;
	authLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (
		username: string,
		email: string,
		password: string,
		password_confirmation: string
	) => Promise<boolean>;
	logout: () => Promise<boolean>;
	forgotPassword: (email: string) => Promise<boolean>;
	resetPassword: (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	) => Promise<boolean>;
	updateProfile: (email: string, username: string) => Promise<boolean>;
	updatePassword: (
		currentPassword: string,
		password: string,
		password_confirmation: string
	) => Promise<boolean>;
	deleteAccount: () => Promise<boolean>;
	clearMessages: () => void;
	updateUser: (updatedUser: User) => void;
	hasRole: (role: string) => boolean;
	can: (permission: string) => boolean;
	sendVerificationEmail: () => Promise<boolean>;
	verifyEmail: (email: string, token: string) => Promise<boolean>;
	profileWindow: ProfileWindow;
	toVerifyEmail: string | null;
	fetchUnreadCount: () => Promise<void>;
	updateUnreadCount: (method: "increment" | "decrement" | number) => void;
	unreadCount: number;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
	undefined
);
