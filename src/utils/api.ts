// src/utils/api.ts (Updated for Axios)
import apiClient from "./axiosConfig"; // Import your configured axios instance
import axios from "axios";

export const getCsrfToken = async (): Promise<void> => {
	axios
		.get("/sanctum/csrf-cookie", {
			baseURL: "/",
			withCredentials: true,
		})
		.catch((error) => {
			console.error("Error fetching CSRF token:", error);
		});
};

// You can export axiosInstance directly for use in components if you prefer,
// or use it internally in this file for other API functions.
export { apiClient };
