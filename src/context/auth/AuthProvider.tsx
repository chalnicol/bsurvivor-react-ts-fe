import React, { useContext, useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { type Response } from "../../data/userData";
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

	const [isLoading, setIsLoading] = useState<boolean>(false);

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

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setMessage(null);
		try {
			const response = await api.post("/login", { email, password });
			const receivedToken = response.data.token;
			const userData = response.data.user;
			localStorage.setItem("token", receivedToken); // Store token
			setToken(receivedToken);
			setUser(userData);
			setMessage("Login succesfull. Redirecting...");
			return true;
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
						"Login failed. Please check your credentials."
				);
			}
			return false; // Indicate failure
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (
		username: string,
		email: string,
		password: string,
		password_confirmation: string
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
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
			return true;
		} catch (err: any) {
			const apiErrors = err.response?.data?.errors;
			if (apiErrors) {
				let errorMessage = "";
				for (const key in apiErrors) {
					errorMessage += apiErrors[key].join(" ") + " ";
				}
				setError(errorMessage.trim());
			} else {
				setError(err.response?.data?.message || "Registration failed.");
			}
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
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
			setIsLoading(false);
			console.log("Logged out successfully.");
		}
	};

	// --- Password Reset Actions ---
	const forgotPassword = async (email: string): Promise<boolean> => {
		setIsLoading(true);
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
			return true;
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
						"Failed to send password reset link."
				);
			}
			return false; // Indicate failure
		} finally {
			setIsLoading(false);
		}
	};

	const resetPassword = async (
		email: string,
		token: string,
		password: string,
		password_confirmation: string
	) => {
		setIsLoading(true);
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
			return true;
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
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const updateProfile = async (
		username: string,
		email: string
	): Promise<Response | null> => {
		//..
		setIsLoading(true);
		setError("");
		setMessage("");
		try {
			const response = await api.put("/user/profile", {
				username: username,
				email: email,
			});
			setUser(response.data.user);
			// setMessage(response.data.message || "Profile data has been updated.");
			return {
				success: response.data.message || "Profile data has been updated.",
				error: null,
			};
		} catch (err: any) {
			const apiErrors = err.response?.data?.errors;
			let tempErr: string = "";
			if (apiErrors) {
				let errorMessage = "";
				for (const key in apiErrors) {
					errorMessage += apiErrors[key].join(" ") + " ";
				}
				// setError(errorMessage.trim());
				tempErr = errorMessage.trim();
			} else {
				// setError(
				// 	err.response?.data?.message || "Failed to update profile."
				// );
				tempErr =
					err.response?.data?.message || "Failed to update profile.";
			}
			return { success: null, error: tempErr };
		} finally {
			setIsLoading(false);
		}
	};

	const updatePassword = async (
		current_password: string,
		password: string,
		password_confirmation: string
	): Promise<Response | null> => {
		setIsLoading(true);
		setError("");
		setMessage("");
		try {
			const response = await api.put("/user/password", {
				current_password,
				password,
				password_confirmation,
			}); // Or PATCH
			// setMessage(response.data.message || "Password updated successfully!");
			return {
				success: response.data.message || "Password updated successfully!",
				error: null,
			};
		} catch (err: any) {
			let myError: string = "";
			const apiErrors = err.response?.data?.errors;
			if (apiErrors) {
				let errorMessage = "";
				for (const key in apiErrors) {
					errorMessage += apiErrors[key].join(" ") + " ";
				}
				// setError(errorMessage.trim());
				myError = errorMessage.trim();
			} else {
				// setError(
				// 	err.response?.data?.message || "Failed to update password."
				// );
				myError =
					err.response?.data?.message || "Failed to update password.";
			}
			return {
				success: null,
				error: myError,
			};
		} finally {
			setIsLoading(false);
		}
	};

	const deleteAccount = async () => {
		setIsLoading(true); // Indicate loading for this action
		clearMessages();
		try {
			await api.delete("/user");

			localStorage.removeItem("token"); // Clear token from storage
			setUser(null);
			setToken(null);
			return true; // Indicate success
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
					err.response?.data?.message || "Failed to update password."
				);
			}
			return false;
		} finally {
			setIsLoading(false);
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
				updateProfile,
				updatePassword,
				deleteAccount,
				clearMessages,
				loading,
				isLoading,
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
