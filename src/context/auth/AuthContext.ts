import React from "react";
import { type Response } from "../../data/userData";

export interface User {
	id: number;
	username: string;
	email: string;
	// Add other user properties you expect from your API
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	error: string | null;
	message: string | null;
	loading: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (
		username: string,
		email: string,
		password: string,
		password_confirmation: string
	) => Promise<boolean>;
	logout: () => Promise<void>;
	forgotPassword: (email: string) => Promise<boolean>;
	resetPassword: (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	) => Promise<boolean>;
	updateProfile: (email: string, username: string) => Promise<Response | null>;
	updatePassword: (
		currentPassword: string,
		password: string,
		password_confirmation: string
	) => Promise<Response | null>;
	deleteAccount: () => Promise<boolean>;
	clearMessages: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
	undefined
);
