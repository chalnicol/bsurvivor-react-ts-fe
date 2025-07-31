import axios from "axios";

// Create an Axios instance with a base URL
const apiClient = axios.create({
	baseURL: "http://localhost/api", // Your Laravel API base URL
	withCredentials: true,
	headers: {
		Accept: "application/json",
		// "Content-Type": "application/json",
	},
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Optional: Add a response interceptor for global error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// if (error.response && error.response.status === 401) {
		// 	// Handle unauthorized errors, e.g., redirect to login or clear token
		// 	console.log(
		// 		"Unauthorized request. Redirecting to login or clearing token."
		// 	);
		// 	localStorage.removeItem("token");
		// 	// You might want to dispatch an action or use a context to update auth state
		// 	// window.location.href = '/login'; // Or use navigate from react-router-dom
		// }
		if (error.response) {
			const { status, data } = error.response;
			if (status == 401) {
				localStorage.removeItem("token");
				console.error(
					"Unauthorized request. Redirecting to login or clearing token."
				);
				throw {
					type: "general",
					errors: data.errors,
					message: data.message,
				};
				//window.location.href = '/login';
			} else if (status == 422) {
				console.error("Validation Errors:", data.errors);
				throw {
					type: "validation",
					errors: data.errors,
					message: data.message,
				};
			} else if (status >= 500) {
				// General server error (5xx errors)
				console.error(
					"Server Error:",
					data.message || "Something went wrong on the server."
				);
				throw {
					type: "server",
					message:
						"A general server error occurred. Please try again later.",
				};
			} else {
				// Other client errors (4xx like 401, 403, 404, etc.)
				console.error(
					"Request Error:",
					data.message || "An unexpected error occurred."
				);
				throw {
					type: "general",
					message: data.message || "An unexpected error occurred.",
				};
			}
		}
		return Promise.reject(error);
	}
);

export default apiClient;
