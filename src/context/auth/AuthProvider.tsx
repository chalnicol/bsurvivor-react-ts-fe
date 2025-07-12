import React, { useContext, useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import api from "../../api/axiosConfig"; // Import your configured axios instance

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token")
	);
	const [loading, setLoading] = useState<boolean>(true); // To manage initial loading state
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const isAuthenticated = !!user && !!token;

	// Function to fetch user data if a token exists (on app load/refresh)
	const fetchUser = async () => {
		if (token) {
			try {
				const response = await api.get("/user"); // Protected route to get user details
				setUser(response.data);
			} catch (error) {
				console.error("Failed to fetch user:", error);
				localStorage.removeItem("token"); // Clear invalid token
				setToken(null);
				setUser(null);
			} finally {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, [token]); // Re-fetch user if token changes

	const login = async (email: string, password: string) => {
		try {
			const response = await api.post("/login", { email, password });
			const receivedToken = response.data.token;
			const userData = response.data.user;

			localStorage.setItem("token", receivedToken); // Store token
			setToken(receivedToken);
			setUser(userData);
			console.log("Logged in successfully:", userData);
		} catch (error: any) {
			console.error("Login failed:", error.response?.data || error.message);
			throw error; // Re-throw to be handled by form component
		}
	};

	const register = async (
		username: string,
		email: string,
		password: string,
		password_confirmation: string
	) => {
		try {
			const response = await api.post("/register", {
				username,
				email,
				password,
				password_confirmation,
			});
			const receivedToken = response.data.token;
			const userData = response.data.user;

			localStorage.setItem("token", receivedToken); // Store token
			setToken(receivedToken);
			setUser(userData);
			console.log("Registered successfully:", userData);
		} catch (error: any) {
			console.error(
				"Registration failed:",
				error.response?.data || error.message
			);
			throw error;
		}
	};

	const logout = async () => {
		try {
			if (token) {
				await api.post("/logout"); // Invalidate token on backend
			}
		} catch (error) {
			console.error("Logout failed on server:", error);
			// Even if backend logout fails, clear client-side state
		} finally {
			localStorage.removeItem("token"); // Clear token from storage
			setToken(null);
			setUser(null);
			console.log("Logged out successfully.");
		}
	};

	// --- Password Reset Actions ---
	const forgotPassword = async (email: string) => {
		setLoading(true);
		setError(null);
		setMessage(null);
		try {
			const response = await api.post("/forgot-password", {
				email: email,
			});
			setMessage(
				response.data.message ||
					"Password reset link sent! Check your email."
			);
		} catch (err: any) {
			setError(
				err.response?.data?.email?.[0] ||
					err.response?.data?.message ||
					"Failed to send password reset link. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	const resetPassword = async (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	) => {
		setLoading(true);
		setError(null);
		setMessage(null);
		try {
			const response = await api.post("/reset-password", {
				email: email,
				token: token,
				password: password,
				password_confirmation: password_confirmation,
			});
			setMessage(
				response.data.message || "Password has been reset successfully!"
			);
		} catch (err: any) {
			const apiErrors = err.response?.data?.errors;
			if (apiErrors) {
				let errorMessage = "";
				for (const key in apiErrors) {
					errorMessage += apiErrors[key].join(" ") + " ";
				}
				setError(errorMessage.trim());
			} else {
				setError(
					err.response?.data?.message ||
						"Failed to reset password. Please try again."
				);
			}
		} finally {
			setLoading(false);
		}
	};

	const clearMessages = () => {
		setError(null);
		setMessage(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				error,
				message,
				token,
				isAuthenticated,
				login,
				register,
				logout,
				forgotPassword,
				resetPassword,
				clearMessages,
				loading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
