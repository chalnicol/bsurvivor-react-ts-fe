import React, { useContext, useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthContext";
import { apiClient, getCsrfToken } from "../../utils/api"; // Import your configured axios instance
import { type ProfileWindow } from "../../data/adminData";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	// const [token, setToken] = useState<string | null>(
	// 	localStorage.getItem("token")
	// );
	const [authLoading, setAuthLoading] = useState<boolean>(true); // To manage initial loading state
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({}); // To hold validation errors
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [profileWindow, setProfileWindow] = useState<ProfileWindow>(null);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const [isToVerifyEmail, setIsToVerifyEmail] = useState<boolean>(false);

	// Function to fetch user data if a token exists (on app load/refresh)

	const fetchUser = async () => {
		if (!user) {
			try {
				const response = await apiClient.get("/user"); // Protected route to get user details
				setUser(response.data.data);
				setIsAuthenticated(true);
			} catch (error) {
				console.log(error);
				setUser(null);
				setIsAuthenticated(false);
			} finally {
				setAuthLoading(false);
			}
		} else {
			setAuthLoading(false);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUnreadCount = async () => {
		try {
			const response = await apiClient.get("/get-unread-count");
			setUnreadCount(response.data.count);
		} catch (error) {
			console.error("Failed to fetch unread notification count:", error);
		}
	};

	const updateUnreadCount = (value: "increment" | "decrement" | number) => {
		setUnreadCount((prevCount) => {
			if (typeof value === "number") {
				return value;
			} else if (typeof value === "string") {
				if (value === "increment") {
					return prevCount + 1;
				} else if (value === "decrement") {
					return prevCount - 1;
				}
			}
			return prevCount;
		});
	};

	const processErrors = (error: any, errorMessage?: string) => {
		if (error.type === "validation") {
			setFieldErrors(error.errors);
			setError(error.message || errorMessage); // Often 'The given data was invalid.'
		} else if (
			error.type === "server" ||
			error.type === "general" ||
			error.type === "network" ||
			error.type === "client"
		) {
			setError(error.message);
		} else {
			// Fallback for any other unexpected error type
			setError("An unknown error occurred.");
		}
	};

	const login = async (email: string, password: string): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setMessage(null);
		setFieldErrors({});

		try {
			await getCsrfToken();
			const response = await apiClient.post("/login", { email, password });
			setUser(response.data.user);
			setIsAuthenticated(true);
			setMessage("Login succesfull. Redirecting...");
			return true;
		} catch (err: any) {
			processErrors(err, "Login failed");
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
		setMessage(null);
		setFieldErrors({});
		try {
			const response = await apiClient.post("/register", {
				username,
				email,
				password,
				password_confirmation,
			});
			setMessage(response.data.message || "Registration successful!");
			setError(null);
			setFieldErrors({});
			return true;
		} catch (error: any) {
			processErrors(error, "Registration failed");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const verifyEmail = async (
		email: string,
		token: string
	): Promise<boolean> => {
		setIsLoading(true);
		try {
			const response = await apiClient.post("/email/verify", {
				email,
				token,
			});
			console.log(response.data.message);
			setMessage(response.data.message || "Email verification successful!");
			setIsToVerifyEmail(false);
			return true;
		} catch (error: any) {
			console.log(error);
			processErrors(error, "Email verification failed");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async (): Promise<boolean> => {
		setIsLoading(true);
		try {
			await apiClient.post("/logout");
			return true;
		} catch (error) {
			console.error("Logout failed on server:", error);
			return false;
		} finally {
			setUser(null);
			setIsAuthenticated(false);
			setMessage(null);
			setError(null);
			setFieldErrors({});
			setProfileWindow(null);
			setIsLoading(false);
		}
	};

	//--- Verify Email Actions ---
	const sendVerificationEmail = async (): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setMessage(null);
		try {
			// Make a POST request to the Laravel endpoint to resend the email
			const response = await apiClient.post(
				"/email/verification-notification"
			);
			setMessage(response.data.message || "Verification link sent!"); // Should be something like "Verification link sent!"
			return true;
		} catch (error) {
			setError("Failed to resend the verification link.");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// --- Password Reset Actions ---
	const forgotPassword = async (email: string): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setMessage(null);
		try {
			const response = await apiClient.post("/forgot-password", {
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
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setMessage(null);
		try {
			const response = await apiClient.post("/reset-password", {
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
			processErrors(err, "Failed to reset password");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const updateProfile = async (
		username: string,
		email: string
	): Promise<boolean> => {
		//..
		setIsLoading(true);
		setProfileWindow("details");
		setError(null);
		setMessage(null);
		setFieldErrors({});
		try {
			const response = await apiClient.put("/user/profile", {
				username: username,
				email: email,
			});
			const isEmailNew = response.data.is_email_new;
			if (isEmailNew) {
				localStorage.removeItem("token");
				setIsToVerifyEmail(true);
				setUser(null);
				setIsAuthenticated(false);
				setMessage(
					response.data.message ||
						"Email has been updated. Please verify your new email."
				);
				return true;
			}
			setUser(response.data.user);
			setMessage(response.data.message || "Profile data has been updated.");
			return true;
		} catch (err: any) {
			processErrors(err, "Failed to update profile");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const updatePassword = async (
		current_password: string,
		password: string,
		password_confirmation: string
	): Promise<boolean> => {
		setIsLoading(true);
		setError(null);
		setMessage(null);
		setFieldErrors({});
		setProfileWindow("password");
		try {
			const response = await apiClient.put("/user/password", {
				current_password,
				password,
				password_confirmation,
			});
			setMessage(response.data.message || "Password updated successfully!");
			return true;
		} catch (err: any) {
			processErrors(err, "Failed to update password");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteAccount = async (): Promise<boolean> => {
		setIsLoading(true); // Indicate loading for this action
		setProfileWindow("delete");
		setError(null);
		setMessage(null);
		setFieldErrors({});
		try {
			await apiClient.delete("/user");
			// localStorage.removeItem("token"); // Clear token from storage
			// setToken(null);
			setUser(null);
			setIsAuthenticated(false);
			return true; // Indicate success
		} catch (err: any) {
			processErrors(err, "Failed to delete account");
			return false; // Indicate failure
		} finally {
			setIsLoading(false);
		}
	};

	const clearMessages = () => {
		setError(null);
		setMessage(null);
		setFieldErrors({});
		setProfileWindow(null);
	};

	// Check if user has a specific role
	const hasRole = (role: string): boolean => {
		return user?.roles?.includes(role) || false;
	};

	// Check if user has a specific permission
	const can = (permission: string): boolean => {
		return user?.permissions?.includes(permission) || false;
	};

	//update user
	const updateUser = (updatedUser: User) => {
		setUser(updatedUser);
	};

	// const fetchNotifications = async (page: number): Promise<boolean> => {
	// 	setIsLoading(true);
	// 	try {
	// 		const response = await apiClient.get(
	// 			`/get-notifications?page=${page}`
	// 		);
	// 		setNotifications(response.data.data);
	// 		return true;
	// 	} catch (error: any) {
	// 		console.error(error);
	// 		return false;
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	return (
		<AuthContext.Provider
			value={{
				user,
				error,
				fieldErrors,
				message,
				// token,
				isAuthenticated,
				profileWindow,
				unreadCount,
				isToVerifyEmail,
				fetchUnreadCount,
				updateUnreadCount,
				verifyEmail,
				sendVerificationEmail,
				login,
				register,
				logout,
				forgotPassword,
				resetPassword,
				updateProfile,
				updatePassword,
				deleteAccount,
				clearMessages,
				updateUser,
				hasRole,
				can,
				isLoading,
				authLoading,
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
