// src/broadcast.ts

import Echo from "laravel-echo";
import Pusher from "pusher-js";

import apiClient from "./utils/axiosConfig";

window.Pusher = Pusher;

window.Echo = new Echo({
	broadcaster: "pusher",
	key: import.meta.env.VITE_PUSHER_APP_KEY,
	cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
	forceTLS: true,
	withCredentials: true, // Crucial for sending HttpOnly cookies
	authorizer: (channel) => {
		return {
			authorize: (socketId, callback) => {
				// Use your apiClient instance here instead of the global 'axios'
				apiClient
					.post(`/broadcasting/auth`, {
						socket_id: socketId,
						channel_name: channel.name,
					})
					.then((response) => {
						// callback(false, response.data);
						callback(null, response.data);
					})
					.catch((error) => {
						callback(error, null);
					});
			},
		};
	},
});
