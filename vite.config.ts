// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		proxy: {
			// Proxy requests from your frontend's /api path
			"/api": {
				// to your Laravel backend URL
				target: "http://localhost",
				changeOrigin: true, // Required for virtual-hosted sites
			},
			"/sanctum/csrf-cookie": {
				target: "http://localhost",
				changeOrigin: true,
			},
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.ts", // or whatever your setup file is named
	},
});
