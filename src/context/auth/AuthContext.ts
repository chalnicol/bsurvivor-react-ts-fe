import React from "react";

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
	login: (email: string, password: string) => Promise<void>;
	register: (
		username: string,
		email: string,
		password: string,
		password_confirmation: string
	) => Promise<void>;

	logout: () => Promise<void>;
	forgotPassword: (email: string) => Promise<void>;
	resetPassword: (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	) => Promise<void>;
	clearMessages: () => void;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(
	undefined
);
