import axios from "axios";

// Create an Axios instance with a base URL
const api = axios.create({
	baseURL: "http://localhost/api", // Your Laravel API base URL
	withCredentials: true,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

// Add a request interceptor to include the token
api.interceptors.request.use(
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
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			// Handle unauthorized errors, e.g., redirect to login or clear token
			console.log(
				"Unauthorized request. Redirecting to login or clearing token."
			);
			localStorage.removeItem("token");
			// You might want to dispatch an action or use a context to update auth state
			// window.location.href = '/login'; // Or use navigate from react-router-dom
		}
		return Promise.reject(error);
	}
);

export default api;
