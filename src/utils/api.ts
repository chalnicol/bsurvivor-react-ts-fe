// src/utils/api.ts (Updated for Axios)
import apiClient from "./axiosConfig"; // Import your configured axios instance

export async function getCsrfToken(): Promise<void> {
	try {
		// This request sets the XSRF-TOKEN cookie. Axios will then automatically
		// read it and include it as X-XSRF-TOKEN header on subsequent requests.
		await apiClient.get("http://localhost/sanctum/csrf-cookie", {
			withCredentials: true,
		});
	} catch (error) {
		console.error("Failed to get CSRF token:", error);
		throw new Error("Failed to get CSRF token.");
	}
}

// You can export axiosInstance directly for use in components if you prefer,
// or use it internally in this file for other API functions.
export { apiClient };
